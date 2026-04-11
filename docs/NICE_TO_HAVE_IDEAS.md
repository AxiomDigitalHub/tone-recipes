# Nice-to-have ideas (not MVP)

**Written:** April 11, 2026
**Purpose:** Park the wild ideas that would be delightful but aren't critical path. When we're ready for a visual polish pass — likely on a `design-v2` branch — this is the backlog.

---

## 1. Modeler card stack (Physical / Helix / Katana)

**Reference:** https://reactbits.dev/components/card-swap

**The idea:** Instead of the current flat "choose your platform" grid, stack the three modeler presentations as a 3D card swap — one in front, two behind with subtle rotation and offset. The user flips through them (auto-rotate or click) and each card shows a platform's signature card — Helix snapshots, Katana channel layout, physical pedalboard.

**Why it's tempting:**
- It makes platform-switching feel like product-browsing, not a dropdown
- The Helix / Katana / Physical divide is the single most important user-facing axis of the entire site, and it's currently presented flatly
- It's visually the thing that would tell a new visitor "this site takes the modeler question seriously"

**Why it's not MVP:**
- We can ship the MVP with a tab switch and it works fine
- The card-swap works best when each card has a distinct, photographable personality — so it depends on good platform hero art (which we don't have yet, and image budget is tight right now)
- Mobile needs a totally different interaction model (swipe vs. stack)

**Where it'd live:** The `/how-it-works` page, possibly a section on the homepage that replaces the current "pick your rig" block.

---

## 2. Signal chain as hero background element

**Reference:** https://reactbits.dev/ (the hero on the landing page)

**The idea:** Instead of the signal chain being a fenced-off dark card below the hero headline, let it live *behind* the hero — a dim, slowly-animated wire + node network taking up the full hero background, with the headline and CTA floating on top. The chain becomes ambient texture, not a competing element.

**Why it's tempting:**
- The signal chain is our visual thesis — it should be the first thing you see, not a thing you scroll to
- It removes the current "headline, then a weird boxy card, then another CTA" stacking that makes the homepage feel incoherent
- React Bits-style ambient backgrounds are the current idiom for devtool and SaaS landing pages, and it'd place Fader & Knob in the right visual company

**Why it's not MVP:**
- It requires re-thinking the hero headline contrast (colored wires behind text need careful handling)
- It kills the current "cable routing" SVG which I just spent real effort on — that's a sunk-cost concern, not a design concern, but worth noting
- Animated backgrounds cost battery on mobile, so we'd need a `prefers-reduced-motion` fallback

**Where it'd live:** Replaces the entire current homepage hero. The flat signal chain card would move to `/how-it-works` or a dedicated "the method" block further down the page.

---

## 3. Homepage redesign (the umbrella)

**The actual user feedback:** "The homepage still isn't landing for me. It's not technically critical path, but the signal, the lines, the weird underline, it's not adding up."

**What's competing on the current homepage:**
1. Headline with a hand-drawn underline
2. A cable-routing SVG with animated glow
3. A dark chain card showing the signal chain
4. A CTA button
5. A "browse recipes" grid further down

**What the actual message is:**
"We turn songs into signal chains, with presets that work on your exact modeler."

**The hypothesis:** Kill the cable routing. Kill the weird underline. Either:
- **(a)** Hero is just headline + one sub + one CTA, and the signal chain becomes a background element (idea #2 above), OR
- **(b)** Hero is just headline + one sub + one CTA, and the first scroll is the chain card — full width, centered, given room to breathe, not crammed in as "also look at this"

Neither is a redesign to scope in this doc. That deserves a `design-v2` branch and its own plan.

---

## How to tackle this

**If we decide to ship any of these:**
1. Create `design-v2` branch from `main`
2. Start with #2 (signal chain as background) because it's the one that actually addresses the "homepage isn't landing" feedback
3. Do #1 (card stack) only after we have platform hero art worth stacking
4. Merge back to main only after a full UX audit confirms the new hero actually reads clearly
