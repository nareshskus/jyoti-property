export default function MyAccountPage() {
  return (
    <div className="container-shell py-12 md:py-16">
      <div className="mb-8">
        <div className="section-label">Account</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">My account</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Customer profile</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">Aarav Sharma</div>
          <div className="mt-1 text-sm text-slate-600">aarav@example.com</div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Saved interests</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">12</div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Submitted listings</div>
          <div className="mt-3 text-xl font-semibold text-slate-900">3</div>
        </div>
      </div>
    </div>
  );
}
