import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { inr, menuCategories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu Manager — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Manage categories, variants and add-ons, snooze out-of-stock items in one tap, schedule menus and bulk-edit prices.",
      },
      { property: "og:title", content: "Menu Manager — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Item snooze, scheduled menus, bulk price edits and per-item veg/GST controls.",
      },
    ],
  }),
  component: MenuManager,
});

type Row = { cat: string; name: string; price: number; veg: boolean; gst: number; stock: number; snoozed: boolean };

function MenuManager() {
  const [rows, setRows] = useState<Row[]>(
    menuCategories.flatMap((c) => c.items.map((i) => ({ cat: c.name, ...i }))),
  );
  const [bulk, setBulk] = useState(0);

  return (
    <AppShell title="Menu Manager" subtitle="1 outlet · 3 categories · 7 items">
      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm text-muted-foreground">Bulk price change</span>
        <input
          type="range"
          min={-20}
          max={20}
          value={bulk}
          onChange={(e) => setBulk(Number(e.target.value))}
          className="w-40 accent-[var(--color-primary)]"
        />
        <span className="num text-sm text-primary">{bulk > 0 ? `+${bulk}` : bulk}%</span>
        <button
          onClick={() => {
            setRows((p) => p.map((r) => ({ ...r, price: Math.round(r.price * (1 + bulk / 100)) })));
            toast.success(`Applied ${bulk}% across 7 items`);
          }}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
        >
          Apply
        </button>
        <div className="ml-auto flex gap-2">
          <button onClick={() => toast("CSV template downloaded")} className="rounded-md border border-border px-3 py-1.5 text-sm">
            CSV import
          </button>
          <button onClick={() => toast.success("Menu cloned to 2 outlets")} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Clone to outlets
          </button>
          <button onClick={() => toast("Dinner menu auto-switches at 6:30pm")} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Scheduled menus
          </button>
        </div>
      </div>

      {menuCategories.map((c) => (
        <section key={c.name} className="mt-4 panel p-5">
          <h2 className="text-lg">{c.name}</h2>
          <div className="mt-3 divide-y divide-border">
            {rows
              .filter((r) => r.cat === c.name)
              .map((r) => (
                <div key={r.name} className="flex flex-wrap items-center gap-3 py-3">
                  <span
                    className={cn(
                      "size-3 rounded-sm border",
                      r.veg ? "border-success" : "border-destructive",
                    )}
                  >
                    <span
                      className={cn(
                        "block size-full scale-50 rounded-full",
                        r.veg ? "bg-success" : "bg-destructive",
                      )}
                    />
                  </span>
                  <span className={cn("font-medium", r.snoozed && "text-muted-foreground line-through")}>
                    {r.name}
                  </span>
                  <span className="num text-xs text-muted-foreground">GST {r.gst}%</span>
                  <span className={cn("num text-xs", r.stock === 0 ? "text-destructive" : "text-muted-foreground")}>
                    stock {r.stock}
                  </span>
                  <span className="num ml-auto font-semibold">{inr(r.price)}</span>
                  <div className="flex gap-1.5">
                    {(["1 hr", "Today", "Indefinitely"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setRows((p) =>
                            p.map((x) => (x.name === r.name ? { ...x, snoozed: true } : x)),
                          );
                          toast(`${r.name} snoozed — ${d}`);
                        }}
                        className="rounded-md border border-border px-2 py-1 text-[11px] hover:border-primary/60"
                      >
                        {d}
                      </button>
                    ))}
                    {r.snoozed ? (
                      <button
                        onClick={() => {
                          setRows((p) =>
                            p.map((x) => (x.name === r.name ? { ...x, snoozed: false } : x)),
                          );
                          toast.success(`${r.name} back online`);
                        }}
                        className="rounded-md bg-success/15 px-2 py-1 text-[11px] text-success"
                      >
                        Unsnooze
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
