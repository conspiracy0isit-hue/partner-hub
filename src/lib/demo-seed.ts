/** Deterministic-ish demo data generator for the prototype. */

export type DemoOutlet = {
  id: string;
  name: string;
  area: string;
  city: string;
  rating: number;
  ordersToday: number;
  live: boolean;
};

export type DemoMenuItem = {
  id: string;
  outletId: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  rating: number;
};

export type DemoOrder = {
  id: string;
  code: string;
  outletId: string;
  customer: string;
  total: number;
  items: number;
  state: "delivered" | "cancelled" | "live";
  minsAgo: number;
};

export type DemoRating = {
  id: string;
  outletId: string;
  stars: number;
  text: string;
  item: string;
};

export type DemoPayout = {
  id: string;
  outletId: string;
  cycle: string;
  gross: number;
  net: number;
  status: "Paid" | "Processing";
};

export type DemoData = {
  seededAt: string;
  scale: number;
  outlets: DemoOutlet[];
  menu: DemoMenuItem[];
  orders: DemoOrder[];
  ratings: DemoRating[];
  payouts: DemoPayout[];
};

const areas = [
  ["Indiranagar", "Bengaluru"],
  ["Koramangala", "Bengaluru"],
  ["HSR Layout", "Bengaluru"],
  ["Powai", "Mumbai"],
  ["Banjara Hills", "Hyderabad"],
  ["Anna Nagar", "Chennai"],
];

const dishes: Array<[string, string, number, number]> = [
  ["Hyderabadi Chicken Biryani", "Biryani", 340, 128],
  ["Veg Biryani", "Biryani", 240, 78],
  ["Mutton Rogan Josh", "Curries", 420, 196],
  ["Paneer Butter Masala", "Curries", 280, 96],
  ["Butter Naan", "Breads", 45, 11],
  ["Tandoori Roti", "Breads", 30, 7],
  ["Paneer Tikka", "Starters", 260, 92],
  ["Chicken 65", "Starters", 290, 118],
  ["Masala Chaas", "Beverages", 50, 12],
  ["Gulab Jamun (2 pc)", "Desserts", 90, 26],
];

const names = [
  "Ananya R.", "Vikram S.", "Meera T.", "Joseph D.", "Karthik V.",
  "Sneha M.", "Rohit B.", "Fatima A.", "Nikhil P.", "Divya K.",
];

const blurbs = [
  "Biryani was perfect, packaging spotless.",
  "Missing raita again, otherwise tasty.",
  "Great food, delivery a bit slow.",
  "Portions have shrunk lately.",
  "Consistently the best in the area.",
  "Gravy leaked in the bag.",
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const pick = <T,>(arr: T[], r: number): T => arr[Math.floor(r * arr.length) % arr.length]!;

export function generateDemoData(scale = 1): DemoData {
  const rand = rng(Date.now() % 100000);
  const outletCount = Math.max(1, Math.min(6, Math.round(2 * scale)));
  const outlets: DemoOutlet[] = Array.from({ length: outletCount }, (_, i) => {
    const [area, city] = areas[i % areas.length]!;
    return {
      id: `out${i + 1}`,
      name: `Spice Route ${area}`,
      area: area!,
      city: city!,
      rating: Number((3.8 + rand() * 0.9).toFixed(1)),
      ordersToday: Math.round(60 + rand() * 140 * scale),
      live: rand() > 0.15,
    };
  });

  const menu: DemoMenuItem[] = [];
  const orders: DemoOrder[] = [];
  const ratings: DemoRating[] = [];
  const payouts: DemoPayout[] = [];

  outlets.forEach((o, oi) => {
    dishes.forEach((d, di) => {
      menu.push({
        id: `m${oi}-${di}`,
        outletId: o.id,
        name: d[0],
        category: d[1],
        price: Math.round(d[2] * (0.95 + rand() * 0.15)),
        cost: d[3],
        rating: Number((3.4 + rand() * 1.5).toFixed(1)),
      });
    });

    const orderCount = Math.round(18 * scale);
    for (let i = 0; i < orderCount; i++) {
      const r = rand();
      orders.push({
        id: `o${oi}-${i}`,
        code: `#B${4000 + oi * 100 + i}`,
        outletId: o.id,
        customer: pick(names, rand()),
        total: Math.round(220 + rand() * 1200),
        items: 1 + Math.floor(rand() * 5),
        state: r > 0.93 ? "cancelled" : r > 0.82 ? "live" : "delivered",
        minsAgo: Math.round(rand() * 720),
      });
    }

    const ratingCount = Math.round(10 * scale);
    for (let i = 0; i < ratingCount; i++) {
      ratings.push({
        id: `r${oi}-${i}`,
        outletId: o.id,
        stars: Math.max(1, Math.min(5, Math.round(3.4 + rand() * 2.2))),
        text: pick(blurbs, rand()),
        item: pick(dishes, rand())[0],
      });
    }

    ["11–17 Aug", "04–10 Aug", "28 Jul–03 Aug", "21–27 Jul"].forEach((cycle, ci) => {
      const gross = Math.round((180000 + rand() * 220000) * scale);
      payouts.push({
        id: `p${oi}-${ci}`,
        outletId: o.id,
        cycle,
        gross,
        net: Math.round(gross * (0.7 + rand() * 0.05)),
        status: ci === 0 ? "Processing" : "Paid",
      });
    });
  });

  return {
    seededAt: new Date().toISOString(),
    scale,
    outlets,
    menu,
    orders,
    ratings,
    payouts,
  };
}
