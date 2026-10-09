create extension if not exists pgcrypto;

create type public.role_enum as enum ('customer', 'admin');
create type public.listing_type_enum as enum ('buy', 'rent');
create type public.publication_status_enum as enum ('pending_approval', 'published', 'rejected', 'unpublished');
create type public.availability_status_enum as enum ('available', 'sold', 'rented');
create type public.enquiry_status_enum as enum ('new', 'contacted', 'visit_scheduled', 'closed');

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
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_property_interests_customer on public.property_interests(customer_id);
create index if not exists idx_property_images_property on public.property_images(property_id);

alter table public.properties
a  add constraint chk_latitude check (latitude is null or (latitude between -90 and 90)),
  add constraint chk_longitude check (longitude is null or (longitude between -180 and 180));
