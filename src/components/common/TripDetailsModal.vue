<template>
  <div
    class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-20 sm:pt-28 pb-8 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <!-- COMPACT 500px THEME ALIGNED TRIP DETAILS MODAL (SHIFTED DOWN) -->
    <div class="relative w-full max-w-[500px] max-h-[78vh] bg-white rounded-card shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto mt-10 sm:mt-14 animate-fade-in text-left">
      <!-- Top Decorative Gradient Accent Line -->
      <div class="h-1 bg-gradient-to-r from-rail-400 via-sky-300 to-indigo-400 shrink-0"></div>

      <!-- Theme Gradient Header -->
      <div class="bg-gradient-to-r from-rail-600 via-rail-500 to-indigo-600 text-white p-4 sm:p-5 relative shrink-0">
        <button
          @click="$emit('close')"
          class="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
          title="Close modal"
        >
          ✕
        </button>

        <!-- Top Badges Row -->
        <div class="flex items-center gap-2 mb-1.5">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black border border-emerald-400/40 tracking-wider uppercase">
            PNR: {{ trip.pnr }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-[10px] font-extrabold border border-white/20">
            {{ trip.status }}
          </span>
        </div>

        <!-- Train Title -->
        <h3 class="text-base sm:text-lg font-black uppercase text-white tracking-tight leading-snug">
          {{ trip.trainName }} <span class="text-blue-200 text-xs font-bold">({{ trip.trainNumber }})</span>
        </h3>
        <p class="text-xs text-blue-100/90 font-medium mt-0.5">
          {{ trip.from }} &rarr; {{ trip.to }} • {{ trip.date }}
        </p>
      </div>

      <!-- Modal Body (Compact Content) -->
      <div class="p-4 sm:p-5 space-y-3.5 flex-1 overflow-y-auto font-sans">
        <!-- Seat & Status Card with Dynamic Gauge Meter -->
        <div class="bg-slate-50/80 p-3 rounded-xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <span class="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Coach &amp; Seat</span>
            <span class="text-slate-900 font-black text-xs sm:text-sm">{{ trip.seatInfo || 'Coach B1 • Seat 24' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <ReliabilityGaugeMeter
              :score="parseInt(trip.routeReliability) || 92"
              :width="90"
              :height="48"
              :showLabels="true"
            />
          </div>
        </div>

        <!-- Timeline Step Progress -->
        <div v-if="trip.timeline" class="space-y-1.5">
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Journey Progress Timeline</h4>
          <div class="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div
              v-for="(step, sIdx) in trip.timeline"
              :key="sIdx"
              class="flex items-center gap-2.5 text-xs"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 shadow-2xs',
                  step.completed ? 'bg-emerald-500 text-white' :
                  step.active ? 'bg-rail-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                ]"
              >
                {{ sIdx + 1 }}
              </div>
              <div class="flex-1 flex items-center justify-between border-b border-slate-100/80 pb-1">
                <span :class="step.active ? 'font-black text-slate-900' : 'font-semibold text-slate-700'">
                  {{ step.label }}
                </span>
                <span class="text-[10px] text-slate-400 font-bold">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Prediction Insights -->
        <div v-if="trip.predictionInsights" class="bg-rail-50/80 p-3 rounded-xl border border-rail-200/80 space-y-1 text-xs">
          <div class="font-black text-rail-800 uppercase flex items-center gap-1.5 text-[10px] tracking-wider">
            <Sparkles class="w-3.5 h-3.5 text-rail-600" />
            <span>RailEase Intelligence Insights</span>
          </div>
          <ul class="list-disc list-inside space-y-0.5 text-slate-700 font-medium text-[11px] leading-relaxed">
            <li v-for="(ins, iIdx) in trip.predictionInsights" :key="iIdx">
              {{ ins }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3.5 px-4 sm:px-5 bg-slate-50/90 border-t border-slate-200/90 flex items-center justify-between shrink-0">
        <button
          @click="router.push('/live-status'); $emit('close')"
          class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Radio class="w-3.5 h-3.5" />
          <span>Live Tracking Map</span>
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-1.5 bg-rail-500 hover:bg-rail-600 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-all duration-200 shadow-sm hover:shadow-glow hover:scale-[1.02] active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, Radio } from 'lucide-vue-next'
import ReliabilityGaugeMeter from '@/components/common/ReliabilityGaugeMeter.vue'

defineProps({
  trip: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const router = useRouter()
</script>
