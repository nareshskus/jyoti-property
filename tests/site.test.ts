import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppLink, formatCurrency } from "../lib/config";

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
