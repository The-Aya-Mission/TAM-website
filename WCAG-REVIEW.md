# theayamission.org — WCAG 2.1 AA Compliance Review
**July 15, 2026 · axe-core scan (16 pages, A/AA ruleset) + manual contrast & keyboard audit**

> **STATUS: ALL FIXES APPLIED & DEPLOYED.** Re-scan result: 16/16 pages clean on desktop and mobile (axe-core, WCAG 2.1 A/AA). Applied: `--gold-link #7a5f1f` for links/roles/spots on paper, visually-hidden (focusable) nav checkbox with focus ring + aria-label, underlined inline links, computable panel backgrounds, and `tabindex`/`role`/`aria-label` on scrollable card rows. Findings below preserved for the record.

## Real failures (must fix for AA)

### 1. Link color on paper fails contrast — 1.4.3 (AA)
Global link color is `--gold-dark` `#a8842f`, which measures **3.20:1** against the paper background — AA requires 4.5:1 for body text. This affects every inline link inside torn panels and cards (privacy policy body, impact page research links, FAQ email link, etc.).
**Fix:** darken links on light backgrounds to `#7a5f1f` (**5.53:1** — passes, and is the exact "accessible gold on light" the app already uses per the handoff doc). Same change needed for `.app-spots` (spots-left labels on event cards, same 3.20:1).

### 2. Mobile menu is keyboard-inaccessible — 2.1.1 (A)
The hamburger uses a CSS checkbox hack, and `#nav-toggle` is `display:none` — it can never receive keyboard focus, so below 1080px a keyboard-only user cannot open the navigation at all.
**Fix:** hide the checkbox with a visually-hidden technique (clip/position) instead of `display:none`, and show a focus ring on the ☰ label via `#nav-toggle:focus-visible + .nav-toggle-btn`.

### 3. Links distinguishable only by color — 1.4.1 (A)
Flagged 16× (once per page): the Privacy Policy link in the footer fine print, plus inline text links generally, have no underline — color is the only cue, and the color difference from surrounding text is below the 3:1 threshold.
**Fix:** underline inline links inside paragraphs and the footer fine print (standalone buttons/nav links are exempt — they're fine as-is).

## False positives (worth silencing anyway)

### 4. 198 "color-contrast" flags on panel text
Nearly all flagged text is dark ink on white paper — actual contrast ~11:1. Axe flags it because the paper is a `border-image` fill, so the computed background is the dark green page and the tool can't verify. Not a user-facing problem, but it buries real issues in every future scan.
**Fix (invisible):** add `background-color: var(--paper); background-clip: padding-box` to `.torn` and `.card`. Tools then compute correctly, and text stays readable if the texture image ever fails to load. `padding-box` clipping keeps the color from leaking behind the transparent torn edges.

## Passing (verified)

- Contrast everywhere else: text on green 12:1, gold headings on green 7.4:1, tape headline ink 9.7:1, footer 8.6–12:1, fine print on paper 4.84:1 — all pass
- One H1 per page, logical h1→h2→h3→h4 order
- Skip-to-content link, `:focus-visible` outlines, `aria-label` on hamburger
- Distinct alt text on all images; `lang="en"`; titled iframes (Zeffy, Monday)
- FAQ accordions are native `<details>/<summary>` — keyboard and screen-reader friendly
- Desktop dropdowns open on `:focus-within` (keyboard works)
- No motion/animation (nothing for prefers-reduced-motion to disable)
- Text zoom to 200% reflows without loss

## Notes (best practice, not AA failures)

- No `<main>` landmark element — `id="main"` sits on a section. Wrapping page content in `<main>` (or `role="main"`) would help screen-reader navigation.
- Swipe rows/carousels: all cards remain reachable by Tab (links pull them into view), but adding `tabindex="0"` + `aria-label` to scroll containers would let keyboard users scroll them directly.
- The crisis banner is first in DOM after the skip link — good; consider `role="note"` or an aria-label naming it.

**Bottom line:** three genuine AA failures (link contrast, mobile menu keyboard access, link underlines) + one scan-hygiene fix. All four are CSS-only, no visual redesign required — the link gold gets slightly deeper on paper, everything else is invisible.
