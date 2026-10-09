# Jyoti Property

A responsive real estate website for an Indian property brand built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Supabase project URL, anon key, and business contact details.
4. Run the app in development mode:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Supabase setup

1. Create a new Supabase project.
2. Apply migrations in `supabase/migrations` in order.
3. Turn on email authentication and password reset.
4. Create a storage bucket named `property-images` for uploaded listing photos.
5. Set `ADMIN_EMAIL` to the email that should act as the single business admin.
6. Add the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` values in your environment.

## Database schema

The project includes SQL migrations for:

- `profiles`
- `properties`
- `enquiries`
- `property_interests`
- `property_images`

The migrations also define publication and availability workflows and RLS policies that separate public, customer, and admin access.

## Live data model

The website reads property and user data from the connected Supabase database. Demo content has been removed so the app is ready for your real inventory and authentication workflow.

## Deployment

This app is designed for Vercel deployment. Add the Supabase environment variables to the deployment environment before launch.

## Notes

- Use a secure server-side admin check based on `ADMIN_EMAIL`.
- Keep private owner details out of public property responses and client-side pages.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in the browser.
