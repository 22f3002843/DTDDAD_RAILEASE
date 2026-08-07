<template>
  <div
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in text-left">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-[#1E3A8A] to-slate-900 text-white p-6 relative">
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
            PNR: {{ trip.pnr }}
          </span>
          <span class="text-xs text-blue-200 font-bold">{{ trip.status }}</span>
        </div>

        <h3 class="text-xl font-black uppercase text-white mt-1">
          {{ trip.trainName }} ({{ trip.trainNumber }})
        </h3>
        <p class="text-xs text-blue-200 mt-0.5">
          {{ trip.from }} &rarr; {{ trip.to }} • {{ trip.date }}
        </p>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5">
        <!-- Seat & Status Card -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold">
          <div>
            <span class="text-slate-500 block text-[11px]">Seat / Coach Info:</span>
            <span class="text-slate-900 font-black text-sm">{{ trip.seatInfo || 'Coach B1 • Seat 24' }}</span>
          </div>
          <div class="text-right">
            <span class="text-slate-500 block text-[11px]">Punctuality Rating:</span>
            <span class="text-emerald-600 font-black text-sm">{{ trip.routeReliability || '92%' }} Score</span>
          </div>
        </div>

        <!-- Timeline Step Progress -->
        <div v-if="trip.timeline" class="space-y-2">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Journey Progress Timeline</h4>
          <div class="space-y-2">
            <div
              v-for="(step, sIdx) in trip.timeline"
              :key="sIdx"
              class="flex items-center gap-3 text-xs"
            >
              <div
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]',
                  step.completed ? 'bg-emerald-500 text-white' :
                  step.active ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                ]"
              >
                {{ sIdx + 1 }}
              </div>
              <div class="flex-1 flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span :class="step.active ? 'font-black text-slate-900' : 'font-semibold text-slate-700'">
                  {{ step.label }}
                </span>
                <span class="text-[11px] text-slate-500 font-medium">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Prediction Insights -->
        <div v-if="trip.predictionInsights" class="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-1.5 text-xs text-blue-900">
          <div class="font-black text-blue-800 uppercase flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-blue-600" />
            <span>RailEase Intelligence Insights</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-slate-700 font-medium text-[11px]">
            <li v-for="(ins, iIdx) in trip.predictionInsights" :key="iIdx">
              {{ ins }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          @click="router.push('/live-status'); $emit('close')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold cursor-pointer shadow flex items-center gap-1.5"
        >
          <Radio class="w-3.5 h-3.5" />
          <span>Open Live Tracking Map</span>
        </button>
        <button
          @click="$emit('close')"
          class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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

defineProps({
  trip: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const router = useRouter()
</script>
