"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function PropertyReviewActions({ propertyId, title }: { propertyId: string; title: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(status: "published" | "rejected") {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("properties")
        .update({ publication_status: status, updated_at: new Date().toISOString() })
        .eq("id", propertyId);

      if (error) {
        toast.error(`Unable to ${status === "published" ? "approve" : "reject"} ${title}.`);
        return;
      }

      toast.success(`${title} has been ${status === "published" ? "approved" : "rejected"}.`);
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => updateStatus("published")}
        disabled={isUpdating}
        className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpdating ? "Updating..." : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => updateStatus("rejected")}
        disabled={isUpdating}
        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
