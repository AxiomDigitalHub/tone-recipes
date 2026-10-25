# Round 4: Marketing Lead sign-off (Mara Quinn)

**Verdict: APPROVE WITH CHANGES.**

## Must-fix before v1 goes live

1. **Measure the north-star from day 1.** Ship the `/ig` page with `NewsletterSignup` *before* `profileReady: true`. Signups must store `utm_source`/`utm_content`, and the digest counts them from the subscriber table, not GA4.
2. **Seed the Fix-It allowlist.** Review at least 6 posts before week 1. If the allowlist is empty, Wednesday falls back to `knob_card` instead of being skipped. Fix-It is our best save driver.
3. **No unattended post without an independent honesty check.** If the critic has `"independent": false`, force `requiresApproval: true` on that slot, whatever `approvalMode` says.
4. **No hardcoded numbers in templates.** "Helix and 6 other rigs" has to come from `otherPlatforms.length` (or drop the number), and D1b has to cover template text too.
5. **Day-45 rule: I'm adopting Sasha's version.** It triggers only when median reach is under 150 AND (saves+shares)/1k reach is below the weeks 1–2 baseline. The output is a flagged review for Daniel, not an automatic change, so a cold account can't kill a format that's working.

## Mix and grid

**Confirmed:** 40% worship and the 2/2/1 grid. In practice that's Sunday Sound + worship_rig, two Knob Cards, one Fix-It, with "Just unwrapped" on Monday from Nov 30. Worship rises to 50% as the runway in the digest allows.

## Daniel's decisions, in priority order

1. Pause today's `faderandknob-social-autopost` task.
2. Hire the audio contractor. It unblocks Reels and Shorts.
3. Fix the profile (avatar, bio). Set `profileReady` once `/ig` ships.
4. Connect Pinterest in Zernio and set `pinterestBoardId` (check pricing first).
5. Approve weeks 1–2 in Zernio, then flip `approvalMode` off.
6. Commit 10 minutes a week to replies. Threads connects in week 2 only if this holds.
