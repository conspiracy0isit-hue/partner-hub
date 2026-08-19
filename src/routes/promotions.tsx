import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { inr, promos } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotion Studio — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Build discounts, control the funded-by split, target cohorts and simulate promo profitability before you launch.",
      },
      { property: "og:title", content: "Promotion Studio — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Model projected orders, incremental revenue and margin impact before launching a promo.",
      },
    ],
  }),
  component: PromotionStudio,
});

const types = ["Flat off", "% off", "BOGO", "Free delivery"] as const;
const cohorts = ["All users", "First-time users", "Dormant 30 days", "High frequency"] as const;

function PromotionStudio() {
  const [type, setType] = useState<(typeof types)[number]>("% off");
  const [depth, setDepth] = useState(20);
  const [minOrder, setMinOrder] = useState(399);
  const [funded, setFunded] = useState(60);
  const [cohort, setCohort] = useState<(typeof cohorts)[number]>("All users");
  const [budget, setBudget] = useState(20000);

  const sim = useMemo(() => {
    const baseOrders = 780;
    const aov = 412;
    const grossMargin = 0.34;
    const lift = Math.min(0.9, (depth / 100) * 2.1) * (cohort === "Dormant 30 days" ? 1.15 : 1);
    const orders = Math.round(baseOrders * (1 + lift));
    const incrementalOrders = orders - baseOrders;
    const discountPerOrder =
      type === "% off"
        ? (aov * depth) / 100
        : type === "Flat off"
          ? depth * 5
          : type === "BOGO"
            ? aov * 0.38
            : 42;
    const yourCost = orders * discountPerOrder * (funded / 100);
    const revenue = orders * aov;
    const incrementalRevenue = incrementalOrders * aov;
    const marginBefore = baseOrders * aov * grossMargin;
    const marginAfter = revenue * grossMargin - yourCost;
    const breakeven = Math.ceil(yourCost / (aov * grossMargin));
    return {
      orders,
      incrementalOrders,
      revenue,
      incrementalRevenue,
      yourCost,
      marginDelta: marginAfter - marginBefore,
      breakeven,
      roi: yourCost > 0 ? incrementalRevenue / yourCost : 0,
    };
  }, [type, depth, funded, cohort]);

  const negative = sim.marginDelta < 0;

  return (
    <AppShell title="Promotion Studio" subtitle="Build, split-fund and simulate before you launch">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="panel p-5">
          <h2 className="text-lg">Discount builder</h2>

          <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Offer type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 text-sm",
                  type === t && "border-primary bg-primary/15 text-primary",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-sm">
              <span>{type === "% off" ? "Discount %" : "Discount depth"}</span>
              <span className="num text-primary">
                {type === "% off" ? `${depth}%` : inr(depth * 5)}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Minimum order value</span>
              <span className="num text-primary">{inr(minOrder)}</span>
            </div>
            <input
              type="range"
              min={99}
              max={999}
              step={10}
              value={minOrder}
              onChange={(e) => setMinOrder(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Funded-by split</p>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={funded}
              onChange={(e) => setFunded(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
            <div className="num mt-1 flex justify-between text-sm">
              <span className="text-primary">You {funded}%</span>
              <span className="text-info">Platform {100 - funded}%</span>
            </div>
          </div>

          <p className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">Cohort</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cohorts.map((c) => (
              <button
                key={c}
                onClick={() => setCohort(c)}
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 text-sm",
                  cohort === c && "border-primary bg-primary/15 text-primary",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-sm">
              <span>Weekly budget cap</span>
              <span className="num text-primary">{inr(budget)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className={cn("panel p-5", negative && "border-destructive/60")}>
            <h2 className="text-lg">Profitability simulator</h2>
            <p className="text-sm text-muted-foreground">
              Projection over 7 days based on your last 4 weeks of order data.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="Projected orders" value={sim.orders.toLocaleString("en-IN")} sub={`+${sim.incrementalOrders} incremental`} />
              <Metric label="Projected revenue" value={inr(sim.revenue)} sub={`${inr(sim.incrementalRevenue)} incremental`} />
              <Metric label="Your promo cost" value={inr(sim.yourCost)} sub={`${funded}% funded by you`} />
              <Metric
                label="Margin impact"
                value={`${sim.marginDelta >= 0 ? "+" : "−"}${inr(Math.abs(sim.marginDelta))}`}
                sub={`Breakeven at ${sim.breakeven} orders`}
                tone={negative ? "bad" : "good"}
              />
            </div>
            <div
              className={cn(
                "mt-4 rounded-md p-3 text-sm",
                negative ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success",
              )}
            >
              {negative
                ? `This promo goes margin-negative. Cut depth to ~${Math.max(5, depth - 8)}% or lower your funded share below ${Math.max(0, funded - 20)}%.`
                : `Healthy: every ₹1 you fund returns ₹${sim.roi.toFixed(1)} of incremental revenue.`}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  toast.success(`${type} ${depth}% launched for ${cohort} · cap ${inr(budget)}`)
                }
                className="flex-1 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Launch promotion
              </button>
              <button
                onClick={() => toast("Variant B created — A/B test starts at next midnight")}
                className="rounded-md border border-border px-4 text-sm"
              >
                A/B test
              </button>
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg">Combo margin calculator</h2>
            <div className="mt-3 space-y-2 text-sm">
              <Row label="Chicken Biryani + Masala Chaas" value="₹365" />
              <Row label="Food cost" value="₹198" muted />
              <Row label="Packaging + platform fee" value="₹64" muted />
              <Row label="Net margin" value="₹103 · 28%" tone="good" />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 panel p-5">
        <h2 className="text-lg">Campaigns</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Campaign</th>
                <th className="text-left">Type</th>
                <th className="text-left">Cohort</th>
                <th className="text-left">Status</th>
                <th className="text-right">Spend</th>
                <th className="text-right">Orders</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="py-2.5 font-medium">{p.name}</td>
                  <td>{p.type}</td>
                  <td className="text-muted-foreground">{p.cohort}</td>
                  <td>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px]",
                        p.status === "Live"
                          ? "bg-success/15 text-success"
                          : p.status === "Draft"
                            ? "bg-secondary text-muted-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="num text-right">{inr(p.spend)}</td>
                  <td className="num text-right">{p.orders}</td>
                  <td className="num text-right">{inr(p.revenue)}</td>
                  <td className="num text-right text-primary">
                    {p.spend ? (p.revenue / p.spend).toFixed(1) + "×" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "num mt-1 text-xl font-semibold",
          tone === "good" && "text-success",
          tone === "bad" && "text-destructive",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  tone,
}: {
  label: string;
  value: string;
  muted?: boolean;
  tone?: "good";
}) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-0">
      <span className={cn(muted && "text-muted-foreground")}>{label}</span>
      <span className={cn("num", tone === "good" && "font-semibold text-success")}>{value}</span>
    </div>
  );
}
