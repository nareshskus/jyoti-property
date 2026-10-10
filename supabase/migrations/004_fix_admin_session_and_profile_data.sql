-- Ensure the admin and demo customer profiles exist even if the earlier migration ran before the auth users were created.
-- This script is additive and safe to run on an already-migrated database.

create extension if not exists pgcrypto;

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

-- Keep admin access explicit for the admin dashboard and all admin operations.
drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Admin can manage all properties" on public.properties;
create policy "Admin can manage all properties"
  on public.properties for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Admin can manage all enquiries" on public.enquiries;
create policy "Admin can manage all enquiries"
  on public.enquiries for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Admin can view all interests" on public.property_interests;
create policy "Admin can view all interests"
  on public.property_interests for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
