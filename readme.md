# WatchCash

Landing site for buying and selling luxury watches. Multi-page static site with forms, sliders, modals, and reference sections (serial numbers, year production, shipping, legal pages).

## Tech stack

- **Build:** [Vite](https://vitejs.dev/) 4.x
- **Templating:** [Handlebars](https://handlebarsjs.com/) (partials: `templates/`, `sections/`)
- **Styles:** [Sass](https://sass-lang.com/)
- **Scripts:** ES modules; TypeScript for type-checking on build
- **UI:** [Swiper](https://swiperjs.com/) (sliders), [intl-tel-input](https://github.com/jackocnr/intl-tel-input) (phone fields)
- **Images:** PNG/JPEG in `public/` converted to WebP via [Sharp](https://sharp.pixelplumbing.com/); `<picture>` helper for WebP + fallback
- **Code quality:** ESLint, Prettier

## Requirements

- [Node.js](https://nodejs.org/) v16+

## Quick start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR; runs WebP conversion and watch |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run webp` | Convert PNG/JPEG in `public/` to WebP once |
| `npm run webp:watch` | Watch `public/` and convert new/changed images to WebP |
| `npm run lint` | Run ESLint on `.ts` files |

## Project structure

```
├── public/           # Static assets; PNG/JPEG here are converted to WebP
├── scripts/          # convertToWebp.js (used by Vite plugin)
├── src/
│   ├── index.html    # Entry; other .html in src/ are additional pages
│   ├── js/
│   │   ├── main.js   # Entry; imports modules (modals, sliders, forms, video, utils, faq)
│   │   └── modules/  # modals, sliders, forms, video, faq, utils, constants
│   ├── sections/     # Handlebars partials for page sections (e.g. section-hero.html)
│   ├── styles/       # Sass: base, layout, vendors
│   └── templates/    # Handlebars partials: head, header, footer, modals, etc.
├── getHTMLFileNames.js  # Collects all .html in src/ for multi-page build
├── vite.config.js    # Handlebars plugin, WebP plugin, picture helper, base path
└── package.json
```

## Pages

- **Index** — hero, who we are, promise, shop, trust, brands, sell CTA, result, social, reviews, team, partner, FAQ
- **About Us** — company info, mission, guarantees, shipping, how to sell, etc.
- **Sell My Watch** — multi-step form (drag-drop, phone, custom select, progressive reveal)
- **Reference:** Serial Numbers, Year Production, Product Dates, Country/Clasp/Model codes
- **Legal:** Shipping & Returns, Privacy Policy, Terms and Conditions
- **Thanks** (post-submit), **404**

## Images (WebP + fallback)

Place PNG or JPEG in `public/`. They are converted to WebP when you run `npm run dev` or `npm run build`. Use the **picture** Handlebars helper so the page gets `<picture>` with WebP and fallback:

```html
{{{picture "/images/hero.png" alt="Hero image"}}}
{{{picture "/images/photo.jpg" alt="Photo" class="rounded"}}}
```

Use **triple braces** `{{{ ... }}}` so the HTML is not escaped. Optional hash: `alt`, `class`, `loading`, `width`, `height`, `sources` (array of `{ media, srcset }` for responsive sources).

```

## License

MIT
