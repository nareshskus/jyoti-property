import { getEnquiries } from "@/lib/data";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries(50);

  return (
    <div className="space-y-6 p-8">
      <div>
        <div className="section-label">Customer enquiries</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Enquiries</h1>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{enquiry.name}</div>
                    <div className="text-xs text-slate-500">{new Date(enquiry.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{enquiry.email}</div>
                    <div className="text-xs text-slate-500">{enquiry.phone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-md">{enquiry.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No enquiries have been submitted yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
