import type { SyndicationPost } from "./content";

/* -------------------------------------------------------------------------- */
/*  Platform adapters for the syndication cron. Spec: docs/SYNDICATION.md.    */
/*                                                                            */
/*  Two modes, chosen per platform by what it can do, NOT configurable:       */
/*    full    — whole article + a cross-domain canonical back to F&K.         */
/*              Only for platforms whose API sets rel=canonical for us.       */
/*    excerpt — description + takeaways + link. For platforms where we can't  */
/*              set a canonical, so a full copy would compete with the        */
/*              original (and read as a link scheme).                         */
/*  A platform is enabled only when every env var it needs is present.        */
/* -------------------------------------------------------------------------- */

export type SyndicationMode = "full" | "excerpt";

export interface Article {
  post: SyndicationPost;
  /** Mode-appropriate HTML body. */
  html: string;
  /** Same body as Markdown (Hashnode wants Markdown). */
  markdown: string;
}

export interface PublishResult {
  remoteId: string;
  remoteUrl: string | null;
}

export interface Platform {
  id: string;
  label: string;
  mode: SyndicationMode;
  /** Medium has no <table>; tables are flattened to lists for it. */
  flattenTables?: boolean;
  /** Env vars that must all be set for the platform to run. */
  requiredEnv: string[];
  publish(article: Article, opts: { draft: boolean }): Promise<PublishResult>;
}

const env = (k: string) => process.env[k]?.trim() ?? "";

async function readJson(res: Response, platform: string): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!res.ok) throw new Error(`${platform} HTTP ${res.status}: ${text.slice(0, 400)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${platform} returned non-JSON: ${text.slice(0, 200)}`);
  }
}

/** Platform-safe tag list: lowercase words, deduped, capped. */
export function normalizeTags(tags: string[], max: number, maxLen = 25): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    const tag = t.toLowerCase().replace(/[^a-z0-9 -]+/g, "").replace(/-/g, " ").trim();
    if (!tag || tag.length > maxLen || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= max) break;
  }
  return out;
}

/* --------------------------------- Medium --------------------------------- */
// Medium stopped issuing NEW integration tokens in 2023; existing tokens
// still work. If you don't already hold one, leave MEDIUM_TOKEN unset and use
// Medium's own "Import a story" (it also sets the canonical) by hand.

const medium: Platform = {
  id: "medium",
  label: "Medium",
  mode: "full",
  flattenTables: true,
  requiredEnv: ["MEDIUM_TOKEN"],
  async publish({ post, html }, { draft }) {
    const headers = {
      Authorization: `Bearer ${env("MEDIUM_TOKEN")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const me = await readJson(await fetch("https://api.medium.com/v1/me", { headers }), "Medium");
    const userId = (me.data as { id?: string } | undefined)?.id;
    if (!userId) throw new Error("Medium /me returned no user id");
    const res = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: post.title,
        contentFormat: "html",
        content: `<h1>${post.title.replace(/</g, "&lt;")}</h1>\n${html}`,
        canonicalUrl: post.canonicalUrl,
        tags: normalizeTags(post.tags, 5),
        publishStatus: draft ? "draft" : "public",
        notifyFollowers: !draft,
      }),
    });
    const data = (await readJson(res, "Medium")).data as { id: string; url?: string };
    return { remoteId: data.id, remoteUrl: data.url ?? null };
  },
};

/* -------------------------------- Hashnode -------------------------------- */
// originalArticleURL is Hashnode's canonical field: it emits rel=canonical to
// faderandknob.com on the syndicated copy.

const HASHNODE_GQL = "https://gql.hashnode.com";

const hashnode: Platform = {
  id: "hashnode",
  label: "Hashnode",
  mode: "full",
  requiredEnv: ["HASHNODE_TOKEN", "HASHNODE_PUBLICATION_ID"],
  async publish({ post, markdown }, { draft }) {
    const tags = normalizeTags(post.tags, 5).map((t) => ({
      name: t,
      slug: t.replace(/\s+/g, "-"),
    }));
    const input = {
      title: post.title,
      subtitle: post.description.slice(0, 150),
      publicationId: env("HASHNODE_PUBLICATION_ID"),
      contentMarkdown: markdown,
      originalArticleURL: post.canonicalUrl,
      tags,
      ...(post.imageUrl ? { coverImageOptions: { coverImageURL: post.imageUrl } } : {}),
    };
    const query = draft
      ? `mutation($input: CreateDraftInput!) { createDraft(input: $input) { draft { id } } }`
      : `mutation($input: PublishPostInput!) { publishPost(input: $input) { post { id url } } }`;
    const res = await fetch(HASHNODE_GQL, {
      method: "POST",
      headers: { Authorization: env("HASHNODE_TOKEN"), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { input } }),
    });
    const json = await readJson(res, "Hashnode");
    if (Array.isArray(json.errors) && json.errors.length) {
      throw new Error(`Hashnode: ${JSON.stringify(json.errors).slice(0, 400)}`);
    }
    const data = json.data as {
      publishPost?: { post: { id: string; url: string } };
      createDraft?: { draft: { id: string } };
    };
    if (data.publishPost) return { remoteId: data.publishPost.post.id, remoteUrl: data.publishPost.post.url };
    if (data.createDraft) return { remoteId: data.createDraft.draft.id, remoteUrl: null };
    throw new Error("Hashnode returned no post");
  },
};

/* --------------------------------- Blogger -------------------------------- */
// Blogger can't set a per-post cross-domain canonical, so it gets the excerpt.
// Auth is an OAuth refresh token for the blog owner (docs/SYNDICATION.md has
// the one-time setup). The Google OAuth client must be in "In production"
// status or Google expires the refresh token after 7 days.

async function googleAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env("BLOGGER_CLIENT_ID"),
      client_secret: env("BLOGGER_CLIENT_SECRET"),
      refresh_token: env("BLOGGER_REFRESH_TOKEN"),
    }),
  });
  const json = await readJson(res, "Google OAuth");
  if (typeof json.access_token !== "string") throw new Error("Google OAuth returned no access_token");
  return json.access_token;
}

const blogger: Platform = {
  id: "blogger",
  label: "Blogger",
  mode: "excerpt",
  requiredEnv: ["BLOGGER_BLOG_ID", "BLOGGER_CLIENT_ID", "BLOGGER_CLIENT_SECRET", "BLOGGER_REFRESH_TOKEN"],
  async publish({ post, html }, { draft }) {
    const token = await googleAccessToken();
    const res = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(env("BLOGGER_BLOG_ID"))}/posts?isDraft=${draft}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "blogger#post",
          title: post.title,
          content: html,
          labels: normalizeTags(post.tags, 8),
        }),
      },
    );
    const json = await readJson(res, "Blogger");
    return { remoteId: String(json.id), remoteUrl: typeof json.url === "string" ? json.url : null };
  },
};

/* ------------------------------ WordPress.com ----------------------------- */
// Free WordPress.com sites can't set a cross-domain canonical either, so this
// is an excerpt too. WORDPRESS_SITE is the site domain or numeric id.

const wordpress: Platform = {
  id: "wordpress",
  label: "WordPress.com",
  mode: "excerpt",
  requiredEnv: ["WORDPRESS_TOKEN", "WORDPRESS_SITE"],
  async publish({ post, html }, { draft }) {
    const res = await fetch(
      `https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(env("WORDPRESS_SITE"))}/posts/new`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${env("WORDPRESS_TOKEN")}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: html,
          excerpt: post.description,
          tags: normalizeTags(post.tags, 8).join(","),
          status: draft ? "draft" : "publish",
        }),
      },
    );
    const json = await readJson(res, "WordPress.com");
    return { remoteId: String(json.ID), remoteUrl: typeof json.URL === "string" ? json.URL : null };
  },
};

export const PLATFORMS: Platform[] = [medium, hashnode, blogger, wordpress];

export function isEnabled(p: Platform): boolean {
  return p.requiredEnv.every((k) => env(k) !== "");
}
