import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { inr, kycDocs, storeHours } from "@/lib/mock-data";

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
  component: StoreSettings,
});

function StoreSettings() {
  const [hours, setHours] = useState(storeHours);
  const [prep, setPrep] = useState(20);
  const [packaging, setPackaging] = useState(15);
  const [minOrder, setMinOrder] = useState(149);
  const [radius, setRadius] = useState(5);
  const [closed, setClosed] = useState(false);

  return (
    <AppShell
      title="Store Settings"
      subtitle="Spice Route · 100 Feet Road, Indiranagar, Bengaluru 560038"
    >
      <section
        className={cn(
          "rounded-xl border p-5",
          closed ? "border-destructive bg-destructive/10" : "border-destructive/40 bg-card",
        )}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl tracking-wide text-destructive">Panic button</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Instantly stop new orders — kitchen fire, staff shortage, power cut. Live orders stay
              active. Auto-reopens at your next opening slot unless you extend.
            </p>
          </div>
          <button
            onClick={() => {
              setClosed(!closed);
              toast[closed ? "success" : "error"](
                closed ? "Store reopened — accepting orders" : "Store closed immediately",
              );
            }}
            className={cn(
              "rounded-md px-4 py-2.5 text-sm font-semibold",
              closed
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground",
            )}
          >
            {closed ? "Reopen store" : "Close store now"}
          </button>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl tracking-wide">Opening hours</h2>
          <ul className="mt-4 space-y-2">
            {hours.map((h, idx) => (
              <li key={h.day} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="w-28">{h.day}</span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) =>
                    setHours((p) =>
                      p.map((x, i) => (i === idx ? { ...x, open: e.target.value } : x)),
                    )
                  }
                  disabled={h.closed}
                  className="num rounded-md border border-input bg-background px-2 py-1.5 disabled:opacity-40"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) =>
                    setHours((p) =>
                      p.map((x, i) => (i === idx ? { ...x, close: e.target.value } : x)),
                    )
                  }
                  disabled={h.closed}
                  className="num rounded-md border border-input bg-background px-2 py-1.5 disabled:opacity-40"
                />
                <button
                  onClick={() =>
                    setHours((p) => p.map((x, i) => (i === idx ? { ...x, closed: !x.closed } : x)))
                  }
                  className={cn(
                    "ml-auto rounded-md border px-3 py-1.5 text-xs font-semibold",
                    h.closed
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {h.closed ? "Closed" : "Open"}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-border p-3 text-sm">
            <p className="font-semibold">Holiday calendar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["15 Aug — Independence Day", "2 Oct — Gandhi Jayanti", "20 Oct — Diwali"].map(
                (d) => (
                  <span key={d} className="rounded-full bg-muted px-3 py-1 text-xs">
                    {d}
                  </span>
                ),
              )}
              <button
                onClick={() => toast("Holiday added to calendar")}
                className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground"
              >
                + Add holiday
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Order defaults</h2>
            <div className="mt-4 space-y-4 text-sm">
              <Field
                label="Default prep time"
                suffix="min"
                value={prep}
                onChange={setPrep}
                min={5}
                max={60}
              />
              <Field
                label="Packaging charge"
                suffix="₹"
                value={packaging}
                onChange={setPackaging}
                min={0}
                max={100}
              />
              <Field
                label="Minimum order value"
                suffix="₹"
                value={minOrder}
                onChange={setMinOrder}
                min={0}
                max={999}
              />
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery radius</span>
                  <span className="num font-semibold">{radius} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Covers ~{(radius * 1.6).toFixed(0)} pincodes · est. {inr(radius * 4800)} weekly
                  reachable GMV
                </p>
              </div>
              <button
                onClick={() => toast.success("Store settings saved")}
                className="w-full rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save settings
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Service area</h2>
            <div className="relative mt-3 h-40 overflow-hidden rounded-lg border border-border bg-muted">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/15"
                style={{ width: `${radius * 13}%`, aspectRatio: "1" }}
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                ●
              </span>
            </div>
            <button
              onClick={() => toast("Polygon editor opened")}
              className="mt-3 w-full rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
            >
              Edit service area polygon
            </button>
          </section>
        </div>
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl tracking-wide">Compliance & KYC</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-125 text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Document</th>
                <th>Value</th>
                <th>Expiry</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {kycDocs.map((d) => (
                <tr key={d.name} className="border-t border-border">
                  <td className="py-2.5">{d.name}</td>
                  <td className="num text-muted-foreground">{d.value}</td>
                  <td className="num text-muted-foreground">{d.expiry}</td>
                  <td className="text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        d.status === "Verified"
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning",
                      )}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => toast.success("Document upload started")}
          className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
        >
          Upload new document
        </button>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  suffix,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="num w-20 rounded-md border border-input bg-background px-2 py-1.5 text-right"
        />
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </span>
    </label>
  );
}
