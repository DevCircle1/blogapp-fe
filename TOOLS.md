# The ten spec tools — what was built and how to finish setup

Built from `Downloads/files.zip`, adapted to this repo (Vite + React Router + a prerender step, not Next.js).
72 new indexable pages, all prerendered into static HTML and listed in `sitemap.xml`.

## Layout

- `src/components/tools/flagship/` — one folder per tool. Each has `pages.js` (all page copy, FAQ, titles),
  a `*Client.jsx` (the interactive part) and a `*Page.jsx`. `FlagshipShell.jsx` is the shared page chrome;
  `registry.js` feeds `scripts/routes.mjs`, so the sitemap and the prerender never disagree with the app.
- `src/lib/<tool>/` — the engines, pure JS, no DOM, tested in Node (`scripts/checks/*.mjs`).
- Routes: `src/appRoutes.jsx`. Directory entries: `standaloneTools` in `src/components/tools/toolCatalog.js`.
- Run every check: `npm run check:tools`. Build: `npm run build`.

## One-time Supabase setup (nothing breaks without it — the tools fall back to bundled data)

Run in the SQL editor: `supabase/tool_specs.sql` (usage counters, bank requests, parse failures, resume checks),
`supabase/llm_models.sql`, `supabase/tax_years.sql`, `supabase/schema_type_status.sql`.
Regenerate the seeded ones after editing the data files: `node scripts/llm-seed-sql.mjs`,
`node scripts/tax-seed-sql.mjs`, `node scripts/schema-seed-sql.mjs`.
`supabase/gsc.sql` and `supabase/functions/gsc-sync` are the **unfinished** Search Console OAuth path (see below).

## Recurring maintenance (this is the moat the specs describe)

| What | Where | When |
|---|---|---|
| LLM prices + "verified" date | `src/data/llmModels.js` (or the `llm_models` table) | weekly |
| Pakistan tax slabs | `src/data/pkTaxYears.js` (or `tax_years`) | every federal budget; add a year, flip `isCurrent`, move the 301 in `netlify.toml` |
| Google rich-result eligibility | `src/lib/schema/types/*.js` `status` (or `schema_type_status`) | when Google changes support |

## Things that need a human decision or check

1. **2026-27 Pakistan slabs come from the Finance Bill 2026 as published by FBR**, not yet the Finance Act.
   The 2024-25 and 2025-26 slabs come from FBR's consolidated Income Tax Ordinance editions. Replace the
   2026-27 `sourceUrl` with the Act once you have it.
2. **Bank pages (HBL, Meezan, Chase):** the parser finds columns from the statement's own header, but the
   per-bank copy describes typical layouts and was not checked against real statements. Test with your own
   statements before promoting those pages, and expect to correct the "layout" notes.
3. **Search Console OAuth is not built.** The CSV/ZIP upload path is complete. The Edge Function is an untested
   sketch and Google's sensitive-scope verification takes weeks — start that first if you want it.
4. **No OCR** for scanned bank statements (the tool says so instead of guessing).
5. **The WhatsApp export guide** has steps but no screenshots (`/blog/how-to-export-whatsapp-chat`).
6. **Session replay:** the site runs Microsoft Clarity. Every tool wrapper carries `data-clarity-mask="true"`
   so file contents stay out of recordings. Keep it when editing.
7. `scripts/checks/csv-scale.md` lists exactly what was tested for the "1GB+" claim. Re-test before raising it.
