import { Resend } from "resend";
import { unsubscribeUrl } from "@/lib/unsubscribe-token";

// Lazy init: only create the Resend client when the API key exists.
// Callers should check before calling email functions, but we also
// guard inside each function.
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : (null as unknown as Resend); // cast so TS doesn't complain at call sites

const FROM_EMAIL = "Fader & Knob <noreply@faderandknob.com>";
const REPLY_TO = "hello@faderandknob.com";

/**
 * RFC 8058 one-click unsubscribe headers. Gmail and Apple Mail show a
 * native "Unsubscribe" UI when these are present and call POST on the URL.
 * Adding these (a) keeps deliverability healthy as the list grows and
 * (b) satisfies CAN-SPAM/CASL requirements for bulk commercial mail.
 */
function unsubscribeHeaders(to: string): {
  "List-Unsubscribe": string;
  "List-Unsubscribe-Post": string;
} {
  const url = unsubscribeUrl(to);
  return {
    "List-Unsubscribe": `<${url}>, <mailto:hello@faderandknob.com?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** HTML-escape a string to prevent injection in email templates. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// Shared email shell
//
// One light layout for every email, in the site's design language: white
// paper, ink text, hairlines, a wash tile for grouped content and an ink
// pill for the main action. Email clients do not load Karla, so the stack
// falls back to Helvetica and Arial. Everything is inline styles, because
// most clients strip <style> blocks.
// ============================================================================

const EMAIL = {
  paper: "#ffffff",
  wash: "#f6f6f4",
  line: "#dcdfe2",
  ink: "#131416",
  ink2: "#4a4f55",
  ink3: "#666c73",
  danger: "#b4473a",
  sans: "Karla, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'Geist Mono', ui-monospace, Menlo, Consolas, monospace",
} as const;

/** Body paragraph. `extra` adds or overrides inline styles. */
function ep(html: string, extra = ""): string {
  return `<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: ${EMAIL.ink2};${extra}">${html}</p>`;
}

/** Section heading inside the body. */
function eh2(text: string, extra = ""): string {
  return `<h2 style="margin: 0 0 12px; font-size: 22px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: ${EMAIL.ink};${extra}">${text}</h2>`;
}

/** Small heading inside a tile or a section. */
function eh3(text: string, extra = ""): string {
  return `<h3 style="margin: 0 0 8px; font-size: 16px; line-height: 1.4; font-weight: 600; color: ${EMAIL.ink};${extra}">${text}</h3>`;
}

/** Bold inline run, in ink. */
function estrong(html: string): string {
  return `<strong style="font-weight: 600; color: ${EMAIL.ink};">${html}</strong>`;
}

/** Inline text link, ink and underlined. */
function ea(href: string, label: string, extra = ""): string {
  return `<a href="${href}" style="color: ${EMAIL.ink}; text-decoration: underline;${extra}">${label}</a>`;
}

/** Primary action: the ink pill button. */
function ebtn(href: string, label: string, extra = ""): string {
  return `<a href="${href}" style="display: inline-block; background: ${EMAIL.ink}; color: ${EMAIL.paper}; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 15px; line-height: 20px; font-weight: 500;${extra}">${label}</a>`;
}

/** Wash tile for grouped content. */
function etile(html: string): string {
  return `<div style="background: ${EMAIL.wash}; border-radius: 12px; padding: 20px; margin: 24px 0;">${html}</div>`;
}

/** Bullet or numbered list. */
function elist(items: string[], ordered = false): string {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} style="margin: 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: ${EMAIL.ink2};">${items
    .map((i) => `<li>${i}</li>`)
    .join("")}</${tag}>`;
}

/** Small print under the hairline at the foot of the email. */
function efine(html: string): string {
  return `<p style="margin: 0 0 6px;">${html}</p>`;
}

/** Footer link, in the footer's grey. */
function efa(href: string, label: string): string {
  return `<a href="${href}" style="color: ${EMAIL.ink3}; text-decoration: underline;">${label}</a>`;
}

/** Inline unsubscribe footer fragment for any newsletter template. */
function unsubscribeFooter(to: string): string {
  return efine(`${efa(unsubscribeUrl(to), "Unsubscribe")} from these emails.`);
}

/**
 * The shell: white page, wordmark or title on top with a hairline under
 * it, the body, then a hairline and the footer in small grey type.
 */
function emailShell(opts: {
  title?: string;
  subtitle?: string;
  body: string;
  footer?: string;
  width?: number;
}): string {
  const { title = "Fader &amp; Knob", subtitle, body, footer, width = 600 } = opts;
  return `<div style="background: ${EMAIL.paper}; margin: 0; padding: 0;">
  <div style="font-family: ${EMAIL.sans}; max-width: ${width}px; margin: 0 auto; background: ${EMAIL.paper}; color: ${EMAIL.ink}; padding: 32px 24px;">
    <div style="border-bottom: 1px solid ${EMAIL.line}; padding-bottom: 16px; margin-bottom: 28px;">
      <h1 style="margin: 0; font-size: 20px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: ${EMAIL.ink};">${title}</h1>
      ${subtitle ? `<p style="margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: ${EMAIL.ink3};">${subtitle}</p>` : ""}
    </div>
    ${body}
    ${
      footer
        ? `<div style="border-top: 1px solid ${EMAIL.line}; margin-top: 32px; padding-top: 16px; font-size: 12px; line-height: 1.6; color: ${EMAIL.ink3};">${footer}</div>`
        : ""
    }
  </div>
</div>`;
}

const TAGLINE = "Tone recipes from the songs you love";

/**
 * Send a welcome email when someone downloads their first PDF.
 */
export async function sendWelcomeEmail(to: string, recipeName: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `Your tone recipe is ready: ${esc(recipeName)}`,
      html: emailShell({
        body: `
          ${eh2("Your recipe PDF is downloading")}
          ${ep(`Thanks for downloading ${estrong(esc(recipeName))}.
            Your PDF has the full signal chain, settings, and platform translations.
            Print it out and tape it to your amp.`)}
          ${etile(`
            ${eh3("What's next?")}
            ${elist([
              ea("https://faderandknob.com/browse", "Browse all 50+ tone recipes"),
              ea("https://faderandknob.com/blog", "Read our tone guides and settings breakdowns"),
              `${ea("https://faderandknob.com/signup", "Create a free account")} for 10 free preset downloads`,
            ])}
          `)}
          ${ep(
            `You're receiving this because you downloaded a recipe from
            ${ea("https://faderandknob.com", "faderandknob.com")}.`,
            " font-size: 14px;",
          )}`,
        footer: `
          ${efine("Fader &amp; Knob. Tone recipes from the songs you love.")}
          ${efine(efa("https://faderandknob.com", "faderandknob.com"))}`,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a newly-subscribed newsletter user.
 * Triggered from /api/newsletter after a successful insert.
 * Non-blocking: if Resend fails, we still return success to the user
 * because their subscription is already stored.
 */
export async function sendNewsletterWelcome(to: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      headers: unsubscribeHeaders(to),
      subject: "Welcome to Fader & Knob",
      html: emailShell({
        subtitle: TAGLINE,
        body: `
          ${eh2("Welcome aboard.")}
          ${ep(`You just joined a list of guitarists who'd rather play than tweak.
            Every week we ship new tone recipes, signal chain breakdowns,
            and downloadable presets for Line 6 Helix and Boss Katana.`, " margin-bottom: 20px;")}
          ${etile(`
            ${eh3("Start here")}
            ${elist([
              `${ea("https://faderandknob.com/browse", "Browse 50+ tone recipes")}: filter by artist, song, or platform`,
              `${ea("https://faderandknob.com/set-packs/worship", "Worship Set Pack")}: one preset, 8 snapshots, 30 songs mapped`,
              `${ea("https://faderandknob.com/how-it-works", "How it works")}: from song to your rig in three steps`,
            ])}
          `)}
          ${ep(`Got a song you want a recipe for? Just reply to this email.
            We read every message and your request might become next week's
            recipe.`)}
          ${ep(`Daniel<br>
            <span style="color: ${EMAIL.ink3}; font-size: 13px;">Fader &amp; Knob</span>`, " margin-bottom: 0;")}`,
        footer: `
          ${efine(`You're receiving this because you subscribed at
            ${efa("https://faderandknob.com", "faderandknob.com")}.`)}
          ${efine(`Fader &amp; Knob is an open AI experiment. Content is
            AI-researched and AI-written, with the record public at
            ${efa("https://faderandknob.com/experiment", "faderandknob.com/experiment")}.`)}
          ${unsubscribeFooter(to)}`,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter welcome:", error);
    return { success: false, error };
  }
}

/** Where internal owner alerts go. Override with OWNER_EMAIL in env. */
const OWNER_EMAIL = process.env.OWNER_EMAIL || "hello@faderandknob.com";

/**
 * Purchase welcome email, sent from the Stripe webhook when a customer buys
 * a Set Pack or starts a Pass/Pro subscription. Transactional (no unsubscribe
 * footer by design). Non-blocking: guarded so a Resend failure never breaks
 * the webhook.
 */
export async function sendPurchaseWelcome(opts: {
  to: string;
  kind: "set_pack" | "subscription";
  label: string; // e.g. "Worship set pack" or "Pro"
  amountCents?: number;
}) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "no_key" };
  const { to, kind, label } = opts;
  const price =
    opts.amountCents != null ? `$${(opts.amountCents / 100).toFixed(2)}` : null;
  const subject =
    kind === "subscription"
      ? `You're in. Welcome to Fader & Knob ${esc(label)}`
      : `Your ${esc(label)} is ready`;
  const ctaHref =
    kind === "subscription"
      ? "https://faderandknob.com/dashboard"
      : "https://faderandknob.com/browse";
  const ctaLabel =
    kind === "subscription" ? "Go to your dashboard" : "Open your Set Pack";
  const blurb =
    kind === "subscription"
      ? `You've got full access now: every recipe, every platform translation, every preset download. Load them into your rig and go play.`
      : `Thanks for grabbing the ${estrong(esc(label))}. It's unlocked on your account. Download the preset, load the snapshots, and you're ready for Sunday.`;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject,
      html: emailShell({
        subtitle: TAGLINE,
        body: `
          ${eh2("Thanks, you're all set.")}
          ${ep(blurb, " margin-bottom: 20px;")}
          <div style="margin: 28px 0;">${ebtn(ctaHref, ctaLabel)}</div>
          ${
            price
              ? ep(
                  `Amount: <span style="font-family: ${EMAIL.mono}; color: ${EMAIL.ink};">${price}</span>. A receipt from Stripe is on its way separately.`,
                  ` font-size: 13px; color: ${EMAIL.ink3}; margin-bottom: 20px;`,
                )
              : ""
          }
          ${ep(`Questions, or a song you want a recipe for? Just reply. I read every message.<br /><br />
            Daniel<br />
            <span style="color: ${EMAIL.ink3}; font-size: 13px;">Fader &amp; Knob</span>`, " margin-bottom: 0;")}`,
        footer: efine(`You're receiving this because you made a purchase at
          ${efa("https://faderandknob.com", "faderandknob.com")}.`),
      }),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send purchase welcome:", error);
    return { success: false, error };
  }
}

/**
 * Internal owner alert: pings the store owner (OWNER_EMAIL) when something
 * needs a human: a sale, a churn, a failed payment, a dispute, or the
 * dreaded "customer paid but the DB write failed" case. Non-blocking.
 */
export async function sendOwnerAlert(opts: {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  urgent?: boolean;
}) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "no_key" };
  const headingColor = opts.urgent ? EMAIL.danger : EMAIL.ink;
  const rowsHtml = opts.rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding: 8px 16px 8px 0; color: ${EMAIL.ink3}; white-space: nowrap; vertical-align: top; border-bottom: 1px solid ${EMAIL.line};">${esc(k)}</td><td style="padding: 8px 0; color: ${EMAIL.ink}; border-bottom: 1px solid ${EMAIL.line};">${esc(v)}</td></tr>`,
    )
    .join("");
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: REPLY_TO,
      subject: `${opts.urgent ? "🔴 " : ""}[F&K] ${opts.subject}`,
      html: emailShell({
        width: 560,
        body: `
          ${eh2(esc(opts.heading), ` font-size: 18px; color: ${headingColor}; margin-bottom: 16px;`)}
          <table style="border-collapse: collapse; font-size: 14px; line-height: 1.5;">${rowsHtml}</table>
          <p style="margin: 24px 0 0;">${ebtn("https://dashboard.stripe.com", "Open Stripe Dashboard &rarr;")}</p>`,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send owner alert:", error);
    return { success: false, error };
  }
}

/** Newsletter footer shared by the weekly sends. */
function newsletterFooter(email: string): string {
  return `
    ${efine("You're receiving this because you subscribed to Fader &amp; Knob updates.")}
    ${efine(efa("https://faderandknob.com", "faderandknob.com"))}
    ${unsubscribeFooter(email)}`;
}

/**
 * Send the weekly "Tone of the Week" newsletter.
 */
export async function sendToneOfTheWeek(opts: {
  to: string[];
  recipeName: string;
  recipeSlug: string;
  recipeDescription: string;
  blogPostTitle: string;
  blogPostSlug: string;
  quickTip: string;
}) {
  const { to, recipeName, recipeSlug, recipeDescription, blogPostTitle, blogPostSlug, quickTip } = opts;

  try {
    // Resend supports batch sending up to 100 at a time
    const batches = [];
    for (let i = 0; i < to.length; i += 100) {
      batches.push(to.slice(i, i + 100));
    }

    for (const batch of batches) {
      await resend.batch.send(
        batch.map((email) => ({
          from: FROM_EMAIL,
          to: email,
          replyTo: REPLY_TO,
          headers: unsubscribeHeaders(email),
          subject: `Tone of the Week: ${esc(recipeName)}`,
          html: emailShell({
            title: "Tone of the week",
            subtitle: "by Fader &amp; Knob",
            body: `
              ${eh2(esc(recipeName), " margin-bottom: 8px;")}
              ${ep(esc(recipeDescription))}
              <div style="margin: 16px 0 28px;">${ebtn(`https://faderandknob.com/recipe/${recipeSlug}`, "Get this tone &rarr;")}</div>
              <div style="border-top: 1px solid ${EMAIL.line}; padding-top: 24px;">
                ${eh3("From the blog")}
                ${ea(`https://faderandknob.com/blog/${blogPostSlug}`, `${esc(blogPostTitle)} &rarr;`, " font-size: 16px;")}
              </div>
              ${etile(`
                ${eh3("Quick tip")}
                ${ep(esc(quickTip), " margin-bottom: 0;")}
              `)}`,
            footer: newsletterFooter(email),
          }),
        })),
      );
    }

    return { success: true, sent: to.length };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return { success: false, error };
  }
}

export interface SetlistSong {
  title: string;
  artist: string;
  /** 2-3 sentence tone note: amp/snapshot guidance for this song. */
  tone: string;
  /** Site links for this song (recipe page, guide, blog post). */
  links: { label: string; url: string }[];
}

/**
 * "Sunday Setlist": Tuesday email mapping this week's most-played worship
 * songs to F&K tones. Same Resend batch pattern as sendToneOfTheWeek.
 */
export async function sendSundaySetlist(opts: {
  to: string[];
  subject: string;
  intro: string;
  sundayDate: string; // e.g. "June 14"
  songs: SetlistSong[];
  outro?: string;
}) {
  const { to, subject, intro, sundayDate, songs, outro } = opts;

  const songBlocks = songs
    .map(
      (s) => `
        <div style="border-top: 1px solid ${EMAIL.line}; padding: 20px 0;">
          ${eh3(esc(s.title), " font-size: 17px; margin-bottom: 2px;")}
          <p style="margin: 0 0 10px; font-size: 13px; line-height: 1.5; color: ${EMAIL.ink3};">${esc(s.artist)}</p>
          ${ep(esc(s.tone), " margin-bottom: 10px;")}
          ${s.links
            .map((l) =>
              ea(`https://faderandknob.com${l.url}`, `${esc(l.label)} &rarr;`, " font-size: 14px; margin-right: 16px;"),
            )
            .join("")}
        </div>`,
    )
    .join("");

  try {
    const batches = [];
    for (let i = 0; i < to.length; i += 100) {
      batches.push(to.slice(i, i + 100));
    }

    for (const batch of batches) {
      await resend.batch.send(
        batch.map((email) => ({
          from: FROM_EMAIL,
          to: email,
          replyTo: REPLY_TO,
          headers: unsubscribeHeaders(email),
          subject,
          html: emailShell({
            title: "Sunday setlist",
            subtitle: `Tones for ${esc(sundayDate)} &middot; by Fader &amp; Knob`,
            body: `
              ${ep(esc(intro))}
              ${songBlocks}
              ${outro ? etile(ep(esc(outro), " margin: 0;")) : ""}`,
            footer: newsletterFooter(email),
          }),
        })),
      );
    }

    return { success: true, sent: to.length };
  } catch (error) {
    console.error("Failed to send Sunday Setlist:", error);
    return { success: false, error };
  }
}

// ============================================================================
// Welcome sequence (docs/WELCOME_SEQUENCE.md)
// Steps live in email_sequence_queue (migration 025) and are drained by
// /api/cron/email-sequence. Copy source of truth: docs/WELCOME_SEQUENCE.md.
// Edit there first, then mirror here.
// ============================================================================

/** Wraps one sequence step in the shared shell with the sequence footer. */
function seqEmail(to: string, body: string): string {
  return emailShell({
    subtitle: TAGLINE,
    body,
    footer: `
      ${efine("Written by Fader &amp; Knob's AI staff. Reply and a human reads it.")}
      ${efine(`Fader &amp; Knob is an open AI experiment. The record is public at
        ${efa("https://faderandknob.com/experiment", "faderandknob.com/experiment")}.`)}
      ${unsubscribeFooter(to)}`,
  });
}

const seqLink = (href: string, label: string) => ea(`https://faderandknob.com${href}`, label);

export type SequenceName = "account" | "newsletter";

interface SequenceStep {
  subject: string;
  html: (to: string) => string;
}

/** All sequence steps, keyed "<sequence>:<step>". */
const SEQUENCE_STEPS: Record<string, SequenceStep> = {
  // A1: sent shortly after account creation.
  "account:1": {
    subject: "Your 5 downloads, and where to spend them",
    html: (to) =>
      seqEmail(
        to,
        `
      ${eh2("You're in.")}
      ${ep(`The free plan is ${estrong("5 preset downloads")} and
        ${estrong("10 recipe PDFs")} a month, every month,
        plus unlimited browsing and saved recipes.`)}
      ${ep("Five downloads is enough to matter if you spend them well. Start with your rig:")}
      ${etile(
        elist([
          `${estrong("Helix / HX Stomp:")} ${seqLink("/browse?platform=helix", "every recipe with a .hlx download")}`,
          `${estrong("Boss Katana:")} ${seqLink("/blog/boss-katana-hidden-settings", "the 7 settings most players never find")}, then ${seqLink("/browse?platform=katana", "the .tsl recipes")}`,
          `${estrong("Quad Cortex / TONEX / Fractal / Kemper:")} ${seqLink("/browse", "every recipe has your platform's tab")}`,
          `${estrong("Pedals and an amp, no modeler:")} every recipe includes the pedalboard translation`,
        ]),
      )}
      ${ep(`One tip before you load anything: ${estrong("level-match first.")}
        A patch that is 2 dB louder always sounds &quot;better.&quot; Set output levels equal
        before you judge a preset, or you will keep the wrong one.`)}
      <div style="margin: 8px 0 0;">${ebtn("https://faderandknob.com/browse", "Browse the library &rarr;")}</div>`,
      ),
  },

  // A2: day 3.
  "account:2": {
    subject: "How to read a recipe (and adjust it for your room)",
    html: (to) =>
      seqEmail(
        to,
        `
      ${ep(`Every Fader &amp; Knob recipe gives exact positions: not &quot;add some drive,&quot;
        but Gain 4.5, Master 7, Presence 6. Exact starting points beat vague advice,
        but no room, cab, or pickup set is identical. Here is the adjustment order
        that works on any platform:`)}
      ${etile(
        elist(
          [
            `${estrong("Play it as written.")} No touching anything for two minutes.`,
            `${estrong("Fix the feel first (gain).")} Too fizzy, back the gain down 1. Too stiff, up 0.5. Gain changes feel more than tone.`,
            `${estrong("Fix the room second (highs).")} Harsh in your room: presence/treble down 1. Dull: up 1. One knob, one step.`,
            `${estrong("Stop.")} Two knobs is almost always enough. Still wrong? The problem is usually level or the cab/IR, not the amp block.`,
          ],
          true,
        ),
      )}
      ${ep(`Going deeper: ${seqLink("/blog/guitar-eq-guide", "the frequencies that actually matter")} and
        ${seqLink("/blog/signal-chain-order-guide", "the complete signal chain order guide")}.`)}
      ${ep(`Chasing a tone we don't have yet? Reply to this email and it goes into the
        production queue; you'll get the page when it's live.`, " margin-bottom: 0;")}`,
      ),
  },

  // A3: day 7. Skipped at send time if the user already upgraded.
  "account:3": {
    subject: "The math on the download cap",
    html: (to) =>
      seqEmail(
        to,
        `
      ${ep("Quick math, then we'll leave you alone.")}
      ${ep(`Free gives you 5 preset downloads a month. If that's your pace, keep it forever;
        the cap resets monthly and nothing expires.`)}
      ${ep(`If you're downloading faster than that, the ${estrong("Pass is $49 a year")}:
        unlimited presets, unlimited PDFs, and new recipes a week before everyone else.
        That's $4.08 a month, or about the cost of one set of strings for a year of
        every tone on the site.`)}
      ${ep(`If you buy Set Packs, skip Pass and take ${estrong("Pro at $79")}:
        every Set Pack is included while you're subscribed, so one $19 pack a year plus
        unlimited downloads already makes it the better deal.`)}
      <div style="margin: 8px 0 0;">
        ${ebtn("https://faderandknob.com/pricing", "Start Pass ($49/yr)", " margin: 0 12px 8px 0;")}
        ${ea("https://faderandknob.com/pricing", "See what Pro includes &rarr;", " display: inline-block; padding: 12px 0; font-weight: 500;")}
      </div>
      ${ep(`Either way, you'll keep getting tone recipes and news like everyone else.
        That part is free forever too.`, " margin: 24px 0 0;")}`,
      ),
  },

  // B2: day 5 for newsletter-only subscribers. Skipped if they now have an account.
  "newsletter:2": {
    subject: "Saved recipes beat bookmarks",
    html: (to) =>
      seqEmail(
        to,
        `
      ${ep(`A free account adds three things the newsletter can't do:
        unlimited saved recipes, ${estrong("5 preset downloads a month")}
        in your platform's native format (.hlx, .tsl), and 10 printable recipe PDFs.
        No card, no trial clock.`)}
      <div style="margin: 8px 0 0;">${ebtn("https://faderandknob.com/signup", "Create the free account &rarr;")}</div>`,
      ),
  },
};

export function getSequenceStep(sequence: SequenceName, step: number): SequenceStep | null {
  return SEQUENCE_STEPS[`${sequence}:${step}`] ?? null;
}

/** Send one welcome-sequence email. Used by /api/cron/email-sequence. */
export async function sendSequenceEmail(opts: {
  to: string;
  sequence: SequenceName;
  step: number;
}): Promise<{ success: boolean; error?: unknown }> {
  const def = getSequenceStep(opts.sequence, opts.step);
  if (!def) return { success: false, error: `unknown step ${opts.sequence}:${opts.step}` };
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      replyTo: REPLY_TO,
      headers: unsubscribeHeaders(opts.to),
      subject: def.subject,
      html: def.html(opts.to),
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to send sequence email ${opts.sequence}:${opts.step}:`, error);
    return { success: false, error };
  }
}

