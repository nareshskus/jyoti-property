import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, ChevronLeft, MapPin, MessageCircleMore, Ruler } from "lucide-react";
import { PropertyMapWrapper } from "@/components/property-map-wrapper";
import { buildWhatsAppLink, formatCurrency } from "@/lib/config";
import { getPropertyById } from "@/lib/data";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PropertyDetailPageInner params={params} />;
}

async function PropertyDetailPageInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const isAvailable = property.availabilityStatus === "available";
  const whatsAppLink = buildWhatsAppLink(property.title, property.id);

  return (
    <div className="container-shell py-12 md:py-16">
      <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
        <ChevronLeft className="h-4 w-4" />
        Back to properties
      </Link>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
            {property.listingType === "buy" ? "For Sale" : "For Rent"}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">{property.title}</h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <div className="text-3xl font-bold text-slate-900">
            {property.listingType === "buy" ? formatCurrency(property.price) : `${formatCurrency(property.price)}/month`}
          </div>
          <div className="text-sm text-slate-500">{property.city}, {property.locality}</div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100">
            <Image
              src={property.coverImagePath}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {property.imagePaths.slice(0, 3).map((image, index) => (
              <div key={`${image}-${index}`} className="relative h-32 overflow-hidden rounded-[1.5rem] border border-slate-200">
                <Image src={image} alt={`${property.title} gallery ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">Availability</div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {property.availabilityStatus}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {property.propertyType === "Plot" ? null : (
              <>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500"><BedDouble className="h-4 w-4" /> Bedrooms</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{property.bedrooms}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500"><Bath className="h-4 w-4" /> Bathrooms</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{property.bathrooms}</div>
                </div>
              </>
            )}
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Ruler className="h-4 w-4" /> Area</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">{property.areaSqft} sqft</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Building2 className="h-4 w-4" /> Type</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">{property.propertyType}</div>
            </div>
          </div>

          <div className="space-y-3">
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
              <MessageCircleMore className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
            <Link href="/contact" className="flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Contact Us
            </Link>
            <button type="button" className="flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700" disabled={!isAvailable}>
              Mark as Interested
            </button>
          </div>

        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="section-label">Property overview</div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">About this property</h2>
          <p className="mt-4 text-slate-600">{property.description}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">City</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{property.city}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Locality</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{property.locality}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
              <div className="text-sm text-slate-500">Address</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{property.address}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="section-label">Location</div>
          <div className="mt-3 flex items-center gap-2 text-slate-700">
            <MapPin className="h-4 w-4 text-slate-500" />
            {property.locality}, {property.city}
          </div>
          <div className="mt-6">
            <PropertyMapWrapper latitude={property.latitude} longitude={property.longitude} title={property.title} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/list-property" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">List Your Property</Link>
        <Link href="/properties" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Explore Similar Properties</Link>
      </div>
    </div>
  );
}
