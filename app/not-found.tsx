import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell py-20 text-center">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <div className="section-label">Not found</div>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Page unavailable</h1>
        <p className="mt-4 text-slate-600">The page you were looking for does not exist or is still being developed.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">Back to home</Link>
      </div>
    </div>
  );
}
