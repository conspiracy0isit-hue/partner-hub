import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Gauge, Mail, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import {
  coachingDigest,
  kitchenMetrics,
  prepAccuracyTrend,
  rejectReasons,
} from "@/lib/ops-data";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Operations Score — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Accept rate, prep-time accuracy, order accuracy and availability scored with ranking impact explanations and a weekly coaching digest.",
      },
      { property: "og:title", content: "Kitchen Operations Score — Spice Route Partner" },
      {
        property: "og:description",
        content: "See how kitchen performance drives marketplace ranking, with weekly coaching.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KitchenScore,
});

function KitchenScore() {
  const [open, setOpen] = useState<string>("prep");

  const score = Math.round(
    kitchenMetrics.reduce((s, m) => s + (m.value / m.target) * m.weight, 0),
  );
  const grade = score >= 95 ? "A" : score >= 88 ? "B" : score >= 80 ? "C" : "D";
  const maxActual = Math.max(...prepAccuracyTrend.map((d) => d.actual));

  return (
    <AppShell
      title="Kitchen Operations Score"
      subtitle="Weekly rolling score · drives search ranking, badges and campaign eligibility"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Operations score
          </p>
          <div className="mt-2 flex items-end gap-3">
            <p
              className={cn(
                "num font-display text-6xl leading-none tracking-wide",
                score >= 88 ? "text-success" : score >= 80 ? "text-warning" : "text-destructive",
              )}
            >
              {score}
            </p>
            <span className="mb-2 rounded-md bg-muted px-2 py-1 text-sm font-semibold">
              Grade {grade}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
            <TrendingDown className="size-4" /> Down 4 pts week-on-week
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              You sit in the <span className="font-semibold text-foreground">38th percentile</span>{" "}
              of biryani kitchens in Indiranagar.
            </p>
            <p>
              At grade B you unlock the{" "}
              <span className="font-semibold text-foreground">Fast &amp; Reliable</span> badge and
              a ~12% lift in impressions.
            </p>
          </div>
          <button
            onClick={() => toast.success("Weekly coaching digest emailed to the owner and manager")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="size-4" /> Send me the weekly digest
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-xl tracking-wide">
            <Gauge className="size-4" /> Metric breakdown
          </h2>
          <div className="mt-4 space-y-3">
            {kitchenMetrics.map((m) => {
              const gap = m.value - m.target;
              const isOpen = open === m.key;
              return (
                <div key={m.key} className="rounded-lg border border-border">
                  <button
                    onClick={() => setOpen(isOpen ? "" : m.key)}
                    className="w-full px-4 py-3 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex-1 text-sm font-semibold">{m.metric}</span>
                      <span className="num text-xs text-muted-foreground">
                        weight {m.weight}%
                      </span>
                      <span
                        className={cn(
                          "num text-sm font-semibold",
                          gap >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {m.value}% / {m.target}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          gap >= 0 ? "bg-success" : "bg-destructive",
                        )}
                        style={{ width: `${Math.min(100, m.value)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.percentile}th percentile in your area · tap for ranking impact
                    </p>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-border bg-muted/30 px-4 py-3 text-sm">
                      <p className="font-medium">Why it affects your ranking</p>
                      <p className="mt-1 text-muted-foreground">{m.impact}</p>
                      <p className="mt-2 flex items-start gap-1.5 text-primary">
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                        {m.fix}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl tracking-wide">Quoted vs actual prep time</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every red bar above the line is a rider waiting at your counter.
          </p>
          <div className="mt-5 flex h-44 items-end gap-3">
            {prepAccuracyTrend.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-full w-full items-end gap-1">
                  <div
                    className="flex-1 rounded-t bg-muted"
                    style={{ height: `${(d.quoted / maxActual) * 100}%` }}
                    title={`Quoted ${d.quoted} min`}
                  />
                  <div
                    className={cn(
                      "flex-1 rounded-t",
                      d.actual > d.quoted + 3 ? "bg-destructive" : "bg-success",
                    )}
                    style={{ height: `${(d.actual / maxActual) * 100}%` }}
                    title={`Actual ${d.actual} min`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Grey = quoted · coloured = actual. Weekend gap averages 10 min.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl tracking-wide">Why orders were rejected</h2>
          <div className="mt-4 space-y-3">
            {rejectReasons.map((r) => (
              <div key={r.reason}>
                <div className="flex items-center justify-between text-sm">
                  <span>{r.reason}</span>
                  <span className="num text-muted-foreground">
                    {r.count} · {r.share}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${r.share}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
            Rejections cost you an estimated{" "}
            <span className="num font-semibold text-foreground">₹41,300</span> in lost GMV this
            week, plus a ranking penalty that lasts 7 days.
          </p>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl tracking-wide">Weekly coaching digest</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three fixes, ranked by score impact. Sent every Monday 08:00.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {coachingDigest.map((c, i) => (
            <div key={c.title} className="rounded-lg border border-border p-4">
              <span className="num text-xs font-semibold text-muted-foreground">0{i + 1}</span>
              <p className="mt-1 font-semibold">{c.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.detail}</p>
              <p className="mt-3 inline-block rounded bg-success/15 px-2 py-1 text-xs font-semibold text-success">
                {c.gain}
              </p>
              <button
                onClick={() => toast.success(`Added to this week's kitchen plan: ${c.title}`)}
                className="mt-3 w-full rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
              >
                Add to kitchen plan
              </button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
