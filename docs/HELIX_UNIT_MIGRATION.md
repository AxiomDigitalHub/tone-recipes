# Helix effect-block unit migration

Fixes unit inconsistencies confirmed against the Line 6 Helix 3.80 Owner's Manual (pp. 32–33). Only normalized (≤1) values were converted; values already in the target unit were left as-is.

- **Total values changed:** 0

| Param | Unit | Conversion | Values changed |
|---|---|---|---|

## Deliberately NOT changed

- **Speed** (Modulation): `0.3–6` are valid **Hz** (manual p32) — correct.
- **Depth / Rate** (Modulation): ambiguous scale (% vs Hz vs 0–10) — needs a human ear, not auto-scaled.
- **EQ gains**: manual did not pin the dB scale; values left untouched.
- **Decay** (seconds), **Level** (0.0 dB), **Cab Position/Angle** (0–1): correct as-is.

