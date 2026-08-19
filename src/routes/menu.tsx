import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
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
          "Manage categories, variants and add-ons, snooze out-of-stock items in one tap, import menus from Excel and bulk-edit prices.",
      },
      { property: "og:title", content: "Menu Manager — Spice Route Partner Portal" },
      {
        property: "og:description",
        content: "Excel menu import, new item creation, item snooze, bulk price edits and per-item veg/GST controls.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuManager,
});

type Row = { cat: string; name: string; price: number; veg: boolean; gst: number; stock: number; snoozed: boolean };

const emptyDraft = { cat: "", name: "", price: "", gst: "5", stock: "0", veg: true };

export default function MenuManager() {
  const [rows, setRows] = useState<Row[]>(
    menuCategories.flatMap((c) => c.items.map((i) => ({ cat: c.name, ...i }))),
  );
  const [bulk, setBulk] = useState(0);
  const [draft, setDraft] = useState<typeof emptyDraft>(emptyDraft);
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => [...new Set(rows.map((r) => r.cat))], [rows]);

  function downloadTemplate() {
    const ws = XLSX.utils.json_to_sheet([
      { Category: "Biryani", Item: "Egg Biryani", Price: 280, Veg: "No", GST: 5, Stock: 20 },
      { Category: "Desserts", Item: "Gulab Jamun", Price: 90, Veg: "Yes", GST: 5, Stock: 40 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu");
    XLSX.writeFile(wb, "menu-import-template.xlsx");
    toast.success("Excel template downloaded");
  }

  async function handleFile(file: File) {
    try {
      const wb = XLSX.read(await file.arrayBuffer());
      const sheet = wb.Sheets[wb.SheetNames[0]!];
      if (!sheet) throw new Error("empty workbook");
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const get = (r: Record<string, unknown>, keys: string[]) => {
        const k = Object.keys(r).find((x) => keys.includes(x.trim().toLowerCase()));
        return k ? String(r[k] ?? "").trim() : "";
      };
      const parsed: Row[] = [];
      let skipped = 0;
      raw.forEach((r) => {
        const name = get(r, ["item", "name", "item name", "dish"]);
        const price = Number(get(r, ["price", "mrp", "amount"]));
        if (!name || !Number.isFinite(price) || price <= 0) {
          skipped++;
          return;
        }
        const vegRaw = get(r, ["veg", "is veg", "veg/non-veg", "type"]).toLowerCase();
        parsed.push({
          cat: get(r, ["category", "cat", "section"]) || "Uncategorised",
          name,
          price: Math.round(price),
          veg: vegRaw === "" ? true : !/non|no|false|0/.test(vegRaw),
          gst: Number(get(r, ["gst", "tax", "gst%"])) || 5,
          stock: Number(get(r, ["stock", "qty", "quantity"])) || 0,
          snoozed: false,
        });
      });
      if (!parsed.length) {
        toast.error("No valid rows found — check the template columns");
        return;
      }
      setRows((prev) => {
        const map = new Map(prev.map((p) => [`${p.cat}|${p.name}`.toLowerCase(), p]));
        parsed.forEach((p) => map.set(`${p.cat}|${p.name}`.toLowerCase(), { ...map.get(`${p.cat}|${p.name}`.toLowerCase()), ...p }));
        return [...map.values()];
      });
      toast.success(`Imported ${parsed.length} items${skipped ? ` · ${skipped} rows skipped` : ""}`);
    } catch {
      toast.error("Could not read that file. Use .xlsx, .xls or .csv");
    }
  }

  function addItem() {
    const price = Number(draft.price);
    if (!draft.name.trim() || !Number.isFinite(price) || price <= 0) {
      toast.error("Item name and a valid price are required");
      return;
    }
    const row: Row = {
      cat: draft.cat.trim() || "Uncategorised",
      name: draft.name.trim(),
      price: Math.round(price),
      veg: draft.veg,
      gst: Number(draft.gst) || 5,
      stock: Number(draft.stock) || 0,
      snoozed: false,
    };
    if (rows.some((r) => r.name.toLowerCase() === row.name.toLowerCase() && r.cat === row.cat)) {
      toast.error("That item already exists in this category");
      return;
    }
    setRows((p) => [...p, row]);
    setDraft(emptyDraft);
    setShowAdd(false);
    toast.success(`${row.name} added to ${row.cat}`);
  }

  return (
    <AppShell title="Menu Manager" subtitle={`${categories.length} categories · ${rows.length} items`}>
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
            toast.success(`Applied ${bulk}% across ${rows.length} items`);
          }}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
        >
          Apply
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
          >
            {showAdd ? "Close" : "Add item"}
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Import from Excel
          </button>
          <button onClick={downloadTemplate} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Download template
          </button>
          <button onClick={() => toast.success("Menu cloned to 2 outlets")} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Clone to outlets
          </button>
          <button onClick={() => toast("Dinner menu auto-switches at 6:30pm")} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Scheduled menus
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {showAdd ? (
        <section className="mt-4 panel p-5">
          <h2 className="text-lg">New item</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <input
              list="menu-categories"
              placeholder="Category"
              value={draft.cat}
              onChange={(e) => setDraft({ ...draft, cat: e.target.value })}
              className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
            />
            <datalist id="menu-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <input
              placeholder="Item name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="rounded-md border border-border bg-transparent px-3 py-2 text-sm lg:col-span-2"
            />
            <input
              type="number"
              placeholder="Price ₹"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              className="num rounded-md border border-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="GST %"
              value={draft.gst}
              onChange={(e) => setDraft({ ...draft, gst: e.target.value })}
              className="num rounded-md border border-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock"
              value={draft.stock}
              onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
              className="num rounded-md border border-border bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.veg}
                onChange={(e) => setDraft({ ...draft, veg: e.target.checked })}
                className="accent-[var(--color-primary)]"
              />
              Vegetarian
            </label>
            <button
              onClick={addItem}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Save item
            </button>
          </div>
        </section>
      ) : null}

      {categories.map((c) => (
        <section key={c} className="mt-4 panel p-5">
          <h2 className="text-lg">{c}</h2>
          <div className="mt-3 divide-y divide-border">
            {rows
              .filter((r) => r.cat === c)
              .map((r) => (
                <div key={`${r.cat}-${r.name}`} className="flex flex-wrap items-center gap-3 py-3">
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
