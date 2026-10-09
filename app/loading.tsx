export default function Loading() {
  return (
    <div className="container-shell py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-56 bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-7 w-40 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-10 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
