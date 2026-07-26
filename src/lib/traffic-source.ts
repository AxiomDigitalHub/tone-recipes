/**
 * Traffic-source classifier — where did this request actually come from?
 *
 * ============================================================================
 * THE DISTINCTION THIS MODULE EXISTS TO ENFORCE
 * ============================================================================
 *
 * An **AI crawler** is a robot. GPTBot, PerplexityBot, ClaudeBot, CCBot,
 * Bytespider. It arrives with a bot user-agent, no human behind it, no
 * session, no scroll, no download, no signup. Its value to us is
 * *eligibility*: if it can't fetch the page, the page can never be cited.
 * It is a LEADING INDICATOR. It converts at exactly 0.00% and always will.
 *
 * An **AI assistant referral** is a person. They asked ChatGPT "what amp
 * settings for Hillsong 'Oceans' on an HX Stomp", the answer cited us, they
 * clicked. They arrive in a real browser with `referrer: chatgpt.com`. They
 * are pre-qualified — someone else already told them we're the answer — and
 * they convert *better* than generic search traffic. It is a LAGGING,
 * REVENUE-BEARING indicator.
 *
 * Conflating the two makes every AI number meaningless. "AI traffic is up
 * 400%" is a triumph if it's assistant referrals and a rounding error (or a
 * bandwidth bill) if it's crawlers. Crawler hits are counted as
 * `ai_crawler` and MUST be excluded from every human metric — sessions,
 * conversion rate, activation, revenue per source. `isBot` is returned
 * separately so a caller can filter *all* robots (AI or not) in one check.
 *
 * ============================================================================
 * USAGE
 * ============================================================================
 *
 *   // Server (route handler / middleware):
 *   import { classifyTrafficSource } from "@/lib/traffic-source";
 *   const c = classifyTrafficSource({
 *     referrer: req.headers.get("referer"),
 *     userAgent: req.headers.get("user-agent"),
 *     searchParams: new URL(req.url).searchParams,
 *   });
 *   if (c.isBot) return;                      // never count robots as humans
 *   log({ source: c.source, detail: c.detail });
 *
 *   // Client (first-touch attribution, before the SPA rewrites the URL):
 *   const c = classifyTrafficSource({
 *     referrer: document.referrer,
 *     userAgent: navigator.userAgent,
 *     searchParams: window.location.search,
 *   });
 *
 * No dependencies, no side effects, no I/O. Safe in middleware (edge
 * runtime), route handlers, scripts, and the browser bundle.
 *
 * ============================================================================
 * HONEST LIMITS (read before trusting a number built on this)
 * ============================================================================
 *
 * - Many assistants send NO referrer. Native ChatGPT/Claude desktop and
 *   mobile apps, Copilot in the Windows shell, and anything opening links
 *   through an in-app webview frequently arrive with an empty `Referer`
 *   and no UTM. Those land in `direct`. Use `isDarkAiCandidate()` plus
 *   landing-page shape to *estimate* that population — never to relabel it.
 * - Google AI Overviews / AI Mode referrals arrive as plain `google.com`.
 *   They are indistinguishable from a blue-link click at the referrer
 *   level. They are classified `search`, and that is the honest answer.
 * - User-agent strings are self-reported and trivially spoofed. Bot
 *   detection here is for *measurement*, not for access control.
 *
 * See docs/MEASUREMENT_PLAN.md § "What we cannot know and why".
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type TrafficSource =
  /** Human arriving from an AI chat answer (chatgpt.com, perplexity.ai…). */
  | "ai_assistant"
  /** Robot indexing/retrieving us (GPTBot, PerplexityBot…). Never a human. */
  | "ai_crawler"
  /** Classic search engine result (includes Google AI Overviews — see above). */
  | "search"
  /** Social network / community platform. */
  | "social"
  /** Newsletter or webmail click. */
  | "email"
  /** Any other site linking to us. */
  | "referral"
  /** No referrer and no campaign tags. Includes "dark" assistant traffic. */
  | "direct";

export interface TrafficClassification {
  /** Best single bucket for this hit. */
  source: TrafficSource;
  /**
   * Stable lowercase slug naming the specific origin: "chatgpt",
   * "perplexity", "google", "reddit", "gptbot", "newsletter". `""` when the
   * source is `direct` with nothing to name. Safe as a GA4 dimension value
   * and as a DB column — never contains a full URL or query string.
   */
  detail: string;
  /**
   * True for ANY robot — AI crawlers, search crawlers, SEO tools, uptime
   * monitors, scripted clients. Filter on this before computing any
   * human-behaviour metric.
   */
  isBot: boolean;
}

export interface ClassifyTrafficInput {
  /** `document.referrer` or the `Referer` header. Full URL or bare host. */
  referrer?: string | null;
  /** `User-Agent` header or `navigator.userAgent`. */
  userAgent?: string | null;
  /**
   * Landing-page query string. Accepts `URLSearchParams`, a raw
   * `"?a=b"` / `"a=b"` string, or a plain object (Next.js
   * `searchParams` page prop shape).
   */
  searchParams?:
    | URLSearchParams
    | string
    | Record<string, string | string[] | undefined>
    | null;
  /**
   * Hosts that are *us*. A referrer on one of these is internal navigation,
   * not a referral. Defaults to the production domain.
   */
  siteHosts?: readonly string[];
}

/** A host pattern plus the slug it resolves to. */
interface HostRule {
  /** Bare host. Matches the host itself and any subdomain of it. */
  host: string;
  /** Optional path prefix requirement (e.g. huggingface.co/chat). */
  path?: string;
  detail: string;
}

/** A user-agent substring plus the slug it resolves to. */
interface AgentRule {
  /** Case-insensitive substring of the UA string. */
  token: string;
  detail: string;
}

/* -------------------------------------------------------------------------- */
/*  Table 1 — AI ASSISTANT HOSTS (humans arriving from a chat answer)         */
/* -------------------------------------------------------------------------- */
/*  Matched against the REFERRER host. These are conversion-bearing humans.  */

export const AI_ASSISTANT_HOSTS: readonly HostRule[] = [
  // OpenAI
  { host: "chatgpt.com", detail: "chatgpt" },
  { host: "chat.openai.com", detail: "chatgpt" },
  { host: "openai.com", detail: "chatgpt" },
  { host: "chat.com", detail: "chatgpt" },
  { host: "sora.com", detail: "chatgpt" },

  // Perplexity
  { host: "perplexity.ai", detail: "perplexity" },
  { host: "pplx.ai", detail: "perplexity" },

  // Anthropic
  { host: "claude.ai", detail: "claude" },
  { host: "claude.com", detail: "claude" },

  // Microsoft Copilot (incl. the Edge sidebar, which uses edgeservices.*)
  { host: "copilot.microsoft.com", detail: "copilot" },
  { host: "copilot.cloud.microsoft", detail: "copilot" },
  { host: "m365.cloud.microsoft", detail: "copilot" },
  { host: "edgeservices.bing.com", detail: "copilot" },
  { host: "bing.com", path: "/chat", detail: "copilot" },
  { host: "github.com", path: "/copilot", detail: "copilot" },

  // Google (the chat products only — plain google.com stays `search`)
  { host: "gemini.google.com", detail: "gemini" },
  { host: "bard.google.com", detail: "gemini" },
  { host: "aistudio.google.com", detail: "gemini" },
  { host: "notebooklm.google.com", detail: "notebooklm" },
  { host: "notebooklm.google", detail: "notebooklm" },

  // Meta / xAI / DeepSeek / Mistral
  { host: "meta.ai", detail: "meta_ai" },
  { host: "grok.com", detail: "grok" },
  { host: "x.ai", detail: "grok" },
  { host: "chat.deepseek.com", detail: "deepseek" },
  { host: "deepseek.com", detail: "deepseek" },
  { host: "chat.mistral.ai", detail: "mistral" },

  // Answer engines / AI search startups
  { host: "you.com", detail: "you" },
  { host: "phind.com", detail: "phind" },
  { host: "poe.com", detail: "poe" },
  { host: "andisearch.com", detail: "andi" },
  { host: "iask.ai", detail: "iask" },
  { host: "komo.ai", detail: "komo" },
  { host: "exa.ai", detail: "exa" },
  { host: "felo.ai", detail: "felo" },
  { host: "genspark.ai", detail: "genspark" },
  { host: "scira.ai", detail: "scira" },
  { host: "liner.com", detail: "liner" },
  { host: "chatsonic.com", detail: "chatsonic" },
  { host: "writesonic.com", detail: "chatsonic" },
  { host: "arc.net", path: "/search", detail: "arc_search" },
  { host: "duck.ai", detail: "duck_ai" },
  { host: "lumo.proton.me", detail: "lumo" },
  { host: "huggingface.co", path: "/chat", detail: "hf_chat" },
  { host: "t3.chat", detail: "t3_chat" },
  { host: "openrouter.ai", detail: "openrouter" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Table 2 — AI CRAWLER USER-AGENTS (robots; zero humans, zero conversions)  */
/* -------------------------------------------------------------------------- */
/*  Matched against the USER-AGENT, never the referrer. Order matters:       */
/*  longer/more specific tokens first, because ClaudeBot and Claude-User     */
/*  both contain "Claude".                                                   */
/*                                                                            */
/*  Retrieval bots (OAI-SearchBot, PerplexityBot, ClaudeBot) are the ones     */
/*  whose hits predict citations. Training bots (GPTBot, CCBot, anthropic-ai) */
/*  predict nothing near-term. `detail` keeps them distinguishable; the       */
/*  crawlerRole() helper below splits them.                                   */

export const AI_CRAWLER_AGENTS: readonly AgentRule[] = [
  // OpenAI — three distinct bots with three distinct meanings
  { token: "oai-searchbot", detail: "oai_searchbot" }, // ChatGPT search index
  { token: "chatgpt-user", detail: "chatgpt_user" }, // live user-triggered fetch
  { token: "gptbot", detail: "gptbot" }, // training corpus

  // Anthropic
  { token: "claude-searchbot", detail: "claude_searchbot" },
  { token: "claude-user", detail: "claude_user" },
  { token: "claudebot", detail: "claudebot" },
  { token: "claude-web", detail: "claude_web" },
  { token: "anthropic-ai", detail: "anthropic_ai" },

  // Perplexity
  { token: "perplexity-user", detail: "perplexity_user" },
  { token: "perplexitybot", detail: "perplexitybot" },

  // Google AI (Googlebot itself is a SEARCH crawler — see GENERIC_BOT_AGENTS)
  { token: "google-extended", detail: "google_extended" },
  { token: "google-cloudvertexbot", detail: "google_vertex" },
  { token: "googleother", detail: "googleother" },

  // Microsoft / Apple / Amazon / Meta
  { token: "bingbot-chat", detail: "bing_chat" },
  { token: "applebot-extended", detail: "applebot_extended" },
  { token: "amazonbot", detail: "amazonbot" },
  { token: "meta-externalagent", detail: "meta_externalagent" },
  { token: "meta-externalfetcher", detail: "meta_externalfetcher" },
  { token: "facebookbot", detail: "facebookbot" },

  // Common Crawl (feeds most open training sets)
  { token: "ccbot", detail: "ccbot" },

  // Everyone else
  { token: "bytespider", detail: "bytespider" }, // ByteDance/TikTok
  { token: "youbot", detail: "youbot" },
  { token: "cohere-ai", detail: "cohere" },
  { token: "cohere-training-data-crawler", detail: "cohere" },
  { token: "diffbot", detail: "diffbot" },
  { token: "omgili", detail: "omgili" }, // Webz.io, resold for training
  { token: "webzio-extended", detail: "omgili" },
  { token: "timpibot", detail: "timpibot" },
  { token: "img2dataset", detail: "img2dataset" },
  { token: "ai2bot", detail: "ai2bot" },
  { token: "petalbot", detail: "petalbot" }, // Huawei, feeds their assistant
  { token: "duckassistbot", detail: "duckassistbot" },
  { token: "mistralai-user", detail: "mistral_user" },
  { token: "firecrawl", detail: "firecrawl" }, // agent scraping infra
  { token: "browserbase", detail: "browserbase" },
  { token: "scrapy", detail: "scrapy" },
] as const;

/**
 * Retrieval bots fetch a page *because a user asked a question right now*, or
 * to keep an answer index fresh. Their hit counts are the leading indicator
 * that matters. Training bots build a corpus for the next model; their hits
 * predict nothing this quarter.
 */
const RETRIEVAL_CRAWLER_DETAILS: ReadonlySet<string> = new Set([
  "oai_searchbot",
  "chatgpt_user",
  "claude_searchbot",
  "claude_user",
  "perplexity_user",
  "perplexitybot",
  "duckassistbot",
  "mistral_user",
  "bing_chat",
]);

/** Split an `ai_crawler` detail into the only two buckets worth acting on. */
export function crawlerRole(detail: string): "retrieval" | "training" {
  return RETRIEVAL_CRAWLER_DETAILS.has(detail) ? "retrieval" : "training";
}

/* -------------------------------------------------------------------------- */
/*  Table 3 — NON-AI BOTS                                                     */
/* -------------------------------------------------------------------------- */
/*  Not `ai_crawler`, but still not human. Sets isBot so they get filtered   */
/*  out of behaviour metrics; `source` still reflects the referrer.          */

export const GENERIC_BOT_AGENTS: readonly AgentRule[] = [
  { token: "googlebot", detail: "googlebot" },
  { token: "bingbot", detail: "bingbot" },
  { token: "duckduckbot", detail: "duckduckbot" },
  { token: "yandexbot", detail: "yandexbot" },
  { token: "baiduspider", detail: "baiduspider" },
  { token: "applebot", detail: "applebot" },
  { token: "slurp", detail: "yahoo_slurp" },
  { token: "seznambot", detail: "seznambot" },
  { token: "ahrefsbot", detail: "ahrefsbot" },
  { token: "semrushbot", detail: "semrushbot" },
  { token: "mj12bot", detail: "mj12bot" },
  { token: "dotbot", detail: "dotbot" },
  { token: "screaming frog", detail: "screaming_frog" },
  { token: "uptimerobot", detail: "uptimerobot" },
  { token: "pingdom", detail: "pingdom" },
  { token: "betteruptime", detail: "betteruptime" },
  { token: "vercel-screenshot", detail: "vercel" },
  { token: "lighthouse", detail: "lighthouse" },
  { token: "headlesschrome", detail: "headless_chrome" },
  { token: "puppeteer", detail: "puppeteer" },
  { token: "playwright", detail: "playwright" },
  { token: "curl/", detail: "curl" },
  { token: "wget", detail: "wget" },
  { token: "python-requests", detail: "python_requests" },
  { token: "python-httpx", detail: "python_httpx" },
  { token: "axios/", detail: "axios" },
  { token: "go-http-client", detail: "go_http" },
  { token: "node-fetch", detail: "node_fetch" },
  { token: "okhttp", detail: "okhttp" },
  { token: "java/", detail: "java_http" },
  { token: "twitterbot", detail: "twitterbot" }, // link unfurl, not a reader
  { token: "facebookexternalhit", detail: "facebook_unfurl" },
  { token: "slackbot", detail: "slack_unfurl" },
  { token: "discordbot", detail: "discord_unfurl" },
  { token: "telegrambot", detail: "telegram_unfurl" },
  { token: "whatsapp", detail: "whatsapp_unfurl" },
  { token: "linkedinbot", detail: "linkedin_unfurl" },
  { token: "redditbot", detail: "reddit_unfurl" },
  { token: "embedly", detail: "embedly" },
  { token: "feedfetcher", detail: "feedfetcher" },
  { token: "bot/", detail: "generic_bot" },
  { token: "spider", detail: "generic_spider" },
  { token: "crawler", detail: "generic_crawler" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Table 4 — SEARCH ENGINES                                                  */
/* -------------------------------------------------------------------------- */
/*  NOTE: google.com covers organic blue links AND AI Overviews AND AI Mode. */
/*  Google sends no signal distinguishing them. Do not pretend otherwise.    */

export const SEARCH_HOSTS: readonly HostRule[] = [
  { host: "google.com", detail: "google" },
  { host: "google.co.uk", detail: "google" },
  { host: "google.ca", detail: "google" },
  { host: "google.com.au", detail: "google" },
  { host: "google.de", detail: "google" },
  { host: "google.fr", detail: "google" },
  { host: "google.es", detail: "google" },
  { host: "google.it", detail: "google" },
  { host: "google.nl", detail: "google" },
  { host: "google.com.br", detail: "google" },
  { host: "google.co.in", detail: "google" },
  { host: "google.co.jp", detail: "google" },
  { host: "google.com.mx", detail: "google" },
  { host: "googleusercontent.com", detail: "google" },
  { host: "bing.com", detail: "bing" },
  { host: "msn.com", detail: "bing" },
  { host: "duckduckgo.com", detail: "duckduckgo" },
  { host: "search.yahoo.com", detail: "yahoo" },
  { host: "yahoo.com", detail: "yahoo" },
  { host: "yandex.com", detail: "yandex" },
  { host: "yandex.ru", detail: "yandex" },
  { host: "baidu.com", detail: "baidu" },
  { host: "ecosia.org", detail: "ecosia" },
  { host: "startpage.com", detail: "startpage" },
  { host: "search.brave.com", detail: "brave" },
  { host: "brave.com", detail: "brave" },
  { host: "qwant.com", detail: "qwant" },
  { host: "search.marginalia.nu", detail: "marginalia" },
  { host: "mojeek.com", detail: "mojeek" },
  { host: "kagi.com", detail: "kagi" },
  { host: "naver.com", detail: "naver" },
  { host: "seznam.cz", detail: "seznam" },
  { host: "ask.com", detail: "ask" },
  { host: "aol.com", detail: "aol" },
  { host: "lite.duckduckgo.com", detail: "duckduckgo" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Table 5 — SOCIAL / COMMUNITY                                              */
/* -------------------------------------------------------------------------- */
/*  Reddit matters disproportionately here: it is a top-cited domain in our  */
/*  query class, so reddit referrals are partly an AI-adjacent channel.      */

export const SOCIAL_HOSTS: readonly HostRule[] = [
  { host: "reddit.com", detail: "reddit" },
  { host: "redd.it", detail: "reddit" },
  { host: "out.reddit.com", detail: "reddit" },
  { host: "facebook.com", detail: "facebook" },
  { host: "fb.com", detail: "facebook" },
  { host: "l.facebook.com", detail: "facebook" },
  { host: "instagram.com", detail: "instagram" },
  { host: "l.instagram.com", detail: "instagram" },
  { host: "threads.net", detail: "threads" },
  { host: "threads.com", detail: "threads" },
  { host: "x.com", detail: "x" },
  { host: "twitter.com", detail: "x" },
  { host: "t.co", detail: "x" },
  { host: "linkedin.com", detail: "linkedin" },
  { host: "lnkd.in", detail: "linkedin" },
  { host: "youtube.com", detail: "youtube" },
  { host: "youtu.be", detail: "youtube" },
  { host: "m.youtube.com", detail: "youtube" },
  { host: "tiktok.com", detail: "tiktok" },
  { host: "pinterest.com", detail: "pinterest" },
  { host: "pin.it", detail: "pinterest" },
  { host: "discord.com", detail: "discord" },
  { host: "discordapp.com", detail: "discord" },
  { host: "t.me", detail: "telegram" },
  { host: "bsky.app", detail: "bluesky" },
  { host: "mastodon.social", detail: "mastodon" },
  { host: "tumblr.com", detail: "tumblr" },
  { host: "quora.com", detail: "quora" },
  { host: "news.ycombinator.com", detail: "hackernews" },
  { host: "vk.com", detail: "vk" },
  { host: "whatsapp.com", detail: "whatsapp" },
  { host: "snapchat.com", detail: "snapchat" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Table 6 — WEBMAIL (a referrer we can only see for browser-based mail)     */
/* -------------------------------------------------------------------------- */

export const EMAIL_HOSTS: readonly HostRule[] = [
  { host: "mail.google.com", detail: "gmail" },
  { host: "outlook.live.com", detail: "outlook" },
  { host: "outlook.office.com", detail: "outlook" },
  { host: "outlook.office365.com", detail: "outlook" },
  { host: "mail.yahoo.com", detail: "yahoo_mail" },
  { host: "mail.proton.me", detail: "proton_mail" },
  { host: "protonmail.com", detail: "proton_mail" },
  { host: "mail.aol.com", detail: "aol_mail" },
  { host: "mail.zoho.com", detail: "zoho_mail" },
  { host: "superhuman.com", detail: "superhuman" },
  { host: "hey.com", detail: "hey" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Table 7 — CAMPAIGN-PARAMETER VALUES                                       */
/* -------------------------------------------------------------------------- */
/*  ChatGPT appends `?utm_source=chatgpt.com` to links it renders. That is   */
/*  the single most reliable AI-referral signal we get, because it survives  */
/*  referrer stripping. Check params BEFORE the referrer.                    */

const AI_PARAM_VALUES: Readonly<Record<string, string>> = {
  "chatgpt.com": "chatgpt",
  chatgpt: "chatgpt",
  openai: "chatgpt",
  "chat.openai.com": "chatgpt",
  "perplexity.ai": "perplexity",
  perplexity: "perplexity",
  "claude.ai": "claude",
  claude: "claude",
  anthropic: "claude",
  copilot: "copilot",
  "copilot.microsoft.com": "copilot",
  gemini: "gemini",
  "gemini.google.com": "gemini",
  bard: "gemini",
  "meta.ai": "meta_ai",
  grok: "grok",
  "you.com": "you",
  phind: "phind",
  deepseek: "deepseek",
  mistral: "mistral",
};

const EMAIL_PARAM_MEDIUMS: ReadonlySet<string> = new Set([
  "email",
  "e-mail",
  "newsletter",
  "mail",
  "drip",
  "sequence",
  "broadcast",
]);

const SOCIAL_PARAM_MEDIUMS: ReadonlySet<string> = new Set([
  "social",
  "social-media",
  "social_media",
  "sm",
  "organic-social",
]);

const PAID_SEARCH_PARAM_MEDIUMS: ReadonlySet<string> = new Set([
  "cpc",
  "ppc",
  "paidsearch",
  "paid-search",
  "sem",
]);

const DEFAULT_SITE_HOSTS: readonly string[] = [
  "faderandknob.com",
  "localhost",
  "127.0.0.1",
];

/* -------------------------------------------------------------------------- */
/*  Internals                                                                 */
/* -------------------------------------------------------------------------- */

/** Lowercase host with a leading `www.` removed. `""` if unparseable. */
function normalizeHost(input: string): string {
  const host = input.trim().toLowerCase();
  return host.startsWith("www.") ? host.slice(4) : host;
}

interface ParsedReferrer {
  host: string;
  path: string;
}

/**
 * Accepts a full URL (`https://chatgpt.com/c/abc`), a protocol-relative URL,
 * or a bare host (`chatgpt.com`) — server logs and analytics exports contain
 * all three. Returns `null` for anything unusable.
 */
function parseReferrer(referrer: string | null | undefined): ParsedReferrer | null {
  if (!referrer) return null;
  const raw = referrer.trim();
  if (!raw || raw === "-" || raw.toLowerCase() === "null") return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
    ? raw
    : raw.startsWith("//")
      ? `https:${raw}`
      : `https://${raw}`;

  try {
    const url = new URL(candidate);
    const host = normalizeHost(url.hostname);
    if (!host) return null;
    return { host, path: url.pathname || "/" };
  } catch {
    return null;
  }
}

/** Host equality, or any subdomain of the pattern. */
function hostMatches(host: string, pattern: string): boolean {
  return host === pattern || host.endsWith(`.${pattern}`);
}

function matchHostRules(
  ref: ParsedReferrer,
  rules: readonly HostRule[],
): HostRule | null {
  // Path-qualified rules are more specific, so they win. Two passes keeps the
  // table order free for readability.
  for (const rule of rules) {
    if (!rule.path) continue;
    if (hostMatches(ref.host, rule.host) && ref.path.startsWith(rule.path)) {
      return rule;
    }
  }
  for (const rule of rules) {
    if (rule.path) continue;
    if (hostMatches(ref.host, rule.host)) return rule;
  }
  return null;
}

function matchAgentRules(
  ua: string,
  rules: readonly AgentRule[],
): AgentRule | null {
  for (const rule of rules) {
    if (ua.includes(rule.token)) return rule;
  }
  return null;
}

/** Normalize every accepted searchParams shape into a single lookup fn. */
function paramReader(
  input: ClassifyTrafficInput["searchParams"],
): (key: string) => string {
  if (!input) return () => "";

  if (typeof input === "string") {
    const qs = input.startsWith("?") ? input.slice(1) : input;
    let parsed: URLSearchParams;
    try {
      parsed = new URLSearchParams(qs);
    } catch {
      return () => "";
    }
    return (key) => (parsed.get(key) ?? "").trim().toLowerCase();
  }

  if (typeof URLSearchParams !== "undefined" && input instanceof URLSearchParams) {
    return (key) => (input.get(key) ?? "").trim().toLowerCase();
  }

  const obj = input as Record<string, string | string[] | undefined>;
  return (key) => {
    const v = obj[key];
    const s = Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
    return s.trim().toLowerCase();
  };
}

function result(
  source: TrafficSource,
  detail: string,
  isBot: boolean,
): TrafficClassification {
  return { source, detail, isBot };
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Classify one request/pageview.
 *
 * Precedence, and why:
 *   1. AI crawler user-agent — a robot's referrer is meaningless, and
 *      misfiling a crawler as a human poisons every downstream rate.
 *   2. AI campaign parameter (`utm_source=chatgpt.com`) — survives referrer
 *      stripping, so it is *more* reliable than the referrer, not less.
 *   3. Referrer host tables: assistant → search → social → webmail → us →
 *      other referral.
 *   4. Campaign medium (`utm_medium=email|social|cpc`) when no referrer.
 *   5. Direct.
 *
 * Non-AI bots do not short-circuit: they get `isBot: true` and are then
 * classified normally, so an unfurl bot following a Slack link still shows
 * up under `social` with the robot flag set.
 */
export function classifyTrafficSource(
  input: ClassifyTrafficInput = {},
): TrafficClassification {
  const ua = (input.userAgent ?? "").toLowerCase();
  const ref = parseReferrer(input.referrer);
  const param = paramReader(input.searchParams);
  const siteHosts = input.siteHosts ?? DEFAULT_SITE_HOSTS;

  // ── 1. AI crawler: robot, always. Never a human, never a conversion. ──
  if (ua) {
    const aiBot = matchAgentRules(ua, AI_CRAWLER_AGENTS);
    if (aiBot) return result("ai_crawler", aiBot.detail, true);
  }

  const genericBot = ua ? matchAgentRules(ua, GENERIC_BOT_AGENTS) : null;
  const isBot = genericBot !== null;

  // ── 2. Explicit AI campaign tag (most reliable assistant signal) ──────
  const utmSource = param("utm_source");
  const refParam = param("ref") || param("source") || param("utm_referrer");
  for (const value of [utmSource, refParam]) {
    if (!value) continue;
    const hit = AI_PARAM_VALUES[value];
    if (hit) return result("ai_assistant", hit, isBot);
  }

  // ── 3. Referrer host ─────────────────────────────────────────────────
  if (ref) {
    const assistant = matchHostRules(ref, AI_ASSISTANT_HOSTS);
    if (assistant) return result("ai_assistant", assistant.detail, isBot);

    const search = matchHostRules(ref, SEARCH_HOSTS);
    if (search) return result("search", search.detail, isBot);

    const social = matchHostRules(ref, SOCIAL_HOSTS);
    if (social) return result("social", social.detail, isBot);

    const mail = matchHostRules(ref, EMAIL_HOSTS);
    if (mail) return result("email", mail.detail, isBot);

    if (siteHosts.some((h) => hostMatches(ref.host, normalizeHost(h)))) {
      // Internal navigation. Not a new visit; callers doing first-touch
      // attribution should ignore these rather than count them as direct.
      return result("direct", "internal", isBot);
    }

    return result("referral", ref.host, isBot);
  }

  // ── 4. Campaign medium, when there is no referrer at all ─────────────
  const medium = param("utm_medium");
  if (EMAIL_PARAM_MEDIUMS.has(medium)) {
    return result("email", utmSource || "newsletter", isBot);
  }
  if (SOCIAL_PARAM_MEDIUMS.has(medium)) {
    return result("social", utmSource || "social", isBot);
  }
  if (PAID_SEARCH_PARAM_MEDIUMS.has(medium) || param("gclid")) {
    return result("search", utmSource || "paid", isBot);
  }
  if (utmSource) {
    return result("referral", utmSource, isBot);
  }

  // ── 5. Direct. Includes app-based AI referrals we cannot see. ────────
  return result("direct", "", isBot);
}

/**
 * Heuristic for "dark" AI traffic: a human with NO referrer landing straight
 * on a deep content page.
 *
 * Real direct traffic is people typing the domain or using a bookmark — it
 * lands on `/`, `/browse`, or a page they've seen before. Nobody types a
 * 60-character recipe slug from memory. A no-referrer hit landing cold on
 * `/recipes/<song>-helix-preset-settings` is almost always an app-based
 * assistant, an in-app webview, or a link pasted out of a chat.
 *
 * This is an ESTIMATE for sizing the blind spot. It must never be used to
 * relabel a session's `source` — that would be inventing data. Report it as
 * its own line: "direct-to-deep-page, likely assistant: N".
 */
export function isDarkAiCandidate(args: {
  classification: TrafficClassification;
  landingPath: string;
}): boolean {
  const { classification, landingPath } = args;
  if (classification.isBot) return false;
  if (classification.source !== "direct") return false;
  if (classification.detail === "internal") return false;

  const path = landingPath.split("?")[0].replace(/\/+$/, "").toLowerCase();
  if (!path || path === "/") return false;

  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return false; // /browse, /pricing — plausibly typed

  // Deep content surfaces a human would never type from memory.
  const deepRoots = ["recipes", "blog", "artists", "songs", "gear", "worship", "news"];
  return deepRoots.includes(segments[0]);
}

/**
 * True when this hit should be counted in human behaviour metrics
 * (sessions, conversion rate, activation, revenue attribution).
 *
 *   sessions.filter(isHumanTraffic)  // the only correct denominator
 */
export function isHumanTraffic(c: TrafficClassification): boolean {
  return !c.isBot && c.source !== "ai_crawler";
}

/**
 * GA4 channel-group label for this classification. Matches the custom
 * channel group defined in docs/MEASUREMENT_PLAN.md so dashboard names and
 * server-side names never drift apart.
 */
export function channelLabel(c: TrafficClassification): string {
  switch (c.source) {
    case "ai_assistant":
      return "AI Assistant";
    case "ai_crawler":
      return "AI Crawler (bot)";
    case "search":
      return "Organic Search";
    case "social":
      return "Organic Social";
    case "email":
      return "Email";
    case "referral":
      return "Referral";
    case "direct":
      return "Direct";
  }
}
