# RailEase 🚆

> **Indian Railway Reliability Intelligence**  
> *"Plan better, Travel smarter. From uncertainty to assurance."*

RailEase is a modern web application designed for Indian Railway travelers. By aggregating 30-day historical train telemetry, signal box logs, and corridor health data, RailEase surfaces realistic reliability scores, delay predictions, live satellite tracking, and automated disruption recovery safeguards.

---

## 🌟 Key Features

- **📊 Historical Reliability Score**: Evaluates 30-day train punctuality and signal logs to assign realistic confidence ratings (88%–94% historical pattern match).
- **⏱️ Delay Forecast Engine**: Statistical delay window modeling based on track maintenance, weather trends, and section congestion.
- **🛰️ Live Express Radar**: Real-time signal map and speed metrics for high-speed corridors like Vande Bharat, Rajdhani, and Tejas Express.
- **🛡️ High-Stakes Disruption Safeguard**: Smart buffer planning, alternate train recommendations, and delay protection coverage for critical exam or flight travel.
- **🔍 Quick Ticket Search**: Search schedules, fares, and IRCTC-style seat class statuses (`AVAILABLE-14`, `RAC 4`, `WL 12`) across major station pairs.
- **🔗 Direct IRCTC Portals**: Instant external links for official PNR Enquiry and Reservation Charts/Vacancy.
- **🔑 Prototype Static Auth**: Demonstration access with static login credentials (`railease` / `123456`).

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

Before running the application locally, ensure you have the following installed:

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

## 🔐 Prototype Login Credentials

To explore gated features (Dashboard, Journey Risk Planner, Live Status Radar):

- **Username**: `railease`
- **Password**: `123456`

---

## 📁 Project Structure

```text
rail_js/
├── public/
│   ├── logo.png              # RailEase Application Logo
│   └── favicon.png           # Browser Favicon
├── src/
│   ├── assets/               # CSS & Styling Design Tokens
│   ├── components/           # Reusable Vue UI Components
│   │   ├── common/           # Logo, AuthWidget, QuickBookWidget
│   │   ├── footer/           # SaaS Multi-Column Footer
│   │   ├── navbar/           # Top Navigation Bar
│   │   └── ui/               # CustomSelect Floating Popover
│   ├── composables/          # Scroll Reveal & Utility Hooks
│   ├── data/                 # Mock Datasets (Trains, Stations, Journeys)
│   ├── layouts/              # AppLayout Container
│   ├── router/               # Vue Router Config & Navigation Guards
│   ├── stores/               # Pinia Stores (Auth, Search, Journey)
│   └── views/                # Page Views (Landing, Search, Dashboard...)
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
