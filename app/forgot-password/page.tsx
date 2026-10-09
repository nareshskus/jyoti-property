"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured. Add your project keys before enabling password reset.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        toast.error("Supabase is not configured. Add your project keys before enabling password reset.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email.";
      toast.error(message);
    }
  }

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="section-label">Recovery</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Reset password</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" {...register("email")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="you@example.com" />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Sending email..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Return to <Link href="/login" className="font-semibold text-slate-900">Login</Link>
        </p>
      </div>
    </div>
  );
}
