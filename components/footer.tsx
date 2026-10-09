import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-semibold text-white">{siteConfig.businessName}</div>
            <p className="mt-3 max-w-sm text-sm text-slate-300">{siteConfig.brandClaim}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick links</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/properties" className="hover:text-white">Explore Properties</Link></li>
              <li><Link href="/list-property" className="hover:text-white">List Your Property</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> {siteConfig.businessPhone}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> {siteConfig.contactEmail}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Your city, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          © 2026 {siteConfig.businessName}. Live property data is managed through the connected Supabase database.
        </div>
      </div>
    </footer>
  );
}
