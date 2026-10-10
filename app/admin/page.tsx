import Link from "next/link";
import { ArrowUpRight, Building2, CircleDollarSign, FileText, Heart, Inbox } from "lucide-react";
import { getAdminMetricSummary, getEnquiries, getPendingProperties } from "@/lib/data";

export default async function AdminDashboardPage() {
  const { publishedProperties, pendingProperties, totalEnquiries, interestedProperties } = await getAdminMetricSummary();
  const recentEnquiries = await getEnquiries(3);
  const recentSubmissions = await getPendingProperties();

  const summaryCards = [
    { label: "Total published properties", value: String(publishedProperties), icon: Building2 },
    { label: "Awaiting approval", value: String(pendingProperties), icon: Inbox },
    { label: "Sold or rented", value: "0", icon: CircleDollarSign },
    { label: "New enquiries", value: String(totalEnquiries), icon: FileText },
    { label: "Interested-property records", value: String(interestedProperties), icon: Heart },
    { label: "Recent submissions", value: String(recentSubmissions.length), icon: ArrowUpRight },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <div className="section-label">Dashboard overview</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Admin dashboard</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700"><Icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-6 text-3xl font-bold text-slate-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-medium text-slate-700 hover:text-slate-900">View all</Link>
          </div>
          <div className="space-y-4">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{enquiry.name}</div>
                  <div className="mt-1">{enquiry.message}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No enquiries yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recently submitted properties</h2>
            <Link href="/admin/submissions" className="text-sm font-medium text-slate-700 hover:text-slate-900">View all</Link>
          </div>
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.slice(0, 3).map((property) => (
                <div key={property.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{property.title}</div>
                  <div className="mt-1">{property.locality}, {property.city}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No pending submissions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
