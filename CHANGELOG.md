# Changelog

All notable changes to this project will be documented in this file.

## [0.0.24] - 2026-11-16

### Added
- “STL Maker” link to the desktop and mobile top navigation.

### Changed
- Desktop navigation now appears from 1280px, with the mobile menu used below that to prevent crowding.

## [0.0.23] - 2026-11-16

### Added
- Browser-based call sign maker at `/callsign-stl-maker/`, with adjustable dimensions and base bar, an interactive light/dark preview, and STL/SVG downloads generated locally.

## [0.0.22] - 2026-11-14

### Changed
- Refreshed the front end with a precision-workshop design system: warm off-white surfaces, graphite text, sharper mint accents, technical mono labels, and asymmetric image-led sections.
- Rebuilt the homepage around a stronger split hero, material marquee, service panels, process section, workshop capability table, gallery preview, and darker conversion CTA.
- Restyled the header, footer, navigation, theme toggle, service cards, and chat widget for a more consistent premium workshop feel.
- Converted the FAQ into an accordion and refreshed the contact, gallery, equipment, and testimonials pages with the new layout language.

### Added
- Project-brief fields for service, material preference, quantity, and deadline on the contact form.
- `enctype="multipart/form-data"` on the contact form to support file uploads explicitly.
- Homepage material marquee and local workshop capability summary.

## [0.0.21] - 2026-09-17

### Fixed
- **Chat rate limiting now actually persists.** The v0.0.20 limiter kept its counters in a module-level Map, which on Netlify is worthless: in-memory state in a function only survives a single invocation, so every request started from an empty counter and passed. Counters now live in Netlify Blobs (`chat-ratelimit` store), so the 8/min and 40/hour per-IP caps and the 300/hour global breaker are real.
- The endpoint now fails closed. If Blobs is unavailable, or a counter cannot be written, the request is refused with a 503 rather than served uncounted. An open endpoint that spends money is worse than a brief chat outage.

### Added
- `@netlify/blobs` dependency, same ^8.1.0 as rapt uses.

## [0.0.20] - 2026-09-17

### Fixed
- **Tilly chat endpoint was open to the internet.** `/.netlify/functions/chat` accepted an unauthenticated POST from anywhere, forwarded it to Claude and returned the answer, with no origin check and no rate limit. Anyone who found the URL could spend the Anthropic balance at roughly $0.0025 a request. Now: requests must come from a mintprints.im origin (or localhost in dev), each IP is capped at 8 requests a minute and 40 an hour, and the whole function instance trips a breaker at 300 an hour. Throttled callers get a 429 with Retry-After.
- Note: the limits in this release lived in memory and therefore did nothing on Netlify. Superseded by 0.0.21, which moves them to Blobs. The only hard cap on spend remains a spend limit set on the Anthropic account itself.

## [0.0.19] — 2026-04-22

### Added
- 8 new hero images (hero-17 to hero-24), converted from desktop JFIF files

## [0.0.18] — 2026-04-22

### Fixed
- Hero image cycling: slots now coordinate so the same image can never appear in two slots at once

## [0.0.17] — 2026-04-21

### Added
- 16 hero images now cycle across 4 slots with staggered 9s fade transitions
- Mobile hero: single full-width image (separate from desktop grid)
- Chat widget `aria-expanded` and dynamic `aria-label` on open/close

### Changed
- Hero images moved from `public/images/hero/` to `src/assets/images/hero/` — now use Astro `<Image />` for optimisation and CLS prevention
- CTA subtext: removed opacity modifier, now full `text-gray-900` for WCAG AA compliance

### Removed
- `<meta name="keywords">` — ignored by all major search engines

## [0.0.16] — 2026-04-21

### Added
- Split hero layout: text left, product photo grid right (three real images of prints and laser work)
- Hero images added to `public/images/hero/`

### Changed
- Hero section redesigned from centred text-only to a two-column layout with product imagery
- `temporary screenshots/` added to `.gitignore`

## [0.0.15] — 2026-04-21

### Changed
- Light mode page background changed from white to `#FAF7F4`
- CTA band switched to dark text (`text-gray-900`) on mint background — fixes WCAG AA contrast failure (~2.8:1 → 5.4:1)
- "View Our Work" secondary button is now a true ghost in dark mode (transparent bg, no dark fill)
- Service card icons updated: FDM now shows a 3D cube, SLA shows a sparkle/precision icon, Custom Design shows a pencil
- Theme toggle refactored to use `data-theme-toggle` attributes — fixes broken mobile toggle caused by duplicate IDs
- Theme toggle button gains `focus-visible` ring for keyboard accessibility
- Mobile menu button gains `aria-expanded` attribute, toggled correctly by JS
- Active nav links now carry `aria-current="page"` on both desktop and mobile

### Fixed
- Removed invalid `<meta name="title">` tag from layout
- Silenced Astro hint on JSON-LD script by adding explicit `is:inline`

## [0.0.14] — 2026-04-21

### Added
- AI-powered Tilly chatbot via Claude Haiku (`netlify/functions/chat.js`) — replaces keyword matching with natural language responses
- Keyword matcher kept as silent fallback if the API call fails
- Input disabled during API call to prevent double-sends

### Changed
- `sendMessage` is now async; send button and Enter key both route through a shared `submitInput` handler

## [0.0.13] — 2026-04-21

### Added
- Tilly — keyword-based FAQ chatbot on the homepage with quick-reply buttons
- Tilly knowledge base: materials, laser, file formats, sizing, turnaround, pricing, ordering, delivery, post-processing
- Profanity filter on Tilly inputs
- Randomised fallback messages when Tilly can't match a question
- Human escalation entry in Tilly linking to info@mintprints.im
- Facebook link in Tilly social media responses
- Gallery link in Tilly for image/examples questions
- `og:image:width`, `og:image:height`, and `fb:app_id` Open Graph meta tags

### Changed
- Laser wattage corrected to 80W continuous / 100W peak across equipment page, FAQ, and chatbot
- Mobile nav active state fixed

### Fixed
- All hyperlinks in Tilly responses corrected
- Duplicate `</head>` tag removed from Layout.astro
- `.claude/` added to `.gitignore`
- Removed stray `tillysmall.jpg` from repo root
- `package.json` version synced to match CHANGELOG (was stuck at 0.0.1)

## [0.0.12] - 2025-11-25

### Added

- Privacy Policy page with comprehensive data protection information
  - Information collection and usage details
  - Data sharing and storage policies
  - Cookie and tracking technology disclosure
  - User rights and contact information
- Terms & Conditions page with complete legal terms
  - Service descriptions and ordering process
  - Payment terms and conditions
  - Intellectual property and design file policies
  - Quality standards and tolerances
  - Returns, refunds, and cancellation policy
  - Liability limitations and user responsibilities
- Legal page links added to footer (Privacy Policy and Terms & Conditions)

## [0.0.11] - 2025-11-25

### Added

- File upload capability to contact form
  - Support for 3D printing files (STL, OBJ, 3MF, STEP, GCODE)
  - Support for laser cutting files (LBRN, LBRN2, SVG, DXF)
  - Support for PDF and ZIP files
  - Multiple file upload support
  - 10MB per file size limit with client-side validation
  - Clear helper text showing accepted file types

### Changed

- Contact form message textarea is now resizable (vertical resize enabled)
- Contact form layout updated - form box now 50% wider (2/3 width vs 1/3 for contact info)
- Updated FAQ to include email contact option alongside contact form

## [0.0.10] - 2025-11-25

### Added

- FAQ (Frequently Asked Questions) page with comprehensive information
  - General questions about services and location
  - 3D printing details (FDM vs SLA, materials, file formats, sizes, timeframes)
  - Laser cutting and etching capabilities and materials
  - Design services and customization options
  - Ordering, payment, and delivery information
  - Technical specifications and requirements
  - USA shipping restrictions notice
  - FAQ link added to header and footer navigation

### Changed

- Removed local pickup/collection options from FAQ
- Updated payment methods (removed cash option)
- Clarified international shipping availability

## [0.0.9] - 2025-11-24

### Added

- Custom 404 error page with helpful navigation
  - Large, clear 404 display with emoji decorations
  - Quick links to all main pages (Home, Gallery, Equipment, Contact)
  - Friendly error message and suggestions
  - Fun 3D printing-themed error joke
  - Consistent branding and dark mode support

## [0.0.8] - 2025-11-24

### Added

- Enhanced spam protection on contact form with multiple layers:
  - "I am not a robot" checkbox verification
  - Time-based validation (prevents instant bot submissions)
  - Multiple honeypot fields (bot-field, website, confirm-email)
  - Content filtering for suspicious patterns and spam keywords
  - Profanity filter for message and name fields
  - Client-side validation before form submission

## [0.0.7] - 2025-11-24

### Added

- Equipment page showcasing Omtech 100W CO2 laser, Bambu Lab X1C printers, and Elegoo 5K resin printers
- Detailed specifications and capabilities for each piece of equipment
- Equipment link in header and footer navigation
- Redbubble shop promotion section on equipment page highlighting custom apparel and accessories

### Changed

- Updated favicon, apple-touch-icon, and OG image to use custom mint leaf logo with transparent background

## [0.0.6] - 2025-11-24

### Added

- Trustpilot branding and call-to-action on testimonials page
- Elfsight Instagram feed widget on gallery page
- Version management documentation in README

### Changed

- Updated all email addresses from hello@mintprints.im to info@mintprints.im
  - Footer email link
  - Contact page email link
  - JSON-LD structured data in Layout

## [0.0.5] - 2025-11-22

### Added

- Comprehensive SEO improvements
  - Open Graph meta tags for Facebook/LinkedIn sharing
  - Twitter Card meta tags for Twitter sharing
  - Canonical URLs for all pages
  - robots.txt file for search engine crawling
  - Automatic sitemap generation via @astrojs/sitemap
  - JSON-LD structured data (LocalBusiness schema)
  - Custom OG image for social sharing
  - Keywords and author meta tags
  - Theme color meta tag

### Changed

- Updated Redbubble links site-wide to correct shop URL

## [0.0.4] - 2025-11-22

### Changed

- Cleaned up Trustpilot logo on testimonials page
- Removed empty Trustpilot widget placeholder (requires valid business ID)

### Fixed

- Fixed 404 errors on static pages by removing SPA redirect from netlify.toml
- Added trailingSlash config to Astro for consistent URL handling

## [0.0.3] - 2025-11-21

### Added

- Thank you page for successful form submissions
- Form redirect to custom thank you page after submission

### Changed

- Updated Etsy and Redbubble icons with official Simple Icons logos
- Etsy now shows full wordmark logo
- Redbubble now shows "RB" circular logo

### Fixed

- Form redirect now uses trailing slash for Netlify compatibility

## [0.0.2] - 2025-11-21

### Added

- Dark mode support with toggle button in header
- Dark mode set as default theme
- Theme preference saved to localStorage
- Smooth transitions between light and dark modes

### Changed

- Updated all components with dark mode colour variants
- Header, Footer, and all pages now support dark mode
- Form inputs styled for dark mode
- Service cards, buttons, and UI elements adapted for dark theme

## [0.0.1] - 2025-11-21

### Added

- Initial release of Mint Prints website
- Home page with hero section and services overview
  - FDM (Plastic) Printing
  - SLA (Resin) Printing
  - Laser Cutting & Etching
  - Custom Design
- Gallery page with Instagram integration (@mintprintsiom)
- Contact page with Netlify Forms
  - Honeypot spam protection
  - Email and social media links
  - Etsy and Redbubble shop links
- Testimonials page with Trustpilot widget embed
- Responsive navigation with mobile menu
- Footer with social links and quick navigation
- Mint green (#64c864) brand colour scheme
- Netlify deployment configuration
- Custom favicon
