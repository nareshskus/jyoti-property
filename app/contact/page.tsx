"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const enquirySchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please provide a valid phone number."),
  message: z.string().min(10, "Please enter a short enquiry message."),
});

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof enquirySchema>) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      toast.error("Supabase is not configured in this environment.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from("enquiries").insert({
      customer_id: session?.user?.id ?? null,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      status: "new",
    });

    if (error) {
      console.error(error);
      toast.error("Your enquiry could not be sent. Please try again later.");
      return;
    }

    reset();
    toast.success("Your enquiry has been saved. We will get back to you soon.");
  }

  return (
    <div className="container-shell py-16">
      <div className="mb-10 text-center">
        <div className="section-label">Contact us</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Speak with our team</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
          <div className="space-y-5">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Business number</div>
              <div className="mt-2 text-2xl font-semibold">{siteConfig.businessPhone}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Email</div>
              <div className="mt-2 text-lg font-medium text-slate-100">{siteConfig.contactEmail}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-300">WhatsApp</div>
              <div className="mt-2 text-lg font-medium text-slate-100">Official Jyoti Property business number</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                <input {...register("name")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Your name" />
                {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input {...register("phone")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="+91 98765 43210" />
                {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" {...register("email")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="you@example.com" />
              {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Enquiry message</label>
              <textarea {...register("message")} rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Tell us what you are looking for..." />
              {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message.message}</p> : null}
            </div>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Submitting..." : "Send enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
