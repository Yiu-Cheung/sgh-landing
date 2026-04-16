# SGH Landing Page

Marketing site for [Smart Gallery Hub](https://smartgalleryhub.com) — AI metadata automation for photographers.

Built with [Astro](https://astro.build) + Tailwind CSS + MDX. Deployed to Cloudflare Pages.

## Pages

- `/` — Homepage (hero, features, pricing, CTAs)
- `/privacy` — Privacy policy (MDX)
- `/terms` — Terms of service (MDX)
- `/download` — Desktop app download links

Legal pages live in `src/pages/*.mdx` and use `FrontLayout`. All other pages use `BaseLayout`.

## Structure

```
public/          static assets (favicons, og-image, screenshots)
src/
  layouts/       BaseLayout + FrontLayout
  components/    reusable Astro partials
  pages/         routes (.astro / .mdx)
```

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview built site |

## Deploy

Pushes to `main` auto-deploy via Cloudflare Pages. Production URL: **https://smartgalleryhub.com**.

## Assets

- `public/main.png` — hero screenshot (1.4 MB, 2083×1151)
- `public/og-image.png` — social card image (1200×630), regenerate via:
  ```sh
  ffmpeg -i public/main.png \
    -vf "scale=w=1200:h=630:force_original_aspect_ratio=increase,crop=1200:630" \
    -y public/og-image.png
  ```
- `public/favicon.{ico,svg}` — browser tab icons
- `public/features/` — feature-tile screenshots
- `public/logo.png` — brand logo

## Related repos

- Main app: `Microstock-AiTools-V3` (Electron + React + Express)
- License worker: `sgh-license-worker` (Cloudflare Worker + Polar integration)
