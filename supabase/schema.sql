-- Enable RLS
alter table tours enable row level security;
alter table tour_guides enable row level security;
alter table tour_clients enable row level security;

-- Create tables
create table tours (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date date not null,
  bus_number text not null,
  start_time time not null,
  end_time time not null,
  meeting_point text not null,
  guide_id uuid references tour_guides(id),
  created_at timestamp with time zone default now()
);

create table tour_guides (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  phone text not null,
  availability boolean default true,
  created_at timestamp with time zone default now()
);

create table tour_clients (
  id uuid default gen_random_uuid() primary key,
  tour_id uuid references tours(id) on delete cascade,
  name text not null,
  phone text not null,
  check_in_status text check (check_in_status in ('pending', 'checked-in', 'no-show')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Create RLS policies
create policy "Enable read access for authenticated users" on tours
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on tours
  for insert with check (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on tour_guides
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on tour_guides
  for insert with check (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on tour_clients
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on tour_clients
  for insert with check (auth.role() = 'authenticated');