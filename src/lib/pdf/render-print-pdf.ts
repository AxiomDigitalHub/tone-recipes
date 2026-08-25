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
 *   - Production (Docker): @sparticuz/chromium — the build made for
 *     barebones Linux. Debian's apt chromium SIGTRAPs inside the slim
 *     container (gpu-process crash regardless of flags; verified live
 *     in-container 2026-07-08), so sparticuz is the ONLY chromium that
 *     renders here. Do not "clean it up" again without a passing
 *     in-container render test.
 *   - Local dev: a locally-installed Chrome, found via LOCAL_CHROME_PATH
 *     or the platform default.
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
  // Explicit override wins (local dev pointing at a system Chrome).
  if (process.env.LOCAL_CHROME_PATH) {
    return puppeteer.launch({
      headless: true,
      executablePath: process.env.LOCAL_CHROME_PATH,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  if (process.env.NODE_ENV === "production") {
    // sparticuz ships its own flag set tuned for minimal containers
    // (no-sandbox, dev-shm, gpu). Proven in-container 2026-07-08:
    // 5.4MB PDF with Fraunces embedded, rendered off the live print route.
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const executablePath = PLATFORM_CHROME[process.platform];
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

/* -------------------------------------------------------------------------- */
/*  Concurrency gate                                                          */
/* -------------------------------------------------------------------------- */
// Each render launches a full headless Chrome (~150-300MB RSS). The PDF
// endpoint needs no auth beyond an email and is rate-limited per IP only,
// so without a global cap, 30 parallel requests = 30 Chromes = OOM on the
// single-container VPS. Two run, a short queue waits, everything past that
// gets a typed error the route maps to 503.

const MAX_CONCURRENT_RENDERS = 2;
const MAX_QUEUE = 8;

let activeRenders = 0;
const renderWaiters: (() => void)[] = [];

/** Thrown when the render queue is full — callers should return 503. */
export class PdfQueueFullError extends Error {
  constructor() {
    super("PDF render queue is full");
    this.name = "PdfQueueFullError";
  }
}

async function acquireRenderSlot(): Promise<void> {
  if (activeRenders < MAX_CONCURRENT_RENDERS) {
    activeRenders++;
    return;
  }
  if (renderWaiters.length >= MAX_QUEUE) {
    throw new PdfQueueFullError();
  }
  // The releasing render hands its slot to the next waiter directly, so
  // activeRenders stays constant across the handoff.
  await new Promise<void>((resolve) => renderWaiters.push(resolve));
}

function releaseRenderSlot(): void {
  const next = renderWaiters.shift();
  if (next) next();
  else activeRenders--;
}

export async function renderUrlToPdf(url: string): Promise<Buffer> {
  await acquireRenderSlot();
  try {
    return await renderUrlToPdfUnbounded(url);
  } finally {
    releaseRenderSlot();
  }
}

async function renderUrlToPdfUnbounded(url: string): Promise<Buffer> {
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
