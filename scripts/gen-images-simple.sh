#!/bin/bash
# Generate AI blog images using Replicate Flux 1.1 Pro
# Simple bash script — generates images only, doesn't touch frontmatter

TOKEN="${REPLICATE_API_TOKEN:?Set REPLICATE_API_TOKEN env var}"
OUTDIR="public/images/blog"
mkdir -p "$OUTDIR"

generate() {
  local slug="$1"
  local prompt="$2"
  local outfile="$OUTDIR/$slug.webp"

  if [ -f "$outfile" ]; then
    echo "[skip] $slug"
    return
  fi

  echo "[gen] $slug"

  # Start prediction
  local resp=$(curl -s -X POST "https://api.replicate.com/v1/predictions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"version\": \"black-forest-labs/flux-1.1-pro\", \"input\": {\"prompt\": \"$prompt, photorealistic, professional photography, 16:9 aspect ratio\", \"aspect_ratio\": \"16:9\"}}")

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

# Generate images — top priority posts first
generate "helix-vs-quad-cortex-vs-kemper" "Three guitar modeler units arranged on a dark surface, professional studio lighting, top-down angle, cables and footswitches visible"
generate "best-modeler-under-500" "Collection of affordable guitar modelers and multi-effects pedals arranged on a wooden table, budget-friendly gear, bright studio lighting"
generate "line-6-helix-family-compared" "Multiple Line 6 Helix products arranged largest to smallest on a dark surface, product lineup photograph"
generate "best-frfr-speakers-for-modelers" "FRFR powered speaker on a stage next to a guitar modeler pedalboard, concert venue setting, dramatic stage lighting"
generate "tube-screamer-settings-guide" "Close-up product photograph of a green Ibanez Tube Screamer overdrive pedal on a dark wooden surface, warm amber lighting, shallow depth of field, knobs visible"
generate "jcm800-settings-guide" "Marshall JCM800 amplifier head close-up showing the front panel controls and logo, warm tube glow visible, dark studio environment"
generate "signal-chain-order-guide" "Guitar effects pedals arranged in a signal chain line on a pedalboard, cables connecting them in order, overhead angle, studio lighting"
generate "big-muff-settings-guide" "Close-up product photograph of a Big Muff Pi fuzz pedal with its distinctive enclosure, dramatic side lighting, dark background"
generate "how-to-dial-in-modeler-tone" "Guitarist sitting with a modeler and headphones, dialing in settings on the unit, focused bedroom studio setting"
generate "overdrive-vs-distortion-vs-fuzz" "Three guitar drive pedals side by side showing different gain types from clean overdrive to heavy fuzz, moody lighting"
generate "impulse-response-ir-guide" "Guitar speaker cabinet with a microphone positioned in front of it, recording studio setting, professional mic placement"
generate "guitar-eq-guide" "Close-up of an equalizer section on a guitar amplifier, frequency knobs and sliders visible, warm studio lighting"
generate "david-gilmour-pink-floyd-tone" "Vintage Fender Stratocaster in black with rosewood fretboard next to effects pedals including a Big Muff and delay, atmospheric lighting"
generate "hendrix-fuzz-tone-recipe" "Vintage Stratocaster with a Fuzz Face pedal and wah pedal on a dark stage, psychedelic colored lighting"
generate "srv-tone-on-helix" "Vintage Stratocaster with heavy string gauge, Texas blues vibe, worn frets, Tube Screamer pedal nearby, warm amber tones"
generate "metallica-rhythm-tone-settings" "Heavy metal guitar rig with a dark ESP style guitar and high-gain amplifier stack, aggressive red and black lighting"
generate "worship-guitar-tone-helix" "Worship guitarists pedalboard with ambient effects reverb delay shimmer, church stage setting, soft purple and white lighting"
generate "the-edge-delay-settings" "Guitar pedalboard focused on multiple delay pedals with dotted eighth note settings, ethereal blue lighting, atmospheric"
generate "boss-ds1-settings-guide" "Close-up of an orange Boss DS-1 distortion pedal on a pedalboard, patch cables connected, stage lighting"
generate "klon-centaur-settings-guide" "Close-up of a gold Klon Centaur overdrive pedal, pristine condition, studio product photography, warm lighting"
generate "rat-pedal-settings-guide" "Close-up of a ProCo RAT distortion pedal, gritty texture, dramatic low-key lighting, dark background"
generate "effects-loop-explained" "Back panel of a guitar amplifier showing effects loop send and return jacks with cables connected, close-up detail shot"
generate "4-wire-method-explained" "Guitar amplifier connected to a multi-effects processor with four cables running between them, studio setting"
generate "helix-vs-quad-cortex" "Two guitar multi-effects processors side by side on a pedalboard, stage lighting with blue and amber tones"
generate "best-helix-amp-models-blues" "Blues guitarists hands on a Stratocaster neck with a multi-effects pedalboard glowing below, warm amber stage lighting"
generate "best-katana-settings-tube-amp" "Boss Katana guitar amplifier in a bedroom studio setting, guitar leaning against it, warm cozy lighting"
generate "quad-cortex-preset-from-scratch" "Touchscreen guitar modeler showing a signal chain layout, fingers about to tap, modern studio desk"
generate "quad-cortex-captures-vs-models" "Guitar modeler unit with touchscreen display next to a real tube amplifier, split lighting digital vs analog"
generate "frfr-vs-guitar-cab-for-modelers" "FRFR flat response speaker on one side and traditional guitar cabinet on the other, studio comparison"
generate "john-mayer-clean-tone-settings" "Clean Fender Stratocaster and a Fender amplifier in a warm studio setting, soft natural lighting"
generate "acdc-rhythm-tone-recipe" "Gibson SG guitar leaning against a Marshall amplifier stack, rock and roll stage setting, powerful lighting"
generate "radiohead-creep-tone-recipe" "Fender Telecaster with a distortion pedal on a minimalist pedalboard, moody alternative rock lighting"
generate "shoegaze-wall-of-sound-recipe" "Massive pedalboard covered in reverb and fuzz pedals, dreamy ethereal lighting with haze, shoegaze atmosphere"
generate "modern-worship-guitar-tone-helix" "Modern church stage with ambient guitar rig, haze and soft colored lighting, pedalboard with expression pedal"
generate "worship-pedalboard-guide" "Complete worship guitar pedalboard laid out with labeled sections, clean organized setup"
generate "fix-thin-modeler-tone" "Guitar modeler screen showing EQ settings being adjusted, close-up of the display"
generate "why-modeler-tone-sounds-fizzy" "Close-up of high-frequency EQ knob being turned down on a guitar amplifier"
generate "solo-patch-volume-drop-fix" "Guitar pedalboard with a volume boost pedal highlighted, live stage setting, spotlight effect"
generate "why-delay-sounds-muddy" "Delay pedal with cables, clean studio setting, warm lighting"
generate "how-to-remove-60-cycle-hum" "Electric guitar pickups close-up showing single coil vs humbucker, technical detail shot"
generate "gain-staging-drop-tunings" "Heavy gauge guitar strings on a down-tuned guitar, close-up of the bridge, dark metal aesthetic"
generate "complete-guide-guitar-amp-types" "Four different guitar amplifier types arranged together tube combo solid state head modeling unit, studio showcase"
generate "pickup-position-guide" "Close-up of guitar pickup selector switch between neck and bridge positions, detailed macro shot"
generate "modeler-vs-tube-amp-shootout" "Guitar modeler facing off against a vintage tube amplifier, dramatic split lighting, versus comparison"
generate "what-is-a-tone-recipe" "Guitar tone settings displayed like a cooking recipe card, clean design, warm lighting"
generate "500-dollar-gigging-rig" "Complete budget gigging guitar rig on a stage affordable guitar small modeler, stage lights"
generate "500-rig-challenge-two-approaches" "Two different guitar rigs side by side showing different budget approaches, comparison on a stage"
generate "20-minute-practice-session" "Guitar practice setup at home guitar on a stand small amp, cozy room lighting"
generate "beginner-signal-chains" "Simple guitar pedalboard with just three pedals overdrive delay reverb, beginner-friendly setup, bright lighting"
generate "andy-timmons-lead-tone-recipe" "Gibson Les Paul with a clean tube amp setup, expressive lead guitar tone, warm vintage studio lighting"
generate "nashville-session-clean-tele-compressor" "Fender Telecaster in butterscotch blonde with a compressor pedal, Nashville recording studio setting"

echo ""
echo "Done! Total images: $(ls $OUTDIR/*.webp 2>/dev/null | wc -l)"
