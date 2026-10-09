"use client";

import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please provide a valid phone number."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured. Configure the project and try again.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        toast.error("Supabase is not configured. Configure the project and try again.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            phone: values.phone,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          role: "customer",
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          toast.warning("Account created, but the customer profile could not be saved. Please verify your database setup.");
        }
      }

      toast.success("Registration submitted. Please check your email to verify your account.");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create your account.";
      toast.error(message);
    }
  }

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="section-label">Create account</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Register</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input {...register("fullName")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Aarav Sharma" />
            {errors.fullName ? <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" {...register("email")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="you@example.com" />
              {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input type="tel" {...register("phone")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="+91 98765 43210" />
              {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-12 outline-none transition focus:border-slate-400"
                placeholder="Create a password"
              />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center text-slate-500" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-slate-900">Login</Link>
        </p>
      </div>
    </div>
  );
}
