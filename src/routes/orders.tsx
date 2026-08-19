import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, Printer, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  cancelReasons,
  inr,
  seedOrders,
  stateFlow,
  stateLabel,
  type Order,
  type OrderState,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Live Orders — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Accept or reject incoming orders, set prep time, track riders to the store and manage cancellations with reason codes.",
      },
      { property: "og:title", content: "Live Orders — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Incoming order queue with prep-time selection, rider ETA and auto-accept rules.",
      },
    ],
  }),
  component: LiveOrders,
});

function LiveOrders() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selectedId, setSelectedId] = useState(seedOrders[0]!.id);
  const [autoAccept, setAutoAccept] = useState(true);
  const [autoCap, setAutoCap] = useState(600);
  const [sound, setSound] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId) ?? orders[0]!;

  const update = (id: string, patch: Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const advance = (o: Order) => {
    const next = stateFlow[Math.min(stateFlow.indexOf(o.state) + 1, stateFlow.length - 1)];!
    update(o.id, { state: next });
    toast.success(`${o.code} → ${stateLabel[next]}`);
  };

  return (
    <AppShell title="Live Orders" subtitle="Queue refreshes in real time · 60s response SLA">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="panel flex flex-wrap items-center gap-4 p-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoAccept}
                onChange={(e) => setAutoAccept(e.target.checked)}
                className="size-4 accent-[var(--color-primary)]"
              />
              Auto-accept under
            </label>
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={autoCap}
              onChange={(e) => setAutoCap(Number(e.target.value))}
              className="w-40 accent-[var(--color-primary)]"
            />
            <span className="num text-sm font-semibold text-primary">{inr(autoCap)}</span>
            <button
              onClick={() => setSound(!sound)}
              className={cn(
                "ml-auto flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs",
                sound ? "text-success" : "text-muted-foreground",
              )}
            >
              <Volume2 className="size-4" /> Sound alerts {sound ? "on" : "off"}
            </button>
          </div>

          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              active={o.id === selected.id}
              onSelect={() => setSelectedId(o.id)}
              onAccept={(mins) => {
                update(o.id, { state: "accepted", prepMins: mins });
                toast.success(`${o.code} accepted · ${mins} min prep`);
              }}
              onAdvance={() => advance(o)}
              onCancel={() => setCancelling(o.id)}
            />
          ))}
        </div>

        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{selected.code} · {selected.customer}</h2>
              <button
                onClick={() => toast.success("Sent to kitchen printer (KOT-2)")}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/60"
              >
                <Printer className="size-4" /> Print KOT
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {selected.items.map((i) => (
                <div key={i.name} className="flex justify-between text-sm">
                  <span>
                    <span className="num text-muted-foreground">{i.qty}× </span>
                    {i.name}
                    {i.note ? (
                      <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[11px] text-warning">
                        {i.note}
                      </span>
                    ) : null}
                  </span>
                  <span className="num">{inr(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                <span>Total · {selected.payment}</span>
                <span className="num">{inr(selected.total)}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {stateFlow.map((s) => (
                <span
                  key={s}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px]",
                    stateFlow.indexOf(selected.state) >= stateFlow.indexOf(s)
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {stateLabel[s]}
                </span>
              ))}
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="relative h-56 bg-[linear-gradient(0deg,transparent_23px,var(--color-border)_24px),linear-gradient(90deg,transparent_23px,var(--color-border)_24px)] [background-size:24px_24px]">
              <div className="absolute left-[22%] top-[62%] flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Bike className="size-4" />
                </span>
                <span className="rounded bg-card px-2 py-1 text-xs">
                  {selected.rider ? selected.rider.name : "Rider unassigned"}
                </span>
              </div>
              <div className="absolute right-[18%] top-[24%] rounded bg-card px-2 py-1 text-xs">
                🏪 Your store
              </div>
              <svg className="absolute inset-0 size-full" aria-hidden>
                <path
                  d="M 90 150 C 160 150, 180 80, 280 66"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between p-4 text-sm">
              <span className="text-muted-foreground">Rider ETA to store</span>
              <span className="num font-semibold text-primary">
                {selected.rider ? `${selected.rider.etaMins} min · ${selected.rider.distanceKm} km` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {cancelling ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 p-4">
          <div className="panel w-full max-w-md p-5">
            <h2 className="text-lg">Cancel order</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a reason code. Refund liability is split automatically.
            </p>
            <div className="mt-4 space-y-2">
              {cancelReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setOrders((p) => p.filter((o) => o.id !== cancelling));
                    setCancelling(null);
                    toast.error(`Order cancelled — ${r}. Liability: restaurant 60% / platform 40%`);
                  }}
                  className="w-full rounded-md border border-border px-3 py-2 text-left text-sm hover:border-destructive/60"
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCancelling(null)}
              className="mt-4 w-full rounded-md bg-secondary py-2 text-sm"
            >
              Keep order
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function OrderCard({
  order,
  active,
  onSelect,
  onAccept,
  onAdvance,
  onCancel,
}: {
  order: Order;
  active: boolean;
  onSelect: () => void;
  onAccept: (mins: number) => void;
  onAdvance: () => void;
  onCancel: () => void;
}) {
  const [prep, setPrep] = useState(order.prepMins);
  const nextLabel: Record<OrderState, string> = {
    placed: "Accept",
    accepted: "Start preparing",
    preparing: "Mark ready",
    ready: "Handover to rider",
    picked_up: "Mark delivered",
    delivered: "Completed",
  };

  return (
    <article
      onClick={onSelect}
      className={cn(
        "panel cursor-pointer p-4 transition-colors",
        active && "border-primary/70",
        order.state === "placed" && "ring-1 ring-primary/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="num font-semibold">{order.code}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
          {stateLabel[order.state]}
        </span>
        <span className="text-xs text-muted-foreground">{order.placedAgo}</span>
        <span className="num ml-auto font-semibold">{inr(order.total)}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {order.items.map((i) => `${i.qty}× ${i.name}`).join(" · ")}
      </p>

      {order.state === "placed" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Prep time</span>
          {[15, 20, 25, 35].map((m) => (
            <button
              key={m}
              onClick={(e) => {
                e.stopPropagation();
                setPrep(m);
              }}
              className={cn(
                "num rounded-md border border-border px-2.5 py-1 text-xs",
                prep === m && "border-primary bg-primary/15 text-primary",
              )}
            >
              {m}m
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(prep);
            }}
            className="ml-auto rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
          >
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm text-destructive"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdvance();
            }}
            disabled={order.state === "delivered"}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium disabled:opacity-40"
          >
            {nextLabel[order.state]}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Cancel order
          </button>
          {order.rider ? (
            <span className="num ml-auto text-xs text-muted-foreground">
              {order.rider.name} · {order.rider.etaMins}m away
            </span>
          ) : null}
        </div>
      )}
    </article>
  );
}
