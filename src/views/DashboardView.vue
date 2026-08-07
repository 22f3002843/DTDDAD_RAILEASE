<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-8">
      <!-- Greeting Header & Dashboard View Mode Switcher Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-rail-900 tracking-tight">
            Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'RailEase' }}
          </h1>
          <p class="text-xs text-slate-500 mt-1 font-medium">
            Here is your authenticated railway intelligence &amp; 7-day delay telemetry dashboard.
          </p>
        </div>

        <!-- Dashboard View Switcher Tabs -->
        <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            @click="activeDashboardTab = 'overview'"
            :class="[
              'px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer',
              activeDashboardTab === 'overview'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            @click="activeDashboardTab = 'search'"
            :class="[
              'px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer',
              activeDashboardTab === 'search'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Search class="w-4 h-4" />
            <span>Search &amp; 7-Day Delay Logs</span>
          </button>
        </div>
      </div>

      <!-- TAB 2: SEARCH TRAINS WITH 7-DAY HISTORICAL TELEMETRY (AUTHENTICATED ONLY) -->
      <div v-if="activeDashboardTab === 'search'" class="animate-fade-in">
        <DashboardTrainSearch />
      </div>

      <!-- TAB 1: OVERVIEW & LIVE RADAR -->
      <div v-else class="space-y-8 animate-fade-in">
        <!-- Top Row Grid: High-Stakes Journey Selector (Left) & Today's Journey Risk (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- High-Stakes Journey Selection Card (Wireframe 3) -->
          <div class="lg:col-span-8 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                High-Stakes Journey Selection
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Tell us what matters most for your trip so our AI optimizes delay protection &amp; backup routes.
              </p>
            </div>

            <!-- 5 Icon Selector Buttons (Exam, Interview, Medical, Flight, Other) -->
            <div class="grid grid-cols-5 gap-3 my-6">
              <button
                v-for="item in journeyStore.highStakesTypes"
                :key="item.id"
                @click="journeyStore.setStakesType(item.id)"
                :class="[
                  'flex flex-col items-center justify-center p-4 rounded-card border transition-all group cursor-pointer',
                  journeyStore.selectedStakesType === item.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-rail-500/30'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                ]"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110',
                    journeyStore.selectedStakesType === item.id ? 'bg-rail-500 text-white' : 'bg-white text-slate-700 shadow-sm'
                  ]"
                >
                  <component :is="getIconComponent(item.icon)" class="w-5 h-5" />
                </div>
                <span class="text-xs font-semibold tracking-tight">{{ item.label }}</span>
              </button>
            </div>

            <div class="p-3.5 rounded-btn bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span class="flex items-center gap-2 font-medium">
                <ShieldAlert class="w-4 h-4 text-rail-500" />
                Active Mode: <strong class="text-slate-900 capitalize">{{ journeyStore.selectedStakesType }} Priority Mode</strong>
              </span>
              <span class="text-rail-500 font-semibold cursor-pointer hover:underline" @click="router.push('/journey-planner')">
                Configure Safeguards &rarr;
              </span>
            </div>
          </div>

          <!-- Today's Journey Risk Card (Wireframe 3 Gauge Chart) -->
          <div class="lg:col-span-4 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col items-center justify-between">
            <div class="w-full flex items-center justify-between">
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                Today's Journey Risk
              </h2>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <!-- Gauge Chart Meter -->
            <div class="my-4">
              <GaugeChart :value="96" label="Low Risk" />
            </div>

            <div class="w-full text-center text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-around">
              <div>
                <span class="block font-bold text-slate-900">0 min</span>
                <span>Avg Delay</span>
              </div>
              <div class="h-8 w-px bg-slate-100"></div>
              <div>
                <span class="block font-bold text-emerald-600">99.4%</span>
                <span>Punctuality</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row Grid: Your Upcoming Trips (Left) & Quick Actions (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Your Upcoming Trips List (Wireframe 3) -->
          <div class="lg:col-span-8 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                Your Upcoming Trips
              </h2>
              <button @click="router.push('/bookings')" class="text-xs font-semibold text-rail-500 hover:underline cursor-pointer">
                View All Bookings
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="trip in journeyStore.upcomingTrips"
                :key="trip.id"
                @click="openTripDetails(trip)"
                class="p-4 rounded-card border border-slate-200/60 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-sm group-hover:bg-rail-500 group-hover:text-white transition-colors">
                    <Train class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-extrabold text-rail-900">{{ trip.trainName }}</span>
                      <span class="text-xs text-slate-400">({{ trip.trainNumber }})</span>
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5 font-medium">
                      {{ trip.from }} &rarr; {{ trip.to }} • {{ trip.date }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {{ trip.status }}
                  </span>
                  <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Grid (Wireframe 3 4-Grid Cards) -->
          <div class="lg:col-span-4 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <h2 class="text-lg font-bold text-rail-900 tracking-tight mb-4">
              Quick Actions
            </h2>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="router.push('/ecatering')"
                class="p-4 bg-slate-50 hover:bg-rail-50 border border-slate-200/60 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Utensils class="w-6 h-6 text-slate-700 group-hover:text-rail-500 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Book Meal</span>
              </button>

              <button
                @click="router.push('/live-status')"
                class="p-4 bg-slate-50 hover:bg-rail-50 border border-slate-200/60 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Clock class="w-6 h-6 text-slate-700 group-hover:text-rail-500 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Live Status</span>
              </button>

              <button
                @click="router.push('/journey-planner')"
                class="p-4 bg-slate-50 hover:bg-rail-50 border border-slate-200/60 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <ShieldCheck class="w-6 h-6 text-slate-700 group-hover:text-rail-500 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Assurance</span>
              </button>

              <button
                @click="router.push('/alerts')"
                class="p-4 bg-slate-50 hover:bg-rail-50 border border-slate-200/60 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Bell class="w-6 h-6 text-slate-700 group-hover:text-rail-500 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">PNR Alerts</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Live Network Status Bar (Wireframe 3 Bottom Bar) -->
        <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Radio class="w-4 h-4 text-emerald-500 animate-pulse" />
              <h2 class="text-base font-bold text-rail-900 tracking-tight">
                Live Network Status
              </h2>
            </div>
            <button @click="router.push('/live-status')" class="text-xs font-semibold text-rail-500 hover:underline cursor-pointer">
              View All Corridors
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div
              v-for="(item, index) in journeyStore.networkStatus"
              :key="index"
              class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs flex flex-col justify-between"
            >
              <span class="font-bold text-slate-800 truncate mb-1" :title="item.corridor">{{ item.corridor }}</span>
              <div class="flex items-center justify-between text-[11px] text-slate-500">
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">{{ item.status }}</span>
                <span>Load {{ item.load }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'
import GaugeChart from '@/components/common/GaugeChart.vue'
import DashboardTrainSearch from '@/components/dashboard/DashboardTrainSearch.vue'
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Hexagon,
  HeartHandshake,
  Plane,
  Compass,
  ShieldAlert,
  Train,
  ChevronRight,
  Utensils,
  Clock,
  ShieldCheck,
  Bell,
  Radio
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const journeyStore = useJourneyStore()

const activeDashboardTab = ref('overview')

function getIconComponent(name) {
  const iconMap = {
    CheckSquare,
    Hexagon,
    HeartHandshake,
    Plane,
    Compass
  }
  return iconMap[name] || Compass
}

function openTripDetails(trip) {
  journeyStore.selectTrip(trip)
  router.push('/journey-planner')
}
</script>
