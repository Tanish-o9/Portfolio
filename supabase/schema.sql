-- Supabase Schema for Tanish's AI Village Public Guestbook
-- Row Level Security (RLS) is strictly enabled.

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  message text not null check (char_length(message) between 1 and 280),
  avatar smallint not null default 0 check (avatar between 0 and 7),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.guestbook enable row level security;

-- Public read policy: Only approved entries are visible
create policy "read approved" on public.guestbook
  for select using (approved = true);

-- Public insert policy: Visitors can submit pending entries (approved must be false)
create policy "insert pending" on public.guestbook
  for insert with check (approved = false);

-- Realtime publication
alter publication supabase_realtime add table public.guestbook;
