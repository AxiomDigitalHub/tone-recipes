# Press Photo Outreach — Rights-Released Gear Images

**Goal:** Get F&K added to manufacturer press/media lists so we have standing access to
rights-released, high-resolution product images for news articles (header images, in-body
shots) — cleared for editorial use, no per-image licensing.

**Why:** Manufacturers rarely expose a self-serve download portal with clear licensing.
The reliable path is being on their media list: press releases + hi-res image packs land in
your inbox on embargo, already cleared for editorial coverage. This is a one-time setup per
brand that pays off on every future story.

**Status:** Drafts ready for Daniel to review + send. Nothing here has been sent — sending
outbound press email is a human step. Send from a branded address if you have one
(e.g. press@faderandknob.com) — it reads as more legitimate than a personal Gmail.

---

## Guardrails when we DO get images

- **Editorial use only** unless the license explicitly says otherwise. Product-news coverage
  is editorial; using a press photo in a paid ad or on merch is not — ask first.
- **Credit as requested.** Most press images want "Photo: Marshall" or similar. Add a
  `photo_credit` line if we extend the news frontmatter; until then, credit in the caption/body.
- **Don't hotlink** the manufacturer's URL. Download the hi-res file, drop it in
  `public/images/news/`, and point `image_url` at the local path. Hotlinking breaks when they
  move the file and isn't what the license covers.
- **Keep the email.** Save the reply granting permission — it's our proof of license.

---

## Reusable template

> **Subject:** Media/press image request — Fader & Knob (guitar tone publication)
>
> Hi [team],
>
> I run **Fader & Knob** (faderandknob.com), an editorial site covering guitar amp modelers,
> effects, and gear — we publish tone breakdowns and news for players on Helix, Quad Cortex,
> HX Stomp, and similar rigs. We regularly cover [BRAND] launches and firmware.
>
> Could you add us to your **press/media list**, and point me to where I can get
> **rights-released, high-resolution product images** cleared for editorial use? We'd credit
> [BRAND] per your preference on every use.
>
> Specifically right now I'm covering **[PRODUCT]** and would love an official product shot to
> run with the piece. Happy to share the article link once it's up.
>
> Thanks,
> [Name]
> Fader & Knob — faderandknob.com
> [email]

---

## Live draft: Marshall 1959BJA (send now)

**To:** `contactus@marshall.com` — and via the newsroom "Get in touch" form at
https://group.marshall.com (that's the correct Marshall *Amplification* route).
**⚠️ Do NOT use `marshallpr.com` (an unrelated Maine PR agency) or `marshall-usa.com`
(Marshall Electronics — broadcast/AV, a different company).** No dedicated amp-PR email is
public, so the general contact + newsroom form is the path; ask them to route it to press/media.

> **Subject:** Press image request — 1959BJA coverage — Fader & Knob
>
> Hi Marshall team,
>
> I run **Fader & Knob** (faderandknob.com), an editorial guitar-tone publication. We just
> published a piece on the new **1959BJA Billie Joe Armstrong Artist Signature** — covering the
> handwired 1959HW platform, the Dookie Mod, and how players can chase that tone. Our audience
> is exactly the players who'd want this amp.
>
> Two asks:
> 1. Could you send an **official high-res product image of the 1959BJA**, cleared for editorial
>    use, to run with the article? We'll credit Marshall however you prefer.
> 2. Please add us to your **press/media list** so we get releases and image packs for future
>    launches — we cover Marshall regularly.
>
> Article's already live and I'll send the link on request. Thanks!
>
> [Name]
> Fader & Knob — faderandknob.com
> [email]

---

## Priority contacts table

Verified addresses where found; otherwise the page to pull the press contact from. **Verify each
before sending — don't trust an address you can't confirm on the brand's own site.**

| Brand | Press route | Notes |
|-------|-------------|-------|
| Marshall (amps) | `contactus@marshall.com` + group.marshall.com newsroom form | No public amp-PR email; ask to be routed to press. Avoid marshallpr.com / marshall-usa.com. |
| Neural DSP | `press@neuraldsp.com` | Dedicated press address. |
| Line 6 | Yamaha Guitar Group press — via line6.com/contact → media | Owned by Yamaha; media requests usually route through YGG PR. Confirm current contact on site. |
| Fractal Audio | fractalaudio.com contact form | Small company; ask directly, they're responsive to media. |
| Kemper | kemper-amps.com contact | Confirm press contact on site. |
| Boss / Roland | roland.com press / regional PR | Roland runs formal regional press contacts — find the US one. |
| IK Multimedia | ikmultimedia.com → press/media | Has a media resources section historically. |
| Mooer | mooeraudio.com contact | Ask distributor too (regional). |
| Valeton | valeton.net contact | Regional distributors often handle press assets. |
| Fender | Fender Newsroom (fender.com/news) | Established newsroom; look for media contact. |
| Gibson | Gibson press / media relations | Established press team. |

**Next actions:** (1) Daniel sends the Marshall draft. (2) As we cover each brand, fire the
template and build out the verified-contact list above so it becomes standing infrastructure.
