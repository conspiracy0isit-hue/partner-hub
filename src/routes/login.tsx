import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { demoUsers, roleLabel, useSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Partner Sign In — Spice Route Portal" },
      {
        name: "description",
        content:
          "Sign in to the Spice Route restaurant partner portal to manage live orders, revenue, payouts and kitchen operations.",
      },
      { property: "og:title", content: "Partner Sign In — Spice Route Portal" },
      {
        property: "og:description",
        content: "Owner, manager and kitchen staff access to the restaurant partner portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, session, ready } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@spiceroute.in");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && session) void navigate({ to: "/", replace: true });
  }, [ready, session, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-primary font-display text-xl text-primary-foreground">
            SP
          </div>
          <p className="font-display text-xl tracking-wide">SPICE ROUTE PARTNER</p>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight tracking-wide">
            Run the kitchen, not the spreadsheet.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Live orders, revenue intelligence, promotions, payouts, inventory cost control and a
            kitchen operations score — in one partner portal.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Prototype build · demo accounts only, no real customer data.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-wide">Partner sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Role-based access: owners see finance, managers see operations, kitchen staff see the
            pass.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const res = signIn(email, password);
              if (!res.ok) {
                setError(res.error ?? "Sign in failed");
                return;
              }
              setError(null);
              toast.success("Signed in");
              void navigate({ to: "/", replace: true });
            }}
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Demo accounts
            </p>
            <div className="mt-3 space-y-2">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  onClick={() => {
                    setEmail(u.email);
                    setPassword(u.password);
                  }}
                  className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <span>
                    <span className="font-medium">{roleLabel[u.role]}</span>
                    <span className="block text-xs text-muted-foreground">{u.email}</span>
                  </span>
                  <span className="num text-xs text-muted-foreground">demo1234</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
