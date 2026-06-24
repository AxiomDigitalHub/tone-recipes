import "server-only";
import puppeteer, { type Browser } from "puppeteer-core";

/**
 * Render an absolute URL to a PDF Buffer via headless Chrome.
 *
 * This turns the beautiful HTML print view (/recipe/[slug]/print) into the
 * downloadable PDF, so the download matches the web design exactly. It
 * replaces the old hand-drawn jsPDF generator (which could only draw
 * primitives and never looked like the site).
 *
 * Environments:
 *   - Production (Vercel/Lambda): puppeteer-core + @sparticuz/chromium.
 *   - Local dev: puppeteer-core + a locally-installed Chrome, found via
 *     LOCAL_CHROME_PATH or the platform default.
 *
 * The /print route already hides the global chrome (masthead / sub-nav /
 * footer) via `.fk-preview:has(.print-mode)` and renders the recipe with
 * the same v3 components as the site, so a screen-media render is exactly
 * what the user sees on screen.
 */

const PLATFORM_CHROME: Record<string, string> = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

async function launch(): Promise<Browser> {
  // In production we ship the serverless-friendly chromium build. Anywhere
  // else (local dev, CI) we drive a locally-installed Chrome.
  if (process.env.NODE_ENV === "production" && !process.env.LOCAL_CHROME_PATH) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const executablePath =
    process.env.LOCAL_CHROME_PATH || PLATFORM_CHROME[process.platform];
  if (!executablePath) {
    throw new Error(
      `No Chrome executable for platform "${process.platform}". Set LOCAL_CHROME_PATH.`,
    );
  }
  return puppeteer.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function renderUrlToPdf(url: string): Promise<Buffer> {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    // Render exactly like the on-screen view (the print page is styled for
    // screen; there are no @media print rules to honor).
    await page.emulateMediaType("screen");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45_000 });
    // Wait for web fonts (Fraunces etc.) so the cover/headings aren't drawn
    // in a fallback face.
    await page
      .evaluate(() => (document as Document & { fonts?: FontFaceSet }).fonts?.ready)
      .catch(() => {});
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      format: "Letter",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
