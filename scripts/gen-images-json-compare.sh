#!/bin/bash
# A/B comparison: use the user's proven Gemini-killer prompt that produced
# great outputs in Gemini directly, and see how Nano Banana Pro on Replicate
# compares with the flattened prose preamble the main script currently uses.
#
# Writes to public/images/blog-comparison/ so the main blog images are
# untouched — you can compare side-by-side with the equivalent files in
# public/images/blog/.
#
# Uses Nano Banana Pro (google/nano-banana-pro) at 2K, same as the
# main gen-images-simple.sh script, for a fair comparison.

TOKEN="${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN env var}"
OUTDIR="public/images/blog-comparison"
MODEL="google/nano-banana-pro"
RESOLUTION="2K"
OUTPUT_FORMAT="jpg"
mkdir -p "$OUTDIR"

# ── The proven prompt (from Gemini direct testing) ─────────────────────
# We treat this as a preamble and substitute the "central subject"
# parenthetical with the specific subject for each image.
read -r -d '' BASE_PROMPT <<'PROMPT'
A high-end, cinematic product photograph of professional music gear in a moody, nocturnal studio setting. The central subject is SUBJECT_PLACEHOLDER, dramatically lit by directional side-lighting (e.g., from a softbox), casting deep shadows and creating high local contrast. The lighting should produce warm, burnished amber highlights and perhaps subtle cool blue or cyan rim lighting to define edges.

The background is dark and textured, featuring elements like charcoal industrial finishes, exposed concrete, or a vintage Oriental rug, with a shallow depth of field (bokeh) to keep focus sharp on the subject. Tactile details are paramount: the weave of amp grille cloth, the brushed metal texture of a pedal chassis, the grain of distressed wood, and the knurled edges of control knobs should be highly visible.

Status LEDs or display screens on the gear should glow intensely, providing vibrant, saturated color accents (like glowing green or orange indicators) against the desaturated surroundings. The composition is a heroic low-angle or three-quarter view, focusing on the details and quality of the hardware. The overall vibe is premium, aspirational, and 'Gear Porn'.
PROMPT

generate() {
  local slug="$1"
  local subject="$2"
  local outfile="$OUTDIR/$slug.$OUTPUT_FORMAT"

  if [ -f "$outfile" ]; then
    echo "[skip] $slug"
    return
  fi

  echo "[gen] $slug"

  # Substitute the SUBJECT_PLACEHOLDER with the specific subject
  local full_prompt="${BASE_PROMPT//SUBJECT_PLACEHOLDER/$subject}"

  # Build request body safely via python3 (avoids shell-escape issues)
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

  local resp
  resp=$(curl -s -X POST "https://api.replicate.com/v1/models/$MODEL/predictions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local pid
  pid=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

  if [ -z "$pid" ]; then
    echo "  ERROR: Failed to start prediction"
    echo "  Response: $(echo "$resp" | head -c 300)"
    return
  fi

  # Poll — up to ~3 minutes
  for i in $(seq 1 60); do
    sleep 3
    local status
    status=$(curl -s "https://api.replicate.com/v1/predictions/$pid" \
      -H "Authorization: Bearer $TOKEN")
    local state
    state=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)

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
        return
      fi
      curl -s -o "$outfile" "$url"
      echo "  Saved: $outfile ($(du -h "$outfile" | cut -f1))"
      return
    elif [ "$state" = "failed" ]; then
      local err
      err=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','unknown'))" 2>/dev/null)
      echo "  ERROR: Prediction failed: $err"
      return
    fi
  done
  echo "  ERROR: Timed out"
}

# ── 10 subjects chosen to match files in public/images/blog/ for A/B ────
# Each subject is a single phrase that slots into "The central subject is ___"

generate "tube-screamer-settings-guide" "a relic'd green overdrive pedal with knurled knobs and chrome jacks"
generate "jcm800-settings-guide" "a vintage British amplifier head with a glowing pilot light and black-and-gold control panel"
generate "david-gilmour-pink-floyd-tone" "a black Stratocaster with rosewood fretboard laying beside a Big Muff fuzz pedal and an analog delay"
generate "impulse-response-ir-guide" "a ribbon microphone positioned inches from the grille cloth of a 4x12 guitar speaker cabinet"
generate "worship-guitar-tone-helix" "a pedalboard loaded with boutique reverb, delay, and shimmer pedals arranged on a dark stage"
generate "metallica-rhythm-tone-settings" "a black hardtail electric guitar leaning against a high-gain amplifier head and 4x12 cabinet"
generate "srv-tone-on-helix" "a heavily worn sunburst Stratocaster with thick strings and a Tube Screamer at its feet"
generate "helix-vs-quad-cortex-vs-kemper" "three flagship guitar modeler units arranged together on a studio floor, patch cables snaking between them"
generate "signal-chain-order-guide" "a pedalboard holding six guitar effect pedals connected in a signal chain with tidy patch cables"
generate "klon-centaur-settings-guide" "a gold boutique overdrive pedal in pristine condition with polished aluminum top panel"

echo ""
echo "Done! Total comparison images: $(ls $OUTDIR/*.$OUTPUT_FORMAT 2>/dev/null | wc -l)"
echo ""
echo "Compare with public/images/blog/<slug>.jpg to see the difference"
echo "between the proven Gemini prompt and the flattened prose preamble."
