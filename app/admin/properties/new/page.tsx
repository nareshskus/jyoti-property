export default function NewPropertyPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="section-label">New listing</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Add property</h1>
      </div>

      <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none" placeholder="Luxury apartment in a prime location" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none" placeholder="Enter city" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none" placeholder="₹85,00,000" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none" placeholder="Describe the property and key features" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">Publish listing</button>
          </div>
        </form>
      </div>
    </div>
  );
}
