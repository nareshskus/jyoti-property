import Link from "next/link";
import { Plus } from "lucide-react";
import { getPublishedProperties } from "@/lib/data";

export default async function AdminPropertiesPage() {
  const properties = await getPublishedProperties();
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="section-label">Manage listings</div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Properties</h1>
        </div>
        <Link href="/admin/properties/new" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
          <Plus className="h-4 w-4" />
          Add property
        </Link>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-slate-200">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{property.title}</div>
                  <div className="text-xs text-slate-500">{property.propertyType}</div>
                </td>
                <td className="px-4 py-4">{property.locality}, {property.city}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">{property.publicationStatus}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/properties/${property.id}/edit`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Edit</Link>
                    <button type="button" className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
