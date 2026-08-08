<template>
  <div :class="['rounded-xl border p-4 sm:p-5', containerClass]">
    <div class="flex items-start gap-3.5">
      <component :is="icon" :class="['w-5 h-5 shrink-0 mt-0.5', iconClass]" />

      <div class="flex-1 min-w-0 space-y-2">
        <!-- The headline, and the number that drives it pulled out large. A
             stressed reader takes the figure in at a glance and only reads the
             sentence if they want the reasoning. -->
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 class="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            {{ card.headline }}
          </h3>
        </div>

        <div v-if="card.figure" class="flex items-baseline gap-2">
          <span :class="['text-2xl sm:text-3xl font-black leading-none', figureClass]">
            {{ card.figure }}
          </span>
          <span v-if="card.figureLabel" class="text-xs font-bold text-slate-500">
            {{ card.figureLabel }}
          </span>
        </div>

        <!-- The evidence is collapsed by default. It is the proof, not the
             message, and six cards of prose was more than anyone would read. -->
        <button
          type="button"
          @click="showEvidence = !showEvidence"
          class="text-[11px] font-extrabold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{{ showEvidence ? 'Hide detail' : 'Why' }}</span>
          <ChevronDown :class="['w-3 h-3 transition-transform', showEvidence ? 'rotate-180' : '']" />
        </button>

        <p v-if="showEvidence" class="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
          {{ card.evidence }}
        </p>

        <button
          v-if="card.action"
          type="button"
          @click="$emit('action', card.action)"
          class="mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-extrabold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {{ card.action.label }}
        </button>
      </div>

      <!-- Severity is never carried by colour alone: roughly one in twelve men
           cannot separate red from green, so the word travels with the hue. -->
      <span :class="['shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full', labelClass]">
        {{ severityLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AlertTriangle, AlertCircle, Info, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  // Card object from services/predictions.js; see generateRiskCards for shape.
  card: { type: Object, required: true }
})

defineEmits(['action'])

const showEvidence = ref(false)

const severityLabel = computed(() => {
  if (props.card.severity === 'high') return 'Important'
  if (props.card.severity === 'medium') return 'Worth knowing'
  return 'Good to know'
})

const icon = computed(() => {
  if (props.card.severity === 'high') return AlertTriangle
  if (props.card.severity === 'medium') return AlertCircle
  return Info
})

const containerClass = computed(() => {
  if (props.card.severity === 'high') return 'bg-red-50/70 border-red-200'
  if (props.card.severity === 'medium') return 'bg-amber-50/70 border-amber-200'
  return 'bg-slate-50 border-slate-200'
})

const iconClass = computed(() => {
  if (props.card.severity === 'high') return 'text-red-600'
  if (props.card.severity === 'medium') return 'text-amber-600'
  return 'text-slate-500'
})

const figureClass = computed(() => {
  if (props.card.severity === 'high') return 'text-red-700'
  if (props.card.severity === 'medium') return 'text-amber-700'
  return 'text-slate-700'
})

const labelClass = computed(() => {
  if (props.card.severity === 'high') return 'bg-red-100 text-red-800'
  if (props.card.severity === 'medium') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-200 text-slate-700'
})
</script>
