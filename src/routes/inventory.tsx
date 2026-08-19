import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Trash2, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/mock-data";
import {
  ingredients as seedIngredients,
  recipes,
  wastageLog as seedWastage,
  wastageReasons,
  type WastageEntry,
} from "@/lib/ops-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory & Cost Control — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "Recipe bill of materials, live food cost percentage, low-stock alerts with days-of-cover and wastage logging for the kitchen.",
      },
      { property: "og:title", content: "Inventory & Cost Control — Spice Route Partner" },
      {
        property: "og:description",
        content: "Track recipe costs, food cost %, low stock and wastage in one screen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const [stock, setStock] = useState(seedIngredients);
  const [wastage, setWastage] = useState<WastageEntry[]>(seedWastage);
  const [openRecipe, setOpenRecipe] = useState<string>("rc1");
  const [wIngredient, setWIngredient] = useState("i2");
  const [wQty, setWQty] = useState("0.5");
  const [wReason, setWReason] = useState<string>(wastageReasons[0]);

  const byId = useMemo(() => Object.fromEntries(stock.map((i) => [i.id, i])), [stock]);

  const costed = recipes.map((r) => {
    const cost = r.bom.reduce(
      (sum, b) => sum + (byId[b.ingredientId]?.costPerUnit ?? 0) * b.qty,
      0,
    );
    return { ...r, cost, foodCostPct: (cost / r.price) * 100 };
  });

  const revenue = costed.reduce((s, r) => s + r.price * r.soldPerDay, 0);
  const foodCost = costed.reduce((s, r) => s + r.cost * r.soldPerDay, 0);
  const wastageCost = wastage.reduce(
    (s, w) => s + (byId[w.ingredientId]?.costPerUnit ?? 0) * w.qty,
    0,
  );
  const blendedPct = (foodCost / revenue) * 100;
  const lowStock = stock.filter((i) => i.stock < i.par);
  const active = costed.find((r) => r.id === openRecipe) ?? costed[0]!;

  function logWastage() {
    const qty = Number(wQty);
    if (!qty || qty <= 0) {
      toast.error("Enter a quantity greater than zero");
      return;
    }
    setWastage((prev) => [
      { id: `w${Date.now()}`, ingredientId: wIngredient, qty, reason: wReason, at: "Just now" },
      ...prev,
    ]);
    setStock((prev) =>
      prev.map((i) =>
        i.id === wIngredient ? { ...i, stock: Math.max(0, Number((i.stock - qty).toFixed(2))) } : i,
      ),
    );
    toast.success(
      `Logged ${qty} ${byId[wIngredient]?.unit ?? ""} wastage — ${inr(
        (byId[wIngredient]?.costPerUnit ?? 0) * qty,
      )} written off`,
    );
  }

  return (
    <AppShell
      title="Inventory & Cost Control"
      subtitle="Recipe-level costing, live stock cover and wastage — Indiranagar kitchen"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Blended food cost", value: `${blendedPct.toFixed(1)}%`, note: "Target ≤ 32%", bad: blendedPct > 32 },
          { label: "Daily food cost", value: inr(foodCost), note: `on ${inr(revenue)} sales` },
          { label: "Wastage written off", value: inr(wastageCost), note: `${wastage.length} entries logged`, bad: wastageCost > 500 },
          { label: "Items below par", value: `${lowStock.length}`, note: "Reorder before the dinner rush", bad: lowStock.length > 0 },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            <p
              className={cn(
                "num mt-1 font-display text-3xl tracking-wide",
                k.bad ? "text-destructive" : "text-foreground",
              )}
            >
              {k.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{k.note}</p>
          </div>
        ))}
      </div>

      {lowStock.length ? (
        <section className="mt-5 rounded-xl border border-destructive/50 bg-destructive/10 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg tracking-wide text-destructive">
            <AlertTriangle className="size-4" /> Low-stock alerts
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lowStock.map((i) => {
              const cover = i.burnPerDay ? i.stock / i.burnPerDay : 99;
              return (
                <div key={i.id} className="rounded-lg border border-border bg-card p-3">
                  <p className="flex items-center justify-between text-sm font-semibold">
                    {i.name}
                    <span className="num text-xs text-destructive">
                      {cover < 1 ? `${Math.round(cover * 24)} hrs cover` : `${cover.toFixed(1)} days`}
                    </span>
                  </p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    {i.stock} {i.unit} on hand · par {i.par} {i.unit} · {i.supplier}
                  </p>
                  <button
                    onClick={() => {
                      setStock((prev) =>
                        prev.map((s) => (s.id === i.id ? { ...s, stock: s.par * 1.5 } : s)),
                      );
                      toast.success(`Purchase order raised to ${i.supplier} for ${i.name}`);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-3.5" /> Raise purchase order
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl tracking-wide">Recipe bill of materials</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {costed.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpenRecipe(r.id)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-semibold",
                  r.id === active.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent",
                )}
              >
                {r.dish}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2">Ingredient</th>
                  <th className="pb-2 text-right">Qty / plate</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {active.bom.map((b) => {
                  const ing = byId[b.ingredientId];
                  const cost = (ing?.costPerUnit ?? 0) * b.qty;
                  return (
                    <tr key={b.ingredientId} className="border-b border-border/60">
                      <td className="py-2">{ing?.name}</td>
                      <td className="num py-2 text-right">
                        {b.qty} {ing?.unit}
                      </td>
                      <td className="num py-2 text-right text-muted-foreground">
                        {inr(ing?.costPerUnit ?? 0)}/{ing?.unit}
                      </td>
                      <td className="num py-2 text-right">{inr(cost)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Plate cost</p>
              <p className="num font-display text-2xl">{inr(active.cost)}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Menu price</p>
              <p className="num font-display text-2xl">{inr(active.price)}</p>
            </div>
            <div
              className={cn(
                "rounded-lg p-3",
                active.foodCostPct > 35 ? "bg-destructive/15" : "bg-success/15",
              )}
            >
              <p className="text-xs text-muted-foreground">Food cost %</p>
              <p
                className={cn(
                  "num font-display text-2xl",
                  active.foodCostPct > 35 ? "text-destructive" : "text-success",
                )}
              >
                {active.foodCostPct.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {active.foodCostPct > 35
              ? `Above the 35% ceiling — a ${inr(
                  Math.ceil((active.cost / 0.33 - active.price) / 5) * 5,
                )} price bump or a 20 g portion trim brings it back to 33%.`
              : "Within the healthy 28–35% band for this cuisine."}
          </p>
        </section>

        <section className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Log wastage</h2>
            <div className="mt-3 space-y-3">
              <select
                value={wIngredient}
                onChange={(e) => setWIngredient(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {stock.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.1"
                min="0"
                value={wQty}
                onChange={(e) => setWQty(e.target.value)}
                className="num w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Quantity"
                aria-label="Wastage quantity"
              />
              <select
                value={wReason}
                onChange={(e) => setWReason(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {wastageReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                onClick={logWastage}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="size-4" /> Record wastage
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Wastage log</h2>
            <ul className="mt-3 space-y-2">
              {wastage.map((w) => {
                const ing = byId[w.ingredientId];
                return (
                  <li
                    key={w.id}
                    className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-sm"
                  >
                    <span>
                      <span className="font-medium">
                        {ing?.name} · {w.qty} {ing?.unit}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {w.reason} · {w.at}
                      </span>
                    </span>
                    <span className="num text-destructive">
                      -{inr((ing?.costPerUnit ?? 0) * w.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl tracking-wide">Stock on hand</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2">Ingredient</th>
                <th className="pb-2 text-right">On hand</th>
                <th className="pb-2 text-right">Par</th>
                <th className="pb-2 text-right">Burn / day</th>
                <th className="pb-2 text-right">Cover</th>
                <th className="pb-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((i) => {
                const cover = i.burnPerDay ? i.stock / i.burnPerDay : 99;
                return (
                  <tr key={i.id} className="border-b border-border/60">
                    <td className="py-2">
                      {i.name}
                      <span className="block text-xs text-muted-foreground">{i.supplier}</span>
                    </td>
                    <td className="num py-2 text-right">
                      {i.stock} {i.unit}
                    </td>
                    <td className="num py-2 text-right text-muted-foreground">{i.par}</td>
                    <td className="num py-2 text-right text-muted-foreground">{i.burnPerDay}</td>
                    <td
                      className={cn(
                        "num py-2 text-right",
                        cover < 1 ? "text-destructive" : cover < 2 ? "text-warning" : "text-success",
                      )}
                    >
                      {cover.toFixed(1)} d
                    </td>
                    <td className="num py-2 text-right">{inr(i.stock * i.costPerUnit)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
