import type { ToneRecipe, PlatformTranslation } from "@/types/recipe";

/**
 * Sidecar assets bundled with every preset download (the "download pack").
 *
 * Born from the 2026-07-08 Reddit research (docs/research/
 * REDDIT_SERVICE_RESEARCH_2026-07-08.md): the #1 reason purchased presets
 * disappoint is rig translation, not tone quality — and the most-loved
 * preset sellers are the ones who teach. So every download ships with:
 *
 *   1. TONE NOTES  — why each block is there, generated from recipe data
 *   2. INSTALL     — how to get the file onto the device, assuming nothing
 *   3. IF IT SOUNDS WRONG — the rig-translation troubleshooter
 *
 * Voice rules (per Daniel): plain language, second person, warm, zero
 * insider-speak. Never assume the reader knows what a cab block or an IR
 * is. Short sentences. It should read like a patient friend, not a manual.
 */

const SITE = "faderandknob.com";

/* -------------------------------------------------------------------------- */
/*  Tone notes — per-block "why", straight from the recipe data               */
/* -------------------------------------------------------------------------- */

export function buildToneNotes(
  recipe: ToneRecipe,
  translation: PlatformTranslation,
  platformLabel: string,
): string {
  const lines: string[] = [];
  lines.push(`${recipe.title}`);
  lines.push(`Tone notes — what each block does and why it's there`);
  lines.push("=".repeat(60));
  lines.push("");
  lines.push(wrap(recipe.description));
  lines.push("");
  lines.push(
    wrap(
      `This file explains the thinking behind the ${platformLabel} preset, ` +
        `block by block. You don't need to read it to use the preset — but if ` +
        `you want to tweak the sound (or learn why it works), start here.`,
    ),
  );
  lines.push("");

  const blocks = [...translation.chain_blocks].sort(
    (a, b) => a.position - b.position,
  );
  blocks.forEach((b, i) => {
    const state = b.enabled === false ? "  [OFF by default — stomp it on]" : "";
    lines.push(`${i + 1}. ${b.block_name}${state}`);
    if (b.original_gear) {
      lines.push(`   Stands in for: ${b.original_gear}`);
    }
    if (b.notes) {
      lines.push(wrap(b.notes, "   "));
    }
    lines.push("");
  });

  if (translation.notes) {
    lines.push("The chain in one breath:");
    lines.push(wrap(translation.notes));
    lines.push("");
  }

  if (recipe.sources?.length) {
    lines.push("Where the rig research comes from:");
    for (const s of recipe.sources) lines.push(`  - ${s}`);
    lines.push("");
  }

  lines.push(`Full recipe with pictures: https://${SITE}/recipe/${recipe.slug}`);
  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/*  Install guides — assume nothing                                           */
/* -------------------------------------------------------------------------- */

const INSTALL_GUIDES: Record<string, string> = {
  helix: `How to install this preset on your Helix (or HX Stomp)
${"=".repeat(60)}

The file ending in .hlx is the preset. Here's how to get it onto
your device. Total time: about two minutes.

You'll need HX Edit — Line 6's free app for Mac and Windows. If you
don't have it yet, download it from line6.com/software. It's also
how you update your firmware, so it's worth having anyway.

1. Connect your Helix (or HX Stomp / LT / Floor) to your computer
   with a USB cable, and turn it on.
2. Open HX Edit. It should find your device automatically.
3. Find an empty preset slot in the list on the left. Click it.
4. Drag the .hlx file from this folder onto that slot.
   (Or use the menu: Presets > Import, then pick the file.)
5. That's it. The preset name appears in the slot, and your
   device now has it. Step on it and play.

If the import fails with a version message: update your firmware
with HX Edit first (Help > Check for Updates), then import again.
Presets made on newer firmware sometimes won't load on older
firmware — updating fixes it.

Stuck? https://${SITE}/how-we-work has ways to reach us.`,

  katana: `How to install this preset on your Boss Katana
${"=".repeat(60)}

The file ending in .tsl is the preset ("Tone Setting" in Boss
language). Here's how to get it onto your amp. Total time: about
two minutes.

You'll need Boss Tone Studio — Boss's free app for Mac and Windows.
Download the version that matches YOUR Katana generation (MkII,
Gen 3, etc.) from boss.info. The versions aren't interchangeable,
so check the back panel of your amp if you're not sure which you have.

1. Connect the Katana to your computer with a USB cable and
   turn it on.
2. Open Boss Tone Studio. It should find the amp automatically.
3. Go to the LIBRARIAN view (top of the window).
4. Click Import, then pick the .tsl file from this folder.
5. The tone appears in your library list. Drag it onto one of
   the amp's channel slots (CH1-CH4) and click Write.
6. Done — that channel button on the amp now calls up this tone.

One honest note: the Katana can't do everything a $1,500 modeler
does, so this version of the tone is the closest the amp gets, not
a clone. The tone notes file explains what had to change.

Stuck? https://${SITE}/how-we-work has ways to reach us.`,

  quad_cortex: `How to install this preset on your Quad Cortex
${"=".repeat(60)}

This download is a build sheet, not a device file. Neural DSP
presets move through their cloud, not as files — so instead of an
importable preset, you get the exact blocks and settings to build
it yourself. It takes about five minutes and you'll end up knowing
the preset better than any import would teach you.

1. Open the .json file in this folder in any text editor (or just
   read the tone notes file — same information, friendlier).
2. On the Quad Cortex, start from an empty preset.
3. Add each block in the order listed, left to right on The Grid.
4. Dial each block's settings to the values shown. Get close —
   two decimal places don't matter, your ears do.
5. Save the preset with the song name.

Stuck? https://${SITE}/how-we-work has ways to reach us.`,
};

export function buildInstallGuide(platform: string): string {
  return INSTALL_GUIDES[platform] ?? INSTALL_GUIDES.helix;
}

/* -------------------------------------------------------------------------- */
/*  The rig-translation troubleshooter                                        */
/* -------------------------------------------------------------------------- */

export function buildTroubleshooter(platform: string): string {
  const isKatana = platform === "katana";
  return `If it sounds wrong on YOUR rig — read this first
${"=".repeat(60)}

Here's the honest truth about every preset ever made, including
this one: it was dialed in on someone else's gear. Your guitar,
your pickups, and especially your speakers all change the sound.
When a preset disappoints, it's almost never broken — it's
translating. These are the five fixes, in the order to try them.

1. IT SOUNDS HARSH OR FIZZY
   You're probably on studio monitors, in-ears, or a PA speaker,
   which reproduce more treble than a guitar amp ever would.
   ${
     isKatana
       ? `Turn the amp's Presence down a touch, and the Treble down
   half a step. Small moves — a little goes far.`
       : `Find the cab block (it imitates the speaker cabinet) and
   lower its "HighCut" — try 8000, then 6000. That trims the
   frequencies a real guitar speaker never makes.`
   }

2. IT SOUNDS MUDDY OR BOOMY
   Small rooms and closed-back speakers pile up bass.
   ${
     isKatana
       ? `Turn Bass down until the low end stops swallowing the
   notes. On the amp, not your guitar.`
       : `In the cab block, raise "LowCut" — try 90, then 120. You're
   cutting rumble the audience never hears as "bass" anyway.`
   }

3. IT HAS TOO MUCH (OR TOO LITTLE) DISTORTION
   Hotter pickups push the amp harder. If your guitar has
   humbuckers and ours had single coils (the tone notes say which
   we used), turn the amp block's Drive down 1-2 steps. Opposite
   direction if you're on single coils and it sounds anemic.

4. IT'S LOUDER OR QUIETER THAN YOUR OTHER PRESETS
   ${
     isKatana
       ? `Level-match with the amp's Master — set it where your other
   channels sit.`
       : `Find the amp block's "ChVol" (channel volume) and nudge it.
   That knob changes loudness without changing the tone, so it's
   always safe to touch.`
   }

5. NO SOUND AT ALL, OR A WEIRD THIN WHISPER
   Three usual suspects, in order:
   - A volume or wah pedal block sitting at zero. Move your
     expression pedal once — that usually wakes it up.
   - The wrong input or output selected for how you're plugged in.
   - If you're going into a mixing desk: phantom power (+48V) on
     the channel can choke some gear. Ask whoever runs sound to
     switch it off for your channel.

STILL WRONG?
Playing through a real guitar amp instead of headphones or a PA?
${
  isKatana
    ? `You're already on a real amp — you're fine.`
    : `Turn the cab block OFF. Your amp's speaker already does that
job; leaving both on is like wearing two pairs of sunglasses.`
}

And if none of this lands the sound, tell us. Seriously — every
report makes the next preset better: https://${SITE}/request

One more thing we believe: a preset is a starting point, not a
verdict. The tone notes file explains what every block is doing,
so you can change things ON PURPOSE instead of poking knobs and
hoping. That's the whole idea of a recipe.`;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Wrap text at ~68 chars for comfortable reading in any text editor. */
function wrap(text: string, indent = ""): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = indent;
  for (const w of words) {
    if ((line + " " + w).length > 68) {
      lines.push(line);
      line = indent + w;
    } else {
      line = line === indent ? indent + w : line + " " + w;
    }
  }
  if (line.trim()) lines.push(line);
  return lines.join("\n");
}
