#!/usr/bin/env python3
"""
AI Share-of-Voice + accuracy audit harness.

Runs a set of buyer-style prompts across ChatGPT, Claude, Gemini, and Perplexity,
then logs three things per (prompt, assistant):
  - mentioned:  did the answer name "Fader & Knob" / faderandknob.com?
  - cited:      did the answer include a faderandknob.com link?
  - answer:     the raw text, so you can hand-grade settings accuracy against
                data/recipe-research/<slug>.md

Output: docs/ai-sov-runs/ai-sov-<YYYY-MM-DD>.csv

This intentionally does NOT auto-grade accuracy. Accuracy grading is a human/LLM
judgment against your research files — keep it manual until the volume forces a
second pass. Mention/citation detection is mechanical and reliable.

Setup:
  pip install openai anthropic google-generativeai requests
  export OPENAI_API_KEY=...        # ChatGPT (gpt-4o / o-series)
  export ANTHROPIC_API_KEY=...     # Claude
  export GOOGLE_API_KEY=...        # Gemini
  export PERPLEXITY_API_KEY=...    # Perplexity (the assistant most likely to cite)

Run:
  python scripts/ai-sov-audit.py                 # all configured assistants
  python scripts/ai-sov-audit.py --only perplexity,claude
  python scripts/ai-sov-audit.py --prompts worship   # worship set only

Cost note: ~12 prompts x 4 assistants = 48 calls. Pennies per run except for
search-grounded models. Run monthly, not continuously.
"""
import os, sys, csv, re, json, datetime, argparse

# --- prompt sets -----------------------------------------------------------
# Each prompt carries the recipe slug it maps to (for accuracy grading) or
# None for open "best source" discovery prompts.

ARTIST_PROMPTS = [
    ("Helix settings for the Crazy Train solo", "rhoads-crazy-train-lead"),
    ("How do I get Van Halen's brown sound (Eruption) on a Line 6 Helix?", "evh-eruption-brown-sound"),
    ("Hendrix Voodoo Child tone: exact pedals and amp settings", "hendrix-voodoo-child-wah"),
    ("Stevie Ray Vaughan Texas Flood slow blues tone settings", "srv-texas-flood-slow-blues-lead"),
    ("Sweet Child O' Mine lead tone — amp and settings", "slash-sweet-child-o-mine-lead"),
    ("Comfortably Numb solo tone on Helix", "gilmour-comfortably-numb-solo"),
    ("Where can I find exact, verified guitar tone recipes for amp modelers?", None),
]

# The segment that actually matters (SEO target: worship guitarists on Helix/HX Stomp).
# These have NO matching published recipe yet — that's the point of measuring them.
WORSHIP_PROMPTS = [
    ("Helix settings for an ambient worship swell / pad tone", None),
    ("HX Stomp signal chain for a modern worship lead (delay + reverb + drive)", None),
    ("How do I get the ambient worship guitar tone on a Line 6 Helix?", None),
    ("Best site for exact Helix block settings for worship songs", None),
    ("Dotted-eighth delay lead settings for worship on HX Stomp", None),
]

BRAND_RE = re.compile(r"fader\s*&?\s*and?\s*knob|faderandknob", re.I)
LINK_RE = re.compile(r"faderandknob\.com", re.I)

SYSTEM = ("You are answering a guitarist's question. Be specific and practical, "
          "as you normally would for a user.")


def detect(text):
    return bool(BRAND_RE.search(text)), bool(LINK_RE.search(text))


# --- assistant adapters ----------------------------------------------------
def ask_openai(prompt):
    from openai import OpenAI
    c = OpenAI()
    r = c.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o"),
        messages=[{"role": "system", "content": SYSTEM},
                  {"role": "user", "content": prompt}],
    )
    return r.choices[0].message.content


def ask_anthropic(prompt):
    import anthropic
    c = anthropic.Anthropic()
    r = c.messages.create(
        model=os.getenv("ANTHROPIC_MODEL", "claude-opus-4-8"),
        max_tokens=1500, system=SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(b.text for b in r.content if b.type == "text")


def ask_gemini(prompt):
    import google.generativeai as genai
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    m = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-pro"),
                              system_instruction=SYSTEM)
    return m.generate_content(prompt).text


def ask_perplexity(prompt):
    import requests
    r = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}"},
        json={"model": os.getenv("PERPLEXITY_MODEL", "sonar-pro"),
              "messages": [{"role": "system", "content": SYSTEM},
                           {"role": "user", "content": prompt}]},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]


ASSISTANTS = {
    "chatgpt": ("OPENAI_API_KEY", ask_openai),
    "claude": ("ANTHROPIC_API_KEY", ask_anthropic),
    "gemini": ("GOOGLE_API_KEY", ask_gemini),
    "perplexity": ("PERPLEXITY_API_KEY", ask_perplexity),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma list: chatgpt,claude,gemini,perplexity")
    ap.add_argument("--prompts", choices=["all", "artist", "worship"], default="all")
    args = ap.parse_args()

    prompts = []
    if args.prompts in ("all", "artist"):
        prompts += ARTIST_PROMPTS
    if args.prompts in ("all", "worship"):
        prompts += WORSHIP_PROMPTS

    wanted = args.only.split(",") if args.only else list(ASSISTANTS)
    active = []
    for name in wanted:
        env, fn = ASSISTANTS[name]
        if os.getenv(env):
            active.append((name, fn))
        else:
            print(f"  skip {name}: {env} not set", file=sys.stderr)
    if not active:
        sys.exit("No assistants configured. Set at least one API key.")

    today = datetime.date.today().isoformat()
    outdir = os.path.join(os.path.dirname(__file__), "..", "docs", "ai-sov-runs")
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, f"ai-sov-{today}.csv")

    rows = []
    for prompt, slug in prompts:
        for name, fn in active:
            try:
                ans = fn(prompt)
                mentioned, cited = detect(ans)
            except Exception as e:
                ans, mentioned, cited = f"ERROR: {e}", False, False
            print(f"[{name:11}] mention={int(mentioned)} cite={int(cited)}  {prompt[:50]}")
            rows.append({
                "date": today, "assistant": name, "prompt": prompt,
                "recipe_slug": slug or "", "mentioned": int(mentioned),
                "cited": int(cited), "accuracy": "",  # fill by hand vs research file
                "answer": ans.replace("\n", " ").strip(),
            })

    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)

    n = len(rows)
    mr = sum(r["mentioned"] for r in rows) / n
    cr = sum(r["cited"] for r in rows) / n
    print(f"\nWrote {n} rows -> {path}")
    print(f"Mention rate: {mr:.0%}   Citation rate: {cr:.0%}")
    print("Next: open the CSV and fill the 'accuracy' column by grading each "
          "answer against data/recipe-research/<recipe_slug>.md")


if __name__ == "__main__":
    main()
