<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-8 font-sans">
      <!-- Greeting Header & Dashboard View Mode Switcher Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'RailEase' }}
          </h1>
          <p class="text-xs text-slate-500 mt-1 font-medium">
            Here is your active journey intelligence &amp; 7-day delay telemetry dashboard.
          </p>
        </div>

        <!-- Dashboard View Switcher Tabs -->
        <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            @click="activeDashboardTab = 'overview'"
            :class="[
              'px-5 py-2 rounded-lg font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer',
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
              'px-5 py-2 rounded-lg font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer',
              activeDashboardTab === 'search'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Train class="w-4 h-4" />
            <span>Train Intelligence &amp; Journey Selection</span>
          </button>
        </div>
      </div>

      <!-- ACTIVE JOURNEY SYNC BANNER (LOCKED ACROSS ALL DASHBOARD FEATURES) -->
      <div
        v-if="journeyStore.activeTrip"
        class="bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-slate-900 text-white p-5 rounded-card shadow-lg border border-blue-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in"
      >
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
            <Train class="w-6 h-6 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/40">
                ACTIVE JOURNEY LOCKED
              </span>
              <span class="text-xs text-blue-200 font-bold">
                PNR: {{ journeyStore.activeTrip.pnr || '84291039' }}
              </span>
            </div>
            <h2 class="text-xl font-black text-white uppercase mt-0.5">
              {{ journeyStore.activeTrip.trainName }} ({{ journeyStore.activeTrip.trainNumber }})
            </h2>
            <p class="text-xs text-blue-200 font-medium">
              {{ journeyStore.activeTrip.from }} &rarr; {{ journeyStore.activeTrip.to }} • {{ journeyStore.activeTrip.date }}
            </p>
          </div>
        </div>

        <!-- Aligned Quick Feature Actions -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="router.push('/live-status')"
            class="px-3.5 py-2 bg-blue-800/80 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold border border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Radio class="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Live Map Radar</span>
          </button>

          <button
            @click="router.push('/journey-planner')"
            class="px-3.5 py-2 bg-blue-800/80 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold border border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ShieldAlert class="w-3.5 h-3.5 text-amber-400" />
            <span>Safeguards &amp; Backup</span>
          </button>

          <button
            @click="router.push('/ecatering')"
            class="px-3.5 py-2 bg-blue-800/80 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold border border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Utensils class="w-3.5 h-3.5 text-orange-400" />
            <span>eCatering Meals</span>
          </button>

          <button
            @click="activeDashboardTab = 'search'"
            class="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer"
          >
            Change Active Train
          </button>
        </div>
      </div>

      <!-- TAB 2: TRAIN INTELLIGENCE & JOURNEY SELECTION -->
      <div v-if="activeDashboardTab === 'search'" class="animate-fade-in">
        <DashboardTrainSearch />
      </div>

      <!-- TAB 1: OVERVIEW & LIVE RADAR -->
      <div v-else class="space-y-8 animate-fade-in">
        <!-- Top Row Grid: High-Stakes Journey Selector (Left) & Today's Journey Risk (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- High-Stakes Journey Selection Card -->
          <div class="lg:col-span-8 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                High-Stakes Journey Safeguards Selection
              </h2>
              <p class="text-xs text-slate-500 mt-0.5 font-medium">
                Tell us what matters most for your journey on <strong>{{ journeyStore.activeTrip?.trainName || 'your active train' }}</strong>.
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
                Active Safeguard Mode: <strong class="text-slate-900 capitalize">{{ journeyStore.selectedStakesType }} Priority Safeguards</strong>
              </span>
              <span class="text-rail-500 font-semibold cursor-pointer hover:underline" @click="router.push('/journey-planner')">
                Configure Safeguards &rarr;
              </span>
            </div>
          </div>

          <!-- Today's Journey Risk Card -->
          <div class="lg:col-span-4 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col items-center justify-between">
            <div class="w-full flex items-center justify-between">
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                Active Train Delay Risk
              </h2>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <!-- Gauge Chart Meter -->
            <div class="my-4">
              <GaugeChart :value="journeyStore.activeTrip?.riskScore || 92" label="Low Delay Risk" />
            </div>

            <div class="w-full text-center text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-around">
              <div>
                <span class="block font-bold text-slate-900">0 min</span>
                <span>Avg Delay</span>
              </div>
              <div class="h-8 w-px bg-slate-100"></div>
              <div>
                <span class="block font-bold text-emerald-600">{{ journeyStore.activeTrip?.routeReliability || '92%' }}</span>
                <span>Punctuality</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row Grid: Your Upcoming Trips & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Your Upcoming Trips List -->
          <div class="lg:col-span-8 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-rail-900 tracking-tight">
                Your Synced Journeys &amp; Saved Trains
              </h2>
              <button @click="activeDashboardTab = 'search'" class="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
                + Select / Add Train by PNR
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="trip in journeyStore.upcomingTrips"
                :key="trip.id"
                @click="journeyStore.selectTrip(trip)"
                :class="[
                  'p-4 rounded-card border transition-all flex items-center justify-between cursor-pointer group',
                  journeyStore.activeTrip?.id === trip.id
                    ? 'bg-blue-50/80 border-blue-500/80 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-50 hover:border-slate-300'
                ]"
              >
                <div class="flex items-center gap-4">
                  <div
                    :class="[
                      'w-11 h-11 rounded-xl flex items-center justify-center transition-colors shadow-sm',
                      journeyStore.activeTrip?.id === trip.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
                    ]"
                  >
                    <Train class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-extrabold text-rail-900">{{ trip.trainName }}</span>
                      <span class="text-xs text-slate-500 font-bold">({{ trip.trainNumber }})</span>
                      <span v-if="journeyStore.activeTrip?.id === trip.id" class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        LOCKED
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5 font-medium">
                      {{ trip.from }} &rarr; {{ trip.to }} • {{ trip.date }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {{ trip.status }}
                  </span>
                  <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Grid -->
          <div class="lg:col-span-4 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <h2 class="text-lg font-bold text-rail-900 tracking-tight mb-4">
              Quick Feature Actions
            </h2>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="router.push('/ecatering')"
                class="p-4 bg-slate-50 hover:bg-orange-50 border border-slate-200/60 hover:border-orange-200 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Utensils class="w-6 h-6 text-slate-700 group-hover:text-orange-600 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Order Meal</span>
              </button>

              <button
                @click="router.push('/live-status')"
                class="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-200 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Radio class="w-6 h-6 text-slate-700 group-hover:text-emerald-600 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Live Radar</span>
              </button>

              <button
                @click="router.push('/journey-planner')"
                class="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Compass class="w-6 h-6 text-slate-700 group-hover:text-blue-600 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">Safeguards</span>
              </button>

              <button
                @click="router.push('/alerts')"
                class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 hover:border-purple-200 rounded-card flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
              >
                <Bell class="w-6 h-6 text-slate-700 group-hover:text-purple-600 mb-2 transition-transform group-hover:scale-110" />
                <span class="text-xs font-bold text-slate-800">PNR Alerts</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Live Network Telemetry Strip -->
        <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-rail-900 tracking-tight">
              Live Network Rail Telemetry
            </h2>
            <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              99.2% Corridor Operational Health
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div
              v-for="item in journeyStore.networkStatus"
              :key="item.corridor"
              class="p-3.5 rounded-btn bg-slate-50 border border-slate-200/60 space-y-1"
            >
              <div class="text-xs font-bold text-slate-800 truncate">{{ item.corridor }}</div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-500">Signal: <strong class="text-emerald-600">{{ item.status }}</strong></span>
                <span class="text-slate-400 font-semibold">{{ item.load }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trip Details Modal -->
      <TripDetailsModal
        v-if="selectedTripForModal"
        :trip="selectedTripForModal"
        @close="selectedTripForModal = null"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardTrainSearch from '@/components/dashboard/DashboardTrainSearch.vue'
import GaugeChart from '@/components/common/GaugeChart.vue'
import TripDetailsModal from '@/components/common/TripDetailsModal.vue'
import {
  LayoutDashboard,
  Train,
  ChevronRight,
  ShieldAlert,
  Radio,
  Utensils,
  Compass,
  Bell,
  CheckSquare,
  Hexagon,
  HeartHandshake,
  Plane
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const journeyStore = useJourneyStore()

const activeDashboardTab = ref('overview')
const selectedTripForModal = ref(null)

function openTripDetails(trip) {
  selectedTripForModal.value = trip
}

function getIconComponent(name) {
  const map = { CheckSquare, Hexagon, HeartHandshake, Plane, Compass }
  return map[name] || Compass
}
</script>
