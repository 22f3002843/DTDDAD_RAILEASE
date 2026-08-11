<template>
  <div
    class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden"
    @click.self="$emit('close')"
  >
    <!-- LANDSCAPE COMPACT TRIP DETAILS MODAL (WIDE & LOW HEIGHT) -->
    <div class="relative w-full max-w-[700px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in text-left font-sans">
      <!-- Top Decorative Accent Line -->
      <div class="h-1 bg-gradient-to-r from-rail-500 via-sky-400 to-indigo-500 shrink-0"></div>

      <!-- Theme Gradient Header (Horizontal Landscape Layout) -->
      <div class="bg-gradient-to-r from-rail-700 via-rail-600 to-indigo-700 text-white px-5 py-3 relative shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black border border-emerald-400/40 tracking-wider uppercase">
              PNR: {{ trip.pnr }}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-white/15 text-blue-100 text-[10px] font-extrabold border border-white/20">
              {{ trip.status }}
            </span>
          </div>
          <h3 class="text-base font-black uppercase text-white tracking-tight leading-none">
            {{ trip.trainName }} <span class="text-blue-200 text-xs font-extrabold">({{ trip.trainNumber }})</span>
          </h3>
          <p class="text-[11px] text-blue-100/90 font-medium mt-1">
            {{ trip.from }} &rarr; {{ trip.to }} • {{ trip.date }}
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
          title="Close modal"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body (2-Column Landscape Layout) -->
      <div class="p-4 grid grid-cols-1 md:grid-cols-12 gap-3.5 flex-1 overflow-y-auto font-sans">
        <!-- Left Column: Seat Info + Gauge + Insights -->
        <div class="md:col-span-5 space-y-3 flex flex-col justify-between">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/90 flex items-center justify-between">
            <div>
              <span class="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Coach &amp; Seat</span>
              <span class="text-slate-900 font-black text-xs">{{ trip.seatInfo || 'Coach B1 • Seat 24' }}</span>
            </div>
            <div class="flex items-center shrink-0">
              <ReliabilityGaugeMeter
                :score="parseInt(trip.routeReliability) || 92"
                :width="85"
                :height="42"
                :showLabels="true"
              />
            </div>
          </div>

          <!-- Prediction Insights -->
          <div v-if="trip.predictionInsights" class="bg-rail-50/80 p-3 rounded-xl border border-rail-200/80 space-y-1 text-xs flex-1 flex flex-col justify-center">
            <div class="font-black text-rail-800 uppercase flex items-center gap-1 text-[10px] tracking-wider mb-0.5">
              <Sparkles class="w-3.5 h-3.5 text-rail-600" />
              <span>RailEase Intelligence Insights</span>
            </div>
            <ul class="list-disc list-inside space-y-1 text-slate-700 font-medium text-[11px] leading-relaxed">
              <li v-for="(ins, iIdx) in trip.predictionInsights" :key="iIdx">
                {{ ins }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Right Column: Timeline Steps -->
        <div class="md:col-span-7 flex flex-col">
          <div v-if="trip.timeline" class="space-y-1.5 flex-1 flex flex-col">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Journey Progress Timeline</h4>
            <div class="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex-1 flex flex-col justify-center">
              <div
                v-for="(step, sIdx) in trip.timeline"
                :key="sIdx"
                class="flex items-center gap-2.5 text-xs"
              >
                <div
                  :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center font-black text-[9px] shrink-0 shadow-2xs',
                    step.completed ? 'bg-emerald-500 text-white' :
                    step.active ? 'bg-rail-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  {{ sIdx + 1 }}
                </div>
                <div class="flex-1 flex items-center justify-between border-b border-slate-100 pb-1">
                  <span :class="step.active ? 'font-black text-slate-900' : 'font-semibold text-slate-700'" class="text-[11px]">
                    {{ step.label }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-extrabold">{{ step.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3 px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
        <button
          @click="router.push('/live-status'); $emit('close')"
          class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Radio class="w-3.5 h-3.5" />
          <span>Live Tracking Map</span>
        </button>
        <button
          @click="$emit('close')"
          class="px-5 py-1.5 bg-rail-600 hover:bg-rail-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
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
