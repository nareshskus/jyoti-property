"use client";

import { Search } from "lucide-react";

export function SearchBar({
  cities = [],
  propertyTypes = [],
  listingTypes = ["buy", "rent"],
  bedroomOptions = [1, 2, 3, 4],
}: {
  cities?: string[];
  propertyTypes?: string[];
  listingTypes?: string[];
  bedroomOptions?: number[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60">
      <form className="grid gap-3 md:grid-cols-5 xl:grid-cols-6">
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
          <option>Buy or rent</option>
          {listingTypes.map((type) => (
            <option key={type} value={type}>
              {type === "buy" ? "Buy" : "Rent"}
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
          <option>City</option>
          {cities.length > 0 ? (
            cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))
          ) : (
            <option value="">No cities available</option>
          )}
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
          <option>Property Type</option>
          {propertyTypes.length > 0 ? (
            propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))
          ) : (
            <option value="">No property types</option>
          )}
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
          <option>Budget</option>
          <option>Up to ₹50L</option>
          <option>₹50L - ₹1Cr</option>
          <option>Above ₹1Cr</option>
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none">
          <option>BHK</option>
          {bedroomOptions.length > 0 ? (
            bedroomOptions.map((bedrooms) => (
              <option key={bedrooms} value={bedrooms}>
                {bedrooms} BHK
              </option>
            ))
          ) : (
            <option value="">No BHK data</option>
          )}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-700"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>
    </div>
  );
}
