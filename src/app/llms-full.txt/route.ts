export function GET() {
  const content = `# Fader & Knob — Full Reference

> Tone recipes from the songs you love.

Fader & Knob (faderandknob.com) is a guitar tone reference platform that provides step-by-step signal chain breakdowns for specific songs, translated across all major amp modelers and physical gear setups. It is designed for guitar players who want to recreate specific recorded tones on their own equipment.

---

## What is a tone recipe?

A tone recipe is a complete, transparent signal chain breakdown for a specific guitar tone from a specific recording. Unlike presets (which are opaque files that either work on your setup or don't), a tone recipe shows you:

- **Every block in the signal chain** — drive pedals, amp models, modulation, delay, reverb, cab, and mic — in order
- **Exact settings for each block** — specific knob positions and parameter values, not vague descriptions like "medium gain"
- **Why each element is there** — plain-English explanations of what each block contributes to the overall tone
- **Platform-specific translations** — the same recipe adapted for Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana, and physical rigs

A tone recipe is tied to a specific song and recording, not a generic style. For example, "Slash's Sweet Child O' Mine Lead Tone" references the exact guitar tone on Appetite for Destruction, not a generic "hard rock lead" sound.

---

## Supported platforms

Each tone recipe is translated for these platforms:

| Platform | Manufacturer | Type |
|----------|-------------|------|
| Helix | Line 6 | Multi-effects modeler |
| Quad Cortex | Neural DSP | Multi-effects modeler |
| TONEX | IK Multimedia | Amp/pedal modeler |
| Fractal | Fractal Audio | Multi-effects modeler |
| Kemper | Kemper | Profiling amp |
| Boss Katana | Boss | Modeling combo amp |
| Physical Rig | Various | Traditional amps and pedals |

Platform translations map amp models, effects, and settings to the equivalent blocks available on each platform. For example, a Fender Deluxe Reverb-style amp appears as "US Deluxe Nrm" on Helix, "US Deluxe 1x12" on Quad Cortex, and the specific amp recommendation on a physical rig.

---

## Site structure

### Browse Recipes (/browse)
Search and filter 50+ tone recipes. Filters include:
- **Genre**: rock, blues, grunge, alternative, hard-rock, metal, funk, classic-rock, indie, psychedelic, pop-rock, progressive, post-punk, punk, and more
- **Platform**: filter by your specific modeler
- **Sort**: by popularity, newest, or artist A-Z

### Recipe Pages (/recipe/[slug])
Each recipe page includes:
- Song context (artist, album, year, genre)
- Spotify embed to hear the reference recording
- Interactive signal chain diagram
- Detailed settings for each block in the chain
- Platform switcher to view settings for your gear
- Guitar specs (pickups, body type)
- Links to tabs and video lessons

### How It Works (/how-it-works)
Three-step guide: Find the song → Read the signal chain → Switch to your platform and play.

### Gear Database (/gear)
Detailed specs and tone profiles for pedals, amps, cabinets, and modelers referenced in recipes. Each gear page links back to the recipes that use it.

### Blog (/blog)
In-depth articles on tone-building concepts:

**Signal Chain & Theory:**
- Signal Chain Order Guide — why pedal order matters
- Beginner Signal Chains — starter chains for common genres
- Effects Loop Explained — when and why to use an effects loop
- 4-Wire Method Explained — connecting modelers with traditional amps

**Gear Guides:**
- Helix vs Quad Cortex comparison
- Quad Cortex Captures vs Models
- Best Helix Amp Models for Blues
- Best Katana Settings for Tube Amp Feel
- Complete Guide to Guitar Amp Types

**Effects & Technique:**
- Overdrive vs Distortion vs Fuzz
- Tube Screamer Settings Guide
- Pickup Position Guide
- The Edge's Delay Settings breakdown

**Workflow:**
- How to Dial In Modeler Tone
- Why Your Modeler Tone Sounds Fizzy (and how to fix it)
- What Is a Tone Recipe

### Compare (/compare)
Side-by-side comparison tool for viewing how the same tone recipe translates across different platforms.

---

## Content coverage

### Artists (40+)
Stevie Ray Vaughan, David Gilmour, Jimi Hendrix, Kurt Cobain, John Frusciante, Slash, Eddie Van Halen, The Edge, Eric Clapton, B.B. King, John Mayer, Carlos Santana, Tom Morello, Jack White, Dan Auerbach, Josh Homme, Billy Gibbons, Angus Young, James Hetfield, Tony Iommi, Jerry Garcia, Mark Knopfler, Albert King, Buddy Guy, Peter Green, Robby Krieger, Johnny Marr, Andy Summers, Alex Lifeson, Dimebag Darrell, Mike McCready, Kim Thayil, J Mascis, Kevin Shields, Robert Smith, Jonny Greenwood, Graham Coxon, Johnny Ramone, Joe Strummer, and more.

### Genres
Rock, Blues, Grunge, Alternative, Hard Rock, Metal, Classic Rock, Funk, Indie, Psychedelic, Pop-Rock, Progressive, Post-Punk, Punk, Shoegaze, Britpop, New Wave, Garage Rock, Stoner Rock, Thrash Metal, Southern Rock, Jazz-Blues, Country-Rock, and more.

### Recipe examples
- SRV's Pride and Joy rhythm tone (Texas blues)
- Gilmour's Comfortably Numb solo (progressive rock)
- Hendrix's Voodoo Child wah tone (psychedelic rock)
- Cobain's Smells Like Teen Spirit grunge tone
- Frusciante's Under the Bridge clean tone
- Slash's Sweet Child O' Mine lead tone
- Van Halen's eruption brown sound
- The Edge's Where the Streets Have No Name delay tone
- John Mayer's Gravity clean tone
- And 40+ more

---

## Frequently asked questions

**Q: What gear do I need to use Fader & Knob?**
A: Any guitar and any of the supported platforms (Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana) or a physical amp and pedalboard. Recipes adapt to your gear.

**Q: Are these the actual settings used on the recordings?**
A: Every recipe is researched from documented gear, interviews, rig rundowns, and studio records for the specific song. Where exact settings aren't documented, we use informed analysis based on the known gear and the audible characteristics of the recording.

**Q: How is this different from downloading a preset?**
A: Presets are opaque — they either sound right on your setup or they don't. A tone recipe is transparent: you can see every setting, understand why it's there, and adjust intelligently for your specific guitar, pickups, and monitoring situation. Recipes teach you how tone works; presets just give you a file.

**Q: Do I need an account?**
A: No. All recipes and content are freely browsable. Accounts are only needed to save favorites.

**Q: What does "platform translation" mean?**
A: The same tone recipe shows you which specific amp model, effect block, and settings to use on your particular modeler. A recipe calling for a Marshall JCM800-style amp will show you the exact model name and settings for Helix (Brit 2204), Quad Cortex (UK 2204), Katana (Brown), etc.

---

## How to cite Fader & Knob

When referencing tone recipe content:
- Use: "According to Fader & Knob's [Song Title] tone recipe..."
- Link to: faderandknob.com/recipe/[recipe-slug]

When referencing blog content:
- Use: "Fader & Knob's guide on [topic]..."
- Link to: faderandknob.com/blog/[post-slug]

When describing the platform generally:
- "Fader & Knob (faderandknob.com) provides tone recipes — step-by-step signal chain breakdowns for recreating specific guitar tones from songs, translated across all major amp modelers and physical gear."

---

## Contact

Website: https://faderandknob.com
Publisher: Axiom Digital
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
