# Compressor time-unit migration — Attack / Release to milliseconds

**Run:** applied
**Values converted (seconds → ms):** 176
**Values already in ms (untouched):** 1243

## Why

`Attack` and `Release` were written in two scales across the corpus. The
registry declared them `min 0, max 1, unit "s"`, so a 60 ms attack rendered
as **"Attack 60s"**, and `scaleParamValue()` — which had no rule for either
parameter — clamped every millisecond-scale value to **1.0** in the generated
.hlx. Every compressor in every downloadable Helix preset was shipping with
maximum attack and maximum release.

Ground truth for the target unit comes from `data/helix-corpus/models.json`
(256 real presets): `HD2_CompressorDeluxeComp` shows `Attack 0.0001..0.072`
and `Release 0.064..2.009` — seconds, as floats. The corpus stores the
human-readable millisecond form; the generator converts on the way out.

## Converted by platform

| Platform | Values |
|---|---|
| `fractal` | 33 |
| `helix` | 2 |
| `kemper` | 111 |
| `quad_cortex` | 30 |

## Every change

| Recipe | Platform | Block | Param | Before | After |
|---|---|---|---|---|---|
| `srv-pride-and-joy-rhythm` | kemper | Compressor | Attack | 0.04 | 40 |
| `hendrix-voodoo-child-wah` | kemper | Compressor | Attack | 0.04 | 40 |
| `cobain-teen-spirit-grunge` | kemper | Compressor | Attack | 0.04 | 40 |
| `frusciante-under-the-bridge-clean` | kemper | Compressor | Attack | 0.06 | 60 |
| `slash-sweet-child-o-mine-lead` | kemper | Compressor | Attack | 0.06 | 60 |
| `evh-eruption-brown-sound` | kemper | Compressor | Attack | 0.04 | 40 |
| `edge-where-the-streets-have-no-name` | kemper | Compressor | Attack | 0.04 | 40 |
| `clapton-layla-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `knopfler-sultans-of-swing-clean` | kemper | Compressor | Attack | 0.04 | 40 |
| `jack-white-seven-nation-army` | kemper | Compressor | Attack | 0.06 | 60 |
| `morello-killing-in-the-name` | kemper | Compressor | Attack | 0.04 | 40 |
| `angus-young-back-in-black-rhythm` | kemper | Compressor | Attack | 0.04 | 40 |
| `townshend-wont-get-fooled-again` | kemper | Compressor | Attack | 0.04 | 40 |
| `garcia-truckin-clean-sparkle` | kemper | Compressor | Attack | 0.04 | 40 |
| `lifeson-tom-sawyer-chorus` | kemper | Compressor | Attack | 0.04 | 40 |
| `brian-may-bohemian-rhapsody` | kemper | Compressor | Attack | 0.04 | 40 |
| `iommi-iron-man-doom-riff` | quad_cortex | Studio Comp | Attack | 0.038 | 38 |
| `iommi-iron-man-doom-riff` | quad_cortex | Studio Comp | Release | 0.2 | 200 |
| `iommi-iron-man-doom-riff` | fractal | Compressor | Attack | 0.038 | 38 |
| `iommi-iron-man-doom-riff` | fractal | Compressor | Release | 0.2 | 200 |
| `rhoads-crazy-train-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `srv-texas-flood-slow-blues-lead` | kemper | Compressor | Attack | 0.06 | 60 |
| `satriani-surfing-with-the-alien-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `gallagher-wonderwall-jangly-rhythm` | kemper | Compressor | Attack | 0.04 | 40 |
| `marr-how-soon-is-now-tremolo` | kemper | Compressor | Attack | 0.04 | 40 |
| `richards-start-me-up-open-g` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `richards-start-me-up-open-g` | quad_cortex | Studio Comp | Release | 0.5 | 500 |
| `richards-start-me-up-open-g` | kemper | Studio Compressor | Attack | 0.06 | 60 |
| `richards-start-me-up-open-g` | kemper | Studio Compressor | Release | 0.5 | 500 |
| `gibbons-la-grange-blues-crunch` | kemper | Compressor | Attack | 0.04 | 40 |
| `dimebag-walk-groove-metal` | kemper | Compressor | Attack | 0.04 | 40 |
| `page-whole-lotta-love-heavy-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `page-stairway-to-heaven-clean-build` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `page-stairway-to-heaven-clean-build` | quad_cortex | Studio Comp | Release | 0.91 | 910 |
| `page-stairway-to-heaven-clean-build` | kemper | Studio Compressor | Attack | 0.06 | 60 |
| `page-stairway-to-heaven-clean-build` | kemper | Studio Compressor | Release | 0.5 | 500 |
| `gilmour-time-solo-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `slash-welcome-to-jungle-aggressive-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `evh-panama-brown-sound` | kemper | Compressor | Attack | 0.04 | 40 |
| `mayer-gravity-super-clean-dynamic` | kemper | Compressor | Attack | 0.04 | 40 |
| `greenwood-creep-clean-to-crunch` | kemper | Compressor | Attack | 0.04 | 40 |
| `turner-do-i-wanna-know-fuzzy-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `hetfield-enter-sandman-tight-rhythm` | kemper | Compressor | Attack | 0.04 | 40 |
| `murray-trooper-galloping-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `bellamy-plug-in-baby-fuzz-whammy` | kemper | Compressor | Attack | 0.04 | 40 |
| `auerbach-lonely-boy-raw-garage` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `auerbach-lonely-boy-raw-garage` | quad_cortex | Studio Comp | Release | 0.91 | 910 |
| `auerbach-lonely-boy-raw-garage` | kemper | Compressor | Attack | 0.04 | 40 |
| `gary-clark-bright-lights-modern-blues` | kemper | Compressor | Attack | 0.04 | 40 |
| `bonamassa-sloe-gin-blues-rock-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `hammett-fade-to-black-clean-wah-solo` | kemper | Compressor | Attack | 0.04 | 40 |
| `homme-no-one-knows-detuned-desert` | kemper | Compressor | Attack | 0.04 | 40 |
| `srv-little-wing-hendrix-tribute` | kemper | Compressor | Attack | 0.06 | 60 |
| `gilmour-shine-on-sustain` | kemper | Compressor | Attack | 0.04 | 40 |
| `angus-thunderstruck-tapping-intro` | kemper | Compressor | Attack | 0.04 | 40 |
| `felder-hotel-california-solo` | quad_cortex | Studio Comp | Attack | 0.05 | 50 |
| `felder-hotel-california-solo` | quad_cortex | Studio Comp | Release | 0.2 | 200 |
| `felder-hotel-california-solo` | fractal | Studio Comp | Attack | 0.05 | 50 |
| `felder-hotel-california-solo` | fractal | Studio Comp | Release | 0.2 | 200 |
| `collins-free-bird-outro-solo` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `collins-free-bird-outro-solo` | quad_cortex | Studio Comp | Release | 0.25 | 250 |
| `collins-free-bird-outro-solo` | fractal | Studio Comp | Attack | 0.06 | 60 |
| `collins-free-bird-outro-solo` | fractal | Studio Comp | Release | 0.25 | 250 |
| `blackmore-smoke-on-the-water-riff` | quad_cortex | Studio Comp | Attack | 0.05 | 50 |
| `blackmore-smoke-on-the-water-riff` | quad_cortex | Studio Comp | Release | 0.2 | 200 |
| `blackmore-smoke-on-the-water-riff` | fractal | Compressor | Attack | 0.05 | 50 |
| `blackmore-smoke-on-the-water-riff` | fractal | Compressor | Release | 0.2 | 200 |
| `clapton-sunshine-of-your-love-woman-tone` | quad_cortex | Studio Comp | Attack | 0.05 | 50 |
| `clapton-sunshine-of-your-love-woman-tone` | quad_cortex | Studio Comp | Release | 0.3 | 300 |
| `clapton-sunshine-of-your-love-woman-tone` | fractal | Compressor | Attack | 0.05 | 50 |
| `clapton-sunshine-of-your-love-woman-tone` | fractal | Compressor | Release | 0.3 | 300 |
| `knopfler-money-for-nothing-intro` | quad_cortex | Studio Comp | Attack | 0.05 | 50 |
| `knopfler-money-for-nothing-intro` | quad_cortex | Studio Comp | Release | 0.25 | 250 |
| `knopfler-money-for-nothing-intro` | fractal | Studio Comp | Attack | 0.05 | 50 |
| `knopfler-money-for-nothing-intro` | fractal | Studio Comp | Release | 0.25 | 250 |
| `edking-sweet-home-alabama-intro` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `edking-sweet-home-alabama-intro` | quad_cortex | Studio Comp | Release | 0.5 | 500 |
| `edking-sweet-home-alabama-intro` | fractal | Studio Comp | Attack | 0.06 | 60 |
| `edking-sweet-home-alabama-intro` | fractal | Studio Comp | Release | 0.5 | 500 |
| `page-black-dog-riff` | quad_cortex | Studio Comp | Attack | 0.02 | 20 |
| `page-black-dog-riff` | quad_cortex | Studio Comp | Release | 0.15 | 150 |
| `page-black-dog-riff` | quad_cortex | Studio Comp | Attack | 0.02 | 20 |
| `page-black-dog-riff` | quad_cortex | Studio Comp | Release | 0.1 | 100 |
| `page-black-dog-riff` | fractal | Studio Comp | Attack | 0.02 | 20 |
| `page-black-dog-riff` | fractal | Studio Comp | Release | 0.15 | 150 |
| `page-black-dog-riff` | fractal | Studio Comp | Attack | 0.02 | 20 |
| `page-black-dog-riff` | fractal | Studio Comp | Release | 0.1 | 100 |
| `gilmour-money-solo` | quad_cortex | Studio Comp | Attack | 0.08 | 80 |
| `gilmour-money-solo` | quad_cortex | Studio Comp | Release | 0.6 | 600 |
| `gilmour-money-solo` | fractal | Studio Comp | Attack | 0.08 | 80 |
| `gilmour-money-solo` | fractal | Studio Comp | Release | 0.6 | 600 |
| `scholz-more-than-a-feeling-riff` | quad_cortex | Studio Comp | Attack | 0.05 | 50 |
| `scholz-more-than-a-feeling-riff` | quad_cortex | Studio Comp | Release | 0.7 | 700 |
| `scholz-more-than-a-feeling-riff` | fractal | Studio Comp | Attack | 0.05 | 50 |
| `scholz-more-than-a-feeling-riff` | fractal | Studio Comp | Release | 0.7 | 700 |
| `livgren-carry-on-wayward-son-riff` | quad_cortex | Studio Comp | Attack | 0.06 | 60 |
| `livgren-carry-on-wayward-son-riff` | quad_cortex | Studio Comp | Release | 0.5 | 500 |
| `livgren-carry-on-wayward-son-riff` | fractal | Studio Comp | Attack | 0.06 | 60 |
| `livgren-carry-on-wayward-son-riff` | fractal | Studio Comp | Release | 0.5 | 500 |
| `mccready-black-solo` | kemper | Compressor | Attack | 0.05 | 50 |
| `mccready-even-flow-solo` | kemper | Compressor | Attack | 0.05 | 50 |
| `grohl-the-pretender-riff` | kemper | Compressor | Attack | 0.03 | 30 |
| `grohl-the-pretender-riff` | fractal | Gate | Release | 0.3 | 300 |
| `frusciante-snow-hey-oh-intro` | kemper | Compressor | Attack | 0.04 | 40 |
| `marr-this-charming-man-jangle` | kemper | Compressor | Attack | 0.04 | 40 |
| `marr-there-is-a-light-jangle` | kemper | Compressor | Attack | 0.04 | 40 |
| `gorham-boys-are-back-twin-lead` | kemper | Compressor | Attack | 0.05 | 50 |
| `mccready-alive-solo` | kemper | Compressor | Attack | 0.05 | 50 |
| `mccready-yellow-ledbetter-clean` | kemper | Compressor | Attack | 0.06 | 60 |
| `corgan-cherub-rock-big-muff` | kemper | Compressor | Attack | 0.05 | 50 |
| `corgan-bullet-butterfly-fender-blender` | kemper | Compressor | Attack | 0.05 | 50 |
| `walsh-life-in-the-fast-lane-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `followill-use-somebody-octave-lead` | kemper | Compressor | Attack | 0.05 | 50 |
| `leadon-take-it-easy-tele-lead` | kemper | Compressor | Attack | 0.06 | 60 |
| `valensi-reptilia-lead-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `hammond-last-nite-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `perkins-folsom-prison-blues-boom-chicka` | kemper | Compressor | Attack | 0.05 | 50 |
| `gibbons-sharp-dressed-man-eliminator` | kemper | Compressor | Attack | 0.05 | 50 |
| `reid-cult-of-personality-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `malakian-chop-suey-clean-to-crushing` | kemper | Compressor | Attack | 0.06 | 60 |
| `deleo-plush-les-paul` | kemper | Compressor | Attack | 0.06 | 60 |
| `deleo-interstate-love-song-clean-intro` | kemper | Compressor | Attack | 0.05 | 50 |
| `dharma-dont-fear-the-reaper-clean-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `angus-highway-to-hell-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `angus-whole-lotta-rosie-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `chuck-berry-johnny-b-goode` | kemper | Compressor | Attack | 0.05 | 50 |
| `hendroff-what-a-beautiful-name` | kemper | Compressor | Attack | 0.04 | 40 |
| `hislop-goodness-of-god` | kemper | Compressor | Attack | 0.05 | 50 |
| `moore-living-hope` | kemper | Compressor | Attack | 0.06 | 60 |
| `moore-way-maker` | kemper | Compressor | Attack | 0.05 | 50 |
| `garrard-great-are-you-lord` | kemper | Compressor | Attack | 0.04 | 40 |
| `malakian-aerials` | kemper | Compressor | Attack | 0.04 | 40 |
| `jones-the-pot-drop-c-crush` | kemper | Compressor | Attack | 0.03 | 30 |
| `jones-the-pot-drop-c-crush` | fractal | Gate | Release | 0.3 | 300 |
| `jones-jambi-drop-d-talk-box` | kemper | Compressor | Attack | 0.03 | 30 |
| `jones-jambi-drop-d-talk-box` | fractal | Gate | Release | 0.3 | 300 |
| `delson-crawling-clean-to-heavy` | kemper | Compressor | Attack | 0.03 | 30 |
| `delson-crawling-clean-to-heavy` | fractal | Gate | Release | 0.3 | 300 |
| `delson-one-step-closer-drop-d` | kemper | Compressor | Attack | 0.03 | 30 |
| `delson-one-step-closer-drop-d` | fractal | Gate | Release | 0.2 | 200 |
| `delson-faint-drop-d-octave-hook` | kemper | Compressor | Attack | 0.03 | 30 |
| `delson-faint-drop-d-octave-hook` | fractal | Gate | Release | 0.2 | 200 |
| `slash-slither-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `nilsson-hisingen-blues-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `tremonti-higher-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `kelliher-colony-of-birchmen-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `tremonti-what-if-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `tremonti-metalingus-riff` | kemper | Compressor | Attack | 0.06 | 60 |
| `tremonti-kennedy-blackbird-solo` | kemper | Compressor | Attack | 0.05 | 50 |
| `grohl-all-my-life-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `grohl-times-like-these-riff` | helix | Deluxe Comp | Attack | 0.04 | 40 |
| `grohl-times-like-these-riff` | helix | Deluxe Comp | Release | 0.2 | 200 |
| `grohl-times-like-these-riff` | kemper | Studio Comp | Attack | 0.05 | 50 |
| `grohl-monkey-wrench-riff` | kemper | Compressor | Attack | 0.03 | 30 |
| `grohl-monkey-wrench-riff` | fractal | Gate | Release | 0.3 | 300 |
| `george-lynch-mr-scary-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `george-lynch-mr-scary-lead` | fractal | Gate | Release | 0.4 | 400 |
| `glenn-tipton-beyond-the-realms-clean-to-lead` | kemper | Compressor | Attack | 0.04 | 40 |
| `dave-murray-wrathchild-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `dave-murray-wrathchild-riff` | fractal | Gate | Release | 0.3 | 300 |
| `kk-downing-hell-bent-for-leather-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `downing-victim-of-changes-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `tipton-exciter-riff` | kemper | Compressor | Attack | 0.02 | 20 |
| `murray-phantom-of-the-opera-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `murray-22-acacia-avenue-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `smith-wasted-years-riff` | kemper | Compressor | Attack | 0.04 | 40 |
| `smith-evil-that-men-do-solo` | kemper | Compressor | Attack | 0.05 | 50 |
| `smith-sea-of-madness-riff` | kemper | Compressor | Attack | 0.05 | 50 |
| `blackmore-stargazer-solo` | kemper | Compressor | Attack | 0.06 | 60 |
| `blackmore-kill-the-king-riff` | kemper | Compressor | Attack | 0.03 | 30 |
| `campbell-stand-up-and-shout-riff` | kemper | Compressor | Attack | 0.03 | 30 |
| `blackmore-gates-of-babylon-solo` | kemper | Compressor | Attack | 0.07 | 70 |
| `campbell-dont-talk-to-strangers-clean` | kemper | Compressor | Attack | 0.02 | 20 |
| `iommi-neon-knights-riff` | kemper | Compressor | Attack | 0.012 | 12 |
| `rhoads-mr-crowley-solo` | kemper | Compressor | Attack | 0.045 | 45 |
| `jake-e-lee-bark-at-the-moon-riff` | kemper | Compressor | Attack | 0.015 | 15 |
