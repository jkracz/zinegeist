---
name: Zinegeist
description: A small-press publishing home for independent writers — editorial warmth, paper texture, shelf-shaped discovery.
colors:
  warm-newsprint: "oklch(0.9529 0.0146 102.4597)"
  aged-paper: "oklch(0.918 0.022 80)"
  foxed-edge: "oklch(0.88 0.026 70)"
  soft-page: "oklch(0.8902 0.0289 49.0874)"
  tea-stain-beige: "oklch(0.8502 0.0389 49.0874)"
  linen-sand: "oklch(0.7473 0.0387 80.5476)"
  mocha-stamp: "oklch(0.6083 0.0623 44.3588)"
  faded-ink: "oklch(0.4063 0.0255 40.3627)"
  pressed-ink: "oklch(0.2721 0.0141 48.1783)"
  weathered-clay: "oklch(0.7272 0.0539 52.332)"
  oxidized-rust: "oklch(0.644 0.0405 52.3917)"
  paper-popover: "oklch(1 0 0)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(48px, 6.2vw, 96px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  ui:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "JetBrains Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  sm: "2px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  page-x: "48px"
components:
  button-primary:
    backgroundColor: "{colors.pressed-ink}"
    textColor: "{colors.warm-newsprint}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
    typography: "{typography.ui}"
  button-primary-hover:
    backgroundColor: "{colors.pressed-ink}"
    textColor: "{colors.warm-newsprint}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
    typography: "{typography.ui}"
  button-outline-hover:
    backgroundColor: "{colors.pressed-ink}"
    textColor: "{colors.warm-newsprint}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
    typography: "{typography.ui}"
  card-zine:
    backgroundColor: "{colors.soft-page}"
    rounded: "{rounded.sm}"
    padding: "0"
  input-search:
    backgroundColor: "{colors.aged-paper}"
    textColor: "{colors.faded-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    typography: "{typography.eyebrow}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.faded-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    typography: "{typography.ui}"
  nav-link-active:
    backgroundColor: "{colors.pressed-ink}"
    textColor: "{colors.warm-newsprint}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  eyebrow-label:
    backgroundColor: "transparent"
    textColor: "{colors.faded-ink}"
    typography: "{typography.eyebrow}"
  kbd-pill:
    backgroundColor: "{colors.aged-paper}"
    textColor: "{colors.faded-ink}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    typography: "{typography.eyebrow}"
---

# Design System: Zinegeist

## 1. Overview

**Creative North Star: "The Open Shelf"**

Zinegeist is the visual feel of walking into a small independent bookshop on a slow afternoon — warm paper, considered type, the quiet authority of things that were made, not generated. The system is built around the act of reading: serif type does the heavy lifting, mono carries the labels and metadata, sans handles only the interactive chrome. Surfaces are tinted neutrals on the Mocha Mouse axis (warm beige to pressed-ink brown), never neutral grey, never pure white. A persistent paper-grain overlay sits across every page, multiplied into the warm tones so the screen has the soft tactile noise of newsprint.

This is a **brand register** at heart — discovery, reading, and publication pages are the product, and the editor / dashboard surfaces extend that voice rather than impose a generic SaaS shell on top of it. Density is generous: large gutters, breathing whitespace, and `--page-x` of 48px on either side of every section. The primary accent (Mocha Stamp) is rare on purpose — it appears as italic emphasis inside serif headlines and as ring/focus tone, almost never as a button fill or block surface. Buttons commit instead to pressed-ink (near-black, but warm) so the marketing voice and the product voice stay in the same hand.

The system explicitly rejects three things: the **generic-tooling-as-publishing-surface** look (Notion, Drive, document chrome with writing inside it), the **personal-site-builder template** look (Squarespace/Wix/Carrd hero-grid-cards-CTA), and the **algorithmic-feed dashboard** look (engagement counts, follower counters, growth-hacker chrome). What's left is a CMS that feels like a publication.

**Key Characteristics:**
- Paper-grain texture across every surface (never decorative-only — it's structural to the feel)
- Serif-first hierarchy (Fraunces) with mono labels (JetBrains Mono) and minimal sans (DM Sans)
- Warm tinted neutrals exclusively — no `#fff`, no `#000`, no neutral grey
- Editorial 12-column grid with intentional column-span variation (no uniform card walls)
- Italic serif as the only emphasis device — never gradient text, never colored highlight blocks
- Pressed-ink buttons with offset paper-shadow (2px down, 0 blur) — printed-press feel, never glassy

## 2. Colors: The Mocha Mouse Palette

A palette built end-to-end on the Mocha Mouse hue axis (warm browns 40–80°). Every neutral is tinted toward the brand hue at low chroma (≤0.03) — there is no untinted grey anywhere in the system. Lightness moves freely from 95% (newsprint) to 27% (pressed ink), but chroma stays restrained. The result reads as "paper" rather than "background".

### Primary
- **Mocha Stamp** (`oklch(0.6083 0.0623 44.3588)`): The single brand accent. Used for italic emphasis inside serif headlines (`<em>` set in `text-primary italic`), focus rings, and chart accents. Almost never appears as a button fill or block surface — its rarity is the point.

### Secondary
- **Linen Sand** (`oklch(0.7473 0.0387 80.5476)`): Warm-yellow biased neutral used for input strokes and the secondary accent strip in editorial layouts. The Mocha Stamp's quieter sibling.

### Tertiary
- **Tea-Stain Beige** (`oklch(0.8502 0.0389 49.0874)`): The hover-fill tone for ghost buttons and nav links — what a pencil-shadow looks like on warm paper.
- **Weathered Clay** (`oklch(0.7272 0.0539 52.332)`): Chart and sidebar accent, dark-mode primary. Appears at low frequency.

### Neutral (the paper stack)
- **Warm Newsprint** (`oklch(0.9529 0.0146 102.4597)`): The page background. Tinted yellow-warm at very low chroma. The "default surface".
- **Aged Paper** (`oklch(0.918 0.022 80)`): Inset surfaces — search bar background, kbd pills, secondary panels.
- **Foxed Edge** (`oklch(0.88 0.026 70)`): The deepest paper tone — used sparingly for layered surfaces.
- **Soft Page** (`oklch(0.8902 0.0289 49.0874)`): Card surfaces (zine cover backplates before art).
- **Faded Ink** (`oklch(0.4063 0.0255 40.3627)`): Primary body-text color. Reads as warm dark-brown, not black.
- **Pressed Ink** (`oklch(0.2721 0.0141 48.1783)`): Reserved for headlines, button fills, and active-state navigation. The system's "near-black" — never use `#000`.
- **Paper Popover** (`oklch(1 0 0)`): The single exception — popover surfaces only, where contrast against the paper background needs to read as a true lifted layer.

### Named Rules

**The No-Grey Rule.** Every neutral is tinted toward the Mocha axis (40–102° hue, 0.005–0.03 chroma). Untinted greys (`#888`, `oklch(L 0 0)`) and pure white/black are forbidden outside the popover surface. Match the warmth or rebuild the token.

**The Rare Stamp Rule.** Mocha Stamp covers ≤8% of any rendered surface. It carries italic emphasis inside headlines and focus state. It does not fill buttons, blocks, or hero backgrounds. If you reach for it as a fill, you're using it wrong — switch to Pressed Ink and let the type carry the contrast.

**The Paper-Not-Background Rule.** Surfaces are paper. Use the warm-paper stack (Warm Newsprint → Aged Paper → Foxed Edge → Soft Page) for any neutral surface. Never reach for `bg-white`, `bg-zinc-*`, `bg-slate-*`, or any framework default neutral.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback) — variable optical-size axis from 9 to 144, italic axis used liberally for emphasis.
**Body Font:** Fraunces — same family carries body copy, set at 19px / 1.55 line-height. The system commits to a **single serif** for reading and headlines.
**UI Font:** DM Sans — buttons, navigation, form labels. Used only on interactive chrome; never appears in editorial body copy.
**Label/Mono Font:** JetBrains Mono — eyebrows, metadata, kbd pills, layout switchers. The "metadata voice".

**Character:** A single editorial serif handles both shouting and whispering — the optical-size axis lets one family carry display, headline, and body without feeling repetitive. Mono is the metadata voice (always ALL CAPS, 0.18em tracking, 11px). Sans is the smallest layer — DM Sans only on buttons and nav, never larger than 14px.

### Hierarchy
- **Display** (Fraunces, weight 400, `clamp(48px, 6.2vw, 96px)`, line-height 0.98, letter-spacing −0.025em): Hero headlines only. One per page. Italic emphasis via `<em>` set in italic + Mocha Stamp.
- **Headline** (Fraunces, weight 400, 44px, line-height 1.05, letter-spacing −0.015em): Section titles ("This season's *shelf*"). One per section.
- **Title** (Fraunces, weight 500, 22px, line-height 1.15, letter-spacing −0.01em): Card titles, publication names in lists. Slightly heavier weight than display because it competes at smaller sizes.
- **Body** (Fraunces, weight 400, 19px, line-height 1.55): The reading layer. Cap line length at 44–65ch on long-form copy (the homepage hero uses `max-w-[44ch]` for the lead paragraph).
- **UI** (DM Sans, weight 500, 14px): Buttons, nav links. Never used for content.
- **Eyebrow** (JetBrains Mono, weight 400, 11px, letter-spacing 0.18em, UPPERCASE): Section labels, metadata, breadcrumbs. The system's "small print".

### Named Rules

**The Single-Serif Rule.** Fraunces handles display, headline, title, and body — the optical-size axis gives the variation. Do not introduce a second serif (no Cormorant, no Playfair, no PT Serif "for body"). The whole reading surface is one voice.

**The Italic-as-Emphasis Rule.** Emphasis inside headlines is *italic Fraunces in Mocha Stamp* — never bold, never underline, never color-block highlight. The italic + tinted-color combination is the system's only flourish.

**The Mono-for-Metadata Rule.** Anything that is *about* the content (counts, dates, status, breadcrumbs, page numbers, kbd hints) is set in JetBrains Mono at 11px / 0.18em / UPPERCASE. Anything that *is* the content is in Fraunces. Never mix.

## 4. Elevation

The system is **flat with paper offsets**, not layered with diffuse shadows. There are no soft glassy drop shadows. Instead, surfaces lift via a 2px hard offset (no blur, ~10% opacity warm-brown) — the visual idiom of stacked paper on a desk. The paper-grain overlay sits at z-60 across the entire viewport with `mix-blend-mode: multiply` (or `screen` in dark mode), giving the whole interface a single shared texture layer.

### Shadow Vocabulary
- **shadow-sm** (`box-shadow: 2px 2px 0 0 hsl(20 18% 51% / 0.08), 2px 1px 2px -1px hsl(20 18% 51% / 0.08)`): Resting state for inset chips, kbd pills, segmented controls. Almost imperceptible.
- **shadow** (`box-shadow: 2px 2px 0 0 hsl(20 18% 51% / 0.11), 2px 1px 2px -1px hsl(20 18% 51% / 0.11)`): Default card shadow.
- **shadow-md** (`box-shadow: 2px 2px 0 0 hsl(20 18% 51% / 0.12), 2px 2px 6px -1px hsl(20 18% 51% / 0.12)`): Hovered cards, active dropdowns.
- **shadow-lg** (`box-shadow: 2px 4px 0 0 hsl(20 18% 51% / 0.14), 4px 8px 18px -2px hsl(20 18% 51% / 0.18)`): Modal surfaces.
- **shadow-page** (composite — see `layout.css:65`): Reserved for zine covers and the featured editorial card. The "this is a printed object" shadow — stacked offset + diffuse penumbra to suggest physical weight.

### Named Rules

**The Hard-Offset Rule.** Shadows are 2px–4px hard offsets in warm-brown HSL, not soft Material drop shadows. The visual model is "paper laid on paper", not "card floating in space". `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` is forbidden.

**The Cover-Shadow Rule.** `shadow-page` is reserved exclusively for objects representing physical print artifacts (zine covers, the featured hero card). Do not apply it to UI surfaces — its weight is meaningful and dilutes if reused.

**The Paper-Grain-Always Rule.** The grain overlay (`PaperGrain.svelte`) is a permanent z-60 fixture, not a hero-only effect. Do not opt screens out of it. The visual cohesion of the system depends on every pixel being filtered through the same noise layer.

## 5. Components

### Buttons
- **Shape:** Gently curved (8px / `--radius`). Pill (`rounded-full`) is reserved for nav links and the segmented layout switcher.
- **Primary** (`zg-btn-primary`): Pressed Ink fill, Warm Newsprint text, 10px × 18px padding, DM Sans 14px / 500 weight. Hover blends 12% Mocha Stamp into the ink fill (`color-mix(in oklch, var(--ink) 88%, var(--primary) 12%)`) — a nearly imperceptible warming, not a color change.
- **Outline** (`zg-btn-outline`): 1px Pressed Ink border, transparent fill, Pressed Ink text. Hover inverts to Pressed Ink fill / Warm Newsprint text — the same printed-press inversion the primary uses.
- **Ghost** (`zg-btn-ghost`): No border, no fill at rest. Hover fills with Tea-Stain Beige at 60% opacity. For navigation actions inside dense layouts.
- **Active state:** All variants drop 1px (`transform: translateY(1px)`) on `:active` — the press is real, not animated.
- **Hover transition:** 80ms transform, 150ms background/border. Fast enough to feel mechanical, not bouncy.

### Cards (Zine Card)
- **Corner Style:** 2px (`rounded-[2px]`) — the corners of a real printed booklet, not the rounded-12px of a modern app card.
- **Background:** Soft Page underneath cover art. The card is the cover.
- **Shadow Strategy:** `shadow-page` on the cover image. The text block below the cover has no shadow — it sits flat on the warm-newsprint background.
- **Cover edge:** A 3px right-side stripe (`.cover-edge`) of repeating warm-paper gradient — simulates the page-block edge of a closed booklet. This is the *only* permitted side-stripe in the system, and it's structural (not decorative).
- **Hover:** Cover translates up 4px and rotates −0.6° on a 500ms `cubic-bezier(0.2, 0.7, 0.2, 1)` (ease-out-quart). The text below stays still. The book lifts off the shelf.
- **Internal Padding:** None on the card itself; metadata row + title + byline + 2-line description sit directly below the cover with `gap-3.5` rhythm.

### Featured Editorial Card
- A 5:3 wide hero card with a hand-set 110° linen-gradient background (`#e8d4b3` → `#c89870` → `#8a5a3c`) and ink type set directly on the gradient. Two columns inside: title block on the left, pull-quote + metadata on the right, separated by a 1px ink-tinted divider. This is the system's signature card and should appear at most once per page.

### Inputs (Search Bar)
- **Style:** Pill (`rounded-full`), 1px border in `--border`, Aged Paper background, DM Sans 12px placeholder text, ⌥+⌘+K kbd pill on the right.
- **Hover:** Border darkens to Pressed Ink. No color change beyond that.
- **Focus:** Inherits Mocha Stamp ring via `--ring` token. 2px outline-offset.

### Navigation (Header)
- **Style:** Sticky header with `backdrop-filter: blur(12px) saturate(140%)` and an 86%-opaque background — the *only* sanctioned glassmorphism in the system, justified by its sticky behavior over scrolling content.
- **Nav links:** Pill-shaped (999px radius), 8px × 14px padding, DM Sans 14px. Hover fills with Tea-Stain Beige at 50% opacity. Active state fills with Pressed Ink and inverts text to Warm Newsprint — the same press-inversion idiom as buttons.
- **Logo:** 28px square mark + Fraunces 22px wordmark, rendered side-by-side at the start of the row.
- **Mobile (<900px):** Search and primary nav collapse; logo + auth controls remain.

### Eyebrows (Section Labels)
- `.eyebrow` — JetBrains Mono 11px, 0.18em letter-spacing, UPPERCASE, in Faded Ink. Appears above every section title and as breadcrumbs in the SectionBar. Carries dates, counts, and status. This is the system's most repeated component — treat it as a first-class primitive.

### Layout Switcher (Segmented Control)
- A pill container (Card background, 1px border, 999px radius) holding mono-text buttons. Active button fills with Pressed Ink and inverts to Warm Newsprint. Used for the discovery view modes (Editorial / Shelf / List).

### Divider
- `.divider-tape` — 1px border-color line with a centered `·  ·  ·` glyph in Fraunces, set on the page background to "punch through" the line. Use for major editorial section breaks; do not use for inline content separators (use Tailwind `border-b` for those).

### Kbd Pill
- 1px border, 2px-bottom-border (the depressed-key affordance), Aged Paper background, JetBrains Mono 10px. Used for keyboard hints (`⌘K` in the search bar).

## 6. Do's and Don'ts

### Do:
- **Do** keep Fraunces as the *only* serif. Use the optical-size axis to differentiate display vs. body — not a second family.
- **Do** use italic Fraunces in Mocha Stamp as the system's only emphasis device inside headlines.
- **Do** tint every neutral toward the Mocha hue (0.005–0.03 chroma at 40–102° hue). The system reads as "paper", not "background".
- **Do** use 2px hard-offset shadows with warm-brown HSL alpha for elevation. Soft Material drop shadows break the printed-press feel.
- **Do** apply the paper-grain overlay (`PaperGrain.svelte`) on every screen — it is a system primitive, not a hero effect.
- **Do** vary column spans in editorial grids (the discovery grid uses a `[6, 3, 3, 4, 4, 4]` span pattern). Uniform card walls flatten the page.
- **Do** set metadata in mono UPPERCASE at 0.18em tracking (the eyebrow style). Counts, dates, status, breadcrumbs all use this voice.
- **Do** use `<em>` italics + Mocha Stamp inline inside serif headlines for the system's signature flourish.
- **Do** invert button colors on hover (Pressed Ink ↔ Warm Newsprint) — the printed-press idiom. Use it consistently across primary, outline, and active-nav states.
- **Do** reserve `shadow-page` for objects representing physical print artifacts (zine covers, the featured editorial card).

### Don't:
- **Don't** use `#fff`, `#000`, or any framework neutral grey (`bg-zinc-*`, `bg-slate-*`, `bg-neutral-*`). All neutrals are warm and tinted.
- **Don't** introduce a second serif. Fraunces handles every reading surface.
- **Don't** use bold weight for emphasis. Italic + Mocha Stamp is the only flourish.
- **Don't** apply `shadow-page` to ordinary UI cards. Its weight is meaningful — the cards that have it represent physical objects.
- **Don't** build the homepage / discovery surface as a Notion-style document or a Squarespace-style hero-grid-CTA template. It is a publication shelf.
- **Don't** show engagement counts, follower-count theater, or "trending" signals as primary affordances. Discovery is editorial-shaped, not feed-shaped.
- **Don't** use side-stripe colored borders (`border-l-4 border-primary` etc.) anywhere. The single sanctioned side-stripe in the system is `.cover-edge` on zine covers, and it represents the page-block of a printed booklet.
- **Don't** use gradient text (`background-clip: text`). Color emphasis is solid Mocha Stamp on italic Fraunces — nothing else.
- **Don't** use glassmorphism beyond the sticky header. The header's blur is justified by its scroll behavior; no other surface gets a backdrop-filter.
- **Don't** use uniform card grids (same-sized cards repeated endlessly). The 12-column editorial grid with featured + side-stack + variable-span tail is the canonical discovery layout.
- **Don't** wrap pages in centered max-width containers. The system uses `px-12` (48px) edge padding directly on the page; the editorial grid spans the full content width.
- **Don't** write growth-hacker or marketing-coded copy (no "supercharge", "unlock", "level up", "AI-powered"). The voice is plainspoken and unhurried — match the type.
- **Don't** add bouncy or elastic easing. Motion is exponential ease-out (`cubic-bezier(0.2, 0.7, 0.2, 1)` for cards, 80ms transforms for buttons). Mechanical, not playful.
- **Don't** use em dashes (—) in UI copy. Match PRODUCT.md's restriction. Use commas, colons, or periods.
