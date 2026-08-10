<template>
  <div
    ref="gaugeElementRef"
    class="inline-flex flex-col items-center justify-center font-sans select-none"
    :class="containerSizeClasses"
  >
    <!-- SVG Gauge Arc & Dynamic Animated Needle -->
    <div class="relative flex items-center justify-center" :style="{ width: `${width}px`, height: `${height}px` }">
      <svg
        :width="width"
        :height="height"
        viewBox="0 0 120 65"
        class="overflow-visible"
      >
        <defs>
          <!-- Segment Gradients -->
          <linearGradient id="gaugeRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#EF4444" />
            <stop offset="100%" stop-color="#F97316" />
          </linearGradient>
          <linearGradient id="gaugeOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F97316" />
            <stop offset="100%" stop-color="#FBBF24" />
          </linearGradient>
          <linearGradient id="gaugeYellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FBBF24" />
            <stop offset="100%" stop-color="#84CC16" />
          </linearGradient>
          <linearGradient id="gaugeLightGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#84CC16" />
            <stop offset="100%" stop-color="#10B981" />
          </linearGradient>
          <linearGradient id="gaugeGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>

          <!-- Drop Shadow for Needle -->
          <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#0F172A" flood-opacity="0.3" />
          </filter>
        </defs>

        <!-- Segment 1: Red (0 - 20) -->
        <path
          d="M 12 55 A 48 48 0 0 1 24.3 27.5"
          fill="none"
          stroke="url(#gaugeRed)"
          stroke-width="10"
          stroke-linecap="round"
        />
        <!-- Segment 2: Orange (20 - 40) -->
        <path
          d="M 27.5 24.3 A 48 48 0 0 1 47.6 12.8"
          fill="none"
          stroke="url(#gaugeOrange)"
          stroke-width="10"
        />
        <!-- Segment 3: Yellow (40 - 60) -->
        <path
          d="M 52.4 12.2 A 48 48 0 0 1 67.6 12.2"
          fill="none"
          stroke="url(#gaugeYellow)"
          stroke-width="10"
        />
        <!-- Segment 4: Light Green (60 - 80) -->
        <path
          d="M 72.4 12.8 A 48 48 0 0 1 92.5 24.3"
          fill="none"
          stroke="url(#gaugeLightGreen)"
          stroke-width="10"
        />
        <!-- Segment 5: Deep Emerald (80 - 100) -->
        <path
          d="M 95.7 27.5 A 48 48 0 0 1 108 55"
          fill="none"
          stroke="url(#gaugeGreen)"
          stroke-width="10"
          stroke-linecap="round"
        />

        <!-- Needle Pivot Base Ring -->
        <circle cx="60" cy="55" r="7" fill="#0F172A" />
        <circle cx="60" cy="55" r="3" fill="#FFFFFF" />

        <!-- Dynamic Animated Rotating Needle (Sweeps on Scroll into View) -->
        <g
          class="transition-transform duration-[1300ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-[60px_55px]"
          :style="{ transform: `rotate(${currentRotationDegree}deg)` }"
          filter="url(#needleShadow)"
        >
          <!-- Needle Shaft -->
          <polygon points="57.5,55 60,14 62.5,55" fill="#0F172A" />
          <circle cx="60" cy="55" r="4.5" fill="#1E293B" />
          <circle cx="60" cy="55" r="2" fill="#38BDF8" />
        </g>
      </svg>
    </div>

    <!-- Score & Dynamic Label readout below -->
    <div v-if="showLabels" class="mt-1 text-center space-y-0.5">
      <div class="flex items-center justify-center gap-1">
        <span class="text-base sm:text-lg font-black tracking-tight" :class="statusColorClass">
          {{ normalizedScore }}<span class="text-xs text-slate-400 font-bold">/100</span>
        </span>
      </div>
      <span
        :class="['px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black border shadow-2xs inline-block uppercase tracking-wider transition-all duration-500', isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90', badgeClass]"
      >
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    default: 85
  },
  width: {
    type: Number,
    default: 110
  },
  height: {
    type: Number,
    default: 60
  },
  showLabels: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium' // 'small', 'medium', 'large'
  }
})

const isAnimated = ref(false)
const gaugeElementRef = ref(null)
let observer = null

const normalizedScore = computed(() => {
  const val = Math.round(props.score)
  return Math.min(Math.max(val, 0), 100)
})

// Target angle for the score (map 0-100 to -90deg to +90deg)
const targetDegree = computed(() => {
  return -90 + (normalizedScore.value / 100) * 180
})

// Current needle rotation degree (starts at -90deg then sweeps to targetDegree when scrolled into view)
const currentRotationDegree = computed(() => {
  if (!isAnimated.value) return -90
  return targetDegree.value
})

const statusText = computed(() => {
  const s = normalizedScore.value
  if (s >= 88) return 'Very Likely On-Time'
  if (s >= 75) return 'Likely On-Time'
  if (s >= 60) return 'Sometimes Delayed'
  if (s >= 40) return 'Moderate Delay Risk'
  return 'Often Delayed'
})

const statusColorClass = computed(() => {
  const s = normalizedScore.value
  if (s >= 88) return 'text-emerald-600'
  if (s >= 75) return 'text-lime-600'
  if (s >= 60) return 'text-amber-600'
  if (s >= 40) return 'text-orange-600'
  return 'text-red-600'
})

const badgeClass = computed(() => {
  const s = normalizedScore.value
  if (s >= 88) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s >= 75) return 'bg-lime-50 text-lime-700 border-lime-200'
  if (s >= 60) return 'bg-amber-50 text-amber-700 border-amber-200'
  if (s >= 40) return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-red-50 text-red-700 border-red-200'
})

const containerSizeClasses = computed(() => {
  switch (props.size) {
    case 'small': return 'scale-90'
    case 'large': return 'scale-110'
    default: return ''
  }
})

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && gaugeElementRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger smooth needle sweep animation to actual pointer degree
            setTimeout(() => {
              isAnimated.value = true
            }, 80)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(gaugeElementRef.value)
  } else {
    setTimeout(() => {
      isAnimated.value = true
    }, 150)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
