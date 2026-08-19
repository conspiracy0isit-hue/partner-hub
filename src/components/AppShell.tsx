import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BellRing,
  ChartNoAxesCombined,
  CookingPot,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  Star,
  Store,
  Utensils,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/orders", label: "Live Orders", icon: CookingPot, badge: "2" },
  { to: "/revenue", label: "Revenue Intelligence", icon: ChartNoAxesCombined },
  { to: "/promotions", label: "Promotion Studio", icon: Megaphone },
  { to: "/menu", label: "Menu Manager", icon: Utensils },
  { to: "/payouts", label: "Payouts & Finance", icon: IndianRupee },
  { to: "/reviews", label: "Reviews & Ratings", icon: Star },
  { to: "/store", label: "Store Settings", icon: Store },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xl">
            SP
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg tracking-wide">SPICE ROUTE</p>
            <p className="text-xs text-muted-foreground">Indiranagar · Partner</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
              activeProps={{
                className: "bg-sidebar-accent !text-primary font-semibold",
              }}
            >
              <item.icon className="size-4" />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span className="num rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="p-3">
          <button
            onClick={() => {
              setOpen(!open);
              toast[open ? "error" : "success"](
                open ? "Store closed — panic button engaged" : "Store is live again",
              );
            }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
              open
                ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                : "bg-success/15 text-success hover:bg-success/25",
            )}
          >
            <Power className="size-4" />
            {open ? "Panic: close store" : "Reopen store"}
          </button>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl leading-none tracking-wide">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "num rounded-full px-3 py-1 text-xs font-semibold",
                open ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
              )}
            >
              {open ? "● OPEN" : "● CLOSED"}
            </span>
            <button
              onClick={() => toast("3 critical alerts: rider unassigned, KYC expiring, rating dip")}
              className="relative rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              <BellRing className="size-4" />
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
