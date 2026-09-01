# Elysian Grace Events

Website for **Elysian Grace Events** — a Johannesburg- and Mokopane-based event planning
business specialising in elegantly curated celebrations: weddings, bridal showers, baby
showers, birthdays, graduations and funeral décor.

Three static pages, no build step, no backend. Enquiries are handed straight to WhatsApp.

---

## Contents

- [What's in it](#whats-in-it)
- [Running it locally](#running-it-locally)
- [Project structure](#project-structure)
- [How the booking form works](#how-the-booking-form-works)
- [Editing the site](#editing-the-site)
- [Design system](#design-system)
- [Deploying](#deploying)
- [Browser support](#browser-support)

---

## What's in it

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Logo, headline, Book Now + WhatsApp buttons, service overview, process, collaborations, testimonials |
| Services & Prices | `services.html` | Ten service sections with full price lists and a sticky category nav |
| Booking | `booking.html` | Enquiry form that composes a WhatsApp message, plus contact details and FAQ |

Every page carries a floating WhatsApp button, a sticky header with a Book Now call to
action, and a full-screen menu on mobile.

**Services covered:** event planning & coordination, décor & styling, funeral décor,
florals & bouquets, hair & wigs, makeup & nails, spa & pamper, photography, bridal attire.

**Collaborations:** The Bridal House, Whistle Shot It, Lee Day Spa, Mmabatho's Helping
Hands Deco, Paradise Hair.

## Running it locally

There is nothing to install and nothing to build — it is plain HTML, CSS and JavaScript.
Open `index.html` directly, or serve the folder so that relative paths behave exactly as
they will in production:

```bash
python3 -m http.server 8400
```

Then visit <http://localhost:8400>.

## Project structure

```
elysian-grace/
├── index.html          # Home
├── services.html       # Services & prices
├── booking.html        # Booking form + FAQ
├── styles.css          # All styling, design tokens at the top
├── script.js           # Nav, scroll reveals, booking form → WhatsApp
├── assets/
│   ├── logo.svg        # Full circular lockup (hero, about panel)
│   └── monogram.svg    # I&L mark (header, footer, favicon)
└── README.md
```

Both logo files are **vector rebuilds** of the brand artwork, so they stay sharp at any
size and need no image assets. Because an SVG loaded through `<img>` cannot pull in web
fonts, they use a system serif stack (Didot → Bodoni 72 → Georgia) and size the wordmark
with `textLength` + `lengthAdjust="spacing"`, which keeps it inside the ring on any machine.

## How the booking form works

The form does not post anywhere and stores nothing. On submit, `script.js`:

1. Validates name, contact number, occasion and at least one selected service.
2. Formats the answers into a readable message.
3. Opens `https://wa.me/27639500047?text=…` so the client can review and send it.

Service buttons on the services page deep-link into the form with the choice preselected,
e.g. `booking.html?service=Décor%20%26%20Styling`. A regex table in `script.js` maps that
string onto the form's service chips — funeral enquiries short-circuit the table so they
don't also tick "Décor & Styling", and a bridal beauty bundle ticks hair, makeup and nails
together. **If you rename a service, update those rules.**

## Editing the site

Everything below is plain text in the HTML — no template language to learn.

- **WhatsApp number** — currently `+27 63 950 0047`. It appears as `27639500047` in
  `wa.me` links across all three pages and once as `WA_NUMBER` at the top of `script.js`.
  Change every occurrence.
- **Prices** — in `services.html`, inside `<ul class="plist">` blocks. Each row is a
  `<li>` with a label and an `<span class="amt">` amount.
- **Services** — each section is `<section class="svc" id="…">`. Adding one means adding a
  matching pill to the `.svc-nav` list and, if it should be bookable, a chip in
  `booking.html` plus a rule in `script.js`.
- **Testimonials** — `index.html`, the `.quotes` block. **These are placeholders and should
  be replaced with real client quotes before the site goes live.**
- **Social links** — the footer Instagram and Facebook links on `index.html` are still
  `href="#"` and need real handles.
- **Cache busting** — `styles.css` and `script.js` are linked with `?v=2`. Bump that number
  when you change either file so returning visitors get the update.

## Design system

Design tokens live in `:root` at the top of `styles.css` — change them there rather than
hunting through rules.

- **Palette** — ivory `#FCFAF6`, white, gold `#B4915B` → `#96763F`, ink `#191612`, with
  WhatsApp green reserved exclusively for chat actions.
- **Type** — SF Pro through the `-apple-system` / `BlinkMacSystemFont` stack, so Apple
  devices use the real system font; **Inter** loads from Google Fonts as the fallback
  everywhere else. Headings sit at weight 600 with `-0.022em` tracking.
- **Motion** — sections fade up on scroll via `IntersectionObserver`, and everything is
  disabled under `prefers-reduced-motion`.
- **Layout** — CSS grid throughout, single column below 640px. The pages are verified to
  have no horizontal overflow from 390px upward.

## Deploying

Static files, so anything that serves a folder will do — GitHub Pages, Netlify, Vercel,
Cloudflare Pages or ordinary shared hosting. There is no build command and no environment
configuration. For GitHub Pages, push this folder to the repository root and enable Pages
on the branch.

Before going live: replace the placeholder testimonials, add the real social links, and set
the canonical URL in the `og:` meta tags in `index.html`.

## Browser support

Current versions of Safari, Chrome, Firefox and Edge on desktop and mobile. The layout
relies on CSS grid, custom properties and `IntersectionObserver`; where the last is missing,
content simply renders without the fade-in.

---

© Elysian Grace Events. All rights reserved. The brand name, logo and price lists belong to
the business owner; the code is provided for their use.
