export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  par: number;
  costPerUnit: number;
  supplier: string;
  burnPerDay: number;
};

export const ingredients: Ingredient[] = [
  { id: "i1", name: "Basmati rice", unit: "kg", stock: 42, par: 30, costPerUnit: 118, supplier: "Anand Agro", burnPerDay: 11 },
  { id: "i2", name: "Chicken (curry cut)", unit: "kg", stock: 9.5, par: 18, costPerUnit: 232, supplier: "Freshmeat Co", burnPerDay: 14 },
  { id: "i3", name: "Mutton (shoulder)", unit: "kg", stock: 3.2, par: 10, costPerUnit: 720, supplier: "Freshmeat Co", burnPerDay: 4.5 },
  { id: "i4", name: "Paneer", unit: "kg", stock: 6.4, par: 8, costPerUnit: 340, supplier: "Nandini Dairy", burnPerDay: 5.2 },
  { id: "i5", name: "Ghee", unit: "L", stock: 11, par: 6, costPerUnit: 620, supplier: "Nandini Dairy", burnPerDay: 1.4 },
  { id: "i6", name: "Onion", unit: "kg", stock: 55, par: 40, costPerUnit: 34, supplier: "KR Market", burnPerDay: 16 },
  { id: "i7", name: "Curd", unit: "kg", stock: 4.1, par: 9, costPerUnit: 76, supplier: "Nandini Dairy", burnPerDay: 6 },
  { id: "i8", name: "Biryani masala", unit: "kg", stock: 2.8, par: 2, costPerUnit: 880, supplier: "Spice Mandi", burnPerDay: 0.4 },
  { id: "i9", name: "Packaging — 750ml tub", unit: "pc", stock: 210, par: 400, costPerUnit: 9, supplier: "PackRight", burnPerDay: 160 },
];

export type Recipe = {
  id: string;
  dish: string;
  price: number;
  soldPerDay: number;
  bom: Array<{ ingredientId: string; qty: number }>;
};

export const recipes: Recipe[] = [
  {
    id: "rc1",
    dish: "Hyderabadi Chicken Biryani (Full)",
    price: 340,
    soldPerDay: 86,
    bom: [
      { ingredientId: "i1", qty: 0.28 },
      { ingredientId: "i2", qty: 0.32 },
      { ingredientId: "i5", qty: 0.03 },
      { ingredientId: "i6", qty: 0.15 },
      { ingredientId: "i8", qty: 0.012 },
      { ingredientId: "i9", qty: 1 },
    ],
  },
  {
    id: "rc2",
    dish: "Mutton Rogan Josh",
    price: 420,
    soldPerDay: 22,
    bom: [
      { ingredientId: "i3", qty: 0.3 },
      { ingredientId: "i7", qty: 0.1 },
      { ingredientId: "i6", qty: 0.12 },
      { ingredientId: "i5", qty: 0.025 },
      { ingredientId: "i9", qty: 1 },
    ],
  },
  {
    id: "rc3",
    dish: "Paneer Butter Masala",
    price: 280,
    soldPerDay: 48,
    bom: [
      { ingredientId: "i4", qty: 0.18 },
      { ingredientId: "i6", qty: 0.1 },
      { ingredientId: "i5", qty: 0.02 },
      { ingredientId: "i9", qty: 1 },
    ],
  },
  {
    id: "rc4",
    dish: "Veg Biryani (Half)",
    price: 190,
    soldPerDay: 37,
    bom: [
      { ingredientId: "i1", qty: 0.18 },
      { ingredientId: "i6", qty: 0.12 },
      { ingredientId: "i8", qty: 0.01 },
      { ingredientId: "i7", qty: 0.06 },
      { ingredientId: "i9", qty: 1 },
    ],
  },
];

export const wastageReasons = [
  "Spoilage / expiry",
  "Over-prep at close",
  "Order cancelled after cook",
  "Quality reject",
  "Spillage in kitchen",
] as const;

export type WastageEntry = {
  id: string;
  ingredientId: string;
  qty: number;
  reason: string;
  at: string;
};

export const wastageLog: WastageEntry[] = [
  { id: "w1", ingredientId: "i2", qty: 1.4, reason: "Order cancelled after cook", at: "Today 14:20" },
  { id: "w2", ingredientId: "i7", qty: 0.8, reason: "Spoilage / expiry", at: "Today 11:05" },
  { id: "w3", ingredientId: "i1", qty: 2.2, reason: "Over-prep at close", at: "Yesterday 23:40" },
];

/* ---------------- Kitchen operations ---------------- */

export const kitchenMetrics = [
  {
    key: "accept",
    metric: "Accept rate",
    value: 82,
    target: 92,
    weight: 30,
    percentile: 41,
    impact: "Every 1% below 92% costs ~2 search positions in your area during peak.",
    fix: "Most rejects happen 22:00–23:00 — trim the late menu instead of rejecting.",
  },
  {
    key: "prep",
    metric: "Prep-time accuracy",
    value: 71,
    target: 85,
    weight: 30,
    percentile: 28,
    impact: "Late-ready orders make riders wait; you pay wait penalties and lose the 'Fast' badge.",
    fix: "Biryani is quoted at 20 min but averages 27. Raise its quoted prep to 26 min.",
  },
  {
    key: "accuracy",
    metric: "Order accuracy",
    value: 94,
    target: 97,
    weight: 25,
    percentile: 63,
    impact: "Each missing-item claim is a refund deduction plus a 1-week ranking penalty.",
    fix: "Raita is missed most. Add it to the packing checklist screen at the pass.",
  },
  {
    key: "availability",
    metric: "Item availability",
    value: 88,
    target: 95,
    weight: 15,
    percentile: 52,
    impact: "Out-of-stock hero items suppress your whole listing for that cuisine tag.",
    fix: "Mutton runs out by 21:00 four days a week — raise the par level to 10 kg.",
  },
] as const;

export const prepAccuracyTrend = [
  { day: "Thu", quoted: 20, actual: 28 },
  { day: "Fri", quoted: 20, actual: 31 },
  { day: "Sat", quoted: 22, actual: 34 },
  { day: "Sun", quoted: 22, actual: 30 },
  { day: "Mon", quoted: 20, actual: 24 },
  { day: "Tue", quoted: 20, actual: 23 },
  { day: "Wed", quoted: 20, actual: 26 },
];

export const rejectReasons = [
  { reason: "Item unavailable", count: 24, share: 43 },
  { reason: "Kitchen overloaded", count: 17, share: 30 },
  { reason: "Closing soon", count: 9, share: 16 },
  { reason: "No rider nearby", count: 6, share: 11 },
];

export const coachingDigest = [
  {
    title: "Fix the 22:00 rush rejects",
    detail: "24 of 56 rejects were 'item unavailable' after 22:00. Switch to a 6-item late-night menu.",
    gain: "+6 pts accept rate",
  },
  {
    title: "Re-quote biryani prep time",
    detail: "Actual prep averages 27 min against a 20 min quote across 7 days.",
    gain: "+11 pts prep accuracy",
  },
  {
    title: "Packing checklist for combos",
    detail: "Raita and salan are the two most-missed sides on biryani combos.",
    gain: "-40% missing-item claims",
  },
];
