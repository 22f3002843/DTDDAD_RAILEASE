# RailEase 🚆

> **Indian Railway Reliability Intelligence & Passenger Companion Platform**  
> *"Plan better, Travel smarter. From uncertainty to assurance."*

RailEase is a state-of-the-art web application engineered for Indian Railway travelers. By analyzing 30-day historical train telemetry, signal box logs, and corridor health metrics, RailEase transforms unverified timetable predictions into data-grounded confidence scores, delay risks, live satellite radar tracking, and automated emergency disruption recovery.

---

## 🌟 What RailEase Is About

Booking a train ticket in India often comes with uncertainty: *Will the train be late? Should I take an earlier route? What if I miss my connection?* 

RailEase solves this by placing **30-day empirical telemetry data** directly into the passenger's hands. Instead of guessing based on scheduled timetables, travelers can see real historical delay patterns, calculated punctuality indexes, recommended travel buffer times, and multi-modal emergency recovery options if things go wrong.

---

## ✨ Key Features & Capabilities

### 📊 1. 30-Day Delay Telemetry & Punctuality Scoring Engine
- **Calculated Confidence Score (0–100)**: Derived from the last 30 days of actual running history.
  - **70+ (Green)**: High confidence / on-time history.
  - **55–69 (Amber)**: Moderate delay risk (+10–25 mins).
  - **Below 55 (Red)**: Frequent delay corridor.
- **Smart Buffer Recommendations**: Calculates recommended buffer times to prevent missed connections.
- **Real vs. Timetable Arrival**: Surfaces the realistic arrival time to plan around instead of published timetables.

### 📡 2. Tactical Cyberpunk Dark Mode Live Satellite Radar (`LiveStatusView.vue`)
- **Real-Time GPS Tracking**: 3-second interval satellite radar updates on a midnight slate canvas.
- **Dynamic Heading Rotation & Track Tilt**: Bullet train icons dynamically calculate rail track tangents (`Math.atan2(dy, dx)`) with a `-20°` alignment tilt to glide flush along OHE steel rails.
- **Live Corridor Telemetry**: Displays speed callouts bounded between **90–130 km/h**, platform assignments, upcoming stations timeline, and active OHE signal glow overlays.

### 🚨 3. AI Emergency Rail Recovery Assistant ("I Missed My Train" - `JourneyPlannerView.vue`)
An edge-to-edge, panic-free emergency rescue workspace providing **3 instant recovery pathways** when a passenger misses their train:
1. 🚖 **Express Catch-Up Cabs**: Calculates express highway transit to intercept the missed train at a downstream major junction (e.g., Kota Junction PF 1) 25 minutes before it arrives, preserving the original booked seat!
2. 🚆 **Next Parallel Fast Express**: Instant Tatkal seat availability and direct rebooking links for parallel Vande Bharat or superfast trains departing shortly.
3. 📜 **Automated IRCTC TDR Refund Assistant**: Auto-calculates eligible refund amounts (up to 85%) under IRCTC No-Show rules with step-by-step TDR filing guidance.
4. 📞 **TTE Seat Hold Alert**: Sends seat retention notifications to the on-board TTE.

### 🍲 4. eCatering & Train-Synced Food Reviews (`ECateringView.vue`)
- **Seat-Side Delivery**: Order hygienic meals directly to your berth from verified food partners.
- **Upward Radial Food Rating Gauge**: Custom SVG gauge meter displaying food quality index (4.8★ / 5 rating) with animated sonar wave rings.
- **Train-Synced Passenger Reviews**: Live review feed verified by PNR and seat numbers with community upvoting.

### 🔔 5. Real-Time PNR & Trip Alerts (`AlertsView.vue`)
- Edge-to-edge alerts panel categorizing Delay warnings, Platform assignments (e.g. NDLS Platform #16), High-Stakes Exam Safeguards, and eCatering discount vouchers.

### 👥 6. Passenger Community Hub (`CommunityView.vue`)
- Edge-to-edge community forum for crowd-sourced station platform updates, fog alerts, coach positioning, and travel tips.

### 🕒 7. Modern Custom Time Selector Dropdown
- Interactive time picker popover for arrival deadline preferences with quick presets (*ASAP*, *Morning*, *Afternoon*, *Evening*), 12-hour/minute selectors, and click-outside dismissal.

### 🎨 8. Premium Aesthetics & Responsive Design
- **Subtle Light Theme Gradients**: Harmonious `bg-gradient-to-r from-rail-50 via-sky-50 to-indigo-50` cards with ambient glowing blur wave mesh auras.
- **Full Edge-to-Edge Canvas (`w-full`)**: Optimized for widescreen, tablet, and mobile views.
- **Scroll-Down Entrance Animations**: Lightweight `IntersectionObserver` scroll-reveal animations (`useScrollReveal.js`).

---

## 🛠️ Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Vanilla CSS tokens & responsive utility design)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + `vue-chartjs`

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended)
- **[npm](https://www.npmjs.com/)** (v9.0.0 or higher)

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/22f3002843/DTDDAD_RAILEASE.git
cd DTDDAD_RAILEASE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Demo Login Credentials

To explore protected traveler features (Dashboard, Emergency Recovery, Live Status Radar, Alerts, Profile):

- **Username**: `railease`
- **Password**: `123456`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
