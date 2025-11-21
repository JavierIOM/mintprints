# Mint Prints

Professional 3D printing, laser cutting, and custom design services website.

**Live site:** [mintprints.im](https://mintprints.im)

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Netlify](https://netlify.com) - Hosting and forms

## Pages

- **Home** - Services overview (FDM/SLA printing, laser cutting, custom design)
- **Gallery** - Instagram feed integration
- **Contact** - Contact form with Netlify Forms
- **Testimonials** - Trustpilot reviews widget

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

## Deployment

The site is configured for Netlify deployment. Push to the `master` branch to trigger a build.

Build settings are configured in `netlify.toml`.

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   └── ServiceCard.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── gallery.astro
│   │   ├── contact.astro
│   │   └── testimonials.astro
│   └── styles/
│       └── global.css
├── netlify.toml
└── package.json
```

## License

All rights reserved. Mint Prints.
