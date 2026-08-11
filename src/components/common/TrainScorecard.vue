<template>
  <div class="flex flex-wrap items-stretch gap-x-6 gap-y-4">
    <!-- The headline score, sized so it reads before anything else on the card.
         It was previously a small pill competing with the train name. -->
    <div class="flex items-center gap-3 shrink-0">
      <div :class="['w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center shrink-0', scoreBoxClass]">
        <span class="text-2xl font-black leading-none">{{ confidence }}</span>
        <span class="text-[8px] font-black uppercase tracking-wider opacity-60 mt-0.5">/ 100</span>
      </div>
      <div class="min-w-0">
        <p :class="['text-sm font-black leading-tight', scoreTextClass]">{{ verdict.phrase }}</p>
        <p v-if="buffer" class="text-[11px] font-extrabold text-slate-700 mt-1">{{ buffer }}</p>
      </div>
    </div>

    <!-- The other things a traveller weighs. Punctuality alone does not decide a
         booking: whether you get a seat at all usually matters more. -->
    <div class="flex flex-wrap items-start gap-x-6 gap-y-3 border-l border-slate-200 pl-6">
      <div class="min-w-[120px]">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Seat chance</p>
        <p :class="['text-base font-black leading-tight mt-0.5', toneText(seat.level)]">
          <span v-if="seat.percent !== null && seat.percent < 100">{{ seat.percent }}%</span>
          <span v-else>{{ seat.label }}</span>
        </p>
        <p class="text-[11px] text-slate-500 font-semibold leading-snug">
          {{ seat.percent !== null && seat.percent < 100 ? seat.label : seat.detail }}
        </p>
      </div>

      <div class="min-w-[120px]">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Predictability</p>
        <p :class="['text-base font-black leading-tight mt-0.5', toneText(predictability.level)]">
          {{ predictability.label }}
        </p>
        <p class="text-[11px] text-slate-500 font-semibold leading-snug">{{ predictability.detail }}</p>
      </div>

      <div v-if="realisticArrival" class="min-w-[120px]">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Realistic arrival</p>
        <p class="text-base font-black leading-tight mt-0.5 text-amber-700">{{ realisticArrival }}</p>
        <p class="text-[11px] text-slate-500 font-semibold leading-snug">Not the timetable time</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * The full picture of a train, at the point of decision.
 *
 * Why more than one score:
 *   Punctuality answers "will it be late", which is only one of the questions a
 *   traveller is actually weighing. Whether they can get a seat at all usually
 *   matters more, and whether the delay is predictable decides whether they can
 *   plan around it. Showing one number implied those were settled.
 */
import { computed } from 'vue'
import {
  computeBaseConfidence,
  getVerdict,
  getSeatOutlook,
  getPredictability,
  getSuggestedBuffer
} from '@/services/scoring'
import { getReliabilityReason, getRealisticArrival } from '@/services/reliability'

const props = defineProps({
  train: { type: Object, required: true }
})

const confidence = computed(() => computeBaseConfidence(props.train))
const verdict = computed(() => getVerdict(confidence.value))
const reason = computed(() => getReliabilityReason(props.train))
const seat = computed(() => getSeatOutlook(props.train))
const predictability = computed(() => getPredictability(props.train))
const buffer = computed(() => getSuggestedBuffer(props.train))
const realisticArrival = computed(() => getRealisticArrival(props.train))

const scoreBoxClass = computed(() => {
  if (verdict.value.level === 'green') return 'bg-emerald-50 border-emerald-300 text-emerald-700'
  if (verdict.value.level === 'amber') return 'bg-amber-50 border-amber-300 text-amber-700'
  return 'bg-red-50 border-red-300 text-red-700'
})

const scoreTextClass = computed(() => {
  if (verdict.value.level === 'green') return 'text-emerald-700'
  if (verdict.value.level === 'amber') return 'text-amber-700'
  return 'text-red-700'
})

/**
 * Text colour for a metric, matching the severity language used app-wide.
 *
 * @param {String} level - 'green' | 'amber' | 'red'
 * @returns {String} Tailwind class
 */
function toneText(level) {
  if (level === 'green') return 'text-emerald-700'
  if (level === 'amber') return 'text-amber-700'
  return 'text-red-700'
}
</script>
