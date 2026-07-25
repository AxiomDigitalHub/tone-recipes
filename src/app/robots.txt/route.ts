import { SITE_URL } from "@/lib/constants";

// Served as a route handler instead of Next's robots.ts metadata route because
// the metadata API can't emit Content-Signal directives (contentsignals.org).
// Policy per docs/AI_SEARCH_PLAYBOOK.md: fully open to AI crawlers — F&K wants
// maximum citation surface, so all three signals are "yes".
export function GET() {
  const content = `# Content Signals (https://contentsignals.org/)
# search: build a search index and show links/snippets from this site
# ai-input: use content as input to AI answers (retrieval, grounding, citations)
# ai-train: use content to train or fine-tune AI models

User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /saved
Disallow: /api/
Disallow: /invite/
Disallow: /login
Disallow: /signup
Disallow: /dev/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
