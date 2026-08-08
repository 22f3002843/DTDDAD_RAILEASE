<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header with Back Arrow (Wireframe 4 Top) -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
              Journey Detail
            </h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              PNR #{{ journey.pnr }} • {{ journey.trainName }} ({{ journey.trainNumber }})
            </p>
          </div>
        </div>

        <span class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
          Status: {{ journey.status }}
        </span>
      </div>

      <!-- Timeline Progress Stepper Card (Wireframe 4 Top Stepper) -->
      <div class="bg-white p-8 rounded-card border border-slate-200/80 shadow-soft">
        <div class="relative flex items-center justify-between">
          <!-- Horizontal Connecting Line -->
          <div class="absolute left-8 right-8 top-4 h-1 bg-slate-200 -z-0">
            <div
              class="h-full bg-slate-900 transition-all duration-700"
              :style="{ width: `${(journey.currentStepIndex / 4) * 100}%` }"
            ></div>
          </div>

          <!-- 5 Timeline Nodes: Booked, Chart Prepared, Departed, In Progress, Arriving -->
          <div
            v-for="(step, idx) in journey.timeline"
            :key="idx"
            class="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all shadow-sm',
                idx < journey.currentStepIndex
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : idx === journey.currentStepIndex
                  ? 'bg-rail-500 border-rail-500 text-white ring-4 ring-rail-500/20 scale-110'
                  : 'bg-white border-slate-300 text-slate-400'
              ]"
            >
              <Check v-if="idx < journey.currentStepIndex" class="w-4 h-4" />
              <span v-else>{{ idx + 1 }}</span>
            </div>

            <span
              :class="[
                'text-xs font-bold mt-3 text-center transition-colors',
                idx === journey.currentStepIndex ? 'text-rail-900 font-extrabold' : 'text-slate-500'
              ]"
            >
              {{ step.label }}
            </span>
            <span class="text-[10px] text-slate-400 font-medium mt-0.5 text-center max-w-[120px]">
              {{ step.time }}
            </span>
          </div>
        </div>
      </div>

      <!-- Middle Grid: Journey Assurance, Predicted Arrival, Why this prediction? (Wireframe 4) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1: Journey Assurance -->
        <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col items-center justify-between text-center">
          <h2 class="text-base font-bold text-rail-900 tracking-tight w-full text-left">
            Journey Assurance
          </h2>

          <div class="my-4">
            <GaugeChart :value="journey.riskScore" label="Assurance Score" />
          </div>

          <p class="text-xs text-slate-500 border-t border-slate-100 pt-3 w-full">
            High-Stakes Protection active for this itinerary.
          </p>
        </div>

        <!-- Card 2: Predicted Arrival -->
        <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <h2 class="text-base font-bold text-rail-900 tracking-tight">
            Predicted Arrival
          </h2>

          <div class="my-6 text-center">
            <div class="text-4xl font-extrabold text-slate-900 tracking-tight">
              {{ journey.predictedArrival }}
            </div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mt-3 border border-emerald-100">
              <Clock class="w-3.5 h-3.5" />
              On-Time High Confidence (+/- 2 min)
            </div>
          </div>

          <div class="text-xs text-slate-500 border-t border-slate-100 pt-3 flex justify-between">
            <span>Scheduled: 02:00 PM</span>
            <span class="text-emerald-600 font-bold">0 min delay</span>
          </div>
        </div>

        <!-- Card 3: Why this prediction? -->
        <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <h2 class="text-base font-bold text-rail-900 tracking-tight">
            Why this prediction?
          </h2>

          <ul class="space-y-3 my-3">
            <li
              v-for="(insight, idx) in journey.predictionInsights"
              :key="idx"
              class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
            >
              <span class="w-2 h-2 rounded-full bg-rail-500 shrink-0 mt-1.5"></span>
              <span>{{ insight }}</span>
            </li>
          </ul>

          <div class="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Powered by RailEase Machine Learning & Signal Telemetry
          </div>
        </div>
      </div>

      <!-- Status Bar: Delay Probability, Crowd Forecast, Weather Impact, Route Reliability (Wireframe 4) -->
      <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-rail-600 flex items-center justify-center">
            <Clock class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-medium text-slate-400 block">Delay Probability</span>
            <span class="text-sm font-extrabold text-slate-900">{{ journey.delayProbability }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-medium text-slate-400 block">Crowd Forecast</span>
            <span class="text-sm font-extrabold text-slate-900">{{ journey.crowdForecast }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <CloudSun class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-medium text-slate-400 block">Weather Impact</span>
            <span class="text-sm font-extrabold text-slate-900">{{ journey.weatherImpact }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-medium text-slate-400 block">Route Reliability</span>
            <span class="text-sm font-extrabold text-slate-900">{{ journey.routeReliability }}</span>
          </div>
        </div>
      </div>

      <!-- Suggested Actions (Wireframe 4 Bottom Cards) -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-rail-900 tracking-tight">
          Suggested Actions
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-rail-500 group-hover:text-white transition-colors">
                <Shield class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Delay Protection Insurance</h3>
                <p class="text-xs text-slate-500">Instant ₹1,500 refund if delayed > 60m</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
          </div>

          <div class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-rail-500 group-hover:text-white transition-colors">
                <Train class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Backup Train Auto-Book</h3>
                <p class="text-xs text-slate-500">Reserve secondary ticket automatically</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
          </div>

          <div class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-rail-500 group-hover:text-white transition-colors">
                <Calendar class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Hotel Transfer Guarantee</h3>
                <p class="text-xs text-slate-500">Free cab voucher at destination</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'
import GaugeChart from '@/components/common/GaugeChart.vue'
import {
  ArrowLeft,
  Check,
  Clock,
  Users,
  CloudSun,
  ShieldCheck,
  Shield,
  Train,
  Calendar,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const journeyStore = useJourneyStore()

const journey = computed(() => journeyStore.selectedJourney)
</script>
