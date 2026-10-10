import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Building2, MapPin, Ruler, Star } from "lucide-react";
import { formatCurrency } from "@/lib/config";
import { getAvailabilityTone } from "@/lib/utils";
import type { Property } from "@/lib/data";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.coverImagePath}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-800">
            {property.listingType === "buy" ? "Buy" : "Rent"}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ring-1 ${getAvailabilityTone(property.availabilityStatus)}`}>
            {property.availabilityStatus}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{property.city}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{property.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{property.locality}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">
            {property.listingType === "buy"
              ? formatCurrency(property.price)
              : `${formatCurrency(property.price)}/mo`}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            4.8
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-3 text-sm text-slate-600">
          {property.propertyType === "Plot" ? (
            <>
              <div className="flex items-center gap-2 col-span-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Plot / land parcel
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-slate-400" />
                {property.areaSqft} sq ft
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-slate-400" />
                {property.bedrooms} BHK
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-slate-400" />
                {property.bathrooms} Bath
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-slate-400" />
                {property.areaSqft} sq ft
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View Details
          </Link>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Interested
          </button>
        </div>
      </div>
    </article>
  );
}
