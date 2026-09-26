-- Language support for blog posts. Run once in the Supabase SQL editor.
--
-- language:        which blog a post belongs to. 'en' posts live at
--                  /blogs/article/<slug>; 'de' at /de/ratgeber/<slug>;
--                  'es' at /es/guias/<slug> (see BLOG_SEGMENTS in
--                  src/i18n/locales.js). Existing rows become 'en'.
-- translation_key: posts that are versions of the same article share a key,
--                  which is what links them with hreflang. Null for posts
--                  with no translation.

alter table public.posts
  add column if not exists language text not null default 'en',
  add column if not exists translation_key text;

alter table public.posts drop constraint if exists posts_language_check;
alter table public.posts
  add constraint posts_language_check check (language in ('en', 'es', 'pt', 'fr', 'de', 'it', 'nl', 'pl'));

create index if not exists posts_language_status_idx on public.posts (language, status, created_at desc);
create index if not exists posts_translation_key_idx on public.posts (translation_key) where translation_key is not null;

-- Make the new columns visible to the API immediately.
notify pgrst, 'reload schema';
