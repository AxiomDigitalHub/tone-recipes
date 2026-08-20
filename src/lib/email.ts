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

/** Inline unsubscribe footer fragment for any newsletter HTML template. */
function unsubscribeFooter(to: string, palette: "dark" | "navy" = "dark"): string {
  const url = unsubscribeUrl(to);
  const dim = palette === "navy" ? "#6e7a8a" : "#666";
  return `<p style="margin: 6px 0 0;">
    <a href="${url}" style="color: ${dim};">Unsubscribe</a> from these emails.
  </p>`;
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
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Fader & Knob</h1>
          </div>

          <h2 style="color: #ffffff; font-size: 20px;">Your recipe PDF is downloading</h2>

          <p style="line-height: 1.6; color: #a3a3a3;">
            Thanks for downloading <strong style="color: #ffffff;">${esc(recipeName)}</strong>.
            Your PDF has the full signal chain, settings, and platform translations —
            print it out and tape it to your amp.
          </p>

          <div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #f59e0b; margin-top: 0;">What's next?</h3>
            <ul style="color: #a3a3a3; line-height: 1.8; padding-left: 20px;">
              <li><a href="https://faderandknob.com/browse" style="color: #f59e0b;">Browse all 50+ tone recipes</a></li>
              <li><a href="https://faderandknob.com/blog" style="color: #f59e0b;">Read our tone guides and settings breakdowns</a></li>
              <li><a href="https://faderandknob.com/signup" style="color: #f59e0b;">Create a free account</a> for 10 free preset downloads</li>
            </ul>
          </div>

          <p style="color: #a3a3a3; font-size: 14px;">
            You're receiving this because you downloaded a recipe from
            <a href="https://faderandknob.com" style="color: #f59e0b;">faderandknob.com</a>.
          </p>

          <div style="border-top: 1px solid #333; margin-top: 24px; padding-top: 16px; color: #666; font-size: 12px;">
            <p>Fader & Knob — Tone recipes from the songs you love.</p>
            <p><a href="https://faderandknob.com" style="color: #666;">faderandknob.com</a></p>
          </div>
        </div>
      `,
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
 * Non-blocking — if Resend fails, we still return success to the user
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
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #0b0f1a; padding: 32px;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Fader &amp; Knob</h1>
            <p style="color: #6e7a8a; font-size: 13px; margin: 4px 0 0;">Tone recipes from the songs you love</p>
          </div>

          <h2 style="color: #f0eadf; font-size: 22px; margin: 0 0 12px;">Welcome aboard.</h2>

          <p style="line-height: 1.6; color: #a3b2c4; margin: 0 0 20px;">
            You just joined a list of guitarists who'd rather play than tweak.
            Every week we ship new tone recipes, signal chain breakdowns,
            and downloadable presets for Line 6 Helix and Boss Katana.
          </p>

          <div style="background: #161d2f; border-left: 3px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #f59e0b; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Start here</h3>
            <ul style="color: #c8d8e8; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li><a href="https://faderandknob.com/browse" style="color: #f59e0b; text-decoration: none;">Browse 50+ tone recipes</a> — filter by artist, song, or platform</li>
              <li><a href="https://faderandknob.com/set-packs/worship" style="color: #f59e0b; text-decoration: none;">Worship Set Pack</a> — one preset, 8 snapshots, 30 songs mapped</li>
              <li><a href="https://faderandknob.com/how-it-works" style="color: #f59e0b; text-decoration: none;">How it works</a> — from song to your rig in three steps</li>
            </ul>
          </div>

          <p style="line-height: 1.6; color: #a3b2c4; margin: 0 0 12px;">
            Got a song you want a recipe for? Just reply to this email —
            we read every message and your request might become next week's
            recipe.
          </p>

          <p style="line-height: 1.6; color: #a3b2c4; margin: 0 0 20px;">
            — Daniel<br>
            <span style="color: #6e7a8a; font-size: 13px;">Fader &amp; Knob</span>
          </p>

          <div style="border-top: 1px solid #1e2840; margin-top: 32px; padding-top: 16px; color: #6e7a8a; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 6px;">
              You're receiving this because you subscribed at
              <a href="https://faderandknob.com" style="color: #6e7a8a;">faderandknob.com</a>.
            </p>
            <p style="margin: 0 0 6px;">
              Fader &amp; Knob is an open AI experiment — content is
              AI-researched and AI-written, with the record public at
              <a href="https://faderandknob.com/experiment" style="color: #6e7a8a;">faderandknob.com/experiment</a>.
            </p>
            ${unsubscribeFooter(to, "navy")}
          </div>
        </div>
      `,
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
 * Purchase welcome email — sent from the Stripe webhook when a customer buys
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
      ? `You're in — welcome to Fader & Knob ${esc(label)}`
      : `Your ${esc(label)} is ready`;
  const ctaHref =
    kind === "subscription"
      ? "https://faderandknob.com/dashboard"
      : "https://faderandknob.com/browse";
  const ctaLabel =
    kind === "subscription" ? "Go to your dashboard" : "Open your Set Pack";
  const blurb =
    kind === "subscription"
      ? `You've got full access now — every recipe, every platform translation, every preset download. Load them into your rig and go play.`
      : `Thanks for grabbing the <strong style="color:#f0eadf;">${esc(label)}</strong>. It's unlocked on your account — download the preset, load the snapshots, and you're ready for Sunday.`;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #0b0f1a; padding: 32px;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Fader &amp; Knob</h1>
            <p style="color: #6e7a8a; font-size: 13px; margin: 4px 0 0;">Tone recipes from the songs you love</p>
          </div>
          <h2 style="color: #f0eadf; font-size: 22px; margin: 0 0 12px;">Thanks — you're all set.</h2>
          <p style="line-height: 1.6; color: #a3b2c4; margin: 0 0 20px;">${blurb}</p>
          <div style="text-align:center; margin: 28px 0;">
            <a href="${ctaHref}" style="background:#f59e0b; color:#0b0f1a; text-decoration:none; font-weight:600; padding:12px 24px; border-radius:6px; display:inline-block;">${ctaLabel}</a>
          </div>
          ${price ? `<p style="color:#6e7a8a; font-size:13px; margin:0 0 20px;">Amount: ${price}. A receipt from Stripe is on its way separately.</p>` : ""}
          <p style="line-height: 1.6; color: #a3b2c4; margin: 0 0 20px;">
            Questions, or a song you want a recipe for? Just reply — I read every message.<br /><br />
            — Daniel<br />
            <span style="color:#6e7a8a; font-size:13px;">Fader &amp; Knob</span>
          </p>
          <div style="border-top: 1px solid #1e2840; margin-top: 24px; padding-top: 16px; color: #6e7a8a; font-size: 12px;">
            <p style="margin:0;">You're receiving this because you made a purchase at
              <a href="https://faderandknob.com" style="color:#6e7a8a;">faderandknob.com</a>.</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send purchase welcome:", error);
    return { success: false, error };
  }
}

/**
 * Internal owner alert — pings the store owner (OWNER_EMAIL) when something
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
  const accent = opts.urgent ? "#ef4444" : "#f59e0b";
  const rowsHtml = opts.rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0; color:#6e7a8a; white-space:nowrap; vertical-align:top;">${esc(k)}</td><td style="padding:6px 0; color:#f0eadf;">${esc(v)}</td></tr>`,
    )
    .join("");
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: REPLY_TO,
      subject: `${opts.urgent ? "🔴 " : ""}[F&K] ${opts.subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #e5e5e5; background-color: #0b0f1a; padding: 24px;">
          <h2 style="color: ${accent}; font-size: 18px; margin: 0 0 16px;">${esc(opts.heading)}</h2>
          <table style="border-collapse:collapse; font-size:14px;">${rowsHtml}</table>
          <p style="margin-top:20px;"><a href="https://dashboard.stripe.com" style="color:#f59e0b;">Open Stripe Dashboard &rarr;</a></p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send owner alert:", error);
    return { success: false, error };
  }
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
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
              <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Tone of the Week</h1>
                <p style="color: #666; font-size: 14px; margin: 4px 0 0;">by Fader & Knob</p>
              </div>

              <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">${esc(recipeName)}</h2>
              <p style="color: #a3a3a3; line-height: 1.6;">${esc(recipeDescription)}</p>
              <a href="https://faderandknob.com/recipe/${recipeSlug}"
                 style="display: inline-block; background: #f59e0b; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                Get this tone &rarr;
              </a>

              <div style="border-top: 1px solid #333; margin: 24px 0; padding-top: 24px;">
                <h3 style="color: #f59e0b; margin-top: 0;">From the Blog</h3>
                <a href="https://faderandknob.com/blog/${blogPostSlug}"
                   style="color: #ffffff; font-size: 16px; text-decoration: none;">
                  ${esc(blogPostTitle)} &rarr;
                </a>
              </div>

              <div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #f59e0b; margin-top: 0;">Quick Tip</h3>
                <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 0;">${esc(quickTip)}</p>
              </div>

              <div style="border-top: 1px solid #333; margin-top: 24px; padding-top: 16px; color: #666; font-size: 12px;">
                <p style="margin: 0 0 6px;">You're receiving this because you subscribed to Fader & Knob updates.</p>
                <p style="margin: 0 0 6px;"><a href="https://faderandknob.com" style="color: #666;">faderandknob.com</a></p>
                ${unsubscribeFooter(email, "dark")}
              </div>
            </div>
          `,
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
 * "Sunday Setlist" — Tuesday email mapping this week's most-played worship
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
        <div style="border-top: 1px solid #333; padding: 20px 0;">
          <h3 style="color: #ffffff; font-size: 17px; margin: 0 0 2px;">${esc(s.title)}</h3>
          <p style="color: #666; font-size: 13px; margin: 0 0 10px;">${esc(s.artist)}</p>
          <p style="color: #a3a3a3; line-height: 1.6; margin: 0 0 10px;">${esc(s.tone)}</p>
          ${s.links
            .map(
              (l) =>
                `<a href="https://faderandknob.com${l.url}" style="color: #f59e0b; font-size: 14px; text-decoration: none; margin-right: 16px;">${esc(l.label)} &rarr;</a>`,
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
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
              <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Sunday Setlist</h1>
                <p style="color: #666; font-size: 14px; margin: 4px 0 0;">Tones for ${esc(sundayDate)} &middot; by Fader & Knob</p>
              </div>
              <p style="color: #a3a3a3; line-height: 1.6;">${esc(intro)}</p>
              ${songBlocks}
              ${
                outro
                  ? `<div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;"><p style="color: #a3a3a3; line-height: 1.6; margin: 0;">${esc(outro)}</p></div>`
                  : ""
              }
              <div style="border-top: 1px solid #333; margin-top: 24px; padding-top: 16px; color: #666; font-size: 12px;">
                <p style="margin: 0 0 6px;">You're receiving this because you subscribed to Fader & Knob updates.</p>
                <p style="margin: 0 0 6px;"><a href="https://faderandknob.com" style="color: #666;">faderandknob.com</a></p>
                ${unsubscribeFooter(email, "dark")}
              </div>
            </div>
          `,
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
// /api/cron/email-sequence. Copy source of truth: docs/WELCOME_SEQUENCE.md —
// edit there first, then mirror here.
// ============================================================================

const SEQ_WRAP_TOP = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
  <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Fader &amp; Knob</h1>
    <p style="color: #666; font-size: 13px; margin: 4px 0 0;">Tone recipes from the songs you love</p>
  </div>`;

function seqFooter(to: string): string {
  return `<div style="border-top: 1px solid #333; margin-top: 32px; padding-top: 16px; color: #666; font-size: 12px; line-height: 1.6;">
    <p style="margin: 0 0 6px;">Written by Fader &amp; Knob's AI staff. Reply and a human reads it.</p>
    <p style="margin: 0 0 6px;">Fader &amp; Knob is an open AI experiment — the record is public at
      <a href="https://faderandknob.com/experiment" style="color: #666;">faderandknob.com/experiment</a>.</p>
    ${unsubscribeFooter(to, "dark")}
  </div>
</div>`;
}

const seqLink = (href: string, label: string) =>
  `<a href="https://faderandknob.com${href}" style="color: #f59e0b; text-decoration: none;">${label}</a>`;

export type SequenceName = "account" | "newsletter";

interface SequenceStep {
  subject: string;
  html: (to: string) => string;
}

/** All sequence steps, keyed "<sequence>:<step>". */
const SEQUENCE_STEPS: Record<string, SequenceStep> = {
  // A1 — sent shortly after account creation.
  "account:1": {
    subject: "Your 5 downloads, and where to spend them",
    html: (to) => `${SEQ_WRAP_TOP}
      <h2 style="color: #ffffff; font-size: 20px;">You're in.</h2>
      <p style="line-height: 1.6; color: #a3a3a3;">
        The free plan is <strong style="color:#ffffff;">5 preset downloads</strong> and
        <strong style="color:#ffffff;">10 recipe PDFs</strong> a month, every month,
        plus unlimited browsing and saved recipes.
      </p>
      <p style="line-height: 1.6; color: #a3a3a3;">
        Five downloads is enough to matter if you spend them well. Start with your rig:
      </p>
      <div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ul style="color: #a3a3a3; line-height: 1.9; padding-left: 20px; margin: 0;">
          <li><strong style="color:#ffffff;">Helix / HX Stomp:</strong> ${seqLink("/browse?platform=helix", "every recipe with a .hlx download")}</li>
          <li><strong style="color:#ffffff;">Boss Katana:</strong> ${seqLink("/blog/boss-katana-hidden-settings", "the 7 settings most players never find")}, then ${seqLink("/browse?platform=katana", "the .tsl recipes")}</li>
          <li><strong style="color:#ffffff;">Quad Cortex / TONEX / Fractal / Kemper:</strong> ${seqLink("/browse", "every recipe has your platform's tab")}</li>
          <li><strong style="color:#ffffff;">Pedals and an amp, no modeler:</strong> every recipe includes the pedalboard translation</li>
        </ul>
      </div>
      <p style="line-height: 1.6; color: #a3a3a3;">
        One tip before you load anything: <strong style="color:#ffffff;">level-match first.</strong>
        A patch that is 2 dB louder always sounds &quot;better.&quot; Set output levels equal
        before you judge a preset, or you will keep the wrong one.
      </p>
      <a href="https://faderandknob.com/browse"
         style="display: inline-block; background: #f59e0b; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 0 0;">
        Browse the library &rarr;
      </a>
      ${seqFooter(to)}`,
  },

  // A2 — day 3.
  "account:2": {
    subject: "How to read a recipe (and adjust it for your room)",
    html: (to) => `${SEQ_WRAP_TOP}
      <p style="line-height: 1.6; color: #a3a3a3;">
        Every Fader &amp; Knob recipe gives exact positions: not &quot;add some drive,&quot;
        but Gain 4.5, Master 7, Presence 6. Exact starting points beat vague advice,
        but no room, cab, or pickup set is identical. Here is the adjustment order
        that works on any platform:
      </p>
      <div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="color: #a3a3a3; line-height: 1.9; padding-left: 20px; margin: 0;">
          <li><strong style="color:#ffffff;">Play it as written.</strong> No touching anything for two minutes.</li>
          <li><strong style="color:#ffffff;">Fix the feel first (gain).</strong> Too fizzy, back the gain down 1. Too stiff, up 0.5. Gain changes feel more than tone.</li>
          <li><strong style="color:#ffffff;">Fix the room second (highs).</strong> Harsh in your room: presence/treble down 1. Dull: up 1. One knob, one step.</li>
          <li><strong style="color:#ffffff;">Stop.</strong> Two knobs is almost always enough. Still wrong? The problem is usually level or the cab/IR, not the amp block.</li>
        </ol>
      </div>
      <p style="line-height: 1.6; color: #a3a3a3;">
        Going deeper: ${seqLink("/blog/guitar-eq-guide", "the frequencies that actually matter")} and
        ${seqLink("/blog/signal-chain-order-guide", "the complete signal chain order guide")}.
      </p>
      <p style="line-height: 1.6; color: #a3a3a3;">
        Chasing a tone we don't have yet? Reply to this email and it goes into the
        production queue; you'll get the page when it's live.
      </p>
      ${seqFooter(to)}`,
  },

  // A3 — day 7. Skipped at send time if the user already upgraded.
  "account:3": {
    subject: "The math on the download cap",
    html: (to) => `${SEQ_WRAP_TOP}
      <p style="line-height: 1.6; color: #a3a3a3;">Quick math, then we'll leave you alone.</p>
      <p style="line-height: 1.6; color: #a3a3a3;">
        Free gives you 5 preset downloads a month. If that's your pace, keep it forever;
        the cap resets monthly and nothing expires.
      </p>
      <p style="line-height: 1.6; color: #a3a3a3;">
        If you're downloading faster than that, the <strong style="color:#ffffff;">Pass is $49 a year</strong>:
        unlimited presets, unlimited PDFs, and new recipes a week before everyone else.
        That's $4.08 a month, or about the cost of one set of strings for a year of
        every tone on the site.
      </p>
      <p style="line-height: 1.6; color: #a3a3a3;">
        If you buy Set Packs, skip Pass and take <strong style="color:#ffffff;">Pro at $79</strong>:
        every Set Pack is included while you're subscribed, so one $19 pack a year plus
        unlimited downloads already makes it the better deal.
      </p>
      <a href="https://faderandknob.com/pricing"
         style="display: inline-block; background: #f59e0b; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 12px 0 0;">
        Start Pass — $49/yr
      </a>
      <a href="https://faderandknob.com/pricing"
         style="display: inline-block; color: #f59e0b; padding: 12px 0; text-decoration: none; font-weight: 600; margin: 8px 0 0;">
        See what Pro includes &rarr;
      </a>
      <p style="line-height: 1.6; color: #a3a3a3; margin-top: 24px;">
        Either way, you'll keep getting the weekly email like everyone else: one recipe,
        one insight, one thing worth knowing. That part is free forever too.
      </p>
      ${seqFooter(to)}`,
  },

  // B2 — day 5 for newsletter-only subscribers. Skipped if they now have an account.
  "newsletter:2": {
    subject: "Saved recipes beat bookmarks",
    html: (to) => `${SEQ_WRAP_TOP}
      <p style="line-height: 1.6; color: #a3a3a3;">
        A free account adds three things the newsletter can't do:
        unlimited saved recipes, <strong style="color:#ffffff;">5 preset downloads a month</strong>
        in your platform's native format (.hlx, .tsl), and 10 printable recipe PDFs.
        No card, no trial clock.
      </p>
      <a href="https://faderandknob.com/signup"
         style="display: inline-block; background: #f59e0b; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 0 0;">
        Create the free account &rarr;
      </a>
      ${seqFooter(to)}`,
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
