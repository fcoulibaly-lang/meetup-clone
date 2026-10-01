-- 1. PROFILES: who each person is
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- 2. EVENTS: what's happening, when, where, and who's hosting
create table events (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  location text not null,
  starts_at timestamptz not null,
  host_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- 3. RSVPS: who is going to which event
create table rsvps (
  id bigint generated always as identity primary key,
  event_id bigint not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);

-- Turn on security, then allow everyone to READ
alter table profiles enable row level security;
alter table events enable row level security;
alter table rsvps enable row level security;

create policy "Anyone can read profiles" on profiles for select using (true);
create policy "Anyone can read events" on events for select using (true);
create policy "Anyone can read rsvps" on rsvps for select using (true);

-- Three sample events, typed in by hand (Step 3 of your build order)
insert into events (title, description, location, starts_at) values
  ('Coffee & Conversation', 'Meet new friends over coffee.', 'Dallas, TX', '2026-10-10 10:00-05'),
  ('Board Game Night', 'Bring a game or just come play.', 'Austin, TX', '2026-10-14 18:30-05'),
  ('Saturday Park Walk', 'An easy 2-mile walk together.', 'Houston, TX', '2026-10-17 09:00-05');
