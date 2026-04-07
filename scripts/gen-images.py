#!/usr/bin/env python3
"""Generate AI blog images using Replicate Flux 1.1 Pro.

Usage: REPLICATE_API_TOKEN=r8_xxx python3 scripts/gen-images.py

Reads prompts from scripts/image-prompts.json.
Saves images to public/images/blog/{slug}.webp.
Does NOT touch frontmatter — run update-frontmatter.py after.
"""

import json, os, time, urllib.request, sys

TOKEN = os.environ.get("REPLICATE_API_TOKEN", "")
if not TOKEN:
    print("Set REPLICATE_API_TOKEN env var")
    sys.exit(1)

OUTDIR = "public/images/blog"
os.makedirs(OUTDIR, exist_ok=True)

# Load prompts
with open("scripts/image-prompts.json") as f:
    data = json.load(f)

STYLE = data["_style"]
PROMPTS = data["prompts"]
DEFAULT = "Professional photograph of guitar effects pedals on a pedalboard in a recording studio"


def api_post(url, body):
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    return json.loads(urllib.request.urlopen(req).read())


def api_get(url):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    return json.loads(urllib.request.urlopen(req).read())


def generate(slug):
    outfile = os.path.join(OUTDIR, f"{slug}.webp")
    if os.path.exists(outfile):
        print(f"[skip] {slug}")
        return "skip"

    prompt = PROMPTS.get(slug, DEFAULT)
    full = f"{prompt}, {STYLE}"
    print(f"[gen] {slug}")
    print(f"  {prompt[:80]}...")

    try:
        resp = api_post("https://api.replicate.com/v1/predictions", {
            "version": "black-forest-labs/flux-1.1-pro",
            "input": {"prompt": full, "aspect_ratio": "16:9"},
        })
        pid = resp.get("id")
        if not pid:
            print(f"  ERROR: {resp.get('detail', 'no id')}")
            return "fail"
    except Exception as e:
        print(f"  ERROR starting: {e}")
        return "fail"

    for _ in range(40):
        time.sleep(3)
        try:
            status = api_get(f"https://api.replicate.com/v1/predictions/{pid}")
        except Exception as e:
            print(f"  Poll error: {e}")
            return "fail"

        if status["status"] == "succeeded":
            url = status["output"]
            urllib.request.urlretrieve(url, outfile)
            kb = os.path.getsize(outfile) // 1024
            print(f"  OK ({kb}KB)")
            return "ok"
        if status["status"] == "failed":
            print(f"  FAILED: {status.get('error', '?')}")
            return "fail"

    print("  TIMEOUT")
    return "fail"


# Run
blog_dir = "content/blog"
slugs = sorted(s.replace(".mdx", "") for s in os.listdir(blog_dir) if s.endswith(".mdx"))
print(f"{len(slugs)} blog posts, {len(PROMPTS)} custom prompts\n")

counts = {"ok": 0, "skip": 0, "fail": 0}
for slug in slugs:
    result = generate(slug)
    counts[result] += 1

print(f"\nDone! OK: {counts['ok']}, Skip: {counts['skip']}, Fail: {counts['fail']}")
print(f"Total images: {len([f for f in os.listdir(OUTDIR) if f.endswith('.webp')])}")
