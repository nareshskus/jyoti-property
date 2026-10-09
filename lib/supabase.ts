import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "https://example.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "demo-key";
const serviceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseConfig = {
  url,
  anonKey,
  serviceKey,
  jwksUrl:
    process.env.SUPABASE_JWKS_URL ?? `${url}/auth/v1/.well-known/jwks.json`,
};

export function getSupabaseBrowserClient() {
  if (!url || !anonKey || url.includes("example")) {
    return null;
  }

  const { createBrowserClient } = require("@supabase/ssr") as typeof import("@supabase/ssr");

  return createBrowserClient(url, anonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        return undefined;
      },
    },
  });
}

export async function getSupabaseServerClient() {
  if (!url || !anonKey || url.includes("example")) {
    return null;
  }

  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Ignore in server component and route handlers when cookies are read-only.
        }
      },
    },
  });
}

export function getSupabaseAdminClient() {
  if (!url || !serviceKey || url.includes("example")) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("example"),
);
