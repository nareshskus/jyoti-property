-- Full setup for a fresh database.
-- Run this single file when creating a brand-new Supabase project.
-- It includes: schema, indexes, RLS policies, admin seeding, and the review workflow.

create extension if not exists pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
    CREATE TYPE public.role_enum AS ENUM ('customer', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type_enum') THEN
    CREATE TYPE public.listing_type_enum AS ENUM ('buy', 'rent');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status_enum') THEN
    CREATE TYPE public.publication_status_enum AS ENUM ('pending_approval', 'published', 'rejected', 'unpublished');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status_enum') THEN
    CREATE TYPE public.availability_status_enum AS ENUM ('available', 'sold', 'rented');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status_enum') THEN
    CREATE TYPE public.enquiry_status_enum AS ENUM ('new', 'contacted', 'visit_scheduled', 'closed');
  END IF;
END
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role public.role_enum not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  listing_type public.listing_type_enum not null,
  property_type text not null,
  city text not null,
  locality text not null,
  address text not null,
  price numeric(12,2) not null check (price >= 0),
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  area_sqft integer not null default 0,
  latitude double precision,
  longitude double precision,
  image_paths text[] not null default '{}',
  cover_image_path text,
  publication_status public.publication_status_enum not null default 'pending_approval',
  availability_status public.availability_status_enum not null default 'available',
  owner_name_private text,
  owner_phone_private text,
  owner_email_private text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  status public.enquiry_status_enum not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_interests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, property_id)
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (property_id, storage_path)
);

create index if not exists idx_properties_publication_status on public.properties(publication_status);
create index if not exists idx_properties_availability on public.properties(availability_status);
create index if not exists idx_properties_city on public.properties(city);
create index if not exists idx_properties_listing_type on public.properties(listing_type);
create index if not exists idx_properties_created_by on public.properties(created_by);
create index if not exists idx_properties_owner_phone on public.properties(owner_phone_private);
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_customer on public.enquiries(customer_id);
create index if not exists idx_property_interests_customer on public.property_interests(customer_id);
create index if not exists idx_property_images_property on public.property_images(property_id);

alter table public.properties
  drop constraint if exists chk_latitude,
  drop constraint if exists chk_longitude;

alter table public.properties
  add constraint chk_latitude check (latitude is null or (latitude between -90 and 90)),
  add constraint chk_longitude check (longitude is null or (longitude between -180 and 180));

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_touch_updated_at on public.properties;
create trigger trg_properties_touch_updated_at
before update on public.properties
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_enquiries_touch_updated_at on public.enquiries;
create trigger trg_enquiries_touch_updated_at
before update on public.enquiries
for each row
execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;
alter table public.property_interests enable row level security;
alter table public.property_images enable row level security;

drop policy if exists "Any visitor can read public published properties" on public.properties;
create policy "Any visitor can read public published properties"
  on public.properties for select
  using (publication_status = 'published');

drop policy if exists "Customers can read their own profile" on public.profiles;
create policy "Customers can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Customers can create their own profile if authenticated" on public.profiles;
create policy "Customers can create their own profile if authenticated"
  on public.profiles for insert
  with check (auth.uid() = id and (role = 'customer' or role = 'admin'));

drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Customers can create enquiry records for themselves" on public.enquiries;
create policy "Customers can create enquiry records for themselves"
  on public.enquiries for insert
  with check (auth.uid() = customer_id or customer_id is null);

drop policy if exists "Customers can read their own enquiries" on public.enquiries;
create policy "Customers can read their own enquiries"
  on public.enquiries for select
  using (auth.uid() = customer_id);

drop policy if exists "Admins can manage all enquiries" on public.enquiries;
create policy "Admins can manage all enquiries"
  on public.enquiries for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Customers can manage their own interests" on public.property_interests;
create policy "Customers can manage their own interests"
  on public.property_interests for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "Admins can view all interests" on public.property_interests;
create policy "Admins can view all interests"
  on public.property_interests for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Customers can create submissions linked to themselves" on public.properties;
create policy "Customers can create submissions linked to themselves"
  on public.properties for insert
  with check (auth.uid() = created_by and publication_status = 'pending_approval');

drop policy if exists "Customers can view their own properties" on public.properties;
create policy "Customers can view their own properties"
  on public.properties for select
  using (auth.uid() = created_by);

drop policy if exists "Customers cannot publish or approve own properties" on public.properties;
create policy "Customers cannot publish or approve own properties"
  on public.properties for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by and publication_status = 'pending_approval');

drop policy if exists "Admin can manage all properties" on public.properties;
create policy "Admin can manage all properties"
  on public.properties for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Customers can read own property images" on public.property_images;
create policy "Customers can read own property images"
  on public.property_images for select
  using (exists (select 1 from public.properties where properties.id = property_images.property_id and properties.created_by = auth.uid()));

drop policy if exists "Admins can manage property images" on public.property_images;
create policy "Admins can manage property images"
  on public.property_images for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Seed the default admin account and a demo customer if they already exist.
do $$
declare
  admin_uuid uuid;
  customer_uuid uuid;
begin
  select id into admin_uuid from auth.users where email = 'admin@jyotiproperty.com' limit 1;
  if admin_uuid is not null then
    insert into public.profiles (id, full_name, email, phone, role)
    values (admin_uuid, 'Jyoti Property Admin', 'admin@jyotiproperty.com', '+91 9415503638', 'admin')
    on conflict (id) do update set
      full_name = excluded.full_name,
      email = excluded.email,
      phone = excluded.phone,
      role = excluded.role;
  end if;

  select id into customer_uuid from auth.users where email = 'customer@example.com' limit 1;
  if customer_uuid is not null then
    insert into public.profiles (id, full_name, email, phone, role)
    values (customer_uuid, 'Demo Customer', 'customer@example.com', '+91 91234 56789', 'customer')
    on conflict (id) do update set
      full_name = excluded.full_name,
      email = excluded.email,
      phone = excluded.phone,
      role = excluded.role;
  end if;
end
$$;

-- Optional: create a sample property once the database is ready and the admin has approved it.
-- Insert your production listings through the app after the admin review process.
