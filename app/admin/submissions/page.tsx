import { getPendingProperties } from "@/lib/data";
import { PropertyReviewActions } from "@/components/admin-property-actions";

export default async function AdminSubmissionsPage() {
  const properties = await getPendingProperties();

  return (
    <div className="space-y-6 p-8">
      <div>
        <div className="section-label">Customer property submissions</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Submissions</h1>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Submission</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Owner contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <tr key={property.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{property.title}</div>
                    <div className="text-xs text-slate-500">{property.propertyType}</div>
                    <div className="mt-2 text-xs text-slate-500">{property.listingType === "buy" ? "For sale" : "For rent"}</div>
                  </td>
                  <td className="px-4 py-4">{property.locality}, {property.city}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-800">{property.ownerPhonePrivate || "No phone"}</div>
                    <div className="text-xs text-slate-500">{property.ownerEmailPrivate || "No email"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {property.publicationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <PropertyReviewActions propertyId={property.id} title={property.title} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">No property submissions are waiting for review.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
