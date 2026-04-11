#!/bin/bash
# One-off test: Flux 2 Pro against 5 moodboards with the JSON prompt-block
# approach, to see whether Flux handles our composition rules and mood
# templates as well as Nano Banana Pro did.
#
# Uses the same Marshall head subject as the earlier Nano Banana sample
# run so the outputs are directly comparable.
#
# Outputs:
#   public/images/blog-moodboards/flux2pro_test/<mood>_sample-marshall-head.jpg
#
# Requires: python3, curl, REPLICATE_API_TOKEN in env.

set -eu

TOKEN="${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN env var}"
MOODBOARDS_JSON="$(dirname "$0")/moodboards.json"
MODEL="black-forest-labs/flux-2-pro"
OUTDIR="public/images/blog-moodboards/flux2pro_test"
SUBJECT="a vintage Marshall amplifier head with a glowing pilot light and worn control panel"

# Spread across the visual spectrum: dark atmospheric, clean minimal,
# colorful editorial, stage drama, and film-toned vintage.
MOODS=(
  "nocturnal_studio"
  "editorial_white"
  "brand_pop"
  "stage_haze"
  "vintage_film"
)

mkdir -p "$OUTDIR"

get_template() {
  local mood="$1"
  FK_MOOD="$mood" MOODBOARDS_JSON="$MOODBOARDS_JSON" python3 -c "
import json, os, sys
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
mood = os.environ['FK_MOOD']
if mood not in data or mood.startswith('_'):
    sys.stderr.write(f'Unknown mood: {mood}\n')
    sys.exit(1)
print(data[mood]['prompt_template'])
"
}

generate_image() {
  local outfile="$1"
  local template="$2"
  local subject="$3"

  local full_prompt="${template//SUBJECT_PLACEHOLDER/$subject}"

  # Flux 2 Pro payload: prompt + aspect_ratio + output_format.
  # Resolution is left as model default (the model picks based on AR).
  local payload
  payload=$(FK_PROMPT="$full_prompt" python3 -c "
import json, os
print(json.dumps({
    'input': {
        'prompt': os.environ['FK_PROMPT'],
        'aspect_ratio': '16:9',
        'output_format': 'jpg',
        'safety_tolerance': 2,
    },
}))
")

  local resp pid retry_after
  local attempts=0
  while [ "$attempts" -lt 8 ]; do
    resp=$(curl -s -X POST "https://api.replicate.com/v1/models/$MODEL/predictions" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$payload")

    pid=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || true)
    if [ -n "$pid" ]; then break; fi

    retry_after=$(echo "$resp" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(int(d.get('retry_after') or 10))
except Exception:
    print(10)
" 2>/dev/null)
    if [ -z "$retry_after" ] || [ "$retry_after" -lt 5 ]; then retry_after=10; fi

    attempts=$((attempts + 1))
    echo "  ...throttled, waiting ${retry_after}s (attempt $attempts/8)"
    sleep "$retry_after"
  done

  if [ -z "$pid" ]; then
    echo "  ERROR: Failed to start prediction"
    echo "  Response: $(echo "$resp" | head -c 400)"
    return 1
  fi

  for i in $(seq 1 60); do
    sleep 3
    local status state
    status=$(curl -s "https://api.replicate.com/v1/predictions/$pid" \
      -H "Authorization: Bearer $TOKEN")
    state=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null || true)

    if [ "$state" = "succeeded" ]; then
      local url
      url=$(echo "$status" | python3 -c "
import sys, json
d = json.load(sys.stdin)
out = d.get('output')
if isinstance(out, list):
    print(out[0] if out else '')
elif isinstance(out, str):
    print(out)
else:
    print('')
" 2>/dev/null)
      if [ -z "$url" ]; then
        echo "  ERROR: No output URL"
        return 1
      fi
      curl -s -o "$outfile" "$url"
      echo "  Saved: $outfile ($(du -h "$outfile" | cut -f1))"
      return 0
    elif [ "$state" = "failed" ]; then
      local err
      err=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','unknown'))" 2>/dev/null || true)
      echo "  ERROR: Prediction failed: $err"
      return 1
    fi
  done
  echo "  ERROR: Timed out waiting for prediction"
  return 1
}

echo "Flux 2 Pro test with subject: $SUBJECT"
echo "Model: $MODEL"
echo ""

for mood in "${MOODS[@]}"; do
  echo "[$mood]"
  template=$(get_template "$mood")
  outfile="$OUTDIR/${mood}_sample-marshall-head.jpg"
  generate_image "$outfile" "$template" "$SUBJECT" || true
done

echo ""
echo "Done. Flux 2 Pro samples saved to $OUTDIR/"
