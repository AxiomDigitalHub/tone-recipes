# Security Audit Report — faderandknob.com

**Date:** 2026-04-07
**Codebase:** /Users/daniellivengood/Documents/Claude/tone-recipes
**Stack:** Next.js 16.1.6, Supabase, Stripe, Vercel
**Auditor:** Automated security sweep

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3     |
| HIGH     | 5     |
| MEDIUM   | 6     |
| LOW      | 4     |
| PASSED   | 10    |

---

## CRITICAL — Fix Immediately

### C1. Hardcoded Secrets in .env.local

**File:** `.env.local`
**What:** The file contains three hardcoded production secrets in plaintext:
- `REPLICATE_API_TOKEN` (starts with `r8_`)
- `VERCEL_OIDC_TOKEN` (full JWT with project/team identifiers)
- `STRIPE_SECRET_KEY` (value starts with `pk_live_` — see C2 below)

**Why it matters:** If this file is ever accidentally committed, shared, or exposed via a backup, all three services are compromised. The Replicate token grants AI model access. The Vercel OIDC token exposes deployment infrastructure.

**How to fix:**
1. Rotate ALL three tokens immediately.
2. Store secrets exclusively in Vercel Environment Variables (dashboard), never in local `.env.local` files that could be committed.
3. For local development, use `.env.local` with test/development-mode keys only — never production keys.

---

### C2. STRIPE_SECRET_KEY Contains a Publishable Key (pk_live_), Not a Secret Key (sk_live_)

**File:** `.env.local` line 5
**What:** The variable `STRIPE_SECRET_KEY` is set to a value beginning with `pk_live_51ROQNg...`. Publishable keys start with `pk_`; secret keys start with `sk_`. This means either:
- (a) The wrong key was pasted — a publishable key is stored where a secret key is expected, or
- (b) The real secret key is stored elsewhere and this is a leftover mistake.

**Why it matters:** If (a), Stripe server operations (creating checkout sessions, verifying webhooks, managing subscriptions) will fail or behave unpredictably. If there is a real `sk_live_` key somewhere that was previously here, it may have been committed to git or shared. The `src/lib/stripe.ts` file reads `process.env.STRIPE_SECRET_KEY` and passes it to `new Stripe(...)`, which expects an `sk_` key.

**How to fix:**
1. Verify which Stripe key this actually is in the Stripe Dashboard.
2. If the real `sk_live_` key was ever in this file, rotate it immediately in Stripe Dashboard.
3. Set the correct `sk_live_` key in Vercel Environment Variables only.
4. Use `sk_test_` keys for local development.

---

### C3. Stripe Webhook Signature Verification Is Optional

**File:** `src/app/api/webhooks/stripe/route.ts` lines 29-38
**What:** The webhook handler checks if `STRIPE_WEBHOOK_SECRET` is configured, but if it is NOT set, it falls through to `JSON.parse(body)` and processes the event without any signature verification. The code comment says "dev mode" but there is no check that this is actually a development environment.

```
if (webhookSecret && sig) {
  // verify signature
} else {
  // No webhook secret configured — parse event directly (dev mode)
  event = JSON.parse(body) as Stripe.Event;
}
```

**Why it matters:** If `STRIPE_WEBHOOK_SECRET` is not set in production (which is plausible given the other .env issues), anyone can POST a crafted JSON body to `/api/webhooks/stripe` and:
- Upgrade any user to premium/creator by sending a fake `checkout.session.completed` event with arbitrary `supabase_user_id`
- Downgrade any user by sending a fake `customer.subscription.deleted` event
- This is a direct privilege escalation vulnerability.

**How to fix:**
1. Set `STRIPE_WEBHOOK_SECRET` in Vercel production environment variables.
2. Make signature verification mandatory — if the secret is missing, reject ALL requests with 500:
```typescript
if (!webhookSecret) {
  console.error("STRIPE_WEBHOOK_SECRET not configured");
  return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
}
```
3. Remove the fallback `JSON.parse` path entirely.

---

## HIGH — Fix This Week

### H1. No Rate Limiting on Any API Route

**Files:** All files in `src/app/api/`
**What:** None of the API routes implement rate limiting: `/api/checkout`, `/api/newsletter`, `/api/invite/redeem`, `/api/recipes/[slug]/download`, `/api/webhooks/stripe`.

**Why it matters:**
- `/api/newsletter` — an attacker can spam newsletter signups with millions of emails, polluting the database
- `/api/recipes/[slug]/download` — free users can automate downloads to bypass the 10-download limit by cycling emails for PDF downloads
- `/api/checkout` — potential for abuse of Stripe checkout session creation
- `/api/invite/redeem` — brute-force attack on invite codes

**How to fix:** Add rate limiting using Vercel's built-in rate limiting, or use `@upstash/ratelimit` with Redis:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});
```

---

### H2. Admin Pages Have No Server-Side Auth Guard

**Files:** `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
**What:** The admin layout contains only metadata (robots noindex). The admin page is a `"use client"` component with no authentication check whatsoever — it renders freely for anyone who visits `/admin`. The moderation page (`/admin/moderation`) does check `is_moderator` on the client side, but this is a client-side-only check that can be bypassed.

**Why it matters:** While the admin page currently shows only static data counts, it links to routes like `/admin/recipes/new` and sets an expectation that this area is restricted. If future admin functionality is added (user management, data deletion), anyone could access it.

**How to fix:**
1. Add middleware-level auth checks for `/admin/*` routes.
2. Or add a server-side layout check:
```typescript
// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
export default async function AdminLayout({ children }) {
  const user = await getServerUser(); // server-side auth check
  if (!user || user.role !== "admin") redirect("/");
  return <>{children}</>;
}
```

---

### H3. Webhook Endpoint Uses Anon Key as Fallback for Service Role Key

**File:** `src/app/api/webhooks/stripe/route.ts` line 12
**What:** `process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!`

The Stripe webhook handler needs to bypass RLS to update user profiles (role upgrades). It falls back to the anon key if the service role key is not set. With the anon key, the `UPDATE profiles SET role = 'premium'` call is subject to RLS policies.

**Why it matters:** The RLS policy on profiles says "Users can update own profile" with `USING (auth.uid() = id)`. Since the webhook creates an unauthenticated client (no user JWT), this update will likely fail silently — meaning paid users may never get upgraded to premium.

**How to fix:**
1. Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel production environment variables.
2. Remove the fallback — if the service role key is missing, fail loudly:
```typescript
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for webhooks");
}
```

---

### H4. No Security Headers Configured

**Files:** `next.config.ts`, `middleware.ts`
**What:** The Next.js config has no `headers()` configuration. There is no Content Security Policy (CSP), no X-Frame-Options, no X-Content-Type-Options, no Referrer-Policy, no Permissions-Policy.

**Why it matters:**
- No CSP means the site is vulnerable to XSS payloads loading external scripts
- No X-Frame-Options means the site can be embedded in iframes for clickjacking attacks
- No X-Content-Type-Options means browsers may MIME-sniff responses
- Third-party scripts (GTM, Clarity, ContentSquare) increase the attack surface

**How to fix:** Add security headers to `next.config.ts`:
```typescript
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://t.contentsquare.net; ..." },
    ],
  }];
}
```

---

### H5. Newsletter Emails Sent Without Unsubscribe Link (CAN-SPAM Violation)

**File:** `src/lib/email.ts`
**What:** Both the welcome email and the "Tone of the Week" newsletter HTML templates contain no unsubscribe link or mechanism. Users who provide their email for a PDF download are automatically subscribed to the newsletter with no explicit opt-in.

**Why it matters:** This violates CAN-SPAM Act requirements (US law) and GDPR requirements (for EU users). Fines can be up to $50,000+ per violation (CAN-SPAM) or 4% of annual revenue (GDPR).

**How to fix:**
1. Add an unsubscribe link to every email template.
2. Add an explicit opt-in checkbox on the PDF download form (unchecked by default).
3. Build an `/api/unsubscribe` endpoint or use Resend's built-in unsubscribe handling.

---

## MEDIUM — Fix This Month

### M1. Download Count Bypass Via Concurrent Requests

**File:** `src/lib/downloads.ts`, `src/app/api/recipes/[slug]/download/route.ts`
**What:** The download check is a read-then-write pattern: count downloads, check limit, then log new download. There is no transaction or atomic operation.

**Why it matters:** A free user at 9/10 downloads could fire 10 simultaneous requests. All would read `count = 9`, all would pass the `remaining > 0` check, and all would succeed — bypassing the 10-download limit.

**How to fix:** Use a Supabase RPC function with a `SELECT ... FOR UPDATE` lock, or use an atomic increment pattern.

---

### M2. XSS Risk in Email Templates via Recipe Name

**File:** `src/lib/email.ts`
**What:** The `recipeName`, `recipeDescription`, `blogPostTitle`, and `quickTip` variables are interpolated directly into HTML email templates using template literals (`${recipeName}`). There is no HTML escaping.

**Why it matters:** If a recipe name or description contains HTML (e.g., `<script>alert(1)</script>` or `<img onerror=...>`), it would be rendered in the email. While most email clients strip scripts, some older clients or webmail interfaces may execute injected HTML/CSS.

**How to fix:** Escape all user-controlled strings before inserting into HTML:
```typescript
function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

---

### M3. Open Redirect in Auth Callback via sessionStorage

**File:** `src/app/auth/callback/page.tsx` line 14
**What:** The `returnTo` value is read from `sessionStorage` and passed directly to `router.replace()`. While sessionStorage is same-origin and cannot be set by external sites, if any XSS vulnerability exists on the domain, an attacker could set `returnTo` to a malicious URL.

**Why it matters:** Combined with any other XSS vector, this could redirect users to a phishing site after authentication.

**How to fix:** Validate that `returnTo` starts with `/` and does not contain `://`:
```typescript
const returnTo = sessionStorage.getItem("returnTo") || "/";
const safeReturnTo = returnTo.startsWith("/") && !returnTo.includes("://") ? returnTo : "/";
```

---

### M4. Moderation Page Uses Anon Key Client Without User JWT

**File:** `src/app/admin/moderation/page.tsx` lines 38-46
**What:** The moderation page creates a Supabase client with the anon key (no user JWT). When it performs moderation actions (approving/rejecting recipes, resolving reports), these operations bypass any RLS user-identity checks.

**Why it matters:** The RLS policies for `user_recipes` updates check `auth.uid()` for owner-only updates. Since the moderation client has no user context, these operations may fail silently, or if policies are too permissive, could be exploited.

**How to fix:** Pass the authenticated user's JWT to the Supabase client:
```typescript
const supabase = createClient(url, anonKey, {
  global: { headers: { Authorization: `Bearer ${session.access_token}` } },
});
```

---

### M5. Geo-Blocking Excludable Via API Routes

**File:** `src/middleware.ts` line 44
**What:** The middleware matcher excludes API routes: `/((?!_next/static|_next/image|favicon\\.svg|api/).*)`. This means all `/api/*` endpoints are accessible from blocked countries (Iran, North Korea, Syria, Cuba, China, Russia, Belarus).

**Why it matters:** If geo-blocking is required for OFAC compliance, API endpoints must also be blocked. A user in a sanctioned country could use the API directly to create checkout sessions, download content, etc.

**How to fix:** Either remove `api/` from the matcher exclusion, or add geo-blocking logic directly to the API routes that handle payments.

---

### M6. Reply Count Race Condition in Forum

**File:** `src/lib/db/forum.ts` lines 334-347
**What:** The `createReply` function reads `reply_count`, increments it in JavaScript, then writes back. This is a classic read-modify-write race condition.

**Why it matters:** Under concurrent replies, the count can become incorrect. While not a security vulnerability per se, it could be exploited to manipulate apparent engagement metrics.

**How to fix:** Use a Supabase RPC function with `UPDATE ... SET reply_count = reply_count + 1`.

---

## LOW — Nice to Have

### L1. Google Verification Token Hardcoded in Layout

**File:** `src/app/layout.tsx` line 74
**What:** `google: "JNyJnVry-lD7u00R3LYzg5jxYdJvY6Yb-vdit1nVHh0"` and `"fo-verify": "638b1d63-d8e9-4a92-a966-6831f4da02a2"` are hardcoded.

**Why it matters:** These are public verification tokens (visible in HTML source anyway), not secrets. However, moving them to environment variables is cleaner practice.

**How to fix:** Move to environment variables if desired, but this is cosmetic.

---

### L2. Password Minimum Length Is Only 6 Characters

**File:** `src/app/(auth)/signup/page.tsx` line 32
**What:** Password validation requires only 6 characters minimum, with no complexity requirements.

**Why it matters:** Short passwords are easier to brute-force. Industry standard is 8+ characters.

**How to fix:** Increase minimum to 8 characters and consider requiring mixed case or special characters. Also configure this in Supabase Auth settings.

---

### L3. Demo Mode User Stored in localStorage

**File:** `src/lib/auth/auth-context.tsx` lines 62-69
**What:** In demo mode (when Supabase is not configured), a fake user object is stored in localStorage and trusted on page load.

**Why it matters:** A user could manually edit localStorage to change their role to "admin" or "creator" in demo mode. However, since demo mode has no real backend, this has no real security impact.

**How to fix:** This is acceptable for demo mode. Ensure demo mode is never active in production (it is gated on `isSupabaseConfigured()` returning false).

---

### L4. Three Third-Party Analytics Scripts Loaded

**File:** `src/app/layout.tsx` lines 108-121
**What:** Three external analytics services are loaded:
- Google Tag Manager (`G-PZLWYT7VMP`)
- Microsoft Clarity (`w3jxns38n6`)
- ContentSquare (`5eb1c56789d9a`)

**Why it matters:** Each external script is a potential supply chain attack vector. If any of these CDNs are compromised, malicious code would run on your site. The `strategy="lazyOnload"` mitigates initial load impact but not security risk.

**How to fix:** Consider whether all three are needed. ContentSquare and Clarity have significant overlap. Add Subresource Integrity (SRI) hashes where possible, and implement a strict CSP (see H4).

---

## PASSED — No Issues Found

### P1. Environment Files Not in Git History
`.env*` files have never been committed to git. The `.gitignore` correctly excludes `.env*` and `.env*.local`.

### P2. No eval() or Function() Usage
No instances of `eval()` or `new Function()` found anywhere in the source code.

### P3. Supabase Anon Key Properly Used as NEXT_PUBLIC_
The Supabase URL and anon key are correctly prefixed with `NEXT_PUBLIC_` since they are designed to be public (used in browser). Stripe secret key and other server-side secrets are NOT prefixed with `NEXT_PUBLIC_`.

### P4. RLS Enabled on All Tables
All Supabase tables have Row Level Security enabled with appropriate policies. Profiles are publicly readable but only self-updatable. Saved recipes are private per user. Comments/votes require authentication for writes.

### P5. SQL Injection Protection
All database queries use the Supabase client library with parameterized queries (`.eq()`, `.insert()`, `.update()`). No raw SQL strings or string concatenation in queries.

### P6. API Routes Properly Authenticate Where Needed
- `/api/checkout` — requires Bearer token, validates user via Supabase
- `/api/invite/redeem` — requires Bearer token
- `/api/recipes/[slug]/download` (preset) — requires Bearer token and role check
- `/api/newsletter` — public endpoint (intentionally, for email signup)
- `/api/recipes/[slug]/download` (PDF) — public with email gate (intentional)

### P7. dangerouslySetInnerHTML Used Safely
All 17 instances of `dangerouslySetInnerHTML` are used for JSON-LD structured data (`JSON.stringify()` of static objects). No user input flows into these. This is safe.

### P8. No File Upload Endpoints
There are no file upload endpoints in the application. Preset downloads are server-generated from static data. No path traversal risk.

### P9. OAuth Redirect URL Uses Same-Origin
The Google OAuth `redirectTo` is set to `${window.location.origin}/auth/callback`, which is same-origin. This prevents redirect-to-attacker-site attacks.

### P10. Stripe Checkout Uses Server-Side Price Validation
The checkout route uses `ensureProducts()` to fetch price IDs from Stripe's API, not from client input. The client only sends the plan name ("premium" or "creator"), which is validated server-side. Users cannot manipulate prices.

---

## Recommended Priority Order

1. **Today:** Rotate the Replicate API token and verify/fix the Stripe key in `.env.local` (C1, C2)
2. **Today:** Make Stripe webhook signature verification mandatory (C3)
3. **This week:** Set `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel (H3)
4. **This week:** Add security headers to `next.config.ts` (H4)
5. **This week:** Add rate limiting to API routes (H1)
6. **This week:** Add server-side admin auth guard (H2)
7. **This week:** Add unsubscribe links to emails (H5)
8. **This month:** Fix download count race condition (M1)
9. **This month:** Escape HTML in email templates (M2)
10. **This month:** Fix geo-blocking for API routes (M5)
