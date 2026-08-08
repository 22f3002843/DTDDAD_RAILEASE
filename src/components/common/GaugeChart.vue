<template>
  <div class="relative flex flex-col items-center justify-center p-2">
    <div class="relative w-44 h-24 overflow-hidden flex items-center justify-center">
      <svg class="w-44 h-44 -rotate-180" viewBox="0 0 100 100">
        <!-- Background Track -->
        <path
          d="M 10,50 A 40,40 0 0,1 90,50"
          fill="none"
          stroke="#E2E8F0"
          stroke-width="9"
          stroke-linecap="round"
        />
        <!-- Filled Progress Arc -->
        <path
          d="M 10,50 A 40,40 0 0,1 90,50"
          fill="none"
          :stroke="gaugeColor"
          stroke-width="9"
          stroke-linecap="round"
          :stroke-dasharray="strokeDasharray"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-1000 ease-out"
        />
      </svg>
      <!-- Center Score Label -->
      <div class="absolute bottom-1 text-center flex flex-col items-center">
        <span class="text-3xl font-extrabold tracking-tight text-rail-900 leading-none">
          {{ value }}<span class="text-[0.6em] font-bold opacity-60">/100</span>
        </span>
        <span class="text-xs font-semibold uppercase tracking-wider mt-1" :style="{ color: gaugeColor }">
          {{ statusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 96
  },
  label: {
    type: String,
    default: 'Reliability'
  }
})

// Semi-circle perimeter for r=40 is PI * 40 ≈ 125.66
const radius = 40
const circumference = Math.PI * radius // ~125.66

const strokeDasharray = computed(() => `${circumference}`)
const strokeDashoffset = computed(() => {
  const progress = Math.min(Math.max(props.value, 0), 100) / 100
  return circumference * (1 - progress)
})

const gaugeColor = computed(() => {
  if (props.value >= 90) return '#16A34A' // Success Green
  if (props.value >= 75) return '#2563EB' // Primary Blue
  if (props.value >= 50) return '#F59E0B' // Warning Amber
  return '#EF4444' // Danger Red
})

const statusText = computed(() => {
  if (props.value >= 90) return 'Low Risk'
  if (props.value >= 75) return 'Moderate'
  return 'High Alert'
})
</script>
