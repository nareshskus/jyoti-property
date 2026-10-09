"use client";

import Link from "next/link";
import { House, Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Explore Properties" },
  { href: "/list-property", label: "List Your Property" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Jyoti Property home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <House className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-900">{siteConfig.businessName}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Trusted real estate
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 md:hidden"
            aria-label="Open mobile menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="space-y-3 border-t border-slate-200 pb-4 pt-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-slate-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white">
                Register
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
