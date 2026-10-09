import { getPublishedProperties } from "@/lib/data";

export default async function AdminSubmissionsPage() {
  const properties = (await getPublishedProperties()).slice(0, 4);
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
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={property.id} className="border-t border-slate-200">
                <td className="px-4 py-4">{property.title}</td>
                <td className="px-4 py-4">Customer {index + 1}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">{property.publicationStatus}</span></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">Approve</button>
                    <button type="button" className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700">Reject</button>
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
