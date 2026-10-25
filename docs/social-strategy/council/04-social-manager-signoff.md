# Round 4 sign-off: Sasha Okafor

**Verdict: APPROVE WITH CHANGES.** I also accept Mara's cuts: no comment prompts, Same Sound merged into the closing slides, News moved to Threads.

On "Key of Ab": the key *is* in the source, in the `recipe.description` of `hislop-goodness-of-god` ("Key of Ab, 82 BPM."). The spec just doesn't parse descriptions. The real gap is that a key has no digits, so D1 would let an invented one through.

## Must-fix for v1

1. **Factsheet, prose facts.** Replace the prose-numbers rule with:
   > "Text facts are extracted from `recipe.description`, `tone_context` and block `notes` with `/\bKey of ([A-G][b#]?m?)\b/` and `/\b(\d{2,3}) BPM\b/`. Never inferred."

   Then add to D1:
   > "Any `/\b(key of|in) [A-G][b#♭♯]?m?\b/i` in LLM text must equal a cited text fact."
2. **D1 tokenizer.** Use `/[-−]?\d+(?:[.,]\d+)?\s?(?:k|ms|hz|khz|db|%|bpm)?/gi` and normalize `−`→`-` before comparing. As written, "Threshold −32" fails against display "-32".
3. **C2 blocks.** Move C2 into the blocking set:
   > "C2 = none blocks; a post that answers no visitor question does not ship (MESSAGING_FRAMEWORK §1)."
4. **Sunday Sound block slides.** The current order caps at 5 slides, so Volume and Comp get dropped, and the volume swell is the whole verse move. Replace with:
   > "Block slides (max 4): Delay · Reverb · Amp + Cab (one slide) · Swells & lift (Volume, Comp, Drive; ≤8 rows; disabled drives labeled 'last chorus')."
5. **Caption template.** "Helix and 6 other rigs" is a hard-coded count that's false for blog sources. Replace with:
   > "`{otherPlatforms.length ? 'Also written for ' + otherPlatforms.join(', ') + '.' : ''}` Full settings: link in profile."

   Set `cta` per format:
   - sunday_sound: "Send this to whoever runs your Sunday rig."
   - knob_card / worship_rig: "Save this for your next rehearsal."
   - fix_it: "Save this for the next time it happens."

## Slide plans: confirmed

- **Knob Card / worship_rig (≤6):** cover → rule slide (one takeaway) → up to 3 table slides → close. Confirmed, on one condition: table cells must be cleaned. Strip a trailing `/\s*\(.*\)\s*$/` from the display value, and turn the stripped text into a text fact. Otherwise the Deluxe guide renders "5 (see below)" as a value.
- **Sunday Sound (≤7):** cover → up to 4 block slides (per fix 4) → close with the attribution line, CTA and other platforms. Confirmed.
- **Fix-It (3 + close):** symptom → cause → exact move, allowlist only. Confirmed.
