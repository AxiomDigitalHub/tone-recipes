# Welcome Sequence: Full Copy + Implementation Spec

**Created:** 2026-07-25
**Status:** Ready to implement. Copy is final draft; prices verified against the live /pricing page 2026-07-25 (Free = 5 preset downloads + 10 PDFs/month, Pass $49/yr, Pro $79/yr, Worship Set Pack $19).
**Fixes:** the oldest known gap in the funnel ("29 sign-ups with no follow-up", April notes) and the retention problem (returning users at ~17% of new, current GA4 window).
**Voice:** fk-staff. Plain, specific, verdict-first. Every email useful without clicking. No fake urgency, no countdown timers. AI authorship disclosed in the footer, per house rules.

---

## Sequence A: new account signup (primary)

Trigger: row inserted in `profiles` (Supabase). Most of these users signed up to download a preset, so the sequence assumes gear in hand.

### A1: immediately. Subject: "Your 5 downloads, and where to spend them"

> You're in. The free plan is 5 preset downloads and 10 recipe PDFs a month, every month, plus unlimited browsing and saved recipes.
>
> Five downloads is enough to matter if you spend them well. Start with the recipe your rig deserves:
>
> - **Helix / HX Stomp:** [SRV's Pride and Joy rhythm tone] or the [worship set opener]
> - **Boss Katana:** [the 7 settings most players never find, as a .tsl]
> - **Quad Cortex / TONEX / Fractal / Kemper:** every recipe has your tab
> - **No modeler, just pedals and an amp:** every recipe includes the pedalboard translation
>
> One tip before you load anything: level-match first. A patch that is 2 dB louder always sounds "better." Set output levels equal before you judge a preset, or you will keep the wrong one.
>
> Save recipes as you browse; saved recipes are unlimited and they make your next five downloads obvious.
>
> [Browse the library →]

### A2: day 3. Subject: "How to read a recipe (and adjust it for your room)"

> Every Fader & Knob recipe gives exact positions: not "add some drive," but Gain 4.5, Master 7, Presence 6. Exact starting points beat vague advice, but no room, cab, or pickup set is identical, so here is the adjustment order that works on any platform:
>
> 1. **Play it as written.** No touching anything for two minutes.
> 2. **Fix the feel first (gain).** Too fizzy, back the gain down 1; too stiff, up 0.5. Gain changes feel more than tone.
> 3. **Fix the room second (highs).** Harsh in your room = presence/treble down 1. Dull = up 1. One knob, one step.
> 4. **Stop.** Two knobs is almost always enough. If it still sounds wrong, the problem is usually level or cab/IR, and we have guides for both.
>
> The full 10-minute version: [How to Dial In a Great Tone on Any Modeler →]
>
> Can't find the tone you're chasing? [Request it] and it goes into the production queue; you'll get the page when it's live.

### A3: day 7. Subject: "The math on the download cap"

> Quick math, then we'll leave you alone.
>
> Free gives you 5 preset downloads a month. If that's your pace, keep it forever; the cap resets monthly and nothing expires.
>
> If you're downloading faster than that, the Pass is $49 a year: unlimited presets, unlimited PDFs, and new recipes a week before everyone else. That's $4.08 a month, or about the cost of one set of strings for a year of every tone on the site.
>
> If you buy Set Packs, skip Pass and take Pro at $79: every Set Pack is included while you're subscribed, so one $19 pack a year plus unlimited downloads already makes it the better deal.
>
> [Start Pass — $49/yr] [See what Pro includes]
>
> Either way, next week you'll get Tone of the Week like everyone else: one recipe, one insight, one thing worth knowing. That part is free forever too.

## Sequence B: newsletter subscriber, no account

Trigger: row inserted in `newsletter_subscribers` with no matching profile.

### B1: immediately. Subject: "What you just signed up for"

> Once a week: one recipe with the settings printed right in the email, one insight from the most-read guide of the week, one piece of modeler news that actually matters. Two minutes to read, no filler.
>
> While you're here, the three most-loaded recipes this month: [1], [2], [3]. (Dynamic: top recipes by downloads, pulled at send time.)

### B2: day 5. Subject: "Saved recipes beat bookmarks"

> A free account adds three things the newsletter can't do: unlimited saved recipes, 5 preset downloads a month in your platform's native format, and 10 printable recipe PDFs. No card, no trial clock.
>
> [Create the free account →]

Then B-track subscribers merge into the weekly newsletter. If they later create an account, they enter Sequence A at A1 (the content doesn't overlap enough to feel repeated, and A1's download framing is what they need at that moment).

## Seasonal variants

Per `SEASONAL_CAMPAIGN_CALENDAR.md` C2 Phase D: the unwrapping window (Dec 25 - Jan 15) swaps A1 for a gear-specific day-one version ("Just got a Katana? Here are your first three downloads") keyed off the landing page that captured the signup, and extends the sequence to 5 emails (add: day 1 "make it sound like the record", day 10 "the three mistakes every new [gear] owner makes"). Build in November; same infrastructure.

---

## Implementation notes

**Sending:** Resend is already wired (`src/lib/email.ts`). Two options; take the second:
1. Resend scheduled sends (schedule A2/A3 at signup time). Simple but hard to cancel if the user converts on day 2.
2. **Queue table + daily drain (recommended, fits existing patterns):** `email_sequence_queue` (user_id, sequence, step, due_at, sent_at, cancelled_at). A row per future step, inserted on trigger. The existing daily scheduled-task infrastructure drains due rows each morning, applying suppression checks at send time, not enqueue time.

**Suppression rules (checked at send time):**
- A3 skipped if `profiles.role` is anything but `free` (they already bought; a paid user getting the upsell is the one email that reads as machine-blind).
- Whole sequence halts on unsubscribe (Resend suppression list is authoritative).
- One sequence per address, ever; re-signups don't re-enqueue.
- B2 skipped if a profile now exists for that email.

**Authorship footer (all sequence emails):** "Written by Fader & Knob's AI staff. Reply and a human reads it." No "checked by a human" claim; recipes are AI-researched and AI-generated with automated audits, and the footer must not overstate the human role. (Replies route via hello@ per `EMAIL_INFRASTRUCTURE.md`.)

**Measurement (source of truth, per Daniel 2026-07-25):** don't grade this sequence with GA4. Query the systems that actually know:
- **Supabase:** signups per day, sequence rows sent, `role` changes, download counts per user before/after A3.
- **Stripe API:** subscriptions created (and their created-vs-signup delta tells you whether A3 converts), MRR, refunds.
- Resend: opens/clicks per step (directional only).
GA4/Clarity stay for attribution (which page produced the signup), not for revenue truth. The weekly metrics snapshot task (see `DISTRIBUTION_AUTOMATION_OS.md` §7) reads Stripe + Supabase and logs the funnel: signups → A3 sent → paid within 14 days.

**Success bar:** any paid conversion within 14 days of A3 at ≥1% of free signups is working; iterate copy from there. The control group is the last four months: zero follow-up, ~17% return rate.
