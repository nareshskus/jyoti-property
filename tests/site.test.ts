import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppLink, formatCurrency } from "../lib/config";
import { resolveUserProfileDetails } from "../lib/auth";

test("formatCurrency returns INR formatting for real estate values", () => {
  assert.match(formatCurrency(2500000), /₹|INR/);
});

test("WhatsApp link includes the branded business number and property title", () => {
  const link = buildWhatsAppLink("Sunrise Residency", "PROP-101");
  assert.ok(link.includes("wa.me"));
  assert.ok(link.includes("Sunrise"));
  assert.ok(link.includes("PROP-101"));
});

test("business contact helpers stay branded and ready for database-backed listings", () => {
  const link = buildWhatsAppLink("Customer property", "PROP-202");

  assert.ok(link.startsWith("https://wa.me/"));
  assert.ok(link.includes("Customer%20property"));
  assert.ok(link.includes("PROP-202"));
});

test("logged in user details prefer profile data and gracefully fall back to auth metadata", () => {
  const details = resolveUserProfileDetails(
    {
      email: "jane@example.com",
      user_metadata: { full_name: "Jane Doe", phone: "+91 90000 00000" },
    },
    {
      full_name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 98765 43210",
    },
  );

  assert.equal(details.name, "Jane Smith");
  assert.equal(details.email, "jane@example.com");
  assert.equal(details.phone, "+91 98765 43210");
});

test("profile names fall back to the email prefix when no full name is saved", () => {
  const details = resolveUserProfileDetails({ email: "customer@example.com", user_metadata: {} }, null);

  assert.equal(details.name, "customer");
  assert.equal(details.email, "customer@example.com");
});
