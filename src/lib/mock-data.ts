export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export type OrderState =
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered";

export type OrderItem = { name: string; qty: number; price: number; note?: string };

export type Order = {
  id: string;
  code: string;
  customer: string;
  placedAgo: string;
  items: OrderItem[];
  total: number;
  payment: "Prepaid" | "Cash";
  state: OrderState;
  prepMins: number;
  rider: { name: string; etaMins: number; distanceKm: number } | null;
};

export const seedOrders: Order[] = [
  {
    id: "o1",
    code: "#A4821",
    customer: "Ananya R.",
    placedAgo: "12s ago",
    items: [
      { name: "Hyderabadi Chicken Biryani (Full)", qty: 2, price: 340 },
      { name: "Mirchi ka Salan", qty: 1, price: 60, note: "extra spicy" },
    ],
    total: 740,
    payment: "Prepaid",
    state: "placed",
    prepMins: 20,
    rider: null,
  },
  {
    id: "o2",
    code: "#A4820",
    customer: "Vikram S.",
    placedAgo: "1m ago",
    items: [
      { name: "Paneer Butter Masala", qty: 1, price: 280 },
      { name: "Butter Naan", qty: 3, price: 45 },
    ],
    total: 415,
    payment: "Cash",
    state: "placed",
    prepMins: 18,
    rider: null,
  },
  {
    id: "o3",
    code: "#A4817",
    customer: "Meera T.",
    placedAgo: "6m ago",
    items: [{ name: "Mutton Rogan Josh", qty: 1, price: 420 }],
    total: 420,
    payment: "Prepaid",
    state: "preparing",
    prepMins: 25,
    rider: { name: "Rahul K.", etaMins: 4, distanceKm: 1.2 },
  },
  {
    id: "o4",
    code: "#A4815",
    customer: "Joseph D.",
    placedAgo: "11m ago",
    items: [
      { name: "Veg Biryani (Half)", qty: 2, price: 190 },
      { name: "Masala Chaas", qty: 2, price: 50 },
    ],
    total: 480,
    payment: "Prepaid",
    state: "ready",
    prepMins: 15,
    rider: { name: "Imran A.", etaMins: 1, distanceKm: 0.3 },
  },
  {
    id: "o5",
    code: "#A4810",
    customer: "Divya P.",
    placedAgo: "24m ago",
    items: [{ name: "Chicken 65", qty: 1, price: 260 }],
    total: 260,
    payment: "Prepaid",
    state: "picked_up",
    prepMins: 15,
    rider: { name: "Suresh M.", etaMins: 7, distanceKm: 2.6 },
  },
];

export const stateFlow: OrderState[] = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
];

export const stateLabel: Record<OrderState, string> = {
  placed: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  picked_up: "Picked up",
  delivered: "Delivered",
};

export const cancelReasons = [
  "Item out of stock",
  "Kitchen overloaded",
  "Store closing early",
  "Customer requested",
  "Rider unavailable",
];

/* ---------- Revenue intelligence ---------- */

export const lostRevenue = [
  { label: "Rejected orders", amount: 18400, detail: "23 orders rejected, mostly 8–10pm", fix: "Turn on auto-accept under ₹600" },
  { label: "Offline hours", amount: 12750, detail: "4h 20m unplanned offline on Sat", fix: "Set a backup manager device" },
  { label: "Snoozed bestsellers", amount: 9600, detail: "Chicken Biryani snoozed 3h in peak", fix: "Link stock to auto-snooze" },
  { label: "Slow prep penalties", amount: 4250, detail: "Avg prep 26m vs 18m promised", fix: "Raise promised prep to 22m" },
];

export const hourlyDemand = [
  { hour: "11a", orders: 8, capacity: 30 },
  { hour: "12p", orders: 22, capacity: 30 },
  { hour: "1p", orders: 34, capacity: 30 },
  { hour: "2p", orders: 19, capacity: 30 },
  { hour: "3p", orders: 6, capacity: 30 },
  { hour: "4p", orders: 5, capacity: 30 },
  { hour: "5p", orders: 9, capacity: 30 },
  { hour: "6p", orders: 17, capacity: 30 },
  { hour: "7p", orders: 29, capacity: 30 },
  { hour: "8p", orders: 41, capacity: 30 },
  { hour: "9p", orders: 38, capacity: 30 },
  { hour: "10p", orders: 21, capacity: 30 },
];

export const revenueTrend = [
  { day: "Mon", revenue: 42000, orders: 121 },
  { day: "Tue", revenue: 38500, orders: 108 },
  { day: "Wed", revenue: 45200, orders: 132 },
  { day: "Thu", revenue: 47800, orders: 139 },
  { day: "Fri", revenue: 61300, orders: 176 },
  { day: "Sat", revenue: 72400, orders: 209 },
  { day: "Sun", revenue: 68100, orders: 194 },
];

export type MatrixItem = {
  name: string;
  volume: number;
  margin: number;
  quadrant: "Star" | "Puzzle" | "Workhorse" | "Dog";
};

export const itemMatrix: MatrixItem[] = [
  { name: "Chicken Biryani", volume: 412, margin: 38, quadrant: "Star" },
  { name: "Mutton Rogan Josh", volume: 88, margin: 44, quadrant: "Puzzle" },
  { name: "Paneer Tikka", volume: 96, margin: 41, quadrant: "Puzzle" },
  { name: "Butter Naan", volume: 620, margin: 19, quadrant: "Workhorse" },
  { name: "Veg Fried Rice", volume: 132, margin: 22, quadrant: "Workhorse" },
  { name: "Fish Curry", volume: 41, margin: 17, quadrant: "Dog" },
  { name: "Chicken 65", volume: 288, margin: 36, quadrant: "Star" },
  { name: "Gulab Jamun", volume: 54, margin: 15, quadrant: "Dog" },
];

export const basketInsights = [
  { insight: "68% who order Biryani don't add a drink", action: "Biryani + Chaas combo at ₹365", upside: 21400 },
  { insight: "Naan attaches to only 31% of curry orders", action: "Bundle 2 naan free above ₹450", upside: 12800 },
  { insight: "Desserts appear in 4% of baskets", action: "₹29 add-on Gulab Jamun at checkout", upside: 6300 },
];

export const menuGaps = [
  { dish: "Chicken Shawarma", localOrders: 1840, youSell: false, est: 34000 },
  { dish: "Andhra Chilli Chicken", localOrders: 1120, youSell: false, est: 22500 },
  { dish: "Filter Coffee", localOrders: 960, youSell: false, est: 9800 },
];

export const benchmarks = [
  { metric: "Rating", you: "4.3", peers: "4.1", better: true },
  { metric: "Avg prep time", you: "26m", peers: "19m", better: false },
  { metric: "Avg order value", you: "₹412", peers: "₹368", better: true },
  { metric: "Share of search", you: "11%", peers: "17%", better: false },
];

/* ---------- Promotions ---------- */

export type Promo = {
  id: string;
  name: string;
  type: string;
  cohort: string;
  status: "Live" | "Draft" | "Ended";
  spend: number;
  orders: number;
  revenue: number;
};

export const promos: Promo[] = [
  { id: "p1", name: "Weekend 20% off", type: "% off", cohort: "All users", status: "Live", spend: 18400, orders: 312, revenue: 128900 },
  { id: "p2", name: "Free delivery ₹399+", type: "Free delivery", cohort: "New users", status: "Live", spend: 7600, orders: 141, revenue: 58200 },
  { id: "p3", name: "Biryani BOGO", type: "BOGO", cohort: "Dormant 30d", status: "Draft", spend: 0, orders: 0, revenue: 0 },
  { id: "p4", name: "Diwali flat ₹100", type: "Flat off", cohort: "High frequency", status: "Ended", spend: 24000, orders: 402, revenue: 171000 },
];

/* ---------- Core modules ---------- */

export const menuCategories = [
  {
    name: "Biryani",
    items: [
      { name: "Hyderabadi Chicken Biryani", price: 340, veg: false, gst: 5, stock: 24, snoozed: false },
      { name: "Veg Dum Biryani", price: 260, veg: true, gst: 5, stock: 12, snoozed: false },
      { name: "Mutton Biryani", price: 460, veg: false, gst: 5, stock: 0, snoozed: true },
    ],
  },
  {
    name: "Curries",
    items: [
      { name: "Paneer Butter Masala", price: 280, veg: true, gst: 5, stock: 30, snoozed: false },
      { name: "Mutton Rogan Josh", price: 420, veg: false, gst: 5, stock: 8, snoozed: false },
    ],
  },
  {
    name: "Breads & Sides",
    items: [
      { name: "Butter Naan", price: 45, veg: true, gst: 5, stock: 120, snoozed: false },
      { name: "Mirchi ka Salan", price: 60, veg: true, gst: 5, stock: 40, snoozed: false },
    ],
  },
];

export const settlement = {
  cycle: "11 Aug – 17 Aug 2026",
  gross: 375300,
  commission: 82566,
  taxes: 18765,
  deductions: 4120,
  get net() {
    return this.gross - this.commission - this.taxes - this.deductions;
  },
};

export const reviews = [
  { user: "Ananya R.", rating: 5, text: "Biryani was perfect, packaging spotless.", item: "Chicken Biryani", replied: true },
  { user: "Karthik V.", rating: 2, text: "Missing raita again. Third time this month.", item: "Veg Biryani", replied: false },
  { user: "Sneha M.", rating: 4, text: "Great food, delivery a bit slow.", item: "Paneer Tikka", replied: false },
];

export const opsScore = [
  { metric: "Accept rate", value: 82, target: 92, percentile: 41 },
  { metric: "Prep time accuracy", value: 71, target: 85, percentile: 28 },
  { metric: "Order accuracy", value: 94, target: 97, percentile: 63 },
  { metric: "Item availability", value: 88, target: 95, percentile: 52 },
];
