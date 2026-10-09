import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  HandCoins,
  MapPinned,
  MessageSquareText,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { siteConfig, formatCurrency } from "@/lib/config";
import { getFeaturedProperties, getPropertyFilterOptions, propertyCategories } from "@/lib/data";

export default async function Home() {
  const featuredProperties = await getFeaturedProperties(3);
  const filterOptions = await getPropertyFilterOptions();

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_45%),linear-gradient(135deg,#0f172a_0%,#132b46_35%,#1d2f4e_100%)] text-white">
        <div className="container-shell grid min-h-[720px] items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.2em] text-slate-200 uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted since 2000
            </span>
            <div className="space-y-5">
              <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find a Place to Call Home.
              </h1>
              <p className="max-w-lg text-lg text-slate-200">
                {siteConfig.brandClaim}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to an advisor
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-200">
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-amber-300" /> Verified guidance</div>
              <div className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-amber-300" /> Pan-India listings</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-amber-300" /> Personalized support</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <div className="relative h-[500px] overflow-hidden rounded-[1.5rem]">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Modern home exterior"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Featured home</div>
                    <div className="mt-2 text-xl font-semibold">Skyline Residence</div>
                  </div>
                  <div className="text-lg font-bold text-amber-300">{formatCurrency(6800000)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-shell -mt-10 pb-16">
          <SearchBar
            cities={filterOptions.cities}
            propertyTypes={filterOptions.propertyTypes}
            listingTypes={filterOptions.listingTypes}
            bedroomOptions={filterOptions.bedroomOptions}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container-shell">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="section-label">Discover</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Featured properties</h2>
            </div>
            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View all listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-shell">
          <div className="mb-10 text-center">
            <div className="section-label">Browse by type</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Find the property that matches your life</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {propertyCategories.map((category) => (
              <div key={category.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{category.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{category.count} curated options</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-shell">
          <div className="mb-10 text-center">
            <div className="section-label">Why choose us</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">A trusted property partner for every step</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "25+ years of experience",
                description: "We bring seasoned market understanding, local insight, and transparent advice for buyers, renters, and investors.",
                icon: <HandCoins className="h-6 w-6" />,
              },
              {
                title: "Transparent process",
                description: "Straightforward guidance, clear documentation, and honest support throughout your property journey.",
                icon: <ShieldCheck className="h-6 w-6" />,
              },
              {
                title: "Customer-first support",
                description: "From shortlist to closure, our team helps you compare, enquire, and move with confidence.",
                icon: <MessageSquareText className="h-6 w-6" />,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">{item.icon}</div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="container-shell">
          <div className="mb-10 text-center">
            <div className="section-label text-slate-300">Simple process</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">How it works</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Explore", description: "Browse live listings from the database, compare neighborhoods, and shortlist the right fit." },
              { step: "02", title: "Enquire", description: "Connect with our advisory team for detailed information, pricing, and site visits." },
              { step: "03", title: "Visit", description: "Arrange walkthroughs and move forward with confidence backed by trusted local guidance." },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl font-bold text-amber-300">{item.step}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
            <div className="section-label text-slate-300">Contact us</div>
            <h2 className="mt-3 text-3xl font-bold">Ready to move forward?</h2>
            <div className="mt-8 space-y-5 text-slate-200">
              <div className="flex items-center gap-3"><MessageSquareText className="h-5 w-5 text-amber-300" /> <span>{siteConfig.businessPhone}</span></div>
              <div className="flex items-center gap-3"><Search className="h-5 w-5 text-amber-300" /> <span>{siteConfig.contactEmail}</span></div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={siteConfig.businessWhatsApp.startsWith('http') ? siteConfig.businessWhatsApp : `https://wa.me/${siteConfig.businessWhatsApp.replace(/\D/g,'')}`} className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400">WhatsApp</a>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">Send enquiry</Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="section-label">We’re here to help</div>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">Tell us what you are looking for</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Location</div>
                <div className="mt-2 font-semibold text-slate-900">Any major city or locality</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Expertise</div>
                <div className="mt-2 font-semibold text-slate-900">Residential, commercial, and investment advice</div>
              </div>
            </div>
            <p className="mt-6 text-slate-600">
              Property listings are loaded from the live Supabase database. Approved submissions and managed inventory appear here once they are published by the admin.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
