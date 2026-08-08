# RailEase — Product & Engineering Specification

**Version:** 1.0
**Date:** 2026-08-08
**Course:** BSMS4002 — Design Thinking for Data-Driven App Development, IIT Madras BS Degree
**Team:** 12 — Devansh Gupta (22f3002843), Rishav Kumar (22f3001352), Dhanashree Dhanwant (23f2003231), Riya Agarwal (22f3000653)
**Repository:** https://github.com/22f3002843/DTDDAD_RAILEASE

---

## How to read this document

This document is written to be handed to a developer (or a developer's LLM coding assistant) and acted upon directly. It is deliberately opinionated: every instruction carries the reason behind it, so that when you hit a case this document did not anticipate, you can derive the right answer from the principle rather than guessing.

| Section | What it gives you |
|---|---|
| [1. Problem Statement](#1-problem-statement) | The user problem, evidenced from research |
| [2. What We Are Building](#2-what-we-are-building) | The product definition and, importantly, what we are *not* |
| [3. Current State Audit](#3-current-state-audit) | Honest assessment of the code as it stands today |
| [4. The Gap](#4-the-gap) | Precisely where current state and intent diverge |
| [5. Design Principles](#5-design-principles) | The rules that resolve future arguments |
| [6. Information Architecture](#6-information-architecture) | Navigation, routes, auth model |
| [7. Screen Specifications](#7-screen-specifications) | Wireframes, states, and behaviour per screen |
| [8. The Confidence Score](#8-the-confidence-score) | Scoring model, formula, presentation rules |
| [9. Prediction Catalogue](#9-prediction-catalogue) | Every ML/heuristic insight, with logic and copy |
| [10. Data Model](#10-data-model) | Required schema changes with full field definitions |
| [11. Build Plan](#11-build-plan) | Ordered phases with acceptance criteria |
| [12. Visual & Copy Guidelines](#12-visual--copy-guidelines) | Tone, colour semantics, typography rules |
| [13. Open Decisions](#13-open-decisions) | What the team must decide, and the cost of each option |
| [14. Non-Goals](#14-non-goals) | Explicitly out of scope, with reasons |

---

## 1. Problem Statement

### 1.1 The stated problem

> Train travellers often rely on multiple railway applications for booking, delay updates, platform information, and journey planning, leading to uncertainty, missed connections, and poor travel decisions.

### 1.2 The sharper problem, after research

The team's Analyze-phase work (Design Thinking Canvas 2) surfaced four independently-derived root causes. They converge on a single theme:

| Source | Root cause identified |
|---|---|
| Devansh Gupta | Users repeatedly check train status because they are never certain whether the train will arrive on time |
| Devansh Gupta | Travellers cannot judge how reliable a train is *before* booking |
| Devansh Gupta / Riya Agarwal | Last-minute platform changes create confusion and missed connections |
| Riya Agarwal | Passengers risk missing interviews, sightseeing slots, and family events |
| Riya Agarwal | Passengers lack confidence in train arrival times |

**The convergent theme is not information scarcity. It is decision confidence.**

This distinction is the most important idea in this document. A traveller today can find the timetable, the live running status, and the seat availability — that data exists across IRCTC, NTES, Where Is My Train, ixigo, and ConfirmTkt. What no product gives them is an answer to:

> *"Given everything that is knowable, should I take this train — and what is likely to go wrong that I have not thought of?"*

Existing apps report **facts**. The user needs a **judgement**.

### 1.3 Why this matters commercially

The consequences of a wrong decision are asymmetric and severe, and they are concentrated in exactly the moments people care most about. From the team's persona work:

- **Arthika (student)** — misses interviews, competitions, entrance exams. A ₹200 saving on a cheaper train can cost a career opportunity.
- **Garima (working mother)** — travels with children. A delay is not an inconvenience, it is a safety and logistics crisis.
- **Amit Singh (tourist)** — a delay collapses a tightly-planned sightseeing itinerary.

The team's Solve-phase brainstorm identified the same asymmetry independently, in the winning "How Might We" question:

> *How might we give high-stakes travellers assurance they'll reach what matters on time — not just live status that other apps already provide?*

Note the second clause. The team had already, in the Solve phase, correctly identified that live status is a commodity. **Assurance is the product.**

### 1.4 The conflicts we must design around

The Analyze phase mapped four value conflicts. These are not obstacles to be removed; they are the design constraints that make the product hard, and therefore defensible. Every one of them has a resolution encoded in this specification.

```
CONFLICT                          RESOLVED BY                      SPEC SECTION
─────────────────────────────────────────────────────────────────────────────
Transparency vs. Simplicity       The 3-Layer Rule                 §5.2
  (Dhanashree)
  Show everything → overwhelming
  Show nothing → blindsided

Fastest vs. Most Reliable         Confidence Score with            §8
  (Devansh)                       user-selected priority
  Speed → higher delay risk
  Reliability → longer / costlier

Early Warning vs. Accuracy        Confidence-graded alerts         §9.4
  (Dhanashree)                    ("likely" vs "confirmed")
  Alert early → false alarms
  Alert late → too late to act

Cheapest Fare vs. Reliability     Priority selector re-weights     §7.1, §8.3
  (Dhanashree, Riya)              the ranking; never hides a
  Cheap → chronically late         cheaper option, only annotates
  Reliable → prices out students   it honestly
```

---

## 2. What We Are Building

### 2.1 The product definition

> **RailEase answers one question: "Will I actually get there — and what could go wrong that I haven't thought of?" It then hands the user to IRCTC to book.**

Every feature decision must be traceable to that sentence. If a proposed screen, field, or button does not serve it, the default answer is no.

### 2.2 What we are NOT

This list exists because the current codebase has drifted toward each of these, and drift is easier to prevent than to reverse.

| We are not | Because |
|---|---|
| A booking engine | We have no PRS/IRCTC integration and no path to one. Booking is a solved, regulated, capital-intensive problem. We redirect. |
| A live-tracking app | Where Is My Train and NTES do this well and free. Live status is an *input* to our judgement, not our output. |
| A food-delivery app | Different business, different operations, different unit economics. |
| A social network | A community feature with fewer than ~10,000 active users reads as abandonment and damages credibility. |
| A generic travel super-app | Every feature added dilutes the one thing that makes us worth opening. |

### 2.3 The business model implication

We do not monetise the transaction. We monetise **attention and trust** — the user opens RailEase to *decide*, then leaves to book. This has one hard design consequence that must not be compromised:

> **We must be willing to say a train is bad.**

IRCTC and every OTA (ixigo, MakeMyTrip, ConfirmTkt) have a structural conflict of interest: they earn on the booking, so their incentive is to present every train as viable. We do not book, therefore we can be honest, therefore we are trusted, therefore people come to us. Honesty is not a nice-to-have here — **it is the entire competitive moat.** Any change that softens a negative verdict to look more appealing destroys the product's reason to exist.

### 2.4 Success criteria

The product is working if:

1. A first-time visitor understands what the app does within 3 seconds of landing, without reading a paragraph.
2. A user can get a genuine, useful verdict on a train **without creating an account**.
3. A user learns at least one thing they did not know they needed to know (e.g. "your realistic arrival is 2 a.m., plan for a cab").
4. A user returns without being prompted, because they asked us to watch a train for them.

---

## 3. Current State Audit

Assessed against commit `aff3da2` on `main`. This section is descriptive, not critical — the existing code is competently built. The issue is direction, not quality.

### 3.1 Stack

| Concern | Implementation |
|---|---|
| Framework | Vue 3, Composition API, `<script setup>` |
| Build | Vite 5 |
| State | Pinia (`useAuthStore`, `useSearchStore`, `useJourneyStore`) |
| Routing | Vue Router 4, with a global `beforeEach` auth guard |
| Styling | Tailwind CSS 3 with custom tokens (`rail-*`, `rounded-card`, `rounded-btn`) |
| Icons | `lucide-vue-next` |
| Animation | GSAP, plus a `useScrollReveal` composable |
| Data | Entirely hardcoded mock data in `src/data/` |

The stack is appropriate and should be retained. No framework change is recommended or needed.

### 3.2 Current routes and access model

| Route | View | Auth required today |
|---|---|---|
| `/` | LandingView | No |
| `/search` | SearchTrainsView | No |
| `/dashboard` | DashboardView | **Yes** |
| `/journey-planner` | JourneyPlannerView | **Yes** |
| `/bookings` | BookingsView | **Yes** |
| `/live-status` | LiveStatusView | **Yes** |
| `/ecatering` | ECateringView | **Yes** |
| `/community` | CommunityView | **Yes** |
| `/alerts` | AlertsView | **Yes** |
| `/profile` | ProfileView | **Yes** |
| `/settings` | SettingsView | **Yes** |

Prototype credentials are `railease` / `123456`, defined in `src/data/auth.js`.

### 3.3 Current navigation

`src/components/sidebar/Sidebar.vue` renders **eleven** primary destinations: Dashboard, Search Trains, My Bookings, Journey Planner, Live Status, Alerts, eCatering, Community, Profile, Settings, Help.

### 3.4 Current data model

`src/data/trains.js` — `MOCK_TRAINS`, an array of objects shaped:

```js
{
  id, number, name, type,
  fromCode, fromName, toCode, toName,
  deptTime, arrTime, duration,
  speedCategory,        // 'Fastest' | 'Cheapest' | ...
  punctualityScore,     // number, 0-100, static
  reliabilityRating,    // 'High Reliability' | 'Moderate' | ...
  crowdLevel,           // 'Low' | 'Moderate' | 'High'
  price,
  classes: [{ code, name, price, status, statusType }],
  features: [String],
  runsOn: [String]
}
```

`src/data/stations.js` — 10 hardcoded `POPULAR_STATIONS`.

`src/data/journeys.js` — `HIGH_STAKES_TYPES` (exam, interview, medical, flight, other) and `MOCK_UPCOMING_TRIPS` containing `riskScore`, `delayProbability`, `predictedArrival`, and `predictionInsights`.

`src/stores/useSearchStore.js` — bidirectional matching against `MOCK_TRAINS`, with a generator fallback that synthesises Vande Bharat / Rajdhani entries when fewer than four direct matches exist.

### 3.5 What is already right, and must be preserved

These are genuine assets. Do not delete them during the refactor.

1. **`HIGH_STAKES_TYPES` in `journeys.js`** — exam / interview / medical / flight. This is a direct, correct encoding of the winning "How Might We" question. It becomes the priority selector (§7.1) and a scoring input (§8.3).
2. **`predictionInsights` in `journeys.js`** — an array of plain-English reasons attached to a prediction. This is already, structurally, Layer 2 of the 3-Layer Rule. It is the right pattern; it simply needs to be applied to trains in search results, not only to a mock upcoming trip.
3. **The third insight string** — *"Predictions provide estimated guidance; actual arrival depends on real-time signal dispatch."* This is an honest uncertainty disclosure. It shows the right instinct and should become a standard component (§12.4).
4. **The `speedCategory` / `reliabilityRating` distinction** — the data already acknowledges that fastest ≠ most reliable, which is Devansh's core conflict.
5. **The bidirectional search with a generator fallback** — pragmatic and keeps the demo from dead-ending. Retain.
6. **The design system** — Tailwind tokens, card radii, and the Lucide icon set are consistent and clean.

---

## 4. The Gap

Seven specific divergences between the current build and the stated intent. Each has a reason and a required change. These map directly onto the build plan in §11.

### Gap 1 — The app visually imitates IRCTC

**Evidence:** `src/views/SearchTrainsView.vue` contains a navy (`bg-[#1E3A8A]`) search bar with an inline comment reading `TOP NAVY MODIFY SEARCH BAR (MATCHING IRCTC SCREENSHOT)`. It includes a Quota dropdown (`GENERAL`), and checkboxes for *Person With Disability Concession* and *Railway Pass Concession*.

**Why this is a problem:** Quota and concession affect **fare and eligibility at the point of booking**. We do not book. These controls cannot change any output we produce, so they are decorative. Worse, by adopting IRCTC's visual language we invite the user to evaluate us as an IRCTC substitute — a comparison we lose, because we cannot issue a ticket. A product whose entire value is "we are the honest alternative" must not dress as the incumbent.

**Required change:** Remove the IRCTC-styled bar and all booking-only controls. Replace with the search card specified in §7.1.

---

### Gap 2 — Authentication blocks the differentiating features

**Evidence:** `src/router/index.js` sets `requiresAuth: true` on `/dashboard`, `/journey-planner`, `/live-status`, `/alerts`, `/ecatering`, `/community`, `/bookings`.

**Why this is a problem:** The stated goal is *"we want to build an app where people come to us."* Acquisition requires that a stranger experiences the value before being asked for anything. Every feature that makes RailEase different from a timetable is currently behind a login wall, so a first-time visitor sees only the commodity part. Nobody creates an account for a benefit they have not yet felt.

**Required change:** Authentication is required at **exactly one moment** — when the user asks to be *notified* (i.e. enabling push/email on a watched train). Everything else is public. See §6.3.

---

### Gap 3 — Eleven navigation destinations

**Evidence:** `navItems` in `Sidebar.vue`.

**Why this is a problem:** Navigation is the app's answer to "what is this for." Eleven top-level answers means no answer. This is the direct cause of the "overwhelming" concern. It also signals a lack of conviction: a product confident in its value shows few doors.

**Required change:** Four destinations. See §6.1.

---

### Gap 4 — Metrics are presented as bare numbers with no reasoning

**Evidence:** `punctualityScore: 88`, `reliabilityRating: 'High Reliability'`, `crowdLevel: 'High'` — static fields rendered as labels.

**Why this is a problem:** This is precisely what competitors already do, so it creates no reason to choose us. More fundamentally, an unexplained number is not trustworthy: the user has no way to calibrate whether 88 is good, what it is 88 *of*, or whether to believe it. **A number without a reason is decoration; a number with a reason is intelligence.** The gap between those two is one line of text, and it is the whole product.

**Required change:** Every score is rendered with its one-line justification adjacent to it, always, with deeper reasoning one tap away. See §5.2 and §8.4.

---

### Gap 5 — No predictive layer exists

**Evidence:** All "predictions" are hardcoded strings in `journeys.js`. `punctualityScore` is a fixed integer per train, not derived.

**Why this is a problem:** The stated vision is *"by using ML they can see crazy predictions of all important things that they might not know they need until something bad happens."* No such computation exists. The insight strings are convincing, but they are copy, not output.

**Required change:** Introduce a derivation layer (`src/services/`) that computes scores and risks from a 30-day history array, even while that history is synthetic. See §8, §9, §10.3.

---

### Gap 6 — Results are not ranked by the thing we are selling

**Evidence:** `filteredTrains` in `useSearchStore.js` returns matches in source order, with filters applied.

**Why this is a problem:** Ranking *is* the opinion. Every competitor sorts by departure time or price. Sorting by confidence is the single most visible expression of our positioning — it is our thesis made physical, legible in one screenshot, and it costs very little to implement.

**Required change:** Default sort is descending confidence, adjusted by the user's stated priority. See §7.2.

---

### Gap 7 — Three features dilute the core

**Evidence:** `ECateringView.vue`, `CommunityView.vue`, `BookingsView.vue`.

**Why this is a problem:**
- **eCatering** — a food-ordering business. Rishav's conflict-tree analysis of it is good research work, but shipping it means competing with Zomato and IRCTC eCatering on operations we do not have.
- **Community** — social features require critical mass. An empty feed actively damages credibility.
- **My Bookings** — we do not have the user's bookings, because we do not book. The screen is structurally unable to be true.

**Required change:** eCatering and Community are parked behind an honest "Planned" state that preserves the team's research. `My Bookings` is *transformed* into **Watching** — see §7.4 — which is the version of this idea that is actually true for a non-booking product, and which becomes the retention engine.

---

## 5. Design Principles

These five principles resolve disagreements. When a design question arises that this document does not answer, derive the answer from these.

### 5.1 Principle 1 — Judgement, not data

We do not show the user a table and ask them to conclude. We conclude, then show our work.

**Test:** Every primary screen must contain at least one sentence a human could have said to a friend. If a screen is entirely numbers and labels, it fails.

### 5.2 Principle 2 — The 3-Layer Rule

This is the direct resolution of Dhanashree's *Transparency vs. Simplicity* conflict. Her Analyze work established that showing everything overwhelms travellers, while showing only price and time leaves them blindsided by hidden delays. Both branches are correct, which means the resolution cannot be a compromise in the middle — it must be **layering, where the user controls the depth.**

```
LAYER 1 — THE VERDICT
  One glanceable conclusion. Always visible. Zero jargon.
  Example:  ┌────┐
            │ 91 │  Very likely on time
            └────┘
  Constraint: a user who reads ONLY this layer must get full,
  actionable value. Layer 1 is not a teaser for Layer 2.

        ▼  user taps "Why this score?"

LAYER 2 — THE REASONS
  3 to 5 bullets in plain English. Explains the verdict.
  Example: "Arrived within 30 minutes on 27 of the last 30 days"
           "Delays here are usually caused by congestion at Pune"
  Constraint: no term a 60-year-old passenger would not use.
  No percentages without a denominator. No unexplained units.

        ▼  user taps "See full record"

LAYER 3 — THE EVIDENCE
  Charts, 30-day distributions, station-by-station history.
  Constraint: collapsed by default. Always optional. A user must
  never be required to enter Layer 3 to complete any task.
```

**The current app inverts this:** it places Layer-3-grade data (a raw score of 88) at Layer 1, and has no Layer 2 at all. Fixing this ordering is the single highest-leverage change in this specification.

### 5.3 Principle 3 — Relevance filtering, not feature reduction

The way to avoid overwhelming a user is **not** to build fewer insights. It is to show only the insights that apply to *this* train on *this* date for *this* user, ordered by how much they should worry.

A risk card that does not apply is not greyed out, not collapsed, not shown as "no risk detected." **It is absent.** Absence is information: if a user sees two cards, there are two things to worry about.

This lets us build the full prediction catalogue in §9 without any screen ever becoming dense.

### 5.4 Principle 4 — Honest by construction

- Never state a prediction without its basis (`"on 27 of the last 30 days"`).
- Never imply precision we do not have. Prefer `"usually arrives around 08:20"` to `"arrives at 08:17"`.
- Always show sample size when it is small. `"Based on only 6 days of data — treat with caution."`
- Never soften a bad verdict for commercial appeal. We have no commercial reason to. This is the moat (§2.3).

### 5.5 Principle 5 — Earn the login

Ask for identity only in exchange for something the user has just asked us to do for them (notify them). Never as a gate to viewing.

---

## 6. Information Architecture

### 6.1 Navigation: 11 → 4

```
   BEFORE                              AFTER
   ─────────────────────────           ────────────────────────────────
   Dashboard                           🔍  PLAN
   Search Trains        ┐                  Search + compare + decide
   My Bookings          │
   Journey Planner      │              👁  WATCHING
   Live Status          │  ────────►       Trains and trips you follow
   Alerts               │
   eCatering            │              📡  LIVE
   Community            │                  Where is my train right now
   Profile              │
   Settings             │              ⚙️  ME
   Help                 ┘                  Profile, alerts, settings
```

**Layout:** bottom tab bar on mobile (≤768px), left rail on desktop. **Four items. This number does not increase.** Any future feature must either fit inside one of the four or replace one.

**Rationale for each:**
- **Plan** — the acquisition surface. Where a stranger arrives and gets value.
- **Watching** — the retention surface. The reason to return.
- **Live** — the utility surface. The reason to open during a journey.
- **Me** — settings. Deliberately last and deliberately dull.

### 6.2 Route map

| Route | Purpose | Auth | Replaces |
|---|---|---|---|
| `/` | Plan — search entry, plus watched-trains strip | No | LandingView + DashboardView |
| `/results` | Ranked train list | No | SearchTrainsView |
| `/train/:number` | Train detail + risk cards | No | *new* |
| `/watching` | Watched trains and trips | No (login only for push) | BookingsView |
| `/live` | Live running status | No | LiveStatusView |
| `/live/:number` | Single train live map/timeline | No | LiveStatusView |
| `/me` | Profile, alert preferences, settings | Partial | ProfileView + SettingsView + AlertsView |
| `/planned` | Honest "coming later" page | No | ECateringView + CommunityView |

Preserve redirects from old paths so no existing link breaks:
`/search → /results`, `/dashboard → /`, `/bookings → /watching`, `/live-status → /live`, `/alerts → /me#alerts`, `/profile → /me`, `/settings → /me`, `/ecatering → /planned`, `/community → /planned`, `/journey-planner → /` (its priority-selection function is absorbed into the search card, §7.1).

### 6.3 Authentication model

```
PUBLIC (no account, full value)          REQUIRES ACCOUNT
─────────────────────────────────        ────────────────────────────
Search trains                            Push / email notifications
See confidence scores                    Syncing watchlist across devices
See all reasons (Layer 2)
See all evidence (Layer 3)
See every risk card
Watch a train (stored locally)
Live running status
```

**Implementation note:** "Watch a train" writes to `localStorage` for anonymous users. When the user later creates an account, migrate the local watchlist into it. Do not lose their list — losing it punishes the exact behaviour we are trying to encourage.

**Change to `router/index.js`:** remove `meta.requiresAuth` from all routes. Replace with a component-level check on the single notification-enable action.

---

## 7. Screen Specifications

### 7.1 Plan (`/`)

**Job:** make a stranger understand the product in 3 seconds and start a search in 2 taps.

```
┌──────────────────────────────────────────────────┐
│  RailEase                              [ Me ]    │
│                                                  │
│   Will your train actually get you there?        │
│   We check 30 days of real performance so you    │
│   know before you book.                          │
│                                                  │
│   ┌────────────────────────────────────────┐     │
│   │  From    Mumbai Central        (MMCT)  │     │
│   │               ⇅                        │     │
│   │  To      KSR Bengaluru          (SBC)  │     │
│   │  When    Fri, 20 Nov                   │     │
│   │                                        │     │
│   │  What matters most?                    │     │
│   │  ( ● Arrive on time )                  │     │
│   │  ( ○ Lowest price   )                  │     │
│   │  ( ○ Comfort        )                  │     │
│   │                                        │     │
│   │        [   Check reliability   ]       │     │
│   └────────────────────────────────────────┘     │
│                                                  │
│  ── You're watching ─────────────────────────    │
│  ┌────────────────────────────────────────────┐  │
│  │ 12951 Rajdhani · Tomorrow 17:00 · 🟢 On time│ │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  We don't sell tickets. We tell you whether      │
│  your train will actually get you there.         │
└──────────────────────────────────────────────────┘
```

**Specification notes:**

1. **The headline is a question, not a slogan.** *"Will your train actually get you there?"* states the user's own anxiety back to them. Slogans like "Plan better, travel smarter" describe us; questions describe them.

2. **The priority selector is the entire personalisation engine.** Three options, single-select, default *Arrive on time*. It re-weights the confidence score (§8.3). This achieves persona-appropriate results — Arthika picks *Lowest price*, Garima picks *Arrive on time*, Amit picks *Comfort* — **without a signup, a questionnaire, or a profile.** It is one tap and it is optional.

3. **`HIGH_STAKES_TYPES` becomes a secondary, optional refinement** on the results page, not a blocking step here. Existing values (exam, interview, medical, flight) are retained and feed the scoring model. Do not delete them; they are good research made concrete.

4. **No quota, no concession, no class selector on this screen.** Class filtering belongs behind a "More filters" control on `/results`. Quota and concession are removed entirely (Gap 1).

5. **The closing line is a positioning statement, not a disclaimer.** *"We don't sell tickets"* must be stated plainly and without apology. It is the reason to trust us, so it is presented as a feature.

6. **The watching strip is absent, not empty, for new users.** Do not render a "no watched trains" placeholder on a first visit — it makes the app look unused. Render it only when the list is non-empty.

---

### 7.2 Results (`/results`)

**Job:** rank by confidence and make the top recommendation obviously correct.

```
┌──────────────────────────────────────────────────────┐
│  ← MMCT → SBC · Fri 20 Nov                           │
│     Priority: Arrive on time  [change]  [filters]    │
│                                                      │
│  ★ BEST FOR YOU                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ 12627  KARNATAKA EXPRESS          Superfast    │  │
│  │ 20:15 → 18:40 (+1)      22h 25m      ₹1,595    │  │
│  │                                                │  │
│  │   ┌──────┐                                     │  │
│  │   │  91  │   Very likely on time               │  │
│  │   └──────┘   Arrived within 30 min on 27 of    │  │
│  │    /100      the last 30 days                  │  │
│  │                                                │  │
│  │  ⚠️ WL 18 in 3A — 82% chance it confirms       │  │
│  │                                                │  │
│  │  [ Why this score? ▾ ]     [ Book on IRCTC ↗ ] │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ 11301  UDYAN EXPRESS               Superfast   │  │
│  │ 08:10 → 06:00 (+1)      21h 50m      ₹1,450    │  │
│  │   ┌──────┐                                     │  │
│  │   │  64  │   Often delayed                     │  │
│  │   └──────┘   Late by 2 hrs or more on 9 of     │  │
│  │              the last 30 days                  │  │
│  │  🔴 Scheduled 06:00 — realistically about 08:20│  │
│  │  [ Why this score? ▾ ]     [ Book on IRCTC ↗ ] │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Specification notes:**

1. **Default sort: confidence descending.** Not departure time. Not price. This is Gap 6 and it is the most visible single expression of our positioning.

2. **Exactly one "★ Best for you" card.** One recommendation is a judgement (Principle 1); three recommendations is a shrug. Its selection logic is in §8.5.

3. **Every card carries its Layer-2 seed on the face** — the single line under the score. This is non-negotiable: it is the difference between decoration and intelligence (Gap 4).

4. **The second card demonstrates honesty.** It is cheaper and faster on paper, and we say it is unreliable anyway. Include a case like this in any demo — it is the clearest possible articulation of §2.3.

5. **`Book on IRCTC ↗` is a clear external handoff.** Use an external-link icon. Never open in-app in a way that implies we are transacting. Deep-link to IRCTC where possible.

6. **`Why this score?` expands inline.** It must not navigate. Layer 2 is a disclosure, not a destination; navigating breaks the sense that the user is in control of depth.

7. **Price is shown but never leads.** It is present because Arthika needs it. It is subordinate because our thesis is that the cheapest option is often the expensive one.

---

### 7.3 Train detail (`/train/:number`)

**Job:** deliver the predictions the user did not know to ask for.

```
┌────────────────────────────────────────────────────┐
│  ←  12627 KARNATAKA EXPRESS                        │
│     MMCT 20:15  →  SBC 18:40 (+1)                  │
│                                                    │
│      ┌────────────┐                                │
│      │     91     │   Very likely on time          │
│      └────────────┘   Based on 30 days of running  │
│                       history on this route        │
│                                                    │
│  ══ What could go wrong ═══════════════════════    │
│                                                    │
│  🔴 HIGH                                           │
│  ┌──────────────────────────────────────────────┐  │
│  │  You'll likely arrive after midnight          │ │
│  │                                               │ │
│  │  Scheduled 23:40. On 11 of the last 30 days   │ │
│  │  it arrived after 01:30. Cabs are scarce and  │ │
│  │  cost 2–3× at that hour.                      │ │
│  │                                               │ │
│  │           [ Alert me if it runs late ]        │ │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  🟠 MEDIUM                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │  Platform changes are common at Pune          │ │
│  │  Changed from the announced platform on 8 of  │ │
│  │  the last 30 days, usually less than 20 min   │ │
│  │  before arrival.                              │ │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  🟢 GOOD TO KNOW                                   │
│  ┌──────────────────────────────────────────────┐  │
│  │  Your waitlist will almost certainly confirm  │ │
│  │  WL 18 in 3A. Comparable waitlists on this    │ │
│  │  train cleared 82% of the time.               │ │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  [ See the full 30-day record  ▾ ]      ← Layer 3  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │   👁 Watch this train    │   Book on IRCTC ↗  │ │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Specification notes:**

1. **"What could go wrong" is the user-facing name of the ML layer.** Do not label it "Predictive Analytics," "AI Insights," or "Risk Intelligence." The plain phrase is understood instantly by a non-technical passenger and sets the correct emotional frame: we are the friend who warns you.

2. **Cards are ordered by severity: HIGH → MEDIUM → GOOD TO KNOW.** Never by category, never by confidence, never alphabetically. The user's scarcest resource is attention, so the thing most likely to hurt them is first.

3. **Non-applicable cards are absent** (Principle 3). If there is no connection, there is no connection card. This is what allows the full §9 catalogue to exist without density.

4. **Every card follows the same three-part structure:** a plain-English headline (what), the evidence (why we say so, with a denominator), and optionally one action. Consistent structure is what makes a stack of cards scannable rather than exhausting.

5. **Each card may carry at most one action button.** Two actions makes it a form.

6. **Layer 3 is one collapsed control at the bottom.** Charts live behind it.

7. **The bottom bar has two actions and only two:** *Watch* (our retention goal) and *Book on IRCTC* (their goal). Watch is placed first because it is the one we uniquely offer.

---

### 7.4 Watching (`/watching`)

**Job:** be the reason the user comes back. This is the most commercially important screen in the app.

```
┌────────────────────────────────────────────────┐
│  Watching                                      │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  12951 MUMBAI RAJDHANI                   │  │
│  │  Tomorrow, 17:00                         │  │
│  │  🟢 Expected on time                     │  │
│  │  We'll tell you if this changes.         │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  12627 KARNATAKA EXPRESS                 │  │
│  │  Running now · 🟠 45 minutes late        │  │
│  │  New arrival estimate: 19:25             │  │
│  │                                          │  │
│  │  ⚠️ Your 40-minute connection at Itarsi  │  │
│  │     is now at risk.                      │  │
│  │            [ See other options ]         │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  🔔 Get alerts on your phone   [ Set up ]      │
└────────────────────────────────────────────────┘
```

**Specification notes:**

1. **This is the retention engine.** IRCTC has a structural blind spot here: it only engages a user after payment. We can care about a traveller *before* they commit, and that asymmetry is defensible.

2. **The connection-at-risk card is the single most valuable moment in the product.** It is proactive, it is unavailable anywhere else, and it is the thing a user tells a friend about. Prioritise it (§9.3).

3. **Watching requires no login and no PNR.** One tap from a train card. Store locally for anonymous users. **The login prompt appears only here**, and only as an upgrade offer ("get alerts on your phone"), never as a gate.

4. **`MOCK_UPCOMING_TRIPS` from `journeys.js` is the seed data** for this screen — its `timeline`, `predictedArrival`, and `predictionInsights` structure is already correct and should be reused rather than rewritten.

---

### 7.5 Live (`/live`, `/live/:number`)

**Job:** utility during the journey. Deliberately plain.

Keep this close to the existing `LiveStatusView`. Two changes:

1. Remove the auth requirement.
2. Add one RailEase-specific line that a pure tracker cannot produce — the honest projection: *"Running 45 min late. At this rate you'll reach SBC around 19:25, not 18:40."* Trackers report position; we report consequence.

Do not over-invest here. This is table stakes, not differentiation.

---

### 7.6 Planned (`/planned`)

**Job:** preserve the team's research without shipping unfinished products.

A simple honest page listing eCatering and Community as planned, with a one-line summary of the insight behind each (drawn from Rishav's eCatering conflict-tree work). This keeps the Analyze-phase research visible for course assessment while keeping the shipped product focused.

---

## 8. The Confidence Score

### 8.1 What it is

A single integer 0–100 expressing: **"how likely is this train to get you there acceptably?"**

It replaces the current static `punctualityScore`. Unlike that field, it is **computed**, **explained**, and **personalised to the user's stated priority**.

### 8.2 Base computation

Computed from a 30-day performance history (see §10.3 for the schema).

```
BASE SCORE (0-100), from 30 days of history:

  onTimeRate        = days arriving within 15 min of schedule / total days
  minorDelayRate    = days arriving 15-60 min late           / total days
  majorDelayRate    = days arriving > 60 min late            / total days
  severeDelayRate   = days arriving > 180 min late           / total days
  consistency       = 1 - (stdDev(delayMinutes) / 120), clamped to [0, 1]

  base = 100 × ( 0.45 × onTimeRate
               + 0.20 × (1 - majorDelayRate)
               + 0.20 × consistency
               + 0.15 × (1 - severeDelayRate) )
```

**Rationale for these weights:**

- `onTimeRate` dominates (0.45) because it is what the user thinks they are asking about.
- `consistency` is weighted as heavily as major delays (0.20) because **a train that is reliably 40 minutes late is more useful than one that is randomly between 0 and 3 hours late.** The user can plan around a predictable offset; they cannot plan around variance. This is a genuine insight that competitors miss, and it is where the score earns its keep.
- `severeDelayRate` is separated (0.15) because a 3-hour delay is not merely "more" than a 1-hour delay — it is a categorically different event that destroys the trip.

### 8.3 Priority adjustment

The score shown is adjusted by the user's selection from §7.1.

| Priority | Adjustment | Reason |
|---|---|---|
| **Arrive on time** | `base` unmodified | The base model already optimises for this |
| **Lowest price** | `base × 0.7 + priceRank × 30` | Still surfaces reliability, but lets cheap-and-decent beat expensive-and-perfect. Serves Arthika. |
| **Comfort** | `base × 0.7 + comfortScore × 30` | `comfortScore` from `crowdLevel`, train type, and class availability. Serves Garima and Amit. |

If the user selected a high-stakes journey type (exam / interview / medical / flight from `HIGH_STAKES_TYPES`), apply an additional penalty to variance:

```
if (highStakes) {
  score = score - (severeDelayRate × 40)
}
```

**Reason:** for a high-stakes trip the cost function is asymmetric — arriving early has near-zero benefit, arriving late has catastrophic cost. The score must reflect that asymmetry rather than treating delay minutes as linear. This is the computational form of the team's winning "How Might We" question.

### 8.4 Presentation rules (mandatory)

| Rule | Reason |
|---|---|
| The score is **never** displayed without an adjacent verdict phrase | A bare number cannot be calibrated by the user |
| The score is **never** displayed without a one-line reason with a denominator | Gap 4 |
| Never show decimals | False precision (Principle 4) |
| If history has fewer than 10 days, show the score greyed with "Limited data" | Honesty about sample size |

**Verdict bands:**

| Score | Verdict phrase | Colour |
|---|---|---|
| 85–100 | Very likely on time | Green |
| 70–84 | Usually on time | Green |
| 55–69 | Sometimes delayed | Amber |
| 40–54 | Often delayed | Red |
| 0–39 | Frequently very late | Red |

Use these exact phrases. They are deliberately conversational, in the register a friend would use.

### 8.5 "Best for you" selection

The single starred recommendation is **not** simply the highest score. It is the highest score among trains that are *viable*:

```
candidates = trains
  .filter(t => t.hasAvailableOrLikelyConfirmingSeat)
  .filter(t => t.departureIsAtReasonableHour || userSaidTheyDontMind)
  .filter(t => t.price <= cheapestPrice × 2.5)

best = candidates.maxBy(adjustedScore)
```

**Reason:** a perfect train the user cannot board, cannot afford, or would have to wake at 03:00 for is not a recommendation. Viability filters convert a ranking into advice.

---

## 9. Prediction Catalogue

Ordered by **value delivered per unit of implementation effort**. Build in this order.

### 9.1 Waitlist confirmation probability — *build first*

**Insight:** "WL 18 in 3A — 82% chance it confirms."

**Why first:** This is the single most anxiety-inducing unknown in Indian rail travel, and it is poorly served. It requires no live data — only historical waitlist-clearance patterns per train/class/quota/day-of-week.

**Logic:** For a given train, class, and days-to-departure, compute the historical proportion of comparable waitlist positions that cleared by chart preparation. Bucket by position ranges (1–10, 11–25, 26–50, 50+).

**Copy:** `"WL 18 in 3A — 82% chance it confirms. Comparable waitlists on this train cleared 82% of the time over the last 30 days."`
**Severity:** GOOD TO KNOW if >70%, MEDIUM if 30–70%, HIGH if <30%.

---

### 9.2 Realistic arrival time — *build second*

**Insight:** "Scheduled 06:00 — realistically about 08:20."

**Why:** It reframes the timetable as aspirational, which every Indian traveller already privately believes. Instant credibility. Trivial to compute.

**Logic:** `realisticArrival = scheduledArrival + median(delayMinutes over 30 days)`. Use the **median**, not the mean — a single 6-hour outlier must not distort the everyday expectation.

**Copy:** `"Scheduled 06:00. Realistically arrives around 08:20 — it was more than 2 hours late on 9 of the last 30 days."`
**Presentation:** show alongside the scheduled time everywhere the scheduled time appears.

---

### 9.3 Connection risk — *build third, highest strategic value*

**Insight:** "1 in 3 chance you miss your Itarsi connection."

**Why:** This is Rishav's *Smart Multi-Leg Bundling* conflict made real — his own analysis flagged "massive stress regarding cascading train delays and tight platform-switching windows." No mainstream app computes it. The consequence is severe and the moment of delivery (mid-journey, on the Watching screen) is the app's emotional peak.

**Logic:**
```
buffer            = scheduledArrival(leg1) → scheduledDeparture(leg2), in minutes
missProbability   = P(delayMinutes(leg1) > buffer), from the 30-day distribution
```
Show whenever `missProbability > 0.15`.

**Copy:** `"Your 40-minute connection at Itarsi is tight. On 10 of the last 30 days this train was more than 40 minutes late — about a 1 in 3 chance you'd miss it."`
**Action:** `[ See other options ]` — surfaces later connecting trains.
**Severity:** HIGH if >40%, MEDIUM if 15–40%.

---

### 9.4 Late-night arrival risk — *build fourth*

**Insight:** "You'll likely arrive at 01:30. Cabs are scarce at that hour."

**Why:** This is the clearest example of the stated vision — *"things they might not know they need until something bad happens."* Nobody considers it until they are stranded at 2 a.m. It is also trivially cheap to compute.

**Logic:** If `realisticArrival` (§9.2) falls between 23:00 and 05:00 **and** the scheduled arrival does not, raise the card. The delta is the point: the timetable promised a civilised hour and reality will not deliver it.

**Copy:** `"You'll likely arrive after midnight. Scheduled 23:40, but on 11 of the last 30 days it arrived after 01:30. Cabs are scarce and cost 2–3× at that hour."`
**Severity:** HIGH.

This card also demonstrates the resolution of Dhanashree's *Early Warning vs. Accuracy* conflict: we warn early (at search time, before booking) but we grade our confidence honestly ("likely", with the denominator shown), so an early warning never masquerades as a certainty.

---

### 9.5 Platform change likelihood

**Insight:** "Platform changes are common at Pune."

Directly from the team's root-cause research (Devansh 🟢, Riya 🟢). Requires station-level historical platform data.

**Copy:** `"Platform changes are common at Pune — changed from the announced platform on 8 of the last 30 days, usually less than 20 minutes before arrival."`
**Severity:** MEDIUM.

---

### 9.6 Seasonal / event delay spike

**Insight:** "Delays on this route roughly double in the week before Diwali."

**Logic:** Compare delay distribution in the target date window against the annual baseline for that route. Requires a full year of history.
**Severity:** MEDIUM.

---

### 9.7 Boarding crowd forecast

**Insight:** "Coach S4 fills up heaviest at Pune."

Serves Garima (family safety) and solo female travellers — Rishav's *Algorithmic Social Comfort Seating* research. Requires occupancy data that may not be publicly available; treat as stretch.
**Severity:** GOOD TO KNOW.

---

### 9.8 Route-segment risk attribution

**Insight:** "Delays on this train almost always accumulate between Wadi and Guntakal."

The most sophisticated insight and the best Layer 3 material. Requires station-level timestamps across the full route.
**Severity:** GOOD TO KNOW (Layer 3 only).

---

## 10. Data Model

### 10.1 Principle

**All prediction logic must read from an interface, never from hardcoded literals.** The current mock data is fine as a source, but the code that computes scores must not know it is mock. This makes the eventual swap to a live data source a change in one adapter file rather than a rewrite.

```
src/services/          ← NEW: all derivation lives here, pure functions
  scoring.js           ← §8: computeConfidence(train, history, priority)
  predictions.js       ← §9: generateRiskCards(train, history, context)
  formatting.js        ← verdict phrases, time formatting, denominators

src/data/
  adapters/
    mockAdapter.js     ← today: reads src/data/*.js
    apiAdapter.js      ← later: reads a real API
  index.js             ← exports one interface; swap the adapter here
```

Every function in `src/services/` must be **pure** — `(input) => output`, no store access, no fetch. This makes them independently runnable and testable, and it means the scoring logic can be demonstrated in isolation.

### 10.2 Extension to the train object

Add to each entry in `MOCK_TRAINS`. **Do not remove existing fields** — other views depend on them.

```js
{
  // ... all existing fields retained ...

  history: [                      // 30 entries, most recent last. See §10.3
    { date: '2026-07-10', delayMinutes: 12, platformChanged: false, cancelled: false },
    // ...
  ],

  route: [                        // ordered stops, needed for §9.3, §9.5, §9.8
    {
      code: 'MMCT', name: 'Mumbai Central',
      schedArr: null, schedDep: '20:15',
      dayOffset: 0,
      platformChangeRate: 0.06    // 0-1, share of last 30 days
    }
  ],

  waitlistHistory: {              // needed for §9.1
    '3A': { cleared: 24, total: 30, avgPositionCleared: 31 },
    'SL': { cleared: 19, total: 30, avgPositionCleared: 48 }
  }
}
```

### 10.3 The history array — the core new structure

```js
/**
 * One day of observed performance for a train.
 *
 * date            ISO date string 'YYYY-MM-DD' — the day of scheduled departure
 * delayMinutes    Integer. Arrival delay at destination in minutes.
 *                 Negative = early. 0 = exactly on time.
 * platformChanged Boolean. True if the boarding platform differed from
 *                 the announced platform at the origin station.
 * cancelled       Boolean. True if the service did not run.
 *                 Cancelled days are EXCLUDED from delay statistics
 *                 but counted separately as a cancellation rate.
 */
```

**Generating realistic synthetic history (required while real data is unavailable):**

Do not generate delays from a uniform random distribution. Real train delays are **right-skewed** — most days are near-punctual, with a long tail of severe delays. A uniform distribution produces a score model that behaves nothing like reality and will mislead the team about whether the scoring works.

Use a log-normal or gamma distribution per train, parameterised so that the resulting `onTimeRate` approximates the train's existing hand-authored `punctualityScore`. This preserves the team's curated intent while producing statistically realistic inputs.

```js
/**
 * Generate 30 days of plausible history for a train.
 *
 * Algorithm in plain English:
 *   1. Take the train's authored punctualityScore as the target on-time rate.
 *   2. Choose log-normal parameters whose cumulative probability below
 *      15 minutes equals that target rate.
 *   3. Draw 30 samples; round to integer minutes.
 *   4. With ~3% probability per day, mark the day cancelled.
 *   5. With a probability derived from the train type, mark platformChanged.
 *
 * Input:  train object (must contain punctualityScore, type)
 * Output: array of 30 history entries as documented above
 */
```

### 10.4 The risk card object

Output of `generateRiskCards()`. Every card in §9 conforms to this shape, which is what makes the card stack in §7.3 uniform and easy to render.

```js
{
  id: 'late_night_arrival',
  severity: 'high',             // 'high' | 'medium' | 'info'
  headline: "You'll likely arrive after midnight",
  evidence: "Scheduled 23:40. On 11 of the last 30 days it arrived after 01:30. Cabs are scarce and cost 2-3x at that hour.",
  action: {                     // optional; at most one
    label: 'Alert me if it runs late',
    type: 'watch'
  },
  confidence: 'likely',         // 'confirmed' | 'likely' | 'possible'
  sampleSize: 30
}
```

`confidence` and `sampleSize` exist to satisfy Principle 4 and to resolve Dhanashree's *Early Warning vs. Accuracy* conflict: the UI can visually distinguish a confirmed fact from a probabilistic warning, so early alerts never overstate themselves.

---

## 11. Build Plan

Four phases. Each has acceptance criteria that can be checked without ambiguity.

### Phase 1 — Subtract and refocus

Highest value per hour of work, and it is mostly deletion. Do this first: the app becomes recognisably itself before any new logic is written.

| # | Task | File(s) |
|---|---|---|
| 1.1 | Remove all `meta.requiresAuth`; add redirects from old routes | `src/router/index.js` |
| 1.2 | Delete the IRCTC-styled navy bar; remove quota and concession controls | `src/views/SearchTrainsView.vue` |
| 1.3 | Reduce navigation to 4 items; bottom tabs on mobile | `src/components/sidebar/Sidebar.vue`, `src/layouts/AppLayout.vue` |
| 1.4 | Rename `/bookings` → `/watching`; reframe copy around watching, not booking | `src/views/BookingsView.vue` |
| 1.5 | Move eCatering and Community to `/planned` | new `PlannedView.vue` |
| 1.6 | Rewrite the landing headline and add the "we don't sell tickets" line | `src/views/LandingView.vue` |
| 1.7 | Add the priority selector to the search card | `LandingView.vue`, `useSearchStore.js` |

**Acceptance:** A logged-out visitor can reach every screen. Navigation shows four items. No screen contains a quota or concession control. The landing page states, in plain language, that we do not sell tickets.

---

### Phase 2 — The core loop

| # | Task | File(s) |
|---|---|---|
| 2.1 | Add the `history` array to every train (synthetic, per §10.3) | `src/data/trains.js`, new generator script |
| 2.2 | Implement `computeConfidence()` per §8, as a pure function | new `src/services/scoring.js` |
| 2.3 | Render score + verdict + one-line reason on every train card | `SearchTrainsView.vue` |
| 2.4 | Sort results by adjusted confidence; add the "★ Best for you" card | `useSearchStore.js` |
| 2.5 | Build the inline "Why this score?" expander (Layer 2, 3–5 bullets) | new `ScoreExplainer.vue` |
| 2.6 | Build the train detail route `/train/:number` | new `TrainDetailView.vue` |

**Acceptance:** Every train card shows a computed score with a one-line reason containing a denominator. Results are sorted by confidence, not time. "Why this score?" expands inline without navigating. Changing the priority selector visibly re-orders results.

---

### Phase 3 — Predictions and retention

| # | Task | File(s) |
|---|---|---|
| 3.1 | Implement `generateRiskCards()` with §9.1–9.4 | new `src/services/predictions.js` |
| 3.2 | Build the "What could go wrong" card stack, severity-ordered | new `RiskCard.vue`, `TrainDetailView.vue` |
| 3.3 | "Watch this train" — one tap, `localStorage`, no login | new `src/stores/useWatchStore.js` |
| 3.4 | Watching screen with live status and connection-risk card | `WatchingView.vue` |
| 3.5 | Login prompt on notification enable **only** | `useAuthStore.js` |

**Acceptance:** A train detail page shows only the risk cards that apply, ordered HIGH → MEDIUM → GOOD TO KNOW. A logged-out user can watch a train and see it on `/watching` after a page reload. The login modal appears only when enabling notifications.

---

### Phase 4 — Depth

| # | Task |
|---|---|
| 4.1 | Layer 3: 30-day delay distribution chart, station-wise breakdown |
| 4.2 | Predictions §9.5–9.8 |
| 4.3 | Real data adapter (§10.1), if a data source is secured |
| 4.4 | Alert delivery (push / email) |

---

## 12. Visual & Copy Guidelines

### 12.1 Tone

Write as a knowledgeable friend, not as a dashboard.

| Do not write | Write |
|---|---|
| "Punctuality Index: 88" | "Usually on time — arrived within 30 min on 26 of the last 30 days" |
| "Predictive Delay Analytics" | "What could go wrong" |
| "Reliability Score: HIGH" | "Very likely on time" |
| "Corridor health telemetry ingested" | "We looked at how this train actually ran over the last 30 days" |
| "Optimise your journey" | "Will your train actually get you there?" |

The existing README uses phrases like *"aggregating 30-day historical train telemetry, signal box logs, and corridor health data."* That is accurate and impressive to an assessor, but it is not how a passenger thinks. Keep that register for documentation; never use it in the interface.

### 12.2 Colour semantics

Colour carries meaning and must be used only for meaning.

| Colour | Meaning | Used for |
|---|---|---|
| Green | Reassurance | Scores 70+, on-time status, GOOD TO KNOW cards |
| Amber | Caution, plan around it | Scores 55–69, MEDIUM cards, minor delays |
| Red | Act on this | Scores below 55, HIGH cards, major delays |
| Neutral slate | Everything else | All structural UI |

**Never use red or amber decoratively.** If red appears, something is wrong. This is what allows a user to scan a results page in one second.

**Accessibility:** colour is never the sole carrier of meaning. Every coloured element also carries a word or an icon, because a red/green distinction is invisible to roughly 8% of male users — a material share of this audience.

### 12.3 Number formatting

- Scores: integer, no decimals, always followed by a verdict phrase.
- Times: 24-hour for the timetable, conversational for prediction ("around 08:20").
- Probabilities: express as frequency where possible. "1 in 3 chance" reads better than "33%". Where a percentage is used, always supply the denominator.
- Never write "N/A". Omit the element instead (Principle 3).

### 12.4 The uncertainty disclosure

A small, consistent, non-alarming line at the foot of any predictive surface:

> *Predictions are estimates based on past performance. Actual running depends on live conditions on the day.*

This already exists as the third string in `predictionInsights` in `journeys.js`. Promote it to a shared component. It costs one line and it is what separates a trustworthy product from an overconfident one.

---

## 13. Open Decisions

These require a team decision before or during the build. Each is stated with its options and consequences.

### 13.1 Data source — **the highest-risk open item**

Every prediction in §9 requires historical delay data. `src/data/trains.js` is hand-authored today.

| Option | Consequence |
|---|---|
| **A. High-fidelity prototype on synthetic history** (§10.3) | Fastest, fully controllable, adequate for a course deliverable. Must be stated honestly in the README and any presentation. **Recommended for this phase.** |
| **B. Third-party API** (RailwayAPI, Indian Rail API, RapidAPI providers) | Real data, but rate limits, cost, and variable reliability. Historical depth is often not offered — most APIs give live status only. |
| **C. Scrape NTES / public datasets** | Genuine historical depth, but significant engineering effort and fragile to layout changes. |

**Recommendation: build on Option A with the adapter boundary from §10.1 in place from day one.** This keeps the swap to B or C a contained change in a single file rather than a rewrite, and it means the product decisions can be validated now rather than blocked on data access.

### 13.2 Mobile-first or desktop-first?

Every wireframe in §7 is drawn mobile-first, because passengers check trains standing on a platform, not at a desk. The current build is desktop-first with a persistent 256px sidebar (`w-64` in `Sidebar.vue`).

**Recommendation: mobile-first, with the four-item navigation as a bottom tab bar and the sidebar as its desktop expression.** This materially affects Phase 1 work, so decide before starting.

### 13.3 Cut or park eCatering and Community?

Both originate in real team research — Rishav's eCatering conflict tree is substantive Analyze-phase work, and the eCatering idea drew votes in the Solve-phase brainstorm.

**Recommendation: park at `/planned`, with the underlying insight stated.** The research remains visible for assessment; the shipped product stays focused. Deleting the work is unnecessary; shipping it is a distraction.

### 13.4 Do we keep the login at all?

With the auth model in §6.3, login serves exactly one purpose: cross-device sync and notification delivery.

**Recommendation: keep it, but only at that one moment.** It is a small amount of code and it enables the retention loop. It must never gate viewing.

---

## 14. Non-Goals

Explicitly out of scope. Listed so that they are declined by reference rather than re-argued.

| Not building | Reason |
|---|---|
| Ticket booking / payments | §2.2. Regulated, capital-intensive, solved. |
| PNR status lookup | Requires IRCTC authentication we do not have. |
| Food ordering | §4 Gap 7. |
| Social / community feed | §4 Gap 7. Requires critical mass we do not have. |
| Multi-modal (bus, flight) journeys | Dilutes the rail-reliability focus. Revisit only once rail is genuinely solved. |
| Native mobile applications | The web app is sufficient for this scope. Design mobile-first so this stays open. |
| Account-required features beyond notifications | §5.5, §6.3. |

---

## Appendix A — Traceability

Every major decision in this document traces to a specific piece of the team's own research. This is included so that assessors, and future contributors, can see that the design is derived rather than invented.

| Spec decision | Traces to |
|---|---|
| Confidence Score (§8) | Devansh — *"Recommend the train that predicts the best balance between speed and reliability based on the user's real purpose"* |
| The 3-Layer Rule (§5.2) | Dhanashree — *Transparency vs. Simplicity* conflict tree |
| Confidence-graded alerts (§9.4, §10.4) | Dhanashree — *Early Warning vs. Accuracy* conflict tree |
| Priority selector (§7.1, §8.3) | Dhanashree — *Cheapest Fare vs. Most Reliable Train*; Riya — Arthika's *affordable travel vs. reach destination on time* |
| Connection risk (§9.3) | Rishav — *Smart Multi-Leg Bundling*, "cascading train delays and tight platform-switching windows" |
| Platform change prediction (§9.5) | Devansh 🟢 and Riya 🟢 root-cause stickies |
| High-stakes penalty (§8.3) | Winning HMW — *"give high-stakes travellers assurance they'll reach what matters on time"* |
| Unified single platform (§6.1) | Devansh — *"Provide all important railway information in one unified platform without overwhelming users"* |
| Proactive alerts (§7.4) | Devansh — *"Provide proactive notifications before delays or platform changes affect the traveller"* |
| Family / solo safety insight (§9.7) | Rishav — *Algorithmic Social Comfort Seating*; Riya — Garima persona |
| Realistic arrival time (§9.2) | Solve-phase idea — *"real-time risk meter that continuously calculates your odds of arriving on time"* (2 votes) |
| Backup options on delay (§9.3 action) | Solve-phase idea — *"Automatically suggest backup travel options such as alternate trains when delays threaten important plans"* (2 votes) |
| eCatering parked (§7.6, §13.3) | Solve-phase idea — *"certified eCatering with hygiene ratings, allergen filters"* (2 votes) — preserved, not shipped |

---

## Appendix B — Quick reference for an implementing LLM

If you are an AI assistant implementing this specification, these are the constraints most likely to be violated by default. Check every change against them.

1. **Never render a score without an adjacent plain-English reason containing a denominator.** (§5.2, §8.4)
2. **Never add a fifth item to the primary navigation.** (§6.1)
3. **Never gate a viewing action behind login.** Only notification enablement requires an account. (§6.3)
4. **Never show a risk card that does not apply.** Absence is the mechanism that prevents overwhelm. (§5.3)
5. **Never soften a negative verdict.** Honesty is the product's only moat. (§2.3)
6. **Keep `src/services/*` pure.** No store access, no fetch, no side effects — `(input) => output` only. (§10.1)
7. **Do not delete `HIGH_STAKES_TYPES`, `predictionInsights`, `MOCK_UPCOMING_TRIPS`, or the existing train fields.** They are assets to be built upon. (§3.5)
8. **Sort by confidence, never by departure time, unless the user explicitly changes the sort.** (§7.2)
9. **Use the exact verdict phrases in §8.4.** Do not invent synonyms.
10. **Every risk card conforms to the §10.4 shape** — headline, evidence, at most one action.
11. **Follow the existing code conventions:** Vue 3 `<script setup>`, Pinia stores, Tailwind with the project's `rail-*` tokens, Lucide icons. Keep diffs minimal and localised; do not refactor unrelated code.
12. **No emojis in source code.** Emoji shown in the wireframes of this document represent icon placement only — implement them as Lucide icons.
