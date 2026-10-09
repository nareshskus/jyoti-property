alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;
alter table public.property_interests enable row level security;
alter table public.property_images enable row level security;

create policy "Any visitor can read public published properties" 
  on public.properties for select
  using (publication_status = 'published' and availability_status = 'available');

create policy "Customers can read their own profile" 
  on public.profiles for select
  using (auth.uid() = id);

create policy "Customers can create their own profile if authenticated" 
  on public.profiles for insert
  with check (auth.uid() = id and (role = 'customer' or role = 'admin'));

create policy "Admin can view all profiles" 
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Customers can create enquiry records for themselves" 
  on public.enquiries for insert
  with check (auth.uid() = customer_id or customer_id is null);

create policy "Customers can read their own enquiries" 
  on public.enquiries for select
  using (auth.uid() = customer_id);

create policy "Admins can manage all enquiries" 
  on public.enquiries for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Customers can manage their own interests" 
  on public.property_interests for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

create policy "Admins can view all interests" 
  on public.property_interests for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Customers can create submissions linked to themselves" 
  on public.properties for insert
  with check (auth.uid() = created_by and publication_status = 'pending_approval');

create policy "Customers can view their own properties" 
  on public.properties for select
  using (auth.uid() = created_by);

create policy "Customers cannot publish or approve own properties" 
  on public.properties for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by and publication_status = 'pending_approval');

create policy "Admin can manage all properties" 
  on public.properties for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Customers can read own property images" 
  on public.property_images for select
  using (exists (select 1 from public.properties where properties.id = property_images.property_id and properties.created_by = auth.uid()));

create policy "Admins can manage property images" 
  on public.property_images for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');
