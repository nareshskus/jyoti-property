do $$
  declare
    admin_uuid uuid;
    customer_uuid uuid;
  begin
    select id into admin_uuid from auth.users where email = 'admin@jyotiproperty.com' limit 1;
    if admin_uuid is not null then
      insert into public.profiles (id, full_name, email, phone, role)
      values (admin_uuid, 'Jyoti Property Admin', 'admin@jyotiproperty.com', '+91 98765 43210', 'admin')
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

-- Sample property rows are intentionally kept as app-level demo data to avoid leaking unapproved property records.
-- When a live Supabase project is connected, replace this with real property insertion logic after admin approval.
