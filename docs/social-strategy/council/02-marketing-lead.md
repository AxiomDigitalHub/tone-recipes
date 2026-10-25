# Round 2: Marketing Lead response to Sasha (Mara Quinn)

**Date:** 2026-10-25 · Responds to `01-social-manager.md`. Theo's recon (`00-prompt-engineer-recon.md`) had not landed when I wrote this. Correction to my Round 1 memo: recipes are static TS in `src/lib/data/index.ts`, not Supabase. That makes "numbers never pass through an LLM" easier to enforce.

## (a) Answers

- **KPI:** two tiers. **Leading indicator: (sends + saves) per 1,000 reach.** Every CTA steers there, so yes, Sasha. **North-star: social-sourced email subscribers** (UTM-tagged). Followers are reported and never targeted.
- **Who fixes the profile:** the machine drafts the avatar asset, the bio (with the AI-disclosure line) and the link-page copy. Daniel uploads the avatar and bio in the Instagram app (one sitting, about 15 minutes). Theo builds the UTM'd link page. **Hard gate: the daily autopost task is paused today and stays paused until the profile is complete.** Posting into an empty profile burns the trial audience we can't get back.
- **Threads:** connect it in **week 2, not now.** It's a text lane for Fix-Its and News, 3 posts a week, with human replies only.

## (b) Format verdicts and cadence

Five posts a week fits under my cap. The cap stays as a ceiling (1 feed post/day + 1 Trial Reel/week), not a quota.

| Format | Verdict |
|---|---|
| 1 Knob Card | **Keep.** Also the first Pinterest export (2:3). |
| 2 Sunday Sound | **Keep, flagship.** "Send to whoever runs your Sunday rig" is the best CTA in either memo. |
| 3 Fix-It | **Keep.** Gate-verified tables only. Also Threads-native. |
| 4 Verdict | **Keep, restricted.** Only ICP decisions (HX Stomp vs Helix LT, FRFR for a Stomp), only posts with an explicit verdict. Launches week 3. |
| 5 Same Sound, Your Gear | **Merge.** It becomes the closing slide of Sunday Sound and Knob Card ("Katana, QC, pedalboard versions → link in profile"). Standalone, it spends four slides on platforms the ICP doesn't own. |
| 6 48-Hour News | **Cut from Instagram, move to Threads.** A single image with no CTA earns neither saves nor clicks. |
| Silent knob-turn Reel | **Keep, 1/week, Trial Reels only.** I withdraw my 2/week. |

**Launch order (weeks 1–2 supervised; Daniel approves each batch in the Monday window):**
- **Week 0 (now):** pause the autopost task, fix the profile, build the link page.
- **Week 1:**
  - Mon: Knob Card (Deluxe Reverb on Helix)
  - Tue: Sunday Sound (Goodness of God)
  - Wed: Fix-It
  - Thu: Knob Card (AC30 or HX Stomp unwrapping angle)
  - Fri: Sunday Sound #2
  - Plus 1 silent Trial Reel.
- **Week 2:** same grid. Connect **Pinterest** (Knob Card + Sunday Sound as 2:3 pins, linked straight to the matching page, not the profile) and **Threads** (Fix-It + News text).
- **Week 3:** Verdict takes Thursday. From Nov 30, Monday becomes "Just unwrapped" (C2).

## (c) Disagreements

1. **No comment-bait CTAs.** "Tag your rig" is engagement bait, which Meta demotes. CTAs are save, send, or link only.
2. **Pinterest is missing from her plan.** It's the only channel where a zero-follower account gets outbound clicks from day one,. It goes in week 2.
3. **A critic model is not the number gate.** Her `{value, sourcePath}` diff is the gate, and it must be deterministic and blocking. The LLM critic only advises on hook and distinctness.
4. **Attribution leak check.** Example A's source slug is `hislop-goodness-of-god`, but the slide credits a pool of players. The renderer must never surface slug or persona names on pool-attributed songs. Every "fact" slide (the 6.8k resistor, "Mid at noon = stock") needs a source field like the numbers do.
5. **Zero audio Reels: accepted, with a deadline.** We accept the reach ceiling; the audio-contractor hire goes to Daniel's next digest as the one business decision.

## (d) Measurement loop: final word

**The Monday digest shows one table:** per format, trailing 14 days, **(sends + saves) per 1,000 reach**, plus one line of **social-sourced email signups and site sessions** (UTM).

**Decision rules, applied automatically from week 4 (each format needs at least 3 posts):**
- The lowest-ranked format gives one weekly slot to the highest-ranked one.
- Any format below 0.5× the account median for two consecutive digests is cut.
- **Day-45 kill rule stands:** if median non-follower carousel reach is under 150, the format system changes, not the cadence.
- If the save/send rate climbs but email signups stay flat for 4 weeks, the problem is the link page, not the content.

Theo to confirm Zernio exposes per-post shares and saves; if not, the digest says which proxy it uses.

---
**Summary**
1. Pause autopost now; Daniel fixes the profile; KPI is (sends+saves)/1k reach leading, social-sourced email signups north-star.
2. Keep Knob Card, Sunday Sound, Fix-It, restricted Verdict; merge Same Sound into closing slides; move News to Threads; 5/week, Pinterest + Threads in week 2.
3. A deterministic number/fact gate blocks; no comment bait; the data-driven slot rule kicks in at week 4, and the audio-contractor hire goes to Daniel.
