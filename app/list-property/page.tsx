"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

const propertySubmissionSchema = z.object({
  title: z.string().min(4, "Please enter a clear property title."),
  type: z.enum(["buy", "rent"]),
  propertyType: z.string().min(2, "Please choose a property type."),
  city: z.string().min(2, "City is required."),
  locality: z.string().min(2, "Locality is required."),
  address: z.string().min(8, "Address is required."),
  price: z.coerce.number().min(1, "Price is required."),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(1, "Area is required."),
  description: z.string().min(15, "Please share a clearer description."),
});

export default function ListPropertyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof propertySubmissionSchema>>({
    resolver: zodResolver(propertySubmissionSchema),
    defaultValues: {
      title: "",
      type: "buy",
      propertyType: "Apartment",
      city: "",
      locality: "",
      address: "",
      price: 0,
      bedrooms: 2,
      bathrooms: 2,
      area: 0,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof propertySubmissionSchema>) {
    toast.success("Property submitted successfully. Your listing is now pending admin approval.");
    console.info("Demo submission:", values);
  }

  return (
    <div className="container-shell py-16">
      <div className="mb-8 text-center">
        <div className="section-label">List with us</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">List your property</h1>
      </div>

      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Property title</label>
              <input {...register("title")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Skyline Heights Residency" />
              {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Listing type</label>
              <select {...register("type")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400">
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property type</label>
              <select {...register("propertyType")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400">
                <option>Apartment</option>
                <option>Independent House</option>
                <option>Villa</option>
                <option>Commercial Space</option>
                <option>Plot</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
              <input {...register("city")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Enter city" />
              {errors.city ? <p className="mt-2 text-sm text-red-600">{errors.city.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Locality</label>
              <input {...register("locality")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Enter locality" />
              {errors.locality ? <p className="mt-2 text-sm text-red-600">{errors.locality.message}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <input {...register("address")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Street, landmark, city" />
              {errors.address ? <p className="mt-2 text-sm text-red-600">{errors.address.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
              <input type="number" {...register("price")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="7500000" />
              {errors.price ? <p className="mt-2 text-sm text-red-600">{errors.price.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Area (sq ft)</label>
              <input type="number" {...register("area")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="1200" />
              {errors.area ? <p className="mt-2 text-sm text-red-600">{errors.area.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bedrooms</label>
              <input type="number" {...register("bedrooms")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="2" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bathrooms</label>
              <input type="number" {...register("bathrooms")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="2" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea {...register("description")} rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Describe the property location, layout, highlights, and amenities." />
              {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description.message}</p> : null}
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit property"}
          </button>
        </form>
      </div>
    </div>
  );
}
