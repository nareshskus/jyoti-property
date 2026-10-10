export type AuthUserMetadata = {
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
  [key: string]: unknown;
};

export type AuthUserLike = {
  email?: string | null;
  user_metadata?: AuthUserMetadata | null;
  app_metadata?: Record<string, unknown> | null;
};

export type ProfileLike = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

export function resolveUserRole(
  user: AuthUserLike | null | undefined,
  profile: ProfileLike | null | undefined,
) {
  const profileRole = typeof profile?.role === "string" ? profile.role.trim().toLowerCase() : "";
  const appMetadata = (user?.app_metadata ?? {}) as Record<string, unknown>;
  const userMetadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const userRole = typeof appMetadata.role === "string" ? appMetadata.role.trim().toLowerCase() : "";
  const metadataRole = typeof userMetadata.role === "string" ? userMetadata.role.trim().toLowerCase() : "";

  return profileRole || userRole || metadataRole || "customer";
}

export function resolveUserProfileDetails(
  user: AuthUserLike | null | undefined,
  profile: ProfileLike | null | undefined,
) {
  const profileName = typeof profile?.full_name === "string" ? profile.full_name.trim() : "";
  const authName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const profileEmail = typeof profile?.email === "string" ? profile.email.trim() : "";
  const profilePhone = typeof profile?.phone === "string" ? profile.phone.trim() : "";
  const authPhone = typeof user?.user_metadata?.phone === "string" ? user.user_metadata.phone.trim() : "";
  const email = profileEmail || user?.email || "";
  const name = profileName || authName || (email ? email.split("@")[0] : "User");

  return {
    name,
    email,
    phone: profilePhone || authPhone || "",
    role: resolveUserRole(user, profile),
  };
}
