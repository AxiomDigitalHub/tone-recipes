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
