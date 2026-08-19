import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateDemoData, type DemoData } from "@/lib/demo-seed";

export type Role = "owner" | "manager" | "staff";

export type DemoUser = {
  email: string;
  password: string;
  name: string;
  role: Role;
  outlet: string;
};

export const demoUsers: DemoUser[] = [
  {
    email: "owner@spiceroute.in",
    password: "demo1234",
    name: "Ravi Menon",
    role: "owner",
    outlet: "All outlets",
  },
  {
    email: "manager@spiceroute.in",
    password: "demo1234",
    name: "Priya Nair",
    role: "manager",
    outlet: "Indiranagar",
  },
  {
    email: "kitchen@spiceroute.in",
    password: "demo1234",
    name: "Imran Shaikh",
    role: "staff",
    outlet: "Indiranagar",
  },
];

export const roleLabel: Record<Role, string> = {
  owner: "Owner",
  manager: "Outlet Manager",
  staff: "Kitchen Staff",
};

/** Which roles may open each route. Everything not listed is owner-only. */
export const routeAccess: Record<string, Role[]> = {
  "/": ["owner", "manager", "staff"],
  "/orders": ["owner", "manager", "staff"],
  "/kitchen": ["owner", "manager", "staff"],
  "/inventory": ["owner", "manager", "staff"],
  "/alerts": ["owner", "manager", "staff"],
  "/menu": ["owner", "manager"],
  "/reviews": ["owner", "manager"],
  "/promotions": ["owner", "manager"],
  "/revenue": ["owner"],
  "/payouts": ["owner"],
  "/store": ["owner"],
};

export function canAccess(role: Role | undefined, path: string) {
  if (!role) return false;
  return (routeAccess[path] ?? ["owner"]).includes(role);
}

export type Session = { email: string; name: string; role: Role; outlet: string };

export type Alert = {
  id: string;
  kind: "order" | "rating" | "stock" | "payout" | "compliance";
  severity: "critical" | "warning" | "info";
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export type Channels = {
  inApp: boolean;
  push: boolean;
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
};

type Ctx = {
  session: Session | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  switchRole: (role: Role) => void;
  demo: DemoData | null;
  seeding: boolean;
  seedDemoData: (scale: number) => Promise<void>;
  clearDemoData: () => void;
  alerts: Alert[];
  pushAlert: (a: Omit<Alert, "id" | "at" | "read">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  channels: Channels;
  setChannel: (key: keyof Channels, value: boolean) => void;
};

const SessionContext = createContext<Ctx | null>(null);

const SESSION_KEY = "spiceroute.session";
const DEMO_KEY = "spiceroute.demo";
const CHANNEL_KEY = "spiceroute.channels";

const baseAlerts: Alert[] = [
  {
    id: "a1",
    kind: "order",
    severity: "critical",
    title: "Rider unassigned for 6 min",
    body: "Order #A4817 has no rider. Auto-escalation to support in 3 min.",
    at: "2 min ago",
    read: false,
  },
  {
    id: "a2",
    kind: "stock",
    severity: "critical",
    title: "Mutton stock below par",
    body: "3.2 kg left — Rogan Josh will run out in ~2.5 hrs at current pace.",
    at: "14 min ago",
    read: false,
  },
  {
    id: "a3",
    kind: "rating",
    severity: "warning",
    title: "Veg Biryani rating dipped to 3.6",
    body: "7 of the last 12 reviews mention missing raita.",
    at: "1 hr ago",
    read: false,
  },
  {
    id: "a4",
    kind: "compliance",
    severity: "warning",
    title: "Shop & Establishment licence expiring",
    body: "Expires 30 Sep 2026. Upload renewal to avoid delisting.",
    at: "Yesterday",
    read: true,
  },
  {
    id: "a5",
    kind: "payout",
    severity: "info",
    title: "Payout of ₹2,69,849 scheduled",
    body: "Cycle 11–17 Aug will settle to HDFC ••••4821 on 20 Aug.",
    at: "Yesterday",
    read: true,
  },
];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [demo, setDemo] = useState<DemoData | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(baseAlerts);
  const [channels, setChannels] = useState<Channels>({
    inApp: true,
    push: false,
    whatsapp: true,
    sms: false,
    email: true,
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s) as Session);
      const d = localStorage.getItem(DEMO_KEY);
      if (d) setDemo(JSON.parse(d) as DemoData);
      const c = localStorage.getItem(CHANNEL_KEY);
      if (c) setChannels((prev) => ({ ...prev, ...(JSON.parse(c) as Partial<Channels>) }));
    } catch {
      /* ignore corrupt demo state */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const user = demoUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user) return { ok: false, error: "No demo account with that email." };
    if (user.password !== password) return { ok: false, error: "Incorrect password." };
    const next: Session = {
      email: user.email,
      name: user.name,
      role: user.role,
      outlet: user.outlet,
    };
    setSession(next);
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const switchRole = useCallback((role: Role) => {
    setSession((prev) => {
      if (!prev) return prev;
      const user = demoUsers.find((u) => u.role === role);
      const next: Session = {
        ...prev,
        role,
        name: user?.name ?? prev.name,
        email: user?.email ?? prev.email,
        outlet: user?.outlet ?? prev.outlet,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const seedDemoData = useCallback(async (scale: number) => {
    setSeeding(true);
    await new Promise((r) => setTimeout(r, 700));
    const data = generateDemoData(scale);
    setDemo(data);
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(data));
    } catch {
      /* quota */
    }
    setSeeding(false);
  }, []);

  const clearDemoData = useCallback(() => {
    setDemo(null);
    localStorage.removeItem(DEMO_KEY);
  }, []);

  const pushAlert = useCallback((a: Omit<Alert, "id" | "at" | "read">) => {
    setAlerts((prev) => [
      { ...a, id: `a${Date.now()}`, at: "just now", read: false },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(
    () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true }))),
    [],
  );
  const markRead = useCallback(
    (id: string) =>
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a))),
    [],
  );

  const setChannel = useCallback((key: keyof Channels, value: boolean) => {
    setChannels((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(CHANNEL_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      session,
      ready,
      signIn,
      signOut,
      switchRole,
      demo,
      seeding,
      seedDemoData,
      clearDemoData,
      alerts,
      pushAlert,
      markAllRead,
      markRead,
      channels,
      setChannel,
    }),
    [
      session,
      ready,
      signIn,
      signOut,
      switchRole,
      demo,
      seeding,
      seedDemoData,
      clearDemoData,
      alerts,
      pushAlert,
      markAllRead,
      markRead,
      channels,
      setChannel,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
