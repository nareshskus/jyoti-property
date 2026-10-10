"use client";

import { Loader2, UploadCloud } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const propertySubmissionSchema = z
  .object({
    title: z.string().min(4, "Please enter a clear property title."),
    listingType: z.enum(["buy", "rent"]),
    propertyType: z.string().min(2, "Please choose a property type."),
    city: z.string().min(2, "City is required."),
    locality: z.string().min(2, "Locality is required."),
    address: z.string().min(8, "Address is required."),
    price: z.coerce.number().min(1, "Price is required."),
    bedrooms: z.coerce.number().min(0).optional(),
    bathrooms: z.coerce.number().min(0).optional(),
    areaSqft: z.coerce.number().min(1, "Area is required."),
    description: z.string().min(15, "Please share a clearer description."),
    contactName: z.string().min(2, "Please add the owner or contact name."),
    contactPhone: z.string().min(8, "Please provide a valid contact number."),
  })
  .superRefine((values, ctx) => {
    if (values.propertyType === "Plot") {
      return;
    }

    if ((values.bedrooms ?? 0) < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["bedrooms"],
        message: "Bedrooms are required for this property type.",
      });
    }

    if ((values.bathrooms ?? 0) < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["bathrooms"],
        message: "Bathrooms are required for this property type.",
      });
    }
  });

export default function ListPropertyPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof propertySubmissionSchema>>({
    resolver: zodResolver(propertySubmissionSchema),
    defaultValues: {
      title: "",
      listingType: "buy",
      propertyType: "Apartment",
      city: "",
      locality: "",
      address: "",
      price: 0,
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 0,
      description: "",
      contactName: "",
      contactPhone: "",
    },
  });

  const propertyType = watch("propertyType");
  const isPlotListing = propertyType === "Plot";

  useEffect(() => {
    if (isPlotListing) {
      reset((currentValues) => ({
        ...currentValues,
        bedrooms: 0,
        bathrooms: 0,
      }));
    }
  }, [isPlotListing, reset]);

  async function handleFilesPicked(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;

    if (!fileList || fileList.length === 0) {
      return;
    }

    setIsReadingFiles(true);

    try {
      const dataUrls = await Promise.all(
        Array.from(fileList).slice(0, 6).map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error("Could not read the selected file."));
              reader.readAsDataURL(file);
            }),
        ),
      );

      setUploadedImages((current) => [...current, ...dataUrls].slice(0, 6));
    } catch {
      toast.error("One or more images could not be read. Please try again.");
    } finally {
      setIsReadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function onSubmit(values: z.infer<typeof propertySubmissionSchema>) {
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one property photo before submitting.");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      toast.error("Supabase is not configured in this environment.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("Please log in before submitting your property.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", session.user.id)
      .maybeSingle();

    const insertPayload = {
      created_by: session.user.id,
      title: values.title.trim(),
      description: values.description.trim(),
      listing_type: values.listingType,
      property_type: values.propertyType,
      city: values.city.trim(),
      locality: values.locality.trim(),
      address: values.address.trim(),
      price: Number(values.price),
      bedrooms: isPlotListing ? 0 : Number(values.bedrooms ?? 0),
      bathrooms: isPlotListing ? 0 : Number(values.bathrooms ?? 0),
      area_sqft: Number(values.areaSqft),
      image_paths: uploadedImages,
      cover_image_path: uploadedImages[0],
      publication_status: "pending_approval",
      availability_status: "available",
      owner_name_private: values.contactName.trim() || profile?.full_name || "Property owner",
      owner_phone_private: values.contactPhone.trim() || profile?.phone || "",
      owner_email_private: session.user.email ?? "",
    };

    const { error } = await supabase.from("properties").insert(insertPayload);

    if (error) {
      console.error(error);
      toast.error("Your property could not be submitted. Please try again.");
      return;
    }

    setUploadedImages([]);
    reset();
    toast.success("Property submitted successfully. It is now pending admin approval.");
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
              <select {...register("listingType")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400">
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property type</label>
              <select {...register("propertyType")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400">
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Plot">Plot</option>
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
              <input type="number" {...register("areaSqft")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="1200" />
              {errors.areaSqft ? <p className="mt-2 text-sm text-red-600">{errors.areaSqft.message}</p> : null}
            </div>

            {!isPlotListing ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bedrooms</label>
                  <input type="number" {...register("bedrooms")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="2" />
                  {errors.bedrooms ? <p className="mt-2 text-sm text-red-600">{errors.bedrooms.message}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bathrooms</label>
                  <input type="number" {...register("bathrooms")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="2" />
                  {errors.bathrooms ? <p className="mt-2 text-sm text-red-600">{errors.bathrooms.message}</p> : null}
                </div>
              </>
            ) : null}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Owner / contact name</label>
              <input {...register("contactName")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Owner name" />
              {errors.contactName ? <p className="mt-2 text-sm text-red-600">{errors.contactName.message}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Contact number</label>
              <input {...register("contactPhone")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="+91 98765 43210" />
              {errors.contactPhone ? <p className="mt-2 text-sm text-red-600">{errors.contactPhone.message}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Property photos</label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesPicked} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <UploadCloud className="h-4 w-4" />
                  {isReadingFiles ? "Uploading images..." : "Upload property photos"}
                </button>
                <div className="mt-4 flex flex-wrap gap-3">
                  {uploadedImages.length > 0 ? (
                    uploadedImages.map((image, index) => (
                      <img key={`${image}-${index}`} src={image} alt={`property preview ${index + 1}`} className="h-20 w-20 rounded-xl object-cover shadow-sm" />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Add up to 6 photos of the property.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea {...register("description")} rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-slate-400" placeholder="Describe the property location, layout, highlights, and amenities." />
              {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description.message}</p> : null}
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || isReadingFiles}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit property"}
          </button>
        </form>
      </div>
    </div>
  );
}
