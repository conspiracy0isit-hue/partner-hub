import { useState } from "react";
import { toast } from "sonner";
import { Database, Loader2, X } from "lucide-react";
import { inr } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export function DemoSeeder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { demo, seeding, seedDemoData, clearDemoData } = useSession();
  const [scale, setScale] = useState(2);

  if (!open) return null;

  const gmv = demo?.orders.reduce((s, o) => s + o.total, 0) ?? 0;
  const avgRating = demo?.ratings.length
    ? demo.ratings.reduce((s, r) => s + r.stars, 0) / demo.ratings.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <Database className="mt-1 size-5 text-primary" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl tracking-wide">Demo data seeding</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate outlets, menus, orders, ratings and payout cycles so the prototype feels
              like a live restaurant group.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5">
          <label className="flex items-center justify-between text-sm">
            <span>Data volume</span>
            <span className="num font-semibold">{scale}×</span>
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
            aria-label="Data volume"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.max(1, Math.min(6, scale * 2))} outlets · ~{18 * scale} orders and ~{10 * scale}{" "}
            ratings per outlet · 4 payout cycles each
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            disabled={seeding}
            onClick={async () => {
              await seedDemoData(scale);
              toast.success("Demo dataset generated");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4" />}
            {seeding ? "Seeding…" : demo ? "Re-seed dataset" : "Seed demo data"}
          </button>
          {demo ? (
            <button
              onClick={() => {
                clearDemoData();
                toast("Demo dataset cleared");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              Clear
            </button>
          ) : null}
        </div>

        {demo ? (
          <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Seeded {new Date(demo.seededAt).toLocaleString("en-IN")}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Outlets", String(demo.outlets.length)],
                ["Menu items", String(demo.menu.length)],
                ["Orders", String(demo.orders.length)],
                ["Ratings", `${demo.ratings.length} · ${avgRating.toFixed(1)}★`],
                ["Payout cycles", String(demo.payouts.length)],
                ["Seeded GMV", inr(gmv)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="num font-display text-lg">{value}</p>
                </div>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {demo.outlets.map((o) => (
                <li key={o.id}>
                  {o.name} · {o.city} · {o.rating}★ · {o.ordersToday} orders today ·{" "}
                  {o.live ? "live" : "paused"}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
