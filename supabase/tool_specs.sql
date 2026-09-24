-- Shared tables for the browser-only tools (bank statement converter, LLM
-- calculators, ATS checker, ...). Run once in the Supabase SQL editor.
-- None of these tables ever stores user content: only counts and enums.

create table if not exists tool_usage (
  id bigserial primary key,
  tool_slug text not null,
  event text not null,               -- 'load' | 'convert' | 'download' | ...
  meta jsonb default '{}',           -- NEVER user content, only counts/enums
  created_at timestamptz default now()
);
create index if not exists tool_usage_slug_created on tool_usage (tool_slug, created_at desc);
alter table tool_usage enable row level security;
drop policy if exists "anon insert" on tool_usage;
create policy "anon insert" on tool_usage for insert to anon with check (true);

create table if not exists tool_config (
  slug text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table tool_config enable row level security;
drop policy if exists "public read" on tool_config;
create policy "public read" on tool_config for select to anon using (true);

-- Bank statement converter ---------------------------------------------------
create table if not exists bank_requests (
  id bigserial primary key,
  bank_name text not null,
  country text,
  created_at timestamptz default now()
);
alter table bank_requests enable row level security;
drop policy if exists "anon insert" on bank_requests;
create policy "anon insert" on bank_requests for insert to anon with check (true);

-- Structure only: column count, detected profile, page count. Never text.
create table if not exists parse_failures (
  id bigserial primary key,
  bank_slug text,
  page_count int,
  column_count int,
  reason text,
  created_at timestamptz default now()
);
alter table parse_failures enable row level security;
drop policy if exists "anon insert" on parse_failures;
create policy "anon insert" on parse_failures for insert to anon with check (true);

-- ATS resume checker: issue CODES and a score only. Never resume content, names,
-- emails or the file itself.
create table if not exists resume_checks (
  id bigserial primary key,
  file_type text,                 -- 'pdf' | 'docx'
  page_count int,
  issues jsonb,                   -- array of issue codes, e.g. ["multi_column","missing_email"]
  score int,
  created_at timestamptz default now()
);
alter table resume_checks enable row level security;
drop policy if exists "anon insert" on resume_checks;
create policy "anon insert" on resume_checks for insert to anon with check (true);
