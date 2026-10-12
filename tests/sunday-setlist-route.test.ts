import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The cron route's content-source branch.
 *
 * For months this route sent an auto-generated email — tone notes built by
 * truncating recipe descriptions — while the hand-researched drafts in
 * content/newsletters/ were read by nothing. These tests pin the two things
 * that fix depends on: a usable draft is passed through *verbatim*, and its
 * absence still produces a sendable email rather than silence.
 *
 * Draft *selection* is covered against a real temp directory in
 * newsletter-draft.test.ts; here the loader is mocked so the branch is
 * deterministic and no clock or repo file is involved. Supabase and Resend
 * are mocked out — this stays a no-network test, per vitest.config.ts.
 */

type SentOpts = Record<string, unknown>;
type SendResult = { success: boolean; sent?: number; error?: unknown };
const sendSundaySetlist = vi.fn<(opts: SentOpts) => Promise<SendResult>>();
const findDraftForSunday = vi.fn();
const insert = vi.fn(async () => ({ error: null }));

vi.mock("@/lib/email", () => ({ sendSundaySetlist }));

vi.mock("@/lib/newsletter-draft", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/newsletter-draft")>();
  return { ...actual, findDraftForSunday };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ insert }) }),
}));

const SECRET = "test-cron-secret";

function request(url = "https://faderandknob.com/api/cron/sunday-setlist?test=qa@example.com") {
  return new Request(url, { headers: { authorization: `Bearer ${SECRET}` } });
}

const DRAFT = {
  subject: "Sunday Setlist — October 18: 6 songs, one AC30",
  sundayDate: "October 18",
  intro: "You got the setlist. Now you need the tones.",
  outro: "Hit reply with your setlist.",
  songs: [
    {
      title: "Goodness of God",
      artist: "Bethel Music",
      tone: "82 BPM in Ab — dotted-eighth at 549 ms, snapshot 5 (Clean Ambi).",
      links: [{ label: "Full recipe", url: "/recipe/hislop-goodness-of-god" }],
    },
  ],
};

async function callRoute(req: Request) {
  const { GET } = await import("@/app/api/cron/sunday-setlist/route");
  // The route only reads nextUrl.searchParams; a NextRequest-shaped object is
  // enough and avoids pulling in the Next server runtime.
  const shim = Object.assign(req, { nextUrl: new URL(req.url) });
  return GET(shim as never);
}

describe("GET /api/cron/sunday-setlist", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    sendSundaySetlist.mockResolvedValue({ success: true, sent: 3 });
    process.env.CRON_SECRET = SECRET;
    process.env.RESEND_API_KEY = "re_test";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
  });

  it("sends the draft verbatim when one matches the upcoming Sunday", async () => {
    findDraftForSunday.mockReturnValue({ draft: { draft: DRAFT, file: "sunday-setlist-2026-10-13.json" } });

    const res = await callRoute(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe("draft");

    const sent = sendSundaySetlist.mock.calls[0][0];
    expect(sent.subject).toBe(DRAFT.subject);
    expect(sent.intro).toBe(DRAFT.intro);
    expect(sent.outro).toBe(DRAFT.outro);
    expect(sent.songs).toEqual(DRAFT.songs);
  });

  it("falls back to a generated setlist when no draft matches", async () => {
    findDraftForSunday.mockReturnValue({ reason: "no draft matched" });

    const res = await callRoute(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe("generated");

    const sent = sendSundaySetlist.mock.calls[0][0];
    expect(sent.subject).toMatch(/^Sunday Setlist: /);
    expect((sent.songs as unknown[]).length).toBeGreaterThan(0);
    // The generated email has no outro — only drafts carry one.
    expect(sent.outro).toBeUndefined();
  });

  it("rejects a request without the cron secret", async () => {
    const res = await callRoute(new Request("https://faderandknob.com/api/cron/sunday-setlist"));
    expect(res.status).toBe(401);
    expect(sendSundaySetlist).not.toHaveBeenCalled();
  });

  it("surfaces a send failure as a 500", async () => {
    findDraftForSunday.mockReturnValue({ draft: { draft: DRAFT, file: "d.json" } });
    sendSundaySetlist.mockResolvedValue({ success: false, error: "resend exploded" } as never);

    const res = await callRoute(request());
    expect(res.status).toBe(500);
  });
});
