# Plantiz design system

The design Plantiz is built on, written from the finished site. This file
replaces everything in `references/`. Every value below is a token in
`frontend/src/styles/tokens.css`; use those tokens, and ask before adding a
new color, font or type size.

## Character

A field guide, not a startup landing page. Emerald on white, near-black ink
for text, a serif for names and headings. The site is illustrated with its
own data, never with pictures: a real dataset entry styled as an index card,
charts of the collection, meters for water and care. Calm and legible first,
with small moments of warmth (an italic phrase in a headline, a fanned stack
of cards, an arrow that nudges forward).

## Color

One accent family (emerald), a slate scale for text and borders, an ink scale
for dark surfaces. Red exists only for errors.

| Ramp | Steps |
| --- | --- |
| Emerald | 50 `#ecfdf5` · 100 `#d1fae5` · 200 `#a7f3d0` · 300 `#6ee7b7` · 400 `#34d399` · 500 `#10b981` · 600 `#059669` · 700 `#047857` · 800 `#065f46` · 900 `#064e3b` |
| Slate | 50 `#f8fafc` · 100 `#f1f5f9` · 200 `#e2e8f0` · 300 `#cbd5e1` · 500 `#64748b` · 600 `#475569` |
| Ink | 900 `#0c1512` · 850 `#111c18` · 800 `#16241f` · 700 `#1f322b` |
| Red | 50 `#fef2f2` · 700 `#b91c1c` |

Use role tokens in components, not ramp steps:

| Role | Token | Value | Contrast |
| --- | --- | --- | --- |
| Page | `--surface` | white | |
| Tinted band | `--surface-tint` | emerald-50 | |
| Dark panel | `--surface-dark` | ink-900 | |
| Text | `--text` | ink-900 | 17.6:1 on tint |
| Body copy | `--text-muted` | slate-600 | 7.2:1 on tint |
| Small print | `--text-subtle` | slate-500 | 4.8:1, white only |
| Links, overlines | `--text-accent` | emerald-700 | 5.2:1 on tint |
| Link hover | `--text-accent-strong` | emerald-800 | |
| On dark | `--text-on-dark` / `-muted` / `-label` | white / emerald-100 at 75% / emerald-300 at 80% | 9.5:1 and 7.6:1 on ink |
| Borders | `--border-soft` / `--border` / `--border-strong` | slate-100 / 200 / 300 | decorative only |
| Field edge | `--input-border` | slate-500 | 4.8:1, passes 3:1 |
| Focus | `--focus-ring` / `--focus-ring-on-dark` | emerald-700 / emerald-300 | |
| Error | `--danger` on `--danger-surface` | red-700 on red-50 | 5.9:1 |

Rules:

- Primary buttons are emerald-700 with white text (5.5:1). Never white text
  on emerald-500 or 600.
- Slate-500 text only on white. On emerald-50, use slate-600.
- Never use slate-400 or lighter for text.
- Red always comes with an alert icon and words, never color alone.
- No gradients, glows or blurred blobs. The one texture is the faint 34px grid
  on dark panels.

## Typography

| Family | Token | Used for |
| --- | --- | --- |
| Fraunces (variable, optical sizing) | `--font-display` | Headings, the brand name, plant names, botanical names (italic), feature numerals |
| Inter (variable) | `--font-body` | Everything else, including all statistics and confidence scores |

Never use Inter, Roboto or Arial for headings. Big numbers (the species-count hero
figure, stat values, confidence percentages) stay in Inter: a serif reads as
decoration on data.

| Token | Size | Used for |
| --- | --- | --- |
| `--text-3xl` | 38 to 60px | Welcome h1 |
| `--text-page-title` | 32 to 44px | Member page h1 |
| `--text-2xl` | 28 to 36px | Section h2, auth h1, results headings |
| `--text-card-title` | 36px | Specimen card plant name |
| `--text-figure` | 48 to 64px | Hero figure (Inter) |
| `--text-xl` | 22px | h3, card titles, brand name |
| `--text-lg` | 18px | Ledes |
| `--text-base` | 16px | Body, and every form input (smaller zooms iOS) |
| `--text-md` | 15px | Buttons, facts, choice labels |
| `--text-sm` | 14px | Nav, table rows, small body |
| `--text-xs` | 13px | Labels, chips, hints, errors |
| `--text-2xs` | 12px | Overlines and stat labels (uppercase only) |

- Weights: 400 body, 500 nav and facts, 600 labels and buttons, 700 headings.
- Headings: leading `--leading-tight` (1.06), tracking `--tracking-tight`
  (-0.02em), `text-wrap: balance`. Body: leading 1.6, `text-wrap: pretty`.
- Overlines: 12px, 600, uppercase, `--tracking-overline` (0.14em),
  emerald-700. Stat labels on dark use `--tracking-label` (0.12em).
- One italic emerald phrase per headline at most (`<em>` in the welcome h1).
- Fonts are self-hosted through `@fontsource-variable`. No font CDNs.

## Space and layout

- Spacing scale on a 4px base: `--space-1` (4px) to `--space-28` (112px).
- Containers: `--container-max` 1200px for pages, `--container-narrow`
  1080px for the split card. Side gutter `--gutter`: 16px on phones, 24px
  from 640px, 32px from 1024px.
- Breakpoints: sm 40rem (640px), md 48rem (768px), lg 64rem (1024px). Build
  mobile first; nothing may scroll sideways at 390px.
- Section rhythm: `.section` is 80px top and bottom, 112px from lg. Member
  page content uses `.section--compact`.
- Backgrounds alternate white and emerald-50 bands; the dark panel sits inside
  a card, never as a full-width band.

## Shape and depth

| Token | Value | Used for |
| --- | --- | --- |
| `--radius-xs` | 4px | Bar ends, meter segments |
| `--radius-sm` | 8px | Small logo tile, list row hover |
| `--radius-md` | 12px | Buttons, inputs, choice cards, icon tiles |
| `--radius-lg` | 24px | Cards, split card on phones, filter bar, dropzone |
| `--radius-xl` | 28px | Split card from sm, specimen card |
| `--radius-full` | pill | Chips, tags, eyebrow, ink and quiet buttons |

- `--shadow-card`: large, soft, green-tinted. Cards and the split card,
  always paired with a 1px `--border-accent` ring (`0 0 0 1px`).
- `--shadow-raised`: small lift for the eyebrow pill, secondary buttons and
  the filter bar.
- `--shadow-btn`: under the primary button and the logo tile only.

## Motion

- Durations `--duration-fast` (140ms) for color changes and
  `--duration-base` (220ms) for movement; easing `--ease-out`.
- What moves: the nav underline grows on hover; arrows nudge 3px
  (`.nudge`); buttons scale to 0.99 when pressed; drop-down chevrons rotate.
- Under `prefers-reduced-motion: reduce`, `base.css` cuts every transition
  and animation to near zero, and movement that is purely decorative (the
  arrow nudge) only exists under `no-preference`. No looping or autoplaying
  animation anywhere.

## Icons and imagery

- Icons are hand-drawn inline SVGs in `components/Icon.jsx`: 24px grid,
  1.75 stroke, round caps and joins, `currentColor`. Add new ones in the same
  style. No icon libraries, no emoji.
- Icons are decorative (`aria-hidden`); the text beside them carries meaning.
- No photos, stock images or illustrations. The only photo on the site is the
  one a visitor uploads to identify. Show the collection through its data.
- No three-column icon feature rows. List features as numbered editorial rows.

## Components

All in plain CSS (`frontend/src/styles/`). No UI kits.

**Header** (`.site-header`). Sticky, solid white, 64px, 1px slate-100 bottom
border. Public pages: brand plus "Log in" link and an ink "Sign up" pill.
Member pages (`SiteLayout member`): brand, the Plants / Recommend / Identify
nav (2px emerald underline, `aria-current` on the active page), a "Hi, name"
greeting from sm, and a quiet "Log out" pill. Below md, the nav becomes a
second row.

**Footer** (`.site-footer`). Small brand, a one-line sign-off, and the app
links on member pages only.

**Buttons** (`.btn`). 48px tall, 12px radius, 15px semibold.
- `--primary`: emerald-700, white text, button shadow, an arrow that nudges.
  One per form or section, for its main action.
- `--secondary`: white with a slate-300 border; hover turns the border
  emerald.
- `--ink`: near-black pill, header "Sign up" only.
- `--quiet`: small white pill (Log out, Change photo).
- `--block`: full width, for form submits.
- `.text-link`: emerald-700 semibold, 44px tall, underline on hover.

**Labels.** `.eyebrow` (white pill, emerald-200 border, leaf icon, overline
text) sits above a page's main h1 on the welcome page; `.overline` is the
plain version. `.chip` (slate-50 pill, 13px) holds facts; `.tag` (emerald-100
pill, uppercase) marks a status such as "Featured species".

**Split card** (`.split-card` with `.panel-dark`). The signature layout: a
white main column beside a near-black panel (1.05fr / 0.95fr from lg). The
panel carries the faint 34px grid, fading out from the top right, and
contents in white and emerald-on-dark. Used for the welcome statistics and
for log in / sign up. Inside dark panels, `.stat` rows pair a 44px
`.stat__tile` (white at 6% with a 1px white-at-10% ring, emerald-300 icon)
with an uppercase label and a value or sentence.

**Specimen card** (`.specimen`). A dataset entry styled as an index card:
tag, catalog number, plant name in Fraunces, botanical name in italic, chips,
then the plant facts. Two blank cards fan out behind it. Welcome hero only.

**Feature list** (`.feature-list`). Numbered rows (Fraunces numerals in
emerald-700) separated by hairlines. The title link stretches over the row;
an arrow circle fills emerald on hover.

**Page intro** (`.page-intro`). The emerald-50 band that opens member pages:
overline, h1, lede.

**Card** (`.card`). White, 24px radius, card shadow and accent ring, 24px
padding (32px from sm).

**Workspace** (`.workspace`). A form card beside its output column (two
equal columns from lg). Before there is output, the column shows a dark
`.how-it-works` panel with numbered `.step` rows.

**Forms** (`forms.css`).
- `.field`: label (13px semibold), optional hint, control, error.
- `.input`: 48px tall, slate-50 fill, slate-500 border, 16px text; white
  fill and an emerald border on focus.
- `PasswordField` adds a 44px Show / Hide button inside the field.
- `.select`: an `.input` with a chevron.
- `.choice-group`: radio cards with the native radio visible. Layouts are
  `grid` (wide cards with hints), `row` (three across) and `chips` (pills).
  The selected card gets an emerald-50 fill and a 2px emerald-700 edge;
  keyboard focus rings the whole card.
- Errors: `.field__error` (alert icon and red text under the field, linked
  with `aria-describedby`), and `.form-alert` (role="alert", always in the
  DOM, takes no space while empty).
- Validate on submit, then move focus to the first invalid field.

**Plant facts** (`.facts`). A two-column definition list: Light, Water, Care,
Hardiness, Height, plus Grows and Lifecycle in the library. Water and care
add a `.level-meter` (three 18px segments, emerald-600 on an emerald-100
track). In results, facts that agree with the visitor's answers get a
`.match-badge` (check icon and "Match").

**Confidence** (`.confidence`). The percentage in Inter bold, the word
"confidence", and an 8px meter (emerald-600 on emerald-100) below. Sizes
`sm`, `md`, `lg`.

**Plant library.** A `.filter-bar` (search plus three selects plus Clear),
a live result count, then one `.plant-group` per plant group (Fraunces h2
with a count) holding native `<details class="plant">` drop-downs. The
summary shows the name, botanical name and chips; the chevron turns on open.
`/plants#id` opens that plant.

**Photo upload** (`.dropzone`, `.photo-preview`). A large 2px-bordered target
that accepts clicks and drops, then a preview with Change and Remove.

## Data visualization

- One series, nominal categories: one color for every bar (`--chart-bar`,
  emerald-600), hover darkens to emerald-800. Never color bars by value.
- Ordered categories (indoors, both, outdoors) use the ordinal ramp
  `--chart-ordinal-1..3` (emerald-200 / 400 / 700), validated on the ink
  surface.
- Bars at most 12px thick here, 4px rounded data end, square at the baseline,
  a 2px surface gap between stacked segments, a hairline baseline.
- Labels and values use text tokens, never the series color. Every chart is
  real markup (a `<table>` or a labelled list) so values never depend on
  hover or color.

## Accessibility

Required on every page:

- AA contrast: 4.5:1 for text, 3:1 for icons, field edges and chart marks.
  The contrast notes in the color table are measured, not guessed.
- A visible focus ring: 3px `--focus-ring`, 3px offset (emerald-300 on dark).
  Stretched links and choice cards draw the ring on the visible shape.
- 44px minimum touch targets (`--tap-target`), including text links and the
  password toggle.
- One h1 per page and headings in order. Decorative icons and meters are
  `aria-hidden`; the adjacent text says the same thing.
- A "Skip to content" link, labelled landmarks, `aria-current` in navigation,
  live regions for filter counts and form errors.
- Everything animated respects `prefers-reduced-motion`.

## Writing

Warm, plain and specific. Sentence case for everything except overlines. No
em dashes in interface copy. Numbers on the site are counted from the
dataset, never invented. Buttons say what they do ("Create a free account",
"Recommend Plants", "Identify plant").
