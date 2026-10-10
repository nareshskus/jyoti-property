-- Additive workflow migration for approved property review and admin operations.
-- This is intentionally separate from the earlier seeded migrations so it can be applied cleanly to an existing database.

create extension if not exists pgcrypto;

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

create index if not exists idx_properties_created_by on public.properties(created_by);
create index if not exists idx_properties_owner_phone on public.properties(owner_phone_private);
create index if not exists idx_enquiries_customer on public.enquiries(customer_id);

-- Allow logged-in customers to submit properties for admin review and keep contact details visible to admin reviewers.
create policy "Customers can insert pending property submissions"
  on public.properties for insert
  with check (
    auth.uid() = created_by and
    publication_status = 'pending_approval' and
    owner_email_private = auth.jwt()->>'email'
  );

-- Keep the public catalogue restricted to published properties only.
create policy "Published properties are visible to authenticated and anonymous visitors"
  on public.properties for select
  using (publication_status = 'published');

-- Ensure admin users can see all property submissions and review contact details.
create policy "Admins can read all property submissions"
  on public.properties for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Admin note updates are allowed for enquiries, but only for the admin role.
create policy "Admins can update enquiry status"
  on public.enquiries for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');
