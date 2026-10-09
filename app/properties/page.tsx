import Link from "next/link";
import { Filter, RefreshCcw } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { getPropertyFilterOptions, getPublishedProperties } from "@/lib/data";

export default async function PropertiesPage() {
  const visibleProperties = await getPublishedProperties();
  const filterOptions = await getPropertyFilterOptions();
  return (
    <div className="container-shell py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="section-label">Property search</div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Explore properties</h1>
        </div>
        <Link href="/list-property" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
          List your property
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <button type="button" className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <RefreshCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Buy or rent</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
                <option>All</option>
                {filterOptions.listingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "buy" ? "Buy" : "Rent"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">City</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
                <option>All cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Property type</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
                <option>Any</option>
                {filterOptions.propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Min price</label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none" placeholder="₹20L" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Max price</label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none" placeholder="₹2Cr" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">BHK</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
                <option>Any</option>
                {filterOptions.bedroomOptions.map((bedrooms) => (
                  <option key={bedrooms} value={bedrooms}>
                    {bedrooms} BHK
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-slate-600">Showing {visibleProperties.length} properties</div>
            <select className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option>Newest</option>
              <option>Price low to high</option>
              <option>Price high to low</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
