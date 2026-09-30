# Talk & Tool

React + Vite front end for [talkandtool.com](https://talkandtool.com) — free browser-based
calculators, converters, text utilities, and developer tools, plus a Supabase-backed blog.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Vite builds, blog snapshot, sitemap, prerender, then `verify` (fails the build on any problem) |
| `npm run blog:data` | Fetches every published post and category from Supabase into `dist-ssr/blog-data.json`; fails if it cannot, or if there are none |
| `npm run sitemap` | Writes `dist/sitemap.xml` from `routes.mjs` and the blog snapshot |
| `npm run prerender` | Server-renders every route, blog included, into static HTML in `dist` |
| `npm run verify` | Checks the generated HTML (content present, one title/description/canonical, no links to 404s) |
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
deliberately carries no canonical tag, because routes without a prerendered page (the login
screens, for example) are served from it and set their own tags once React mounts.

### The blog

Blog pages are prerendered from a build-time snapshot, not fetched after load:

1. **`scripts/blog-data.mjs`** fetches every published (`status = approved`) post and every
   category with the publishable key, so row-level security applies as it does for visitors,
   and sanitises each post body. It fails the build if the credentials are missing, a
   request fails, or no published post comes back — a deploy never ships empty blog pages.
2. **`scripts/blog-pages.mjs`** turns the snapshot into pages: every post, every category
   with posts, and every localized guide index with posts (`/es/guias`, `/de/ratgeber`).
   The sitemap and the prerender both use it, so they list the same URLs.
3. The prerender renders each page with that data and embeds the same data in the page
   (`<script id="page-seed">`, read through `src/context/seed.js`), so the browser hydrates
   the prerendered HTML without a mismatch and refreshes it in the background. What each
   page shows is derived by the shared functions in `src/lib/blog/views.js`.
4. `<head>` tags come from each page's `<Seo>`: the prerender captures react-helmet-async's
   output from the server render. The metadata in `routes.mjs` is only a fallback for pages
   that render no `<Seo>`.

Unknown posts, empty categories and empty guide indexes answer a real 404: the build writes
non-forced rules into `dist/_redirects`, which Netlify applies only when no prerendered file
exists at the path.

A post becomes a static page on the next deploy — see [Rebuilding when posts change](#rebuilding-when-posts-change).

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

Netlify, configured in `netlify.toml` (build command, redirects, headers) plus the
`dist/_redirects` file the build generates. Redirect order matters and static files win over
non-forced redirects, which is what lets the prerendered pages take precedence over the SPA
fallback and the blog's 404 rules.

The build needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify's
environment variables; without them it fails at `blog:data`.

### Rebuilding when posts change

Blog pages are static, so publishing, editing, unpublishing or deleting a post only reaches
the site on the next deploy. Until then the change shows up in lists (they refresh in the
browser), but a new post's URL answers 404 when opened directly, and an edited post shows
its old text until the page refreshes it. Trigger a deploy on every such change:

1. **Create a Netlify build hook.** Site configuration → Build & deploy → Continuous
   deployment → Build hooks → *Add build hook*, name it `Supabase posts`, branch `main`.
   Netlify shows a URL like `https://api.netlify.com/build_hooks/<id>`. Treat it as a secret:
   anyone who has it can start builds.
2. **Store it in Supabase Vault** (SQL editor), so it never appears in code or in this repo:

   ```sql
   select vault.create_secret('https://api.netlify.com/build_hooks/<id>', 'netlify_build_hook');
   ```

3. **Call it when a published post changes.** A database webhook (Database → Webhooks) fires
   on every row change, drafts included. This trigger calls the hook only when a published
   post is added, changed, unpublished or deleted:

   ```sql
   create extension if not exists pg_net;

   create or replace function public.request_site_rebuild()
   returns trigger
   language plpgsql
   security definer
   set search_path = ''
   as $$
   begin
     if (tg_op in ('INSERT', 'UPDATE') and new.status = 'approved')
        or (tg_op in ('UPDATE', 'DELETE') and old.status = 'approved') then
       perform net.http_post(
         url := (select decrypted_secret from vault.decrypted_secrets where name = 'netlify_build_hook'),
         params := jsonb_build_object('trigger_title', 'Supabase: post ' || lower(tg_op))
       );
     end if;
     return null;
   end;
   $$;

   create trigger posts_request_site_rebuild
   after insert or update or delete on public.posts
   for each row execute function public.request_site_rebuild();
   ```

   To test it, change a published post's title and watch Netlify → Deploys; the deploy is
   labelled `Supabase: post update`. Category renames also change pages; add the same trigger
   on `public.categories` (without the status condition) if categories are edited often.

**Repeated edits start repeated builds.** Every save of a published post starts a deploy, so
ten quick corrections queue ten builds. If that becomes a problem, debounce: have the trigger
only mark that a rebuild is due, and let a scheduled job call the hook at most every ten
minutes. The last edit is always included, because the job runs after it:

```sql
create table if not exists public.site_rebuild (id int primary key default 1, due boolean not null default false);
insert into public.site_rebuild (id) values (1) on conflict do nothing;

-- In request_site_rebuild(), replace `perform net.http_post(...)` with:
--   update public.site_rebuild set due = true where id = 1;

create extension if not exists pg_cron;
select cron.schedule('site-rebuild', '*/10 * * * *', $$
  with claimed as (update public.site_rebuild set due = false where id = 1 and due returning 1)
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'netlify_build_hook'),
    params := '{"trigger_title": "Supabase: posts changed"}'::jsonb
  ) from claimed;
$$);
```
