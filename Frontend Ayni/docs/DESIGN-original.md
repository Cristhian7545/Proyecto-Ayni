---
name: Vecindario Cálido
colors:
  surface: '#fff8f1'
  surface-dim: '#e0d9d0'
  surface-bright: '#fff8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3ea'
  surface-container: '#f4ede4'
  surface-container-high: '#eee7de'
  surface-container-highest: '#e8e1d9'
  on-surface: '#1e1b16'
  on-surface-variant: '#434841'
  inverse-surface: '#33302a'
  inverse-on-surface: '#f7f0e7'
  outline: '#747870'
  outline-variant: '#c4c8bf'
  surface-tint: '#50644c'
  primary: '#4d6149'
  on-primary: '#ffffff'
  primary-container: '#657a61'
  on-primary-container: '#f7fff1'
  inverse-primary: '#b6cdaf'
  secondary: '#54634d'
  on-secondary: '#ffffff'
  secondary-container: '#d7e8cd'
  on-secondary-container: '#5a6953'
  tertiary: '#4f614a'
  on-tertiary: '#ffffff'
  tertiary-container: '#677a62'
  on-tertiary-container: '#f7fff0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e9ca'
  primary-fixed-dim: '#b6cdaf'
  on-primary-fixed: '#0e200d'
  on-primary-fixed-variant: '#384c35'
  secondary-fixed: '#d7e8cd'
  secondary-fixed-dim: '#bbcbb2'
  on-secondary-fixed: '#121f0e'
  on-secondary-fixed-variant: '#3d4b37'
  tertiary-fixed: '#d4e8cc'
  tertiary-fixed-dim: '#b8ccb1'
  on-tertiary-fixed: '#101f0e'
  on-tertiary-fixed-variant: '#3a4b36'
  background: '#fff8f1'
  on-background: '#1e1b16'
  surface-variant: '#e8e1d9'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '700'
    lineHeight: 1.875rem
    letterSpacing: 0em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: 0em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-xxl: 3.5rem
---

## Brand & Style

This design system establishes an authentic, community-first digital environment tailored for intergenerational neighborhood connection across Peru. Rooted in familiar domestic warmth, civic trust, and quiet utility, the experience balances contemporary mobile agility with the legibility and tactile comfort demanded by older adults.

The aesthetic blends **Organic Warm Minimalism** with gentle tactile cues. Interfaces prioritize tranquility, human safety, and effortless readability:
- **Atmosphere:** Natural, grounded, sun-drenched coastal and andean residential courtyard warmth.
- **Tone:** Cordial, trustworthy, neighborly, and clear. Avoid overly technical jargon, gamification gimmicks, or aggressive urgency.
- **Visual Clutter Elimination:** Strictly no intrusive map overlays, noisy telemetry graphics, or dense analytic charts. Content prioritizes conversational community boards, local announcements, collaborative security, and mutual aid.

## Colors

The palette draws inspiration from Peruvian coastal olive groves, sun-washed adobe courtyards, and woven linen textures. High contrast is rigorously enforced between typography and soft backgrounds to support multi-generational visual comfort.

### Functional Palette Structure
- **Surface Canvas (Beige Principal):** `#F6EFE6` — The primary app-level page backdrop.
- **Surface Container (Blanco Cálido):** `#FFFCF8` — Dedicated card, modal, and input surface layer, offering clean separation from the canvas.
- **Surface Dim / Secondary (Beige Secundario):** `#EADFCC` — Secondary panels, navigation bars, and chip fills.
- **Primary Brand (Verde Oliva):** `#6F846A` — Interactive affordances, active icon fills, key interactive text links, and prominent callouts.
- **Primary Accent / Hover (Verde Profundo):** `#5C6E57` — Button focus/hover states, high-contrast borders, and primary emphasis.
- **Secondary Tone (Verde Salvia):** `#A8B89F` — Gentle supportive badges, soft active highlights, and decorative status indicators.
- **Typography & Dark Elements (Texto Principal):** `#4D5A4A` — Primary text, header labels, and core iconography. Achieves comfortable AAA/AA contrast against `#FFFCF8` and `#F6EFE6`.
- **Subtle Borders & Separators:** `#D9CEBD` — Structural hairline rules and resting outline states.
- **System States:**
  - *Success:* `#4E7A52` with `#EAF3EA` surface tint.
  - *Warning / Alert:* `#B87333` (warm terracotta) with `#FDF4ED` surface tint.
  - *Critical / Urgent:* `#A3483F` with `#FBEFED` surface tint.

## Typography

The platform utilizes **Plus Jakarta Sans** as the unified font family across all tiers. Its friendly rounded terminals, wide x-height, and generous counters ensure effortless scanning for older demographics while preserving crisp, contemporary rhythm for youth.

### Hierarchy Guidelines
- **Optical Accessibility:** Avoid text sizes below `0.75rem` (12px). All default user-generated posts and comments render at `body-md` (16px) or `body-lg` (18px) to reduce eyestrain.
- **Weights:** Use regular (400) for body reading to keep horizontal eye travel smooth; use semibold (600) and bold (700) deliberately for section anchors, buttons, and authors. Avoid ultra-thin or hairline weights completely.
- **Line Lengths:** Text blocks in community posts, notices, and descriptions must clamp between 45 and 72 characters per line.

## Layout & Spacing

The layout philosophy uses a disciplined **Fixed Grid with Contained Max-Widths** to prevent visual fatigue on wider monitors and ensure natural touch zones on mobile devices.

### Grid & Breakpoints
- **Mobile (< 768px):** Single-column layout. Canvas margin: `1rem` (16px). Inter-card gap: `1rem`. Touch targets adhere strictly to a minimum 48x48px bounding box.
- **Tablet (768px – 1024px):** 8-column layout. Canvas margin: `1.5rem` (24px). Gutter: `1.25rem` (20px). Supports feed and secondary sidebar widgets.
- **Desktop (> 1024px):** 12-column layout capped at a max-width of `1200px` centered on `#F6EFE6`. Gutter: `1.5rem` (24px). Outer canvas margin: `2.5rem` (40px).

### Spacing Rhythm
Spacing is bound to an 8px vertical rhythm with a 4px sub-grid (`space-xs`). Use generous internal card padding (`space-lg`) to foster calm, airy breathing room around neighbor interactions.

## Elevation & Depth

This system intentionally departs from aggressive dark shadows, multi-tiered floating surfaces, and glassy blurs in favor of **Tonal Surface Separation with Ambient Low-Contrast Depth**. 

### Visual Hierarchy Principles
1. **Zero-Elevation Base:** The primary page canvas sits flat at `#F6EFE6`.
2. **Elevated Content Cards:** Cards sit on `#FFFCF8` and are grounded by a 1px continuous border (`#D9CEBD`) combined with an ultra-soft, warm ambient shadow:
   `box-shadow: 0 2px 8px -2px rgba(77, 90, 74, 0.06), 0 1px 3px 0 rgba(77, 90, 74, 0.04)`.
3. **Hover & Active Depth:** When cards or interactive elements are engaged, the subtle border shifts to `#A8B89F` and the shadow deepens gently without floating unmoored:
   `box-shadow: 0 6px 16px -4px rgba(77, 90, 74, 0.08), 0 2px 6px -1px rgba(77, 90, 74, 0.05)`.
4. **Modals & Overlays:** Pinned dialogue boxes and dropdown menus use `#FFFCF8` framed by a `#5C6E57` 1px border at 40% opacity, backstopped by a warm dimming scrim (`rgba(77, 90, 74, 0.28)`).

## Shapes

The shape system employs moderate, organic curvature (level 2). Radii provide friendly, ergonomic contours without feeling juvenile or bubble-like.

- **Standard Elements (0.5rem / 8px):** Checkboxes, form text inputs, small badges, and tooltips.
- **Cards & Modals (rounded-lg: 1rem / 16px):** Neighbor feed cards, directory profiles, alert panels, and dialog sheets.
- **Structural Containers (rounded-xl: 1.5rem / 24px):** Primary app navigation bar container, banner blocks, and main content wrappers.
- **Full Pill (`9999px`):** The `+ Publicar` primary action, filter chips, search input shell, and status pills.

## Components

### 1. App Header & Global Shell
- **Header Surface:** Background `#FFFCF8`, bottom border 1px `#D9CEBD`. Height: 68px.
- **Logo:** Located on the far left with brand emblem and title in `#4D5A4A` (bold, 18px).
- **Global Search:** Centered or left-aligned next to logo. Full pill shape (`rounded-full`), background `#F6EFE6`, border 1px `#D9CEBD`, placeholder text `#4D5A4A` with 60% opacity. Leading magnifying glass icon.
- **Actions Cluster (Right Side):**
  - **`+ Publicar` Button:** High-priority pill button. Background `#6F846A`, text `#FFFCF8` (Font-weight: 600), horizontal padding `1.25rem`, vertical padding `0.625rem`. Hover: `#5C6E57`.
  - **Chat Messages Icon:** 44x44px round touch target with olive icon stroke. Unread indicator uses an olive pill badge with white numeral.
  - **Notifications Icon:** 44x44px round touch target with bell icon stroke and subtle red-clay unread dot.
  - *Constraint Enforcement:* The avatar/profile trigger is strictly excluded from this header.

### 2. Primary 7-Item Navigation Bar
A horizontal bar on desktop or persistent anchored navigation containing exactly 7 categories:
1. **Inicio / Tablón**
2. **Seguridad Vecinal**
3. **Servicios y Oficios**
4. **Comunidad y Eventos**
5. **Compra y Venta**
6. **Avisos Oficiales**
7. **Mi Perfil** *(sole canonical location for profile access)*

- **Styling:** Grounded on `#EADFCC` or bordered `#FFFCF8`. Active state uses pill highlight `#6F846A` with `#FFFCF8` text. Inactive items use `#4D5A4A` with subtle hover transitions to `#F6EFE6`.

### 3. Cards (Neighbor Posts & Community Notices)
- **Base:** `#FFFCF8` container, 1px solid `#D9CEBD` border, `rounded-lg` (16px), padding `1.25rem` to `1.5rem`.
- **Card Header:** Neighbor avatar (48px rounded-full), resident name in `#4D5A4A` (Font-weight: 600), district/street badge, and relative timestamp (`body-sm`).
- **Card Content:** Uncluttered body text in `#4D5A4A`. Optional single-image attachment with 12px radius.
- **Card Footer:** Neighborly actions (*Apoyar*, *Comentar*, *Compartir*) styled as text buttons in `#4D5A4A` with `#6F846A` on hover.

### 4. Buttons
- **Primary:** Background `#6F846A`, text `#FFFCF8`, radius `0.5rem` (or full pill for publishing). Hover `#5C6E57`, active `#4D5A4A`.
- **Secondary / Outlined:** Background transparent, border 1.5px `#6F846A`, text `#6F846A`. Hover background `#F6EFE6`.
- **Tertiary / Ghost:** Text `#4D5A4A`, hover background `#EADFCC`. Minimum height 44px across all buttons for accessibility.

### 5. Filter Chips
- **Resting:** Background `#FFFCF8`, border 1px `#D9CEBD`, text `#4D5A4A`, radius `9999px`.
- **Active:** Background `#6F846A`, border 1px `#6F846A`, text `#FFFCF8`, font-weight 600.

### 6. Inputs & Search Fields
- **Container:** Background `#FFFCF8`, 1px border `#D9CEBD`, radius `0.5rem`, padding `0.75rem 1rem`.
- **Focus:** 2px ring `#6F846A` with zero background wash.
- **Assistive Text:** Set in `#4D5A4A` (80% opacity) at `0.875rem` for unmistakable readability.

### 7. Checkboxes & Radio Buttons
- **Size:** 22x22px for easy touch and click targets.
- **Selected State:** Border and fill `#6F846A`, check icon in `#FFFCF8`.
- **Resting State:** Border 1.5px `#D9CEBD`, fill `#FFFCF8`.

### 8. Global Footer
- Background: `#EADFCC`. Border-top: 1px `#D9CEBD`. Padding: `2rem` vertical.
- Center-aligned legal notice: `"© 2026 EntreVecinos. Todos los derechos reservados"` styled in `body-sm` (`#4D5A4A`).