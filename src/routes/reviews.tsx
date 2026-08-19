import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { complaints, itemRatings, ratingTrend, reviews } from "@/lib/mock-data";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Ratings — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Rating trend, per-item ratings, inline review replies, complaint tickets with photo evidence and auto-flagged repeat issues.",
      },
      { property: "og:title", content: "Reviews & Ratings — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Track rating trends, reply to reviews inline and resolve complaint tickets.",
      },
    ],
  }),
  component: Reviews,
});

function Stars({ n }: { n: number }) {
  return (
    <span className="num text-warning" aria-label={`${n} out of 5`}>
      {"★".repeat(Math.round(n))}
      <span className="text-muted-foreground">{"★".repeat(5 - Math.round(n))}</span>
    </span>
  );
}

function Reviews() {
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const max = 5;

  return (
    <AppShell
      title="Reviews & Ratings"
      subtitle="4.2 average over 1,633 rated orders · up 0.2 vs last month"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Rating trend
          </h2>
          <div className="mt-6 flex h-40 items-end gap-4">
            {ratingTrend.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                <span className="num text-xs text-muted-foreground">{w.rating.toFixed(1)}</span>
                <div
                  className="w-full rounded-t bg-primary/70"
                  style={{ height: `${((w.rating - 3.5) / (max - 3.5)) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{w.week}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-warning/40 bg-warning/5 p-5">
          <h2 className="font-display text-xl tracking-wide">Auto-flagged issue</h2>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Veg Biryani</span> has 7 “missing raita” complaints in
            14 days — 3.1% of its orders. Estimated rating drag: −0.2.
          </p>
          <button
            onClick={() => toast.success("Packing checklist added for Veg Biryani")}
            className="mt-4 w-full rounded-md bg-warning px-3 py-2 text-sm font-semibold text-warning-foreground"
          >
            Add packing checklist
          </button>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl tracking-wide">Recent reviews</h2>
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => {
              const key = r.user;
              const done = r.replied || sent.includes(key);
              return (
                <li key={key} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">{r.user}</span>
                    <Stars n={r.rating} />
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {r.item}
                    </span>
                    {done ? (
                      <span className="ml-auto text-xs text-success">Replied</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  {!done ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        value={replies[key] ?? ""}
                        onChange={(e) => setReplies((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder="Write a reply…"
                        className="min-w-50 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() =>
                          setReplies((p) => ({
                            ...p,
                            [key]:
                              "Thank you for the feedback — we're tightening our packing checks and would love to make it right on your next order.",
                          }))
                        }
                        className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                      >
                        AI draft
                      </button>
                      <button
                        onClick={() => {
                          setSent((p) => [...p, key]);
                          toast.success(`Reply posted to ${r.user}`);
                        }}
                        className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Post reply
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl tracking-wide">Per-item ratings</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {itemRatings.map((i) => (
              <li key={i.item}>
                <div className="flex items-center justify-between">
                  <span className="truncate pr-2">{i.item}</span>
                  <span
                    className={cn(
                      "num font-semibold",
                      i.rating >= 4.2 ? "text-success" : i.rating >= 3.8 ? "text-warning" : "text-destructive",
                    )}
                  >
                    {i.rating.toFixed(1)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${(i.rating / 5) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{i.count} ratings</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl tracking-wide">Complaint tickets</h2>
        <ul className="mt-4 space-y-3">
          {complaints.map((c) => {
            const isResolved = c.status === "Resolved" || resolved.includes(c.id);
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
              >
                <span className="rounded-md bg-destructive/15 px-2 py-1 text-xs font-semibold text-destructive">
                  {c.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{c.detail}</p>
                  <p className="num text-xs text-muted-foreground">
                    {c.order}
                    {c.photo ? " · photo evidence attached" : ""}
                  </p>
                </div>
                {isResolved ? (
                  <span className="text-xs font-semibold text-success">Resolved</span>
                ) : (
                  <button
                    onClick={() => {
                      setResolved((p) => [...p, c.id]);
                      toast.success(`Ticket ${c.order} resolved`);
                    }}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                  >
                    Resolve
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
