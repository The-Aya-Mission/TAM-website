# The Aya Mission — Design Specification (Locked)
**Version 1.1 · July 2026 · Source of truth: `css/style.css` in the TAM-website repo**

> v1.1 changes: tape headlines are real `<h1>`/`<h2>` elements; mobile viewability pass (left-aligned body text, swipe rows, tighter rhythm, paper margins + tiled side tears); accessibility additions (skip link, focus outlines); operations-app integration layer (`js/app.js`, `js/analytics.js`); SEO infrastructure (sitemap, robots, smart 404).

This document locks the visual system used on theayamission.org so it can be reproduced on other internal sites. Where exact values are given, use them exactly. Where assets are referenced, copy them from `/assets/` — do not recreate them.

---

## 1. Brand Colors

Defined as CSS custom properties on `:root`:

| Token | Hex | Use |
|---|---|---|
| `--green-deep` | `#0e1f15` | Darkest green — footer, dark buttons, nav dropdown panels |
| `--green` | `#16301f` | Base background green (fallback under the canvas texture) |
| `--green-mid` | `#1d3a28` | Reserved mid-tone accent |
| `--gold` | `#d9b777` | Primary accent — tape, headlines-on-tape, nav highlights (sampled from the pitch deck tape) |
| `--gold-soft` | `#e6cd9b` | Tape hover state |
| `--gold-dark` | `#a8842f` | Link color on paper, small accents |
| `--paper` | `#f7f5ee` | Paper white (fallback under the paper texture) |
| `--ink` | `#14140f` | Primary text on paper |
| `--ink-soft` | `#2e2e26` | Body text on paper |
| Text on green | `#f2f0e6` | Off-white body text over the green canvas |
| Footer text | `#ddd8c9` | Footer body; fine print `#bcb8aa` |
| Fine print on paper | `#6f6c5d` / `#5a5748` | Small captions |

**Rule:** never place pure black text on green, and never use flat hex backgrounds where a texture asset exists (see §3).

## 2. Typography

Google Fonts load: `Marcellus` (400) and `Quicksand` (500, 600, 700).

| Role | Font | Size | Notes |
|---|---|---|---|
| Base body | Quicksand 500 | 18px, line-height 1.75 | Never lighter than 500 — 400 is too thin on texture |
| H1 (hero) | Marcellus | clamp(2.6rem, 7vw, 4.6rem) | Uppercase, letter-spacing .06em, key word in `--gold` via `<em>` |
| Tape headline (large) | Marcellus | clamp(1.4rem, 3.2vw, 2.2rem) | Uppercase, .08em tracking, on `tape-wide.svg` |
| Tape headline (small) | Marcellus | clamp(1.1rem, 1.8vw, 1.45rem) | .1em tracking, on `tape-small.svg` |
| Card / panel H3 | Marcellus | 1.3rem | .04em tracking |
| Lead paragraph (`.lead`) | Quicksand 500 | clamp(1.2rem, 2vw, 1.5rem), lh 1.65 | The one big statement per panel; color `--ink` |
| Body on paper | Quicksand 500 | 1.0–1.05rem | Color `--ink-soft`, max-width 72ch |
| Fine print (`.fine`) | Quicksand 500 | .95rem | Methodology notes, disclaimers |
| Nav links | Quicksand 600 | .82rem | Uppercase, .05em tracking |
| Buttons | Quicksand 700 | .9rem (.76 in carousels) | Uppercase, .08em tracking |

**Hierarchy rule per paper panel:** one tape headline → one `.lead` → body → `.fine`. Last child inside a panel has `margin-bottom: 0`.

## 3. Texture Assets (copy, don't recreate)

All extracted from the original pitch-deck SVG exports.

| File | What it is | How it's used |
|---|---|---|
| `bg-green.jpg` (2000w) | Green canvas photo texture with vignette | Desktop background, `position:fixed` pseudo-element, `cover` |
| `bg-green-tile.jpg` (960px, seamless) | Tone-matched seamless tile of the same canvas | Mobile background at `background-size: 480px`, repeated, plus a radial vignette overlay — never stretch the full photo on phones |
| `paper-torn.webp` (1000×1310) | Real torn-paper scan, RGBA, torn on all 4 edges | `border-image` source for all paper panels/cards |
| `paper-torn-2.webp` / `paper-torn-3.webp` | Mirrored / 180°-rotated variants | Alternate tears so adjacent papers never match |
| `tape-wide.svg` / `tape-small.svg` | Gold tape brush shapes (vector, `#d9b777`) | Headlines, buttons, tape chips; stretch `100% 100%` |
| `tape-wide-flip.svg` / `tape-small-flip.svg` | Mirrored tapes | Alternate per section |
| `tape-dark.svg` | Tape recolored `--green-deep` | Dark buttons on paper |
| `tape-small-hover.svg` | Tape recolored `--gold-soft` | Hover state |
| `soldier-radio.svg`, `soldier-salute.svg`, `soldier-kneel.svg`, `memorial-cross.svg` | Soldier silhouettes (black + tan offset) | Flanking stat bands (desktop only), footer watermark at 14% opacity |
| `logo.png` / `logo-small.png` | Full logo / nav mark | Nav mark sits on a `--paper` rounded chip (8px radius, 3px padding) because the silhouette vanishes on dark green |

**Background formula (desktop):** fixed pseudo-element (`body::before`, `position:fixed; inset:0; z-index:-1`) with `bg-green.jpg` center/cover. Never `background-attachment: fixed` (breaks/blurs on iOS).

## 4. Signature Components

### 4.1 Torn paper panel (`.torn`)
```css
max-width: 1000px; margin-inline: auto;
border-style: solid;
border-width: 58px 32px;
border-image: url(paper-torn.webp) 160 110 160 70 fill / 58px 38px 58px 28px stretch;
filter: drop-shadow(0 6px 22px rgba(0,0,0,.45));
```
Inner container `.torn-inner`: max-width 1100px, padding 48px 34px.
Mobile (≤700px): border-width `34px 13px`, border-image-width `34px 17px 34px 12px`, inner padding `20px 10px`.

### 4.2 Note card (`.card`)
Same border-image technique, smaller: border-width `42px 24px`, image-width `42px 28px 42px 21px`, drop-shadow `0 5px 16px rgba(0,0,0,.4)`.
A tape chip is pinned over the top edge via `::before`: 230×72px, `top: -84px`, centered, rotated −2°, `drop-shadow(0 3px 5px rgba(0,0,0,.35))`. **Most of the tape must sit above the paper edge** — it's holding the note to the wall.
Mobile: border `32px 15px`, chip `top: -64px`.

### 4.3 Hand-done variety (mandatory)
No two adjacent papers or tapes may look identical:
- Cards cycle paper sources: `nth-child(3n+2)` → `paper-torn-2.webp` rotate .6°; `nth-child(3n)` → `paper-torn-3.webp` rotate −.5°; `3n+1` rotate .3°.
- Tape chips vary width (178–256px), height (60–72px), tilt (±2°), and direction (`scaleX(-1)` on some).
- Section tape headlines alternate direction per section: `section:nth-of-type(even)` swaps to the `-flip` tape with mirrored padding and opposite tilt.

### 4.4 Tape headline (`.tape`)
`display: inline-flex; align-items: center; justify-content: center;` so text centers on the tape body. Asymmetric padding reserves room for the ragged pointed end: `.5em 2em .5em 1.35em` (mirrored on flipped variants). Background stretches `100% 100%`; `drop-shadow(0 3px 12px rgba(0,0,0,.35))`; tilt ±.5–.6°.

**Markup rule (v1.1):** tape headlines are semantic headings, not spans — exactly one `<h1 class="tape">` per page (the page title), all other tapes are `<h2>`. Reset heading defaults with `h1.tape, h2.tape { margin: 0; font-weight: 400 }`.

### 4.5 Buttons
Three types, all uppercase Quicksand 700, padding 15px 32px, hover `translateY(-2px)`:
- **Gold** — `tape-small.svg` background, `--green-deep` text; hover swaps to `tape-small-hover.svg`.
- **Dark** — `tape-dark.svg` background, `--paper` text. Use on paper.
- **Line** — 2px `--gold` border, transparent, `--gold` text. Secondary action on green.

### 4.6 Taped photo (`.photo-taped`)
White border frame (10px padding, 14px bottom), `box-shadow: 0 8px 24px rgba(0,0,0,.45)`, tilt ±1.2–1.4° alternating, tape chip over top edge (150×42 base, varied per nth-child). Gallery grid: `repeat(auto-fill, minmax(240px, 1fr))`, gap 26px, images `aspect-ratio: 4/3; object-fit: cover`.

### 4.7 Tape link grid (`.tape-links`)
Navigation-as-tape: gold tape strips with Marcellus 1.15rem labels, alternating ±.8° tilt and flipped ends, grid `minmax(240px, 1fr)`. Use instead of link boxes/tiles.

### 4.8 Stat band
Full-width green section, Marcellus number/statement in `--gold` at clamp(2rem, 5.5vw, 3.4rem), supporting text `#f2f0e6` max-width 780px. Desktop ≥1100px: soldier silhouettes flank it (200px wide, bottom-anchored, 90% height, opacity .9). Hidden below 1100px.

### 4.9 Horizontal carousel (`.carousel`)
Flex scroller: `overflow-x: auto; scroll-snap-type: x mandatory;` cards `flex: 0 0 min(270px, 72vw); scroll-snap-align: center;` with slimmer borders (28px 16px). Padding-top 62px so tape chips aren't clipped. Thin gold scrollbar (`scrollbar-color: var(--gold) rgba(0,0,0,.25)`). Always add a "swipe/scroll →" hint line under the headline.

### 4.10 FAQ accordion (`.faq-item`)
Native `<details>/<summary>` inside a torn panel. Summary: Marcellus 1.15rem, 18px vertical padding, `+`/`–` indicator in `--gold-dark` (swap via `[open]`), 1px `#d8d3c2` bottom rule.

## 5. Header & Footer

**Header:** sticky (desktop only), frosted glass — `linear-gradient(180deg, rgba(8,18,12,.78), rgba(8,18,12,.38))` + `backdrop-filter: blur(14px)`, 1px gold-tinted bottom border. Layout: brand | nav (flex, margin-left auto) | gold tape "Be the Bridge" button. Dropdowns: `--green-deep` panels, gold-tinted border, shown on `:hover`/`:focus-within`.

**Mobile header (≤1080px):** `position: static` (scrolls away). Only logo + Be the Bridge + ☰ hamburger visible. Menu is a CSS checkbox toggle (`#nav-toggle:checked ~ nav.main`); groups flatten with gold group labels and indented sublinks.

**Footer:** `--green-deep`, 4 columns `minmax(240px, 1fr)` (org blurb + EIN, Explore links, Connect links, Crisis support), gold Marcellus column headers, `soldier-kneel.svg` watermark bottom-right at 14% opacity, centered fine-print bar.

**Crisis banner:** always the first element on every page — gold bar, dark text: Veterans Crisis Line 988 (press 1) / text 838255.

## 6. Layout System

| Token | Value |
|---|---|
| Content max-width | 1100px (`--max`); nav bar 1320px; paper panels 1000px |
| Section padding | 70px 0 (`section.band`); 44px 0 on mobile |
| Wrap gutter | 24px (14px ≤700px) |
| Grid | `repeat(auto-fit, minmax(260–320px, 1fr))`, gap 26px (44px 20px mobile — extra row gap for tape chips) |
| Breakpoints | ≤1080px hamburger nav · ≤900px tiled mobile background · ≤700px mobile comfort pass (below) |

**Section rhythm:** alternate paper panels and open-green sections. Never stack two identical treatments without a header; every card grid on green gets its own tape headline.

**Mobile pass (≤700px, v1.1):**
- Body paragraphs left-align (`.torn-inner p, .card p, .section-head p, .hero p, footer .cols p`); tape headlines, `p.center`, and the stat band stay centered.
- Rhythm tightens: `section.band` 34px 0, grid gap 34px 18px, buttons 12px 22px / .82rem.
- Paper: `.torn` gets `margin-inline: 14px` (panels must never run edge-to-edge), border-width 30px 17px, image-width 30/20/30/16. Cards: 28px 17px, image-width 28/20/28/15, chip `top: -58px`.
- **Side tears tile, never stretch:** `border-image-repeat: stretch round` on `.torn`, `.card`, and `.logo-panel`. Stretched side slices smear; `round` tiles natural tear bumps down tall panels.
- Card grids that would stack 3+ deep become swipe rows: add class `m-carousel` → mobile-only `display:flex; overflow-x:auto; scroll-snap-type:x mandatory`, cards `flex: 0 0 76vw`, container `padding-top: 70px` for tape chips. Desktop grid unchanged.
- Footer link columns go two-up; the org blurb and crisis column span full width (`grid-column: 1 / -1`).

## 7. Interaction & Motion

Minimal: buttons/tape-links lift 2px on hover; nav links recolor to `--gold`; dropdowns appear instantly; carousel snaps. No scroll animations, parallax, or fades — the hand-made aesthetic stays still, like a real wall.

## 8. Voice & Content Rules (for parity)

- Headlines on tape are short (2–6 words), uppercase via CSS, never typed in caps.
- One `.lead` statement per panel; stats bold inline (`64% to 0%`).
- Compliance line wherever ceremonies are mentioned: *"TAM provides preparation and integration support. Sacramental ceremonies are conducted by independent religious organizations."*
- Every page ends with a green CTA section (h2 ~1.7rem + one gold button) before the footer.

## 8b. Accessibility & Integration Layer (v1.1)

- Every page: `<a class="skip" href="#main">Skip to content</a>` first in `<body>`; first section after the header carries `id="main"`. Skip link is visually hidden until keyboard focus.
- Focus visibility: `a, .btn, summary, .nav-toggle-btn` get a 3px gold `:focus-visible` outline, offset 2px. Hamburger label carries `aria-label="Open menu"`.
- Images: every image needs distinct, descriptive alt text — no repeated generic alts across a gallery.
- `js/app.js`: single `APP_BASE` constant for the operations app (`apply.theayamission.org`); links carry both a hard `href` and `data-app-href` (rewritten on load); live widgets target `#app-events` / `#app-opportunities` and filter placeholder values (TBD/TBA/N/A). `js/analytics.js`: GA4 with custom click events (donate, app outbound, newsletter, merch).
- SEO plumbing: one H1 per page, `sitemap.xml` + `robots.txt` at root, and a `404.html` that JS-redirects known legacy paths.

## 9. Implementation Notes

- The whole system is one stylesheet (`css/style.css`, ~560 lines) + the `/assets/` folder. Copy both to bootstrap a new site; page templates are plain HTML.
- Tears and tape are **real deck assets** via `border-image` and stretched SVG backgrounds — no CSS filters or clip-paths remain in the live system. Do not substitute synthetic torn edges.
- `border-image` slice values (`160 110 160 70`) are tuned to this exact `paper-torn.webp`; if you regenerate the paper, re-measure tear depths before slicing.
- Repo: `github.com/The-Aya-Mission/TAM-website` — treat `css/style.css` there as the canonical version of this spec.
