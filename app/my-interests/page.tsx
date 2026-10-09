import Image from "next/image";
import Link from "next/link";
import { getPublishedProperties } from "@/lib/data";

export default async function MyInterestsPage() {
  const properties = (await getPublishedProperties()).slice(0, 2);

  return (
    <div className="container-shell py-12 md:py-16">
      <div className="mb-8">
        <div className="section-label">Saved homes</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">My interests</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {properties.map((property) => (
          <div key={property.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="relative h-52">
              <Image src={property.coverImagePath} alt={property.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{property.city}</div>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{property.title}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Interested</span>
              </div>
              <Link href={`/properties/${property.id}`} className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
