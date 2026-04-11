# Email infrastructure for Fader & Knob

**Written:** April 11, 2026
**Question:** Does Resend give us a real inbox? If not, what's the cheapest AI-friendly way to have an email address we can both send from and receive at?

---

## Short answer

**Resend is send-only.** It does not host an inbox. It's a transactional mail API — it delivers `noreply@faderandknob.com` and `hello@faderandknob.com` outbound, but anything sent *to* those addresses goes nowhere unless we wire up a separate receiver.

The cheapest and most AI-friendly path is:

- **Outbound:** keep Resend (already set up, already in `src/lib/email.ts`)
- **Inbound:** add **Cloudflare Email Routing** (free) to forward `hello@faderandknob.com` to a personal Gmail or ProtonMail inbox

Total cost: **$0 on top of what we already pay**.

---

## Options, ranked

### Option A — Cloudflare Email Routing + Resend (recommended)

Free service that accepts mail for any address at your domain and forwards it to a real inbox you already use.

- **Price:** Free, no cap on forwarded addresses
- **Setup:** Cloudflare dashboard → domain → Email → Email Routing → enable → add a rule (`hello@faderandknob.com` → `daniel@gmail.com`). Updates MX records automatically.
- **Pros:** Zero cost, zero maintenance, works with the existing Resend send setup, no new vendor
- **Cons:** You reply *from* your personal inbox — so either (a) reply from gmail and accept that `daniel@gmail.com` is visible, or (b) set up Gmail "Send mail as" using Resend SMTP so replies appear to come from `hello@faderandknob.com`
- **AI friendliness:** Claude can read Gmail via the Gmail MCP connector; Claude can draft replies that you send. Fully compatible with the current workflow.

**This is the right default.** Nothing to lose, $0.

### Option B — Google Workspace

A real hosted inbox at `hello@faderandknob.com` plus Drive, Docs, Calendar, etc.

- **Price:** $6/user/month (Business Starter)
- **Pros:** Real inbox, Gmail UI, label/search/filter, works with every mail client, Gmail MCP connector works out of the box
- **Cons:** $72/year per seat — and we'd still keep Resend for transactional sends because Workspace has tight sending limits (2,000/day per user, and deliverability suffers if you push bulk mail through it)
- **When this matters:** When you want the domain-branded address to be primary, or when the volume of human-to-human email (customer support, partners, sponsors) grows past what forwarding-to-personal can handle

### Option C — Fastmail

Similar to Workspace but privacy-focused and cheaper.

- **Price:** $3/user/month (Basic) or $5/user/month (Standard)
- **Pros:** Real inbox, good IMAP/SMTP, privacy-friendly, masked email aliases
- **Cons:** No native Claude connector (would need to configure via IMAP tools), separate from the Google ecosystem
- **Verdict:** Skip unless you're philosophically against Google

### Option D — ProtonMail custom domain

- **Price:** $4/month (Mail Plus)
- **Pros:** End-to-end encrypted, privacy-focused
- **Cons:** No Claude connector, awkward API access, and the encryption story mostly only applies proton-to-proton
- **Verdict:** Skip for this use case

### Option E — Zoho Mail (free tier)

Free custom-domain email hosting for up to 5 users.

- **Price:** Free
- **Pros:** Real inbox at the custom domain with no monthly cost
- **Cons:** Zoho's spam filters are heavy-handed with inbound transactional senders, the webmail is clunky, no reliable Claude connector, and bulk sending is rate-limited. Most founders move off it within 6 months.
- **Verdict:** Free but not worth the friction.

---

## Recommended setup

1. **Keep Resend for outbound.** Already wired up in `src/lib/email.ts` — sends welcome emails, Tone of the Week, recipe downloads.
2. **Enable Cloudflare Email Routing** and set two rules:
   - `hello@faderandknob.com` → personal inbox (customer replies, partnerships, feedback)
   - `support@faderandknob.com` → personal inbox (future: explicit support channel)
3. **Optional:** configure Gmail "Send mail as" using Resend SMTP credentials so you can reply from `hello@faderandknob.com` directly inside Gmail. This makes the domain-branded address feel like a real inbox without paying for Workspace.
4. **Revisit Workspace** only when (a) volume of inbound human mail is a daily annoyance, or (b) you want shared inboxes or a second seat for a collaborator.

---

## Claude integration notes

- The **Gmail connector** (already in your MCP registry) can read, search, and draft replies to Gmail. If `hello@faderandknob.com` forwards into Gmail, Claude can triage it the same way as any other Gmail.
- **Resend has no inbound API.** Don't plan on Claude reading Fader & Knob mail through Resend — that's not what it does.
- If you ever want Claude to process inbound mail *programmatically* (e.g. auto-tag recipe requests), use Cloudflare Email Routing's **Worker** mode, which lets a Cloudflare Worker inspect each incoming message before forwarding. That's the cheapest programmatic inbound option and costs pennies at our volume.

---

## What this does NOT change

- The existing `noreply@faderandknob.com` / `hello@faderandknob.com` senders in `src/lib/email.ts` stay exactly the same. Resend is the right tool for transactional sends.
- DNS setup (SPF, DKIM, DMARC) is already done for the outbound path. Cloudflare Email Routing adds its own MX records automatically and doesn't conflict.
