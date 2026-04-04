import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Fader & Knob <noreply@faderandknob.com>";
const REPLY_TO = "hello@faderandknob.com";

/**
 * Send a welcome email when someone downloads their first PDF.
 */
export async function sendWelcomeEmail(to: string, recipeName: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `Your tone recipe is ready: ${recipeName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Fader & Knob</h1>
          </div>

          <h2 style="color: #ffffff; font-size: 20px;">Your recipe PDF is downloading</h2>

          <p style="line-height: 1.6; color: #a3a3a3;">
            Thanks for downloading <strong style="color: #ffffff;">${recipeName}</strong>.
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
          subject: `Tone of the Week: ${recipeName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #e5e5e5; background-color: #1a1a1a; padding: 32px;">
              <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">Tone of the Week</h1>
                <p style="color: #666; font-size: 14px; margin: 4px 0 0;">by Fader & Knob</p>
              </div>

              <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">${recipeName}</h2>
              <p style="color: #a3a3a3; line-height: 1.6;">${recipeDescription}</p>
              <a href="https://faderandknob.com/recipe/${recipeSlug}"
                 style="display: inline-block; background: #f59e0b; color: #1a1a1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                Get this tone &rarr;
              </a>

              <div style="border-top: 1px solid #333; margin: 24px 0; padding-top: 24px;">
                <h3 style="color: #f59e0b; margin-top: 0;">From the Blog</h3>
                <a href="https://faderandknob.com/blog/${blogPostSlug}"
                   style="color: #ffffff; font-size: 16px; text-decoration: none;">
                  ${blogPostTitle} &rarr;
                </a>
              </div>

              <div style="background: #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #f59e0b; margin-top: 0;">Quick Tip</h3>
                <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 0;">${quickTip}</p>
              </div>

              <div style="border-top: 1px solid #333; margin-top: 24px; padding-top: 16px; color: #666; font-size: 12px;">
                <p>You're receiving this because you subscribed to Fader & Knob updates.</p>
                <p><a href="https://faderandknob.com" style="color: #666;">faderandknob.com</a></p>
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
