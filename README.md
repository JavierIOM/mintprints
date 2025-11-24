# Mint Prints

3D Printing, Laser Cutting & Custom Design on the Isle of Man - Where all your prints are Mint!

## Tech Stack

- **Framework:** Astro 5
- **Styling:** Tailwind CSS 4
- **Hosting:** Netlify
- **Forms:** Netlify Forms

## Features

- Responsive design with dark mode support
- Contact form with honeypot spam protection
- Instagram gallery integration
- SEO optimized (Open Graph, Twitter Cards, JSON-LD structured data)
- Automatic sitemap generation

## Pages

- **Home** - Hero section and services overview
- **Gallery** - Instagram feed integration
- **Testimonials** - Customer reviews via Trustpilot
- **Contact** - Contact form and social links

## Services

- FDM (Plastic) 3D Printing
- SLA (Resin) 3D Printing
- Laser Cutting & Etching
- Custom Design

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Version Management

**IMPORTANT:** When making changes to the site:

1. **Always update [CHANGELOG.md](CHANGELOG.md)** with a new version entry
2. **Always update the version number** in [src/components/Footer.astro](src/components/Footer.astro)
3. Follow semantic versioning: MAJOR.MINOR.PATCH (currently using 0.0.x for initial development)
4. Document all changes under appropriate categories:
   - **Added** - New features
   - **Changed** - Changes to existing functionality
   - **Fixed** - Bug fixes
   - **Removed** - Removed features

## Deployment

The site automatically deploys to Netlify on push to the main branch.

## Links

- Website: https://mintprints.im
- Instagram: [@mintprintsiom](https://www.instagram.com/mintprintsiom/)
- Facebook: [Mint Prints IOM](https://www.facebook.com/mintprintsiom)
- Etsy: [MintPrintsIOM](https://www.etsy.com/shop/MintPrintsIOM)
- Redbubble: [manxcraft](https://www.redbubble.com/people/manxcraft/shop)
