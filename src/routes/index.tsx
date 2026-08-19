import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { inr, lostRevenue, opsScore, revenueTrend, seedOrders } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Partner Overview — Spice Route Restaurant Portal" },
      {
        name: "description",
        content:
          "Merchant dashboard for a food delivery marketplace: live orders, lost revenue counter, kitchen ops score and payouts at a glance.",
      },
      { property: "og:title", content: "Partner Overview — Spice Route Restaurant Portal" },
      {
        property: "og:description",
        content: "Track lost revenue, live orders and kitchen performance in one merchant console.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const lost = lostRevenue.reduce((s, l) => s + l.amount, 0);
  const week = revenueTrend.reduce((s, d) => s + d.revenue, 0);
  const newOrders = seedOrders.filter((o) => o.state === "placed").length;

  return (
    <AppShell title="Overview" subtitle="Week of 11–17 Aug 2026 · Indiranagar outlet">
      <section className="panel relative overflow-hidden p-6">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,var(--color-primary)/18%,transparent_70%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <TriangleAlert className="size-4" /> Lost revenue this week
          </div>
          <p className="num mt-3 text-6xl font-bold text-primary">{inr(lost)}</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Money left on the table by rejected orders, offline hours, snoozed bestsellers and slow
            prep. Fixing the top two recovers about {inr(lostRevenue[0]!.amount + lostRevenue[1]!.amount)}.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {lostRevenue.map((l) => (
              <div key={l.label} className="rounded-md border border-border bg-background/40 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{l.label}</p>
                <p className="num mt-1 text-xl font-semibold">{inr(l.amount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.detail}</p>
                <p className="mt-2 text-xs font-medium text-primary">→ {l.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="Net revenue (7d)" value={inr(week)} sub="+14% vs last week" />
        <Stat label="Orders awaiting action" value={String(newOrders)} sub="Respond within 60s" />
        <Stat label="Kitchen ops score" value="74 / 100" sub="Peer percentile: 46th" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg">Ops levers that move ranking</h2>
          <div className="mt-4 space-y-4">
            {opsScore.map((m) => (
              <div key={m.metric}>
                <div className="flex justify-between text-sm">
                  <span>{m.metric}</span>
                  <span className="num text-muted-foreground">
                    {m.value}% → target {m.target}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.percentile}th percentile among 3km peers
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-md bg-primary/10 p-3 text-sm text-primary">
            Raising accept rate 82% → 92% moves you up ~4 positions in local search.
          </p>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg">Jump back in</h2>
          <div className="mt-4 grid gap-3">
            <Shortcut to="/orders" title="Live Orders" desc="2 new orders, 1 rider arriving" />
            <Shortcut to="/revenue" title="Revenue Intelligence" desc="Demand heatmap & item matrix" />
            <Shortcut to="/promotions" title="Promotion Studio" desc="Simulate a promo before launch" />
            <Shortcut to="/payouts" title="Payouts" desc="Settlement of 11–17 Aug ready" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="panel p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="num mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Shortcut({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/60"
    >
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowUpRight className="size-4 text-primary" />
    </Link>
  );
}
