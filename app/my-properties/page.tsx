import Image from "next/image";
import Link from "next/link";
import { getPublishedProperties } from "@/lib/data";

export default async function MyPropertiesPage() {
  const records = (await getPublishedProperties()).slice(0, 3);

  return (
    <div className="container-shell py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="section-label">Your listings</div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">My properties</h1>
        </div>
        <Link href="/list-property" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
          Add property
        </Link>
      </div>

      <div className="space-y-4">
        {records.map((property) => (
          <div key={property.id} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                <Image src={property.coverImagePath} alt={property.title} fill className="object-cover" sizes="96px" />
              </div>
              <div>
                <div className="text-xl font-semibold text-slate-900">{property.title}</div>
                <div className="mt-1 text-sm text-slate-500">{property.city} • {property.locality}</div>
                <div className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {property.publicationStatus}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/properties/${property.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">View</Link>
              <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Withdraw</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
