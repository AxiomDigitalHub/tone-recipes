/**
 * Contact address rendered so Cloudflare leaves it alone.
 *
 * Cloudflare's Scrape Shield → Email Obfuscation rewrites every mailto:
 * link AND every plaintext address in the HTML body into
 * `<a href="/cdn-cgi/l/email-protection#…">`. That endpoint is served by
 * Cloudflare's edge with **HTTP 404** (verified: it returns the real
 * "Email Protection | Cloudflare" interstitial under a 404 status), so
 * every page carrying our address published a broken internal link —
 * six of them in the Aug 2026 site audit, up from zero in June.
 *
 * `<!--email_off-->` is Cloudflare's documented per-element opt-out. It has
 * to reach the wire as a genuine HTML comment, which JSX comments don't do,
 * hence dangerouslySetInnerHTML.
 *
 * Use this instead of writing the address inline anywhere in a page.
 */

export const CONTACT_EMAIL = "hello@faderandknob.com";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(inner: string) {
  return { __html: `<!--email_off-->${inner}<!--email_on-->` };
}

/**
 * Clickable mailto link. `label` defaults to the address itself; pass a
 * phrase ("tell us") when the anchor reads as prose. `style` is a raw CSS
 * declaration string because this has to be serialised HTML, not JSX.
 */
export function ContactEmailLink({
  label,
  className,
  style,
  subject,
}: {
  label?: string;
  className?: string;
  style?: string;
  subject?: string;
}) {
  const href = subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
  const attrs = [
    `href="${href}"`,
    className ? `class="${escapeHtml(className)}"` : "",
    style ? `style="${escapeHtml(style)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      dangerouslySetInnerHTML={wrap(
        `<a ${attrs}>${escapeHtml(label ?? CONTACT_EMAIL)}</a>`,
      )}
    />
  );
}

/** The address as plain text, for prose that isn't a link. */
export function ContactEmailText() {
  return <span dangerouslySetInnerHTML={wrap(CONTACT_EMAIL)} />;
}
