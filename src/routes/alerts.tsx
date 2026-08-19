import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BellRing,
  CheckCheck,
  Mail,
  MessageCircle,
  Smartphone,
  Star,
  Package,
  IndianRupee,
  FileWarning,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { useSession, type Alert, type Channels } from "@/lib/session";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Notification & Alert Center — Spice Route Partner Portal" },
      {
        name: "description",
        content:
          "In-app alerts and browser push for unassigned riders, low stock, rating dips and payouts, with WhatsApp, SMS and email routing.",
      },
      { property: "og:title", content: "Notification & Alert Center — Spice Route Partner" },
      {
        property: "og:description",
        content: "Route critical restaurant alerts to in-app, push, WhatsApp, SMS and email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertCenter,
});

const kindIcon: Record<Alert["kind"], typeof BellRing> = {
  order: AlertTriangle,
  rating: Star,
  stock: Package,
  payout: IndianRupee,
  compliance: FileWarning,
};

const sevStyle: Record<Alert["severity"], string> = {
  critical: "border-destructive/50 bg-destructive/10 text-destructive",
  warning: "border-warning/50 bg-warning/10 text-warning",
  info: "border-border bg-muted/40 text-muted-foreground",
};

function AlertCenter() {
  const { alerts, markAllRead, markRead, pushAlert, channels, setChannel } = useSession();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const unread = alerts.filter((a) => !a.read).length;

  async function enablePush() {
    if (permission === "unsupported") {
      toast.error("This browser does not support notifications");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setChannel("push", true);
      new Notification("Spice Route Partner", {
        body: "Browser push is on. Critical alerts will appear here.",
      });
      toast.success("Browser push enabled");
    } else {
      setChannel("push", false);
      toast.error("Push permission denied — enable it in browser site settings");
    }
  }

  function fireTestAlert() {
    pushAlert({
      kind: "order",
      severity: "critical",
      title: "Test alert — order about to breach SLA",
      body: "Order #A4823 has been in 'placed' for 4 min. Accept now to protect accept rate.",
    });
    if (channels.inApp) toast.error("Order #A4823 about to breach SLA");
    if (channels.push && permission === "granted") {
      new Notification("Order about to breach SLA", {
        body: "#A4823 has been waiting 4 min. Accept now.",
      });
    }
    const routed = (["whatsapp", "sms", "email"] as const).filter((c) => channels[c]);
    if (routed.length) {
      toast(`Placeholder delivery queued: ${routed.join(", ").toUpperCase()}`, {
        description: "No provider connected in this prototype.",
      });
    }
  }

  const toggles: Array<{
    key: keyof Channels;
    label: string;
    hint: string;
    icon: typeof Mail;
    placeholder?: boolean;
  }> = [
    { key: "inApp", label: "In-app toasts", hint: "Instant banner inside the portal", icon: BellRing },
    { key: "push", label: "Browser push", hint: "Works when the tab is in the background", icon: Smartphone },
    { key: "whatsapp", label: "WhatsApp", hint: "Placeholder — connect a BSP later", icon: MessageCircle, placeholder: true },
    { key: "sms", label: "SMS", hint: "Placeholder — connect a gateway later", icon: Smartphone, placeholder: true },
    { key: "email", label: "Email", hint: "Placeholder — daily + critical digests", icon: Mail, placeholder: true },
  ];

  return (
    <AppShell
      title="Notification & Alert Center"
      subtitle={`${unread} unread · routing rules apply to every outlet you manage`}
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="flex-1 font-display text-xl tracking-wide">Alert feed</h2>
            <button
              onClick={fireTestAlert}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Send test alert
            </button>
            <button
              onClick={() => {
                markAllRead();
                toast.success("All alerts marked read");
              }}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((a) => {
              const Icon = kindIcon[a.kind];
              return (
                <button
                  key={a.id}
                  onClick={() => markRead(a.id)}
                  className={cn(
                    "flex w-full gap-3 rounded-lg border p-3 text-left transition-colors",
                    sevStyle[a.severity],
                    a.read && "opacity-60",
                  )}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {a.title}
                      {!a.read ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.body}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {a.kind} · {a.at}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Delivery channels</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Test each channel before you rely on it during a dinner rush.
            </p>
            <div className="mt-4 space-y-3">
              {toggles.map((t) => (
                <div
                  key={t.key}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                >
                  <t.icon className="size-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {t.label}
                      {t.placeholder ? (
                        <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          placeholder
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.hint}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={channels[t.key]}
                    aria-label={t.label}
                    onClick={() => {
                      if (t.key === "push" && !channels.push) {
                        void enablePush();
                        return;
                      }
                      setChannel(t.key, !channels[t.key]);
                    }}
                    className={cn(
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                      channels[t.key] ? "bg-primary" : "bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-4 rounded-full bg-background transition-all",
                        channels[t.key] ? "left-[1.15rem]" : "left-0.5",
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Browser permission:{" "}
              <span className="font-semibold text-foreground">{permission}</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl tracking-wide">Escalation rules</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Order unaccepted 3 min → in-app + push, then WhatsApp to the manager.</li>
              <li>• Stock below par → push at 09:00 and 16:00 to the kitchen lead.</li>
              <li>• Rating below 4.0 for a day → email digest to the owner.</li>
              <li>• Payout status change → email + in-app to the owner only.</li>
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
