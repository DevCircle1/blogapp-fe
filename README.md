# Talk & Tool

React + Vite front end for [talkandtool.com](https://talkandtool.com) — free browser-based
calculators, converters, text utilities, and developer tools, plus a Supabase-backed blog.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Vite build, then generates the sitemap, then prerenders static HTML |
| `npm run sitemap` | Writes `dist/sitemap.xml` (also pulls blog URLs from Supabase) |
| `npm run prerender` | Writes per-route static HTML into `dist` |
| `npm run smoke` | Server-renders all tool components to catch render-time crashes |
| `npm run og:image` | Regenerates `public/og-cover.png` |
| `npm run lint` | ESLint |
| `npm run preview` | Serves `dist` locally |

## How the SEO pipeline fits together

The app is a client-rendered SPA, so a plain build serves the same empty `index.html` for
every URL. Three pieces address that:

1. **`src/components/common/Seo.jsx`** — the only place head tags are set. Every indexable
   route renders exactly one `<Seo>` so title, description, canonical, Open Graph, and robots
   directives cannot drift apart. Private pages pass `noindex`.

2. **`scripts/prerender.mjs`** — after the Vite build, writes a real HTML file per route
   (`dist/tools/word-counter.html` and so on) carrying that route's actual head tags and a
   plain-HTML copy of its opening content. Crawlers that do not run JavaScript — social
   unfurlers especially — get the right page immediately. React replaces `#root` on mount.

   Files are written as `<route>.html`, not `<route>/index.html`: Netlify serves the former
   at `/route` directly, while the directory form redirects to a trailing-slash URL that
   would disagree with the canonical tag inside the page.

3. **`scripts/routes.mjs`** — the single list of indexable URLs, consumed by both the
   prerenderer and the sitemap generator so the two cannot disagree.

`dist/app.html` is the neutral SPA shell that `netlify.toml` rewrites unmatched paths to. It
deliberately carries no canonical tag, because genuinely dynamic routes (blog articles,
category pages) are served from it and set their own tags once React mounts.

### Adding a tool

1. Add an entry to the relevant file in `src/components/tools/data/` with `slug`, `title`,
   `shortTitle`, `description`, `icon`, `category`, `tags`, `intro`, `steps`, and `faqs`.
   That content is what makes the page rank — write it specifically for that tool. Boilerplate
   repeated across pages reads as duplicate content.
2. Add the component to the matching file in `src/components/tools/impl/`.
3. Register it in `TOOL_COMPONENTS` in `src/components/tools/PremiumToolSuite.jsx`.
4. Run `npm run smoke` and `npm run build`.

Slugs are permanent. Renaming one breaks an indexed URL — add a 301 in `netlify.toml` instead.

## Environment

Copy `.env.example` to `.env`. The `VITE_SUPABASE_*` values are compiled into the public
bundle by design; never put a service-role key there.

AdSense slot IDs are optional — `AdSlot` renders nothing until they are set, which is
deliberate: an empty ad container on a live page is an AdSense policy problem.

## Deployment

Netlify, configured entirely in `netlify.toml` (build command, redirects, headers). Redirect
order matters and static files win over redirects, which is what lets the prerendered pages
take precedence over the SPA fallback.
