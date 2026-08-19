import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import {
  commissionOrders,
  deductions,
  inr,
  payoutHistory,
  settlement,
} from "@/lib/mock-data";

export const Route = createFileRoute("/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts & Finance — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Settlement cycle breakdown, per-order commission transparency, deduction disputes, instant payout and GST/TDS reports for your outlet.",
      },
      { property: "og:title", content: "Payouts & Finance — Spice Route Partner Portal" },
      {
        property: "og:description",
        content:
          "Gross sales to net payout, per-order commission breakdown and one-tap deduction disputes.",
      },
    ],
  }),
  component: Payouts,
});

function Payouts() {
  const [disputed, setDisputed] = useState<string[]>([]);
  const [advance, setAdvance] = useState(false);
  const fee = Math.round(settlement.net * 0.015);

  const waterfall = [
    { label: "Gross sales", value: settlement.gross, tone: "text-foreground" },
    { label: "Platform commission (21.8%)", value: -settlement.commission, tone: "text-destructive" },
    { label: "Taxes (GST + TCS)", value: -settlement.taxes, tone: "text-destructive" },
    { label: "Deductions & refunds", value: -settlement.deductions, tone: "text-destructive" },
  ];

  return (
    <AppShell
      title="Payouts & Finance"
      subtitle={`Settlement cycle ${settlement.cycle} · credited every Tuesday`}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Gross to net
          </h2>
          <div className="mt-4 space-y-3">
            {waterfall.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={cn("num font-semibold", row.tone)}>
                  {row.value < 0 ? "− " : ""}
                  {inr(Math.abs(row.value))}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-display text-xl tracking-wide">Net payout</span>
              <span className="num font-display text-2xl text-success">{inr(settlement.net)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-primary/40 bg-primary/5 p-5">
          <h2 className="font-display text-xl tracking-wide">Instant payout</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get today instead of Tuesday. Fee 1.5%.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Eligible amount</dt>
              <dd className="num">{inr(settlement.net)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Fee</dt>
              <dd className="num text-destructive">− {inr(fee)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>You receive now</dt>
              <dd className="num text-success">{inr(settlement.net - fee)}</dd>
            </div>
          </dl>
          <button
            disabled={advance}
            onClick={() => {
              setAdvance(true);
              toast.success("Instant payout initiated — funds in ~30 minutes");
            }}
            className="mt-4 w-full rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {advance ? "Payout processing" : "Get money now"}
          </button>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl tracking-wide">Per-order commission breakdown</h2>
          <div className="flex gap-2">
            {["Invoice PDF", "GST report", "TDS certificate"].map((d) => (
              <button
                key={d}
                onClick={() => toast(`${d} download started`)}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-150 text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Order</th>
                <th>Gross</th>
                <th>Commission</th>
                <th>Taxes</th>
                <th>Rider fee</th>
                <th>Ads</th>
                <th className="text-right">Net to you</th>
              </tr>
            </thead>
            <tbody>
              {commissionOrders.map((o) => {
                const comm = Math.round((o.gross * o.commissionPct) / 100);
                const net = o.gross - comm - o.taxes - o.riderFee - o.ads;
                return (
                  <tr key={o.code} className="border-t border-border">
                    <td className="num py-2.5 font-semibold">{o.code}</td>
                    <td className="num">{inr(o.gross)}</td>
                    <td className="num text-destructive">
                      − {inr(comm)}{" "}
                      <span className="text-xs text-muted-foreground">({o.commissionPct}%)</span>
                    </td>
                    <td className="num text-destructive">− {inr(o.taxes)}</td>
                    <td className="num text-destructive">− {inr(o.riderFee)}</td>
                    <td className="num text-destructive">− {inr(o.ads)}</td>
                    <td className="num text-right font-semibold text-success">{inr(net)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl tracking-wide">Deductions this cycle</h2>
          <ul className="mt-4 space-y-3">
            {deductions.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.order} · liability: {d.liable}
                  </p>
                </div>
                <span className="num text-sm font-semibold text-destructive">− {inr(d.amount)}</span>
                {d.disputable ? (
                  <button
                    disabled={disputed.includes(d.id)}
                    onClick={() => {
                      setDisputed((p) => [...p, d.id]);
                      toast.success(`Dispute raised for ${d.order} — response in 48h`);
                    }}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent disabled:opacity-60"
                  >
                    {disputed.includes(d.id) ? "Dispute raised" : "Dispute"}
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">Not disputable</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl tracking-wide">Past settlements</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {payoutHistory.map((p) => (
              <li key={p.cycle} className="flex items-center justify-between">
                <span className="text-muted-foreground">{p.cycle}</span>
                <span className="num font-semibold">{inr(p.net)}</span>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
