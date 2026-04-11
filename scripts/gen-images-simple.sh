#!/bin/bash
# Generate AI blog images using Replicate Flux 1.1 Pro
# Simple bash script — generates images only, doesn't touch frontmatter
#
# Every image follows the Fader & Knob "gear porn" visual style:
# - Cinematic music gear photography
# - Dramatic side-lighting with soft-box keys and deep shadows
# - Warm amber highlights against cool charcoal backgrounds
# - Shallow depth of field, low-angle hero shots
# - Tactile textures: tolex, brushed aluminum, distressed wood
# - Glowing LED indicators, anisotropic highlights on metal
# - Vintage aesthetic meets modern tech

TOKEN="${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN env var}"
OUTDIR="public/images/blog"
mkdir -p "$OUTDIR"

# ── Style preamble applied to every prompt ──────────────────────────────
STYLE_PREAMBLE="cinematic music gear photography, dramatic side-lighting from soft-box key with deep shadows, warm amber highlights against cool charcoal and deep onyx background, shallow depth of field with creamy bokeh, low-angle hero shot, tactile textures of tolex amp covering and brushed aluminum and distressed wood grain, glowing neon cyan and orange LED indicators, anisotropic highlights on chrome switches and knurled knobs, vintage aesthetic meets modern tech, industrial minimalist music studio backdrop, moody premium nocturnal aspirational vibe, 8k resolution detail, photorealistic"

generate() {
  local slug="$1"
  local subject="$2"
  local outfile="$OUTDIR/$slug.webp"

  if [ -f "$outfile" ]; then
    echo "[skip] $slug"
    return
  fi

  echo "[gen] $slug"

  # Combine style preamble with the subject description
  local full_prompt="$STYLE_PREAMBLE, $subject"

  # Start prediction
  local resp=$(curl -s -X POST "https://api.replicate.com/v1/predictions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"version\": \"black-forest-labs/flux-1.1-pro\", \"input\": {\"prompt\": \"$full_prompt\", \"aspect_ratio\": \"16:9\"}}")

  local pid=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

  if [ -z "$pid" ]; then
    echo "  ERROR: Failed to start prediction"
    return
  fi

  # Poll for completion
  for i in $(seq 1 30); do
    sleep 3
    local status=$(curl -s "https://api.replicate.com/v1/predictions/$pid" \
      -H "Authorization: Bearer $TOKEN")
    local state=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null)

    if [ "$state" = "succeeded" ]; then
      local url=$(echo "$status" | python3 -c "import sys,json; print(json.load(sys.stdin)['output'])" 2>/dev/null)
      curl -s -o "$outfile" "$url"
      echo "  Saved: $outfile ($(du -h "$outfile" | cut -f1))"
      return
    elif [ "$state" = "failed" ]; then
      echo "  ERROR: Prediction failed"
      return
    fi
  done
  echo "  ERROR: Timed out"
}

# ─── Subject descriptions ───────────────────────────────────────────────
# Focus on the gear and composition. Lighting, mood, and surface textures
# are handled by the STYLE_PREAMBLE — don't repeat them here.

# Modeler comparisons and buyer guides
generate "helix-vs-quad-cortex-vs-kemper" "three flagship guitar modeler units arranged on a dark textured surface, top-down hero angle, patch cables snaking between footswitches"
generate "best-modeler-under-500" "collection of compact guitar multi-effects pedals arranged on reclaimed wood, patch bay visible in soft-focus background"
generate "line-6-helix-family-compared" "line of five Line 6 Helix floor, rack, LT, and HX Stomp units arranged largest to smallest, dramatic product lineup"
generate "best-frfr-speakers-for-modelers" "FRFR powered speaker beside a modeler floorboard on a concrete stage, backline haze drifting behind"
generate "helix-vs-quad-cortex" "two flagship modeler units side by side on a pedalboard, diagonal composition"
generate "quad-cortex-preset-from-scratch" "touchscreen guitar modeler mid-configuration, a single finger reaching toward a signal chain block"
generate "quad-cortex-captures-vs-models" "digital modeler unit beside a small tube combo amplifier, split composition digital versus analog"
generate "frfr-vs-guitar-cab-for-modelers" "FRFR flat response speaker on the left and a traditional 4x12 guitar cabinet on the right, symmetric studio comparison"
generate "modeler-vs-tube-amp-shootout" "modern digital modeler facing off against a vintage tube amplifier head, diagonal split lighting"
generate "best-katana-settings-tube-amp" "Boss Katana combo amplifier with a vintage Stratocaster leaning against it in a cluttered bedroom producer studio"

# Drive pedals and settings
generate "tube-screamer-settings-guide" "close-up macro of a green overdrive pedal on distressed wood, knurled knobs in sharp focus, chrome jacks catching rim light"
generate "big-muff-settings-guide" "close-up of a classic fuzz pedal with oversized chickenhead knobs, scuffed enclosure, vintage road-worn patina"
generate "boss-ds1-settings-guide" "orange distortion pedal on a pedalboard with patch cables, iconic enclosure in sharp focus"
generate "klon-centaur-settings-guide" "gold boutique overdrive pedal in pristine condition, polished aluminum, collector aesthetic"
generate "rat-pedal-settings-guide" "black distortion pedal with a gritty relic finish, chipped paint, roadworn character"
generate "overdrive-vs-distortion-vs-fuzz" "three drive pedals arranged in a row on a pedalboard, each clearly different in color and enclosure style"

# Amp guides
generate "jcm800-settings-guide" "British amplifier head close-up showing front panel controls and glowing pilot light, subtle warm tube glow"
generate "complete-guide-guitar-amp-types" "four distinct amplifier types arranged in a showcase row, tube combo beside solid state head beside modeling unit"
generate "guitar-eq-guide" "close-up of an equalizer section on a guitar amplifier, frequency knobs and silver sliders in sharp focus"

# Technique and signal routing
generate "signal-chain-order-guide" "pedalboard shot from a low angle, six pedals connected in a line with tidy patch cables running between them"
generate "impulse-response-ir-guide" "studio microphone positioned inches from a guitar speaker cabinet grille cloth, ribbon mic capsule catching rim light"
generate "effects-loop-explained" "back panel of a guitar amplifier showing FX send and return jacks with 1/4-inch cables inserted, shallow depth of field"
generate "4-wire-method-explained" "overhead detail of four patch cables running between an amplifier back panel and a multi-effects processor, tidy cable management"
generate "beginner-signal-chains" "three-pedal starter board on a wood floor, overdrive into delay into reverb, clean minimal composition"
generate "pickup-position-guide" "extreme macro of a guitar pickup selector blade switch mid-position, chrome hardware, aged nitro finish"
generate "how-to-remove-60-cycle-hum" "extreme close-up of a single-coil pickup beside a humbucker on the same guitar, technical detail shot"

# Artist tone recipes
generate "david-gilmour-pink-floyd-tone" "black Stratocaster with rosewood fretboard beside a Big Muff and delay pedal, atmospheric haze"
generate "hendrix-fuzz-tone-recipe" "weathered white Stratocaster with a Fuzz Face and Cry Baby wah pedal at its feet, psychedelic purple rim light"
generate "srv-tone-on-helix" "heavily worn sunburst Stratocaster with thick strings and a classic Tube Screamer, Texas blues aesthetic"
generate "metallica-rhythm-tone-settings" "black hardtail electric guitar beside a high-gain head and 4x12 cabinet, aggressive crimson accent lighting"
generate "the-edge-delay-settings" "pedalboard featuring multiple delay pedals with dotted-eighth tap timing, ethereal cyan glow"
generate "john-mayer-clean-tone-settings" "natural Stratocaster in front of a blonde tweed combo amplifier, soft warm practice room"
generate "acdc-rhythm-tone-recipe" "cherry SG leaning against a stacked British amplifier rig on a stage"
generate "radiohead-creep-tone-recipe" "butterscotch Telecaster with a big fuzz pedal, stark minimal composition"
generate "andy-timmons-lead-tone-recipe" "sunburst Les Paul in front of a boutique tube combo, expressive lead guitar aesthetic"
generate "nashville-session-clean-tele-compressor" "butterscotch blonde Telecaster with a compressor pedal on a session studio desk, Nashville pro aesthetic"

# Worship guitar
generate "worship-guitar-tone-helix" "ambient worship pedalboard with reverb, delay, and shimmer pedals, diffuse soft colored stage haze"
generate "modern-worship-guitar-tone-helix" "modern church stage in low light, single expression pedal and ambient pedalboard in soft purple wash"
generate "worship-pedalboard-guide" "complete worship pedalboard laid out cleanly on concrete, organized by signal chain sections"

# Shoegaze / alt
generate "shoegaze-wall-of-sound-recipe" "oversized pedalboard covered in reverb and fuzz pedals, dreamy haze drifting through the frame"

# Troubleshooting and fixes
generate "how-to-dial-in-modeler-tone" "guitarist at a desk with a floor modeler and studio headphones, hands on the device, focused bedroom studio"
generate "fix-thin-modeler-tone" "close-up of a modeler unit EQ page on screen, sliders mid-adjustment, finger approaching the display"
generate "why-modeler-tone-sounds-fizzy" "macro of a hand turning down a high-frequency presence knob on an amplifier"
generate "solo-patch-volume-drop-fix" "pedalboard with a volume boost pedal in the hot spot, a foot about to engage it, stage spotlight effect"
generate "why-delay-sounds-muddy" "solo delay pedal with coiled patch cables on a clean surface, focus on the mix knob"
generate "gain-staging-drop-tunings" "close-up of heavy gauge strings on a down-tuned baritone guitar bridge, dark metal aesthetic"

# Rigs and lifestyle
generate "best-helix-amp-models-blues" "blues guitarist hands on a worn Stratocaster neck with a floor modeler glowing amber below"
generate "500-dollar-gigging-rig" "complete budget gigging rig at the edge of a small stage, affordable guitar beside a small modeler"
generate "500-rig-challenge-two-approaches" "two distinct budget guitar rigs side by side on a comparison bench, each with different philosophy"
generate "20-minute-practice-session" "guitar on a stand beside a small practice amp in a cozy home corner, soft evening light"
generate "what-is-a-tone-recipe" "flat-lay of a guitar tone recipe card beside the actual pedals it describes, editorial composition"

echo ""
echo "Done! Total images: $(ls $OUTDIR/*.webp 2>/dev/null | wc -l)"
