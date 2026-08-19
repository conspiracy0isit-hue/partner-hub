import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BellRing,
  ChartNoAxesCombined,
  CookingPot,
  Database,
  Gauge,
  IndianRupee,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Package,
  Star,
  Store,
  Utensils,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { canAccess, roleLabel, useSession, type Role } from "@/lib/session";
import { DemoSeeder } from "@/components/DemoSeeder";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/orders", label: "Live Orders", icon: CookingPot, badge: "2" },
  { to: "/kitchen", label: "Kitchen Ops Score", icon: Gauge },
  { to: "/inventory", label: "Inventory & Cost", icon: Package },
  { to: "/revenue", label: "Revenue Intelligence", icon: ChartNoAxesCombined },
  { to: "/promotions", label: "Promotion Studio", icon: Megaphone },
  { to: "/menu", label: "Menu Manager", icon: Utensils },
  { to: "/payouts", label: "Payouts & Finance", icon: IndianRupee },
  { to: "/reviews", label: "Reviews & Ratings", icon: Star },
  { to: "/alerts", label: "Alert Center", icon: BellRing },
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
  const [seedOpen, setSeedOpen] = useState(false);
  const { session, ready, signOut, switchRole, alerts } = useSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const unread = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    if (ready && !session) void navigate({ to: "/login", replace: true });
  }, [ready, session, navigate]);

  if (!ready || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  const role = session.role;
  const allowed = canAccess(role, path);
  const visibleNav = nav.filter((n) => canAccess(role, n.to));

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xl">
            SP
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg tracking-wide">SPICE ROUTE</p>
            <p className="text-xs text-muted-foreground">{session.outlet} · Partner</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {visibleNav.map((item) => (
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
              {item.to === "/alerts" && unread ? (
                <span className="num rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              ) : "badge" in item && item.badge ? (
                <span className="num rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 p-3">
          <button
            onClick={() => setSeedOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-sidebar-accent"
          >
            <Database className="size-3.5" /> Demo data
          </button>
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
            <select
              value={role}
              onChange={(e) => {
                switchRole(e.target.value as Role);
                toast(`Now viewing as ${roleLabel[e.target.value as Role]}`);
              }}
              aria-label="Switch role"
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs font-semibold"
            >
              {(["owner", "manager", "staff"] as Role[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabel[r]}
                </option>
              ))}
            </select>
            <span
              className={cn(
                "num hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline",
                open ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
              )}
            >
              {open ? "● OPEN" : "● CLOSED"}
            </span>
            <Link
              to="/alerts"
              className="relative rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
              aria-label="Alert center"
            >
              <BellRing className="size-4" />
              {unread ? (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
              ) : null}
            </Link>
            <button
              onClick={() => {
                signOut();
                toast("Signed out");
                void navigate({ to: "/login", replace: true });
              }}
              className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
          {visibleNav.map((item) => (
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
        <main className="px-6 py-6">
          {allowed ? (
            children
          ) : (
            <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
              <Lock className="mx-auto size-6 text-muted-foreground" />
              <h2 className="mt-3 font-display text-xl tracking-wide">Restricted section</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {roleLabel[role]} accounts can't open this page. Finance and store configuration
                are limited to the owner.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Back to overview
              </Link>
            </div>
          )}
        </main>
      </div>

      <DemoSeeder open={seedOpen} onClose={() => setSeedOpen(false)} />
    </div>
  );
}
