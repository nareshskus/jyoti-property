export const siteConfig = {
  businessName: "Jyoti Property",
  businessPhone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210",
  businessWhatsApp:
    process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "+919876543210",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@jyotiproperty.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@jyotiproperty.com",
  brandClaim:
    process.env.NEXT_PUBLIC_BRAND_CLAIM ??
    "25+ years of experience guiding families and investors with transparent advice, verified guidance, and dependable property assistance.",
  supportTitle: "Trusted property advisory for homes, investments, and commercial growth.",
};

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildWhatsAppLink(propertyTitle?: string, referenceId?: string) {
  const phoneDigits = siteConfig.businessWhatsApp.replace(/\D/g, "");
  const summary = propertyTitle ?? "your property";
  const message = `Hi Jyoti Property, I am interested in ${summary}${referenceId ? ` (${referenceId})` : ""}. Please share the details and next steps.`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
