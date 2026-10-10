"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resolveUserProfileDetails, type AuthUserLike } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function MyAccountPage() {
  const [userDetails, setUserDetails] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted || !user) {
        if (isMounted) {
          setUserDetails(null);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (isMounted) {
        setUserDetails(resolveUserProfileDetails(user as AuthUserLike, profile ?? null));
        setLoading(false);
      }
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;

      if (!user) {
        if (isMounted) {
          setUserDetails(null);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (isMounted) {
        setUserDetails(resolveUserProfileDetails(user as AuthUserLike, profile ?? null));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!loading && !userDetails) {
    return (
      <div className="container-shell py-12 md:py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="section-label">Account</div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Please log in</h1>
          <p className="mt-4 text-slate-600">You need to sign in to view your account details.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-12 md:py-16">
      <div className="mb-8">
        <div className="section-label">Account</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">My account</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Customer profile</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">{userDetails?.name ?? "Loading..."}</div>
          <div className="mt-1 text-sm text-slate-600">{userDetails?.email ?? "Loading..."}</div>
          {userDetails?.phone ? <div className="mt-1 text-sm text-slate-500">{userDetails.phone}</div> : null}
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Saved interests</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">12</div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Submitted listings</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">3</div>
        </div>
      </div>
    </div>
  );
}
