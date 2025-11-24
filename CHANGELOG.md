# Changelog

All notable changes to this project will be documented in this file.

## [0.0.7] - 2025-11-24

### Added

- Equipment page showcasing Omtech 100W CO2 laser, Bambu Lab X1C printers, and Elegoo 5K resin printers
- Detailed specifications and capabilities for each piece of equipment
- Equipment link in header and footer navigation
- Redbubble shop promotion section on equipment page highlighting custom apparel and accessories

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
