# Partner Power Hub

# Restaurant Partner Portal — Food Delivery Marketplace

 a **merchant-side web app** for a Swiggy/DoorDash-style platform. This is the dashboard restaurant owners log into to manage their presence on your marketplace.

---

## Core Modules (table stakes — must exist)

**1. Live Orders**

- Incoming order queue with accept/reject + prep-time selection

- Order states: placed → accepted → preparing → ready → picked up → delivered

- Rider tracking on map, rider ETA to store

- Auto-accept rules (accept all orders under ₹X during peak)

- Sound/browser-push alerts, order printing to kitchen printer

- Cancellation with reason codes, refund liability split (who pays: you, restaurant, or rider)

**2. Menu Manager**

- Categories, items, variants (half/full, small/large), add-on groups

- Item images with quality guidance + auto-crop

- Per-item toggles: veg/non-veg, spice level, allergens, GST slab

- **Item snooze** — one tap to mark out-of-stock for 1hr / today / indefinitely

- Scheduled menus (breakfast/lunch/dinner auto-switch)

- Bulk price edit, CSV import, clone menu across outlets

**3. Store Settings**

- Open/close hours per day, holiday calendar

- **Panic button** — close store instantly (kitchen fire, staff shortage)

- Prep time defaults, packaging charge, min order value

- Delivery radius, service area polygon

- FSSAI license, GST number, bank account, KYC document upload

**4. Payouts & Finance**

- Settlement cycle view: gross sales → commission → taxes → deductions → net payout

- Per-order commission breakdown (transparency is a huge trust driver)

- Invoice download, TDS/TCS certificates, GST reports

- Dispute a deduction workflow

- **Instant payout** — advance settlement for a small fee (revenue line for you, cash-flow relief for them)

**5. Reviews & Ratings**

- Rating trend, per-item ratings

- Respond to reviews inline

- Complaint tickets with photo evidence

- Auto-flagged issues (repeated "missing item" complaints on one dish)

---

## Growth Features (this is what wins signups)

These are the features that make an owner choose your platform over the incumbent.

### 6. Revenue Intelligence

- **Lost revenue counter** — money left on the table this week: rejected orders, offline hours, snoozed bestsellers, slow prep penalties. Quantified in currency, not percentages. This single number is the most persuasive thing on the dashboard.

- **Demand heatmap** — orders by hour × day, overlaid with your capacity. Shows exactly which hours are underserved.

- **Item performance matrix** — 2×2 of order volume vs margin: Stars, Puzzles (high margin/low volume → promote), Workhorses, Dogs (delist)

- Basket analysis: "68% who order Biryani don't add a drink" → suggests a combo

- Repeat customer rate, new vs returning revenue split

- **Menu gap finder** — dishes ordered frequently in your pincode that you don't sell

### 7. Competitive Benchmarking

- Anonymized peer comparison: your rating, prep time, and avg order value vs similar restaurants in a 3km radius

- Your rank in your cuisine category locally, week over week

- Price positioning: your Butter Chicken at ₹340 vs area median ₹295

- **Share of search** — how often you appear when users search your cuisine, and where you place

- Competitor promo activity ("4 nearby biryani places ran 20% off this weekend; you didn't")

### 8. Self-Serve Ads Manager

- Sponsored listing campaigns with budget, bid, and daypart targeting

- Placement options: search results, category page, homepage carousel, "near you" rail

- Live ROAS dashboard: spend → impressions → clicks → orders → revenue

- Audience targeting: lapsed customers, new users in your zone, high-AOV users

- Recommended budget based on your capacity gaps

- **Guaranteed-orders packages** — pay ₹X, get Y orders or refund the difference

### 9. Promotion Studio

- Discount builder: flat off, % off, BOGO, free delivery, free item above threshold

- **Funded-by split control** — set what you contribute vs platform contribution

- Cohort targeting: first-time users, dormant 30-day users, high-frequency users

- Combo/meal builder with margin calculator that warns before you go negative

- **Profitability simulator** — model a promo before launching: projected orders, incremental revenue, margin impact, breakeven volume

- A/B test two offers against each other

### 10. Kitchen Operations Score

- Composite health score with the levers that actually move ranking on your platform

- Metrics: accept rate, avg prep time, order accuracy, cancellation rate, item availability %

- **Ranking impact explainer** — "Raising accept rate from 82% to 92% would move you up ~4 positions in local search." Directly ties behavior to visibility.

- Prep-time accuracy: promised vs actual, and the rider-wait cost

- Peer percentile on every metric

- Weekly coaching digest with the one highest-leverage fix

### 11. Inventory & Cost Control

- Recipe/BOM per dish → live food cost % and true margin

- Auto-depletion on order, low-stock alerts before you go out of stock mid-rush

- **Auto-snooze at zero stock** — prevents the cancellation that damages your rating

- Wastage logging with reason codes

- Supplier price tracking with margin-erosion alerts

- **Marketplace procurement** — order raw materials through your platform at negotiated rates (major B2B revenue line and a genuine lock-in)

### 12. Multi-Outlet Console

- Portfolio dashboard: all outlets ranked by revenue, rating, ops score

- Outlet comparison, best-performer benchmarking

- Push menu/price/promo changes to selected outlets with approval flow

- Role-based access: owner, cluster manager, outlet manager, accountant

- Franchise compliance monitoring

### 13. Customer Relationship Layer

Owners on delivery platforms hate being cut off from their customers. Giving them *any* direct relationship is a strong differentiator.

- Privacy-safe customer segments (aggregate cohorts, not individual PII)

- Loyalty program hosted on your platform: stamps, points, tiers

- **Win-back campaigns** — push/SMS to lapsed customers, priced per send

- Post-order feedback surveys

- Branded storefront microsite with direct-order link (no-commission or low-commission channel — huge acquisition pitch)

### 14. AI Copilot

- Natural-language analytics: "Why did last Tuesday drop 30%?" → answers with attribution

- Menu description and photo-alt rewriting for search discoverability

- Photo quality scoring with reshoot suggestions (image quality measurably drives conversion)

- Auto-drafted review responses in the owner's tone

- Demand forecast: tomorrow's expected orders by hour → prep and staffing guidance

- Anomaly alerts: "Paneer Tikka conversion fell 40% after the price change on the 12th"

### 15. Growth Programs & Marketplace

- **Onboarding checklist with a completion score** — gamified profile completeness; each step tied to a projected order lift

- Platform program enrollment: express delivery, priority listing, festival campaigns

- Working capital / merchant cash advance underwritten on your order history

- Equipment and packaging marketplace with partner pricing

- Insurance, cloud-kitchen space, staffing partner directory

- Academy: short courses on food photography, menu engineering, review management

- Referral program (refer a restaurant, earn credit)

### 16. Notification & Alert Center

- Configurable channels: in-app, WhatsApp, SMS, email, browser push

- Critical alerts: order backlog, rider unassigned >5min, rating drop, payout failure, KYC expiry

- Digest scheduling per role

---

## Why These Specific Features Drive Signups

| Owner's real fear | Feature that answers it |

|---|---|

| "Commission is a black box" | Per-order commission breakdown, dispute flow |

| "I don't know why I'm not getting orders" | Share of search, ranking impact explainer |

| "Discounts destroy my margin" | Profitability simulator, funded-by split |

| "The platform owns my customers" | Branded storefront, loyalty layer, win-back |

| "Cash flow is brutal" | Instant payout, merchant cash advance |

| "I'm flying blind vs competitors" | Anonymized peer benchmarking |

The two features I'd build first as acquisition hooks: **Lost Revenue Counter** (quantified pain, visible in 5 seconds) and **Promo Profitability Simulator** (removes the #1 objection to running promotions, which is what actually grows your GMV).

---

Want me to build the clickable prototype for this — Live Orders, Revenue Intelligence, and Promotion Studio as the three worked screens?

create this Live Orders, Revenue Intelligence, and Promotion Studio  and now core modules as a clickable web page

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0936142b-0951-4641-a929-7953adc31e1a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
