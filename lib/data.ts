import { getSupabaseServerClient } from "@/lib/supabase";

export type ListingType = "buy" | "rent";
export type PropertyType =
  | "Apartment"
  | "Independent House"
  | "Villa"
  | "Commercial Space"
  | "Plot";
export type PublicationStatus =
  | "pending_approval"
  | "published"
  | "rejected"
  | "unpublished";
export type AvailabilityStatus = "available" | "sold" | "rented";

export type Property = {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  city: string;
  locality: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  latitude?: number;
  longitude?: number;
  imagePaths: string[];
  coverImagePath: string;
  publicationStatus: PublicationStatus;
  availabilityStatus: AvailabilityStatus;
  ownerPhonePrivate?: string;
  ownerEmailPrivate?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
};

export type Enquiry = {
  id: string;
  customerId?: string;
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "visit_scheduled" | "closed";
  adminNotes?: string;
  createdAt: string;
};

export const propertyCategories = [
  { title: "Apartments", count: 0 },
  { title: "Independent Houses", count: 0 },
  { title: "Villas", count: 0 },
  { title: "Commercial Spaces", count: 0 },
  { title: "Plots", count: 0 },
];

export const customerSupportStats = [
  { value: "25+", label: "Years of experience" },
  { value: "1.2K+", label: "Homes guided" },
  { value: "100%", label: "Transparent process" },
];

function mapPropertyRow(row: Record<string, any>): Property {
  const imagePaths = Array.isArray(row.image_paths)
    ? row.image_paths.filter((path: string | null | undefined) => Boolean(path))
    : [];

  return {
    id: row.id,
    title: row.title ?? "Untitled property",
    description: row.description ?? "",
    listingType: (row.listing_type ?? "buy") as ListingType,
    propertyType: (row.property_type ?? "Apartment") as PropertyType,
    city: row.city ?? "",
    locality: row.locality ?? "",
    address: row.address ?? "",
    price: Number(row.price ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    areaSqft: Number(row.area_sqft ?? 0),
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    imagePaths,
    coverImagePath: row.cover_image_path ?? imagePaths[0] ?? "",
    publicationStatus: (row.publication_status ?? "pending_approval") as PublicationStatus,
    availabilityStatus: (row.availability_status ?? "available") as AvailabilityStatus,
    ownerPhonePrivate: row.owner_phone_private ?? undefined,
    ownerEmailPrivate: row.owner_email_private ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
    featured: Boolean(row.featured ?? false),
  };
}

export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("publication_status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapPropertyRow);
}

export async function getPendingProperties(): Promise<Property[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("publication_status", ["pending_approval", "rejected"])
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapPropertyRow);
}

export async function getAllProperties(): Promise<Property[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapPropertyRow);
}

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const properties = await getPublishedProperties();
  return properties.slice(0, limit);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("publication_status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapPropertyRow(data);
}

export async function getPropertyFilterOptions() {
  const supabase = await getSupabaseServerClient();

  const fallback = {
    cities: [],
    propertyTypes: [],
    listingTypes: ["buy", "rent"],
    bedroomOptions: [1, 2, 3, 4],
  };

  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("city, property_type, listing_type, bedrooms")
    .eq("publication_status", "published");

  if (error || !data) {
    return fallback;
  }

  const cities = [...new Set(data.map((row) => row.city).filter(Boolean))].sort();
  const propertyTypes = [...new Set(data.map((row) => row.property_type).filter(Boolean))].sort();
  const listingTypes = [...new Set(data.map((row) => row.listing_type).filter(Boolean))].sort();
  const bedroomOptions = [...new Set(data.map((row) => Number(row.bedrooms)).filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b);

  return {
    cities,
    propertyTypes,
    listingTypes,
    bedroomOptions,
  };
}

export async function getEnquiries(limit = 20): Promise<Enquiry[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    customerId: row.customer_id ?? undefined,
    propertyId: row.property_id ?? undefined,
    name: row.name ?? "Customer",
    email: row.email ?? "",
    phone: row.phone ?? "",
    message: row.message ?? "",
    status: (row.status ?? "new") as Enquiry["status"],
    adminNotes: row.admin_notes ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
  }));
}

export async function getAdminMetricSummary() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      publishedProperties: 0,
      pendingProperties: 0,
      totalEnquiries: 0,
      interestedProperties: 0,
    };
  }

  const [enquiriesResult, interestsResult] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase.from("property_interests").select("id", { count: "exact", head: true }),
  ]);

  const publishedProperties = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("publication_status", "published");

  const pendingProperties = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("publication_status", "pending_approval");

  return {
    publishedProperties: publishedProperties.count ?? 0,
    pendingProperties: pendingProperties.count ?? 0,
    totalEnquiries: enquiriesResult.count ?? 0,
    interestedProperties: interestsResult.count ?? 0,
  };
}

export async function updatePropertyPublicationStatus(propertyId: string, status: PublicationStatus) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("properties")
    .update({
      publication_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId);

  if (error) {
    throw error;
  }
}
