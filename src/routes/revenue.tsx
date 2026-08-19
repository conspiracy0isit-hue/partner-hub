import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  basketInsights,
  benchmarks,
  hourlyDemand,
  inr,
  itemMatrix,
  lostRevenue,
  menuGaps,
  revenueTrend,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue Intelligence — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Lost revenue breakdown, demand heatmap vs capacity, item performance matrix, basket analysis and menu gap finder for your outlet.",
      },
      { property: "og:title", content: "Revenue Intelligence — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Quantified lost revenue, demand heatmap and item margin matrix for restaurant owners.",
      },
    ],
  }),
  component: RevenueIntelligence,
});

const quadrantColor: Record<string, string> = {
  Star: "bg-success/20 text-success border-success/40",
  Puzzle: "bg-primary/20 text-primary border-primary/40",
  Workhorse: "bg-info/20 text-info border-info/40",
  Dog: "bg-destructive/20 text-destructive border-destructive/40",
};

function RevenueIntelligence() {
  const lost = lostRevenue.reduce((s, l) => s + l.amount, 0);
  const maxOrders = Math.max(...hourlyDemand.map((h) => h.orders));

  return (
    <AppShell title="Revenue Intelligence" subtitle="Last 7 days · Indiranagar · 3km peer set">
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-1">
          <p className="text-xs uppercase tracking-widest text-primary">Lost revenue this week</p>
          <p className="num mt-2 text-4xl font-bold text-primary">{inr(lost)}</p>
          <div className="mt-4 space-y-2">
            {lostRevenue.map((l) => (
              <div key={l.label}>
                <div className="flex justify-between text-sm">
                  <span>{l.label}</span>
                  <span className="num">{inr(l.amount)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${(l.amount / lost) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-lg">Revenue trend</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {revenueTrend.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="num text-[11px] text-muted-foreground">
                  {Math.round(d.revenue / 1000)}k
                </span>
                <div
                  className="w-full rounded-t bg-primary/70"
                  style={{ height: `${(d.revenue / 72400) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 panel p-5">
        <h2 className="text-lg">Demand heatmap vs your capacity</h2>
        <p className="text-sm text-muted-foreground">
          Capacity is 30 orders/hr. Bars above the line are demand you cannot serve.
        </p>
        <div className="mt-6 flex h-48 items-end gap-2">
          {hourlyDemand.map((h) => {
            const over = h.orders > h.capacity;
            return (
              <div key={h.hour} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-40 w-full items-end">
                  <div
                    className={cn("w-full rounded-t", over ? "bg-destructive/70" : "bg-chart-2/70")}
                    style={{ height: `${(h.orders / maxOrders) * 100}%` }}
                  />
                  <div
                    className="absolute inset-x-0 border-t border-dashed border-primary"
                    style={{ bottom: `${(h.capacity / maxOrders) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{h.hour}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-primary">
          8–9pm demand exceeds capacity by 11 orders/hr → add one kitchen hand or raise prep time.
        </p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg">Item performance matrix</h2>
          <div className="relative mt-4 h-72 rounded-md border border-border bg-background/40">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border" />
            {itemMatrix.map((i) => (
              <div
                key={i.name}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px]",
                  quadrantColor[i.quadrant],
                )}
                style={{
                  left: `${8 + (i.volume / 650) * 84}%`,
                  top: `${92 - ((i.margin - 12) / 36) * 84}%`,
                }}
              >
                {i.name}
              </div>
            ))}
            <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
              volume →
            </span>
            <span className="absolute left-2 top-1 text-[10px] text-muted-foreground">↑ margin</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {(["Star", "Puzzle", "Workhorse", "Dog"] as const).map((q) => (
              <span key={q} className={cn("rounded-full border px-2 py-0.5", quadrantColor[q])}>
                {q}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-5">
            <h2 className="text-lg">Basket analysis</h2>
            <div className="mt-3 space-y-3">
              {basketInsights.map((b) => (
                <div key={b.insight} className="rounded-md border border-border p-3">
                  <p className="text-sm">{b.insight}</p>
                  <p className="mt-1 text-xs text-primary">→ {b.action}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    Est. monthly upside {inr(b.upside)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg">Menu gap finder · 560038</h2>
            <table className="mt-3 w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-1 text-left">Dish</th>
                  <th className="text-right">Local orders/mo</th>
                  <th className="text-right">Est. revenue</th>
                </tr>
              </thead>
              <tbody>
                {menuGaps.map((g) => (
                  <tr key={g.dish} className="border-t border-border">
                    <td className="py-2">{g.dish}</td>
                    <td className="num text-right">{g.localOrders.toLocaleString("en-IN")}</td>
                    <td className="num text-right text-primary">{inr(g.est)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 panel p-5">
        <h2 className="text-lg">Anonymized peer benchmarking</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benchmarks.map((b) => (
            <div key={b.metric} className="rounded-md border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{b.metric}</p>
              <p className={cn("num mt-1 text-2xl font-semibold", b.better ? "text-success" : "text-destructive")}>
                {b.you}
              </p>
              <p className="num text-xs text-muted-foreground">peer median {b.peers}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Rank in North Indian, 3km radius: <span className="text-foreground">#7 of 41</span> (up 2 WoW).
          Your Butter Chicken at ₹340 vs area median ₹295.
        </p>
      </section>
    </AppShell>
  );
}
