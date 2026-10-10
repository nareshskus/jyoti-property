"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Building2, FileText, Heart, LogOut, Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const navItems = [
  { href: "/admin", label: "Dashboard Overview", icon: BarChart3 },
  { href: "/admin/properties", label: "Manage Properties", icon: Building2 },
  { href: "/admin/properties/new", label: "Add Property", icon: Plus },
  { href: "/admin/submissions", label: "Customer Submissions", icon: UserRound },
  { href: "/admin/enquiries", label: "Enquiries", icon: FileText },
  { href: "/admin/interests", label: "Interested Properties", icon: Heart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.replace("/login");
      return;
    }

    let isMounted = true;

    const syncAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user ?? null;

      if (!user) {
        if (isMounted) {
          router.replace("/login");
        }
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

      if (!isMounted) {
        return;
      }

      if (profile?.role !== "admin") {
        router.replace("/my-account");
        return;
      }

      setIsAdmin(true);
    };

    syncAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;

      if (!user) {
        if (isMounted) {
          router.replace("/login");
        }
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

      if (!isMounted) {
        return;
      }

      if (profile?.role !== "admin") {
        router.replace("/my-account");
        return;
      }

      setIsAdmin(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.push("/login");
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-8 px-3">
            <div className="text-xl font-bold text-slate-900">Jyoti Property</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Admin panel</div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <button type="button" onClick={handleLogout} className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="min-h-[80vh] rounded-[2rem] border border-slate-200 bg-slate-50/50">{children}</div>
      </div>
    </div>
  );
}
