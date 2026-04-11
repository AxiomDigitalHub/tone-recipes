#!/bin/bash
# Moodboard-driven image generation.
#
# Reads scripts/moodboards.json and generates images using a specific
# mood's prompt template. Subject phrases slot into SUBJECT_PLACEHOLDER
# exactly the way the proven Gemini-prompt approach did.
#
# Two usage modes:
#
#   1) Sample the moodboards side-by-side:
#      bash scripts/gen-images-moodboards.sh sample
#      -> generates one image per moodboard of the same subject
#         into public/images/blog-moodboards/
#
#   2) Re-shoot a specific image with a specific mood:
#      bash scripts/gen-images-moodboards.sh one <mood_key> <slug> "<subject>"
#      -> writes to public/images/blog-moodboards/<mood_key>/<slug>.jpg
#
# Requires: python3 (standard library only), curl, REPLICATE_API_TOKEN in env.

set -eu

TOKEN="${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN env var}"
MOODBOARDS_JSON="$(dirname "$0")/moodboards.json"
MODEL="google/nano-banana-pro"
RESOLUTION="${FK_RESOLUTION:-2K}"
OUTPUT_FORMAT="${FK_FORMAT:-jpg}"

if [ ! -f "$MOODBOARDS_JSON" ]; then
  echo "moodboards.json not found at $MOODBOARDS_JSON" >&2
  exit 1
fi

# Extract a prompt template + label for a given mood key
# Args: mood_key
get_template() {
  local mood="$1"
  FK_MOOD="$mood" python3 -c "
import json, os, sys
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
mood = os.environ['FK_MOOD']
if mood not in data or mood == '_meta':
    sys.stderr.write(f\"Unknown mood: {mood}\n\")
    sys.exit(1)
print(data[mood]['prompt_template'])
"
}

# List all mood keys (excluding _meta and _composition_rules)
list_moods() {
  MOODBOARDS_JSON="$MOODBOARDS_JSON" python3 -c "
import json, os
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
for k in data:
    if not k.startswith('_'):
        print(k)
"
}

# Pick a deterministic mood for a given author slug.
# Uses the moodboard's authors array, picking the first mood that
# lists the author. Falls back to nocturnal_studio.
mood_for_author() {
  local author_slug="$1"
  FK_AUTHOR="$author_slug" python3 -c "
import json, os, sys
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
author = os.environ['FK_AUTHOR']
for mood_key, mood in data.items():
    if mood_key.startswith('_'):
        continue
    if author in (mood.get('authors') or []):
        print(mood_key)
        sys.exit(0)
print('nocturnal_studio')
"
}

# List all author -> mood mappings from the moodboards file
list_authors() {
  MOODBOARDS_JSON="$MOODBOARDS_JSON" python3 -c "
import json, os
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
rows = []
for mood_key, mood in data.items():
    if mood_key.startswith('_'):
        continue
    for a in (mood.get('authors') or []):
        rows.append((a, mood_key, mood.get('label','')))
rows.sort()
for author, mood_key, label in rows:
    print(f'{author:22} {mood_key:22} {label}')
"
}

# Generate one image
# Args: out_file, prompt_template, subject
generate_image() {
  local outfile="$1"
  local template="$2"
  local subject="$3"

  if [ -f "$outfile" ] && [ "${FORCE_REGENERATE:-false}" != "true" ]; then
    echo "  [skip] $outfile"
    return 0
  fi

  # Substitute the placeholder with the subject
  local full_prompt="${template//SUBJECT_PLACEHOLDER/$subject}"

  # Build payload via python to avoid shell escaping hell
  local payload
  payload=$(FK_PROMPT="$full_prompt" FK_RES="$RESOLUTION" FK_FMT="$OUTPUT_FORMAT" python3 -c "
import json, os
print(json.dumps({
    'input': {
        'prompt': os.environ['FK_PROMPT'],
        'aspect_ratio': '16:9',
        'resolution': os.environ['FK_RES'],
        'output_format': os.environ['FK_FMT'],
        'allow_fallback_model': True,
    },
}))
")

  local resp pid retry_after
  local attempts=0
  # Retry loop with backoff for 429 rate-limit responses.
  # Replicate throttles heavily when account credit is low.
  while [ "$attempts" -lt 8 ]; do
    resp=$(curl -s -X POST "https://api.replicate.com/v1/models/$MODEL/predictions" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$payload")

    pid=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || true)

    if [ -n "$pid" ]; then
      break
    fi

    # Parse retry_after from the Replicate throttle response
    retry_after=$(echo "$resp" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(int(d.get('retry_after') or 10))
except Exception:
    print(10)
" 2>/dev/null)

    if [ -z "$retry_after" ] || [ "$retry_after" -lt 5 ]; then
      retry_after=10
    fi

    attempts=$((attempts + 1))
    echo "  ...throttled, waiting ${retry_after}s (attempt $attempts/8)"
    sleep "$retry_after"
  done

  if [ -z "$pid" ]; then
    echo "  ERROR: Failed to start prediction after 8 retries"
    echo "  Response: $(echo "$resp" | head -c 300)"
    return 1
  fi

  # Poll for completion
  for i in $(seq 1 60); do
    sleep 3
    local status
    status=$(curl -s "https://api.replicate.com/v1/predictions/$pid" \
      -H "Authorization: Bearer $TOKEN")
    local state
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
      mkdir -p "$(dirname "$outfile")"
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

export MOODBOARDS_JSON

# ── Main dispatcher ────────────────────────────────────────────────────
MODE="${1:-sample}"

case "$MODE" in
  sample)
    # Generate one image per moodboard using the same subject
    SAMPLE_SUBJECT="${2:-a vintage Marshall amplifier head with a glowing pilot light and worn control panel}"
    SAMPLE_SLUG="${3:-sample-marshall-head}"
    OUTDIR="public/images/blog-moodboards"
    mkdir -p "$OUTDIR"

    echo "Sampling all moodboards with subject: $SAMPLE_SUBJECT"
    echo ""

    for mood in $(list_moods); do
      echo "[$mood]"
      template=$(get_template "$mood")
      outfile="$OUTDIR/${mood}_${SAMPLE_SLUG}.$OUTPUT_FORMAT"
      generate_image "$outfile" "$template" "$SAMPLE_SUBJECT" || true
    done

    echo ""
    echo "Done. Sample images saved to $OUTDIR/"
    ;;

  one)
    # Generate a single image with a specific mood
    MOOD="${2:?Usage: $0 one <mood_key> <slug> '<subject>'}"
    SLUG="${3:?Usage: $0 one <mood_key> <slug> '<subject>'}"
    SUBJECT="${4:?Usage: $0 one <mood_key> <slug> '<subject>'}"

    OUTDIR="public/images/blog-moodboards/$MOOD"
    mkdir -p "$OUTDIR"

    echo "[$MOOD] $SLUG"
    template=$(get_template "$MOOD")
    outfile="$OUTDIR/$SLUG.$OUTPUT_FORMAT"
    generate_image "$outfile" "$template" "$SUBJECT"
    ;;

  list)
    echo "Available moodboards:"
    for mood in $(list_moods); do
      label=$(FK_MOOD="$mood" python3 -c "
import json, os
with open(os.environ['MOODBOARDS_JSON']) as f:
    data = json.load(f)
print(data[os.environ['FK_MOOD']]['label'])
")
      printf "  %-22s %s\n" "$mood" "$label"
    done
    ;;

  author)
    # Generate a single image using the mood assigned to a specific author
    AUTHOR="${2:?Usage: $0 author <author_slug> <slug> '<subject>'}"
    SLUG="${3:?Usage: $0 author <author_slug> <slug> '<subject>'}"
    SUBJECT="${4:?Usage: $0 author <author_slug> <slug> '<subject>'}"

    MOOD=$(mood_for_author "$AUTHOR")
    OUTDIR="public/images/blog-moodboards/$MOOD"
    mkdir -p "$OUTDIR"

    echo "[$AUTHOR -> $MOOD] $SLUG"
    template=$(get_template "$MOOD")
    outfile="$OUTDIR/$SLUG.$OUTPUT_FORMAT"
    generate_image "$outfile" "$template" "$SUBJECT"
    ;;

  authors-list)
    echo "Author -> Moodboard assignments:"
    list_authors
    ;;

  *)
    echo "Usage:"
    echo "  $0 sample [subject] [slug]                     # Generate one image per moodboard"
    echo "  $0 one <mood_key> <slug> <subject>             # Generate with a specific mood"
    echo "  $0 author <author_slug> <slug> <subject>       # Generate with the mood assigned to an author"
    echo "  $0 list                                        # List available moodboards"
    echo "  $0 authors-list                                # Show author -> mood assignments"
    exit 1
    ;;
esac
