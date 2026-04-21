# Changelog

All notable changes to this project will be documented in this file.

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
