export default function EditPropertyPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="section-label">Update listing</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Edit property</h1>
      </div>

      <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none" defaultValue="Sunrise Residency 2BHK" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none">
              <option>published</option>
              <option>pending_approval</option>
              <option>unpublished</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Availability</label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none">
              <option>available</option>
              <option>sold</option>
              <option>rented</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
