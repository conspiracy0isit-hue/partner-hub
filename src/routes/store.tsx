import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { kycDocs, storeHours } from "@/lib/mock-data";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store Settings — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Opening hours, holiday calendar, panic close, prep time and packaging defaults, delivery radius and FSSAI/GST/KYC documents.",
      },
      { property: "og:title", content: "Store Settings — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Manage hours, panic close, delivery radius and compliance documents.",
      },
    ],
  }),
  component: StoreSettings;
});

function StoreSettings() {
  return null;
}
