/**
 * Manual email test harness. Sends a sample purchase-welcome + owner-alert
 * through the real Resend integration so you can eyeball the templates.
 *
 * Usage (loads RESEND_API_KEY from .env.local via the shell):
 *   export $(grep -E '^RESEND_API_KEY=' .env.local | xargs) \
 *     && OWNER_EMAIL=you@example.com npx tsx scripts/test-emails.ts you@example.com
 *
 * The single arg is the recipient for the customer "welcome" email.
 * OWNER_EMAIL controls where the owner alert goes (defaults to hello@).
 */
import { sendPurchaseWelcome, sendOwnerAlert } from "@/lib/email";

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: npx tsx scripts/test-emails.ts <recipient-email>");
    process.exit(1);
  }
  console.log("RESEND_API_KEY present:", Boolean(process.env.RESEND_API_KEY));
  console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL || "(default hello@)");
  console.log("Sending customer welcome to:", to);

  const welcome = await sendPurchaseWelcome({
    to,
    kind: "subscription",
    label: "Pro",
  });
  console.log("purchase welcome result:", welcome);

  const alert = await sendOwnerAlert({
    subject: "TEST — new subscriber",
    heading: "💰 New Pass/Pro subscriber (TEST)",
    rows: [
      ["Plan", "pro"],
      ["Customer", to],
      ["Mode", "test"],
      ["Note", "This is a test from scripts/test-emails.ts"],
    ],
  });
  console.log("owner alert result:", alert);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
