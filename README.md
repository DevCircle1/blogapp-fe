# Talk & Tool

[Next.js](https://nextjs.org) (App Router) + React front end for [talkandtool.com](https://talkandtool.com) —
free browser-based calculators, converters, text utilities, and developer tools, plus a
Supabase-backed blog.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` | `prebuild` (blog snapshot, then sitemap), `next build`, then `postbuild` (`verify`, which fails the build on any problem) |
| `npm start` | Serves the production build |
| `npm run blog:data` | Fetches every published post and category from Supabase into `.blog-data/blog-data.json`; fails if it cannot, or if there are none |
| `npm run sitemap` | Writes `public/sitemap.xml` from `scripts/routes.mjs` and the blog snapshot |
| `npm run verify` | Checks the prerendered HTML in `.next/server/app` (content present, one title/description/canonical, every tool's interactive root, no links to 404s, no `[object Object]` URLs) |
| `npm run smoke` | Server-renders all tool components to catch render-time crashes |
| `npm run og:image` | Regenerates `public/og-cover.png` |
| `npm run lint` | ESLint |

The build uses webpack (`next build --webpack`): the pages ship WASM image decoders and web workers
that are verified against webpack's output.

## How rendering and SEO fit together

Every URL is rendered to real HTML on the server, so crawlers that do not run JavaScript — social
unfurlers especially — get the page's content, head tags and structured data immediately. React then
hydrates it.

1. **Routes** live in `src/app`. Each `page.jsx` is a thin server component that renders an existing
   client component from `src/components` (those carry a `'use client'` directive). Pages are
   generated at build time with `generateStaticParams` and refreshed in the background by ISR
   (`revalidate`: 10 minutes for blog-driven pages, an hour for the rest).
2. **Two root layouts** so `<html lang>` is correct in the served HTML: `src/app/(en)` for the English
   site at the domain root, and `src/app/[lang]` for the localized sections (`/es`, `/de/ratgeber`, …).
   Both render the same document, `src/app/_components/RootDocument.jsx`. Moving between the two is a
   full page load, which is what Next does across root layouts.
3. **`src/components/common/Seo.jsx`** is the only place head tags are set. Every indexable route renders
   exactly one `<Seo>`, so title, description, canonical, Open Graph, hreflang and robots cannot drift
   apart. Private pages pass `noindex`. It renders plain `<title>`/`<meta>`/`<link>` elements, which
   React 19 hoists into `<head>`.
4. **Unknown URLs get a real 404.** Data-driven routes set `dynamicParams = false` and list every valid
   URL in `generateStaticParams`, so anything else is an unmatched route and is answered by
   `src/app/global-not-found.jsx` (status 404, `noindex`, no canonical). Removed features such as
   `/job-alert` therefore stay 404 with no extra rule. `global-not-found` is still an experimental Next
   option (`next.config.mjs`); it is the supported way to get a styled 404 when an app has more than one root layout.
5. **`scripts/routes.mjs`** is the single list of indexable URLs. It feeds the sitemap, `verify`, and
   the static params for the localized pages, so they cannot disagree about what exists.
   Which component serves each flagship tool URL is `src/app/_lib/flagship.js`.

Redirects and the security and cache headers are in `next.config.mjs`.

### The blog

Blog pages are rendered on the server from Supabase, not fetched after load:

1. **`src/lib/blog/server.js`** fetches every published (`status = approved`) post and every category with
   the publishable key, so row-level security applies as it does for visitors, and sanitises each post
   body. It throws if the credentials are missing, a request fails, or no published post comes back — a
   deploy never ships empty blog pages, and a failed background refresh keeps the last good page.
2. **`scripts/blog-pages.mjs`** turns that snapshot into pages: every post, every category with posts, and
   every localized guide index with posts (`/es/guias`, `/de/ratgeber`), plus the data each page renders
   with. The sitemap, `verify` and the pages themselves all use it.
3. `src/app/_components/Seeded.jsx` hands each page its data through `src/context/seed.js`, so the
   browser hydrates the server HTML without a mismatch and refreshes it in the background. What each page
   shows is derived by the shared functions in `src/lib/blog/views.js`.

Edits to a published post reach the site within ten minutes (ISR). A **new** post's URL, or a category or
guide index that gains its first post, is generated at build time, so it needs a deploy — see
[Rebuilding when posts change](#rebuilding-when-posts-change). Unknown posts, empty categories and empty
guide indexes answer a real 404.

### Adding a tool

1. Add an entry to the relevant file in `src/components/tools/data/` with `slug`, `title`,
   `shortTitle`, `description`, `icon`, `category`, `tags`, `intro`, `steps`, and `faqs`.
   That content is what makes the page rank — write it specifically for that tool. Boilerplate
   repeated across pages reads as duplicate content.
2. Add the component to the matching file in `src/components/tools/impl/`.
3. Register it in `TOOL_COMPONENTS` in `src/components/tools/toolComponents.js`.
4. Run `npm run smoke` and `npm run build`. The page is generated automatically: `/tools/[toolSlug]`
   takes its static params from the catalogue.

Slugs are permanent. Renaming one breaks an indexed URL — add a 301 in `next.config.mjs` instead.

## Environment

Copy `.env.example` to `.env`. The `NEXT_PUBLIC_*` values are compiled into the public bundle by
design; never put a service-role key there. The old `VITE_*` names are still accepted as a fallback
(`next.config.mjs`), so an existing `.env` or Netlify environment keeps working.

AdSense slot IDs are optional — `AdSlot` renders nothing until they are set, which is
deliberate: an empty ad container on a live page is an AdSense policy problem.

## Deployment

Netlify, configured in `netlify.toml` (build command, Node version, the canonical-host redirect). Netlify
detects Next.js and installs its runtime; there is no publish directory.

The build needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the `VITE_`
equivalents) in Netlify's environment variables; without them it fails at `blog:data`.

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
