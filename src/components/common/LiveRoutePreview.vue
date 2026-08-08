<template>
  <button
    type="button"
    @click="$emit('open')"
    class="relative w-full h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group cursor-pointer text-left"
    title="Open the full live radar"
  >
    <!-- Dot grid, matching the full radar so the two read as the same map. -->
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

    <svg class="w-full h-full relative z-10" viewBox="0 0 400 144" fill="none">
      <defs>
        <linearGradient id="previewTrack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="55%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
        <radialGradient id="previewHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Track, drawn twice: a dark bed and a lit line on top. -->
      <path :d="trackPath" stroke="#1e293b" stroke-width="7" fill="none" stroke-linecap="round" />
      <path :d="trackPath" stroke="url(#previewTrack)" stroke-width="3" fill="none" stroke-linecap="round" />

      <!-- Origin and destination -->
      <circle :cx="START.x" :cy="START.y" r="5" fill="#10b981" stroke="#059669" stroke-width="2" />
      <circle :cx="END.x" :cy="END.y" r="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />

      <text :x="START.x - 4" :y="START.y + 20" fill="#94a3b8" font-size="10" font-weight="800">{{ fromCode }}</text>
      <text :x="END.x - 18" :y="END.y - 12" fill="#94a3b8" font-size="10" font-weight="800">{{ toCode }}</text>

      <!-- The train, placed along the curve by journey progress. -->
      <g :transform="`translate(${marker.x}, ${marker.y})`">
        <circle cx="0" cy="0" r="18" fill="url(#previewHalo)" class="animate-pulse" />
        <circle cx="0" cy="0" r="10" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5" class="animate-ping" />
        <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
      </g>
    </svg>

    <!-- Stage label and the affordance that this opens the full map. -->
    <div class="absolute inset-x-0 bottom-0 px-3.5 py-2.5 flex items-center justify-between gap-3 bg-gradient-to-t from-slate-950 to-transparent">
      <span class="text-[11px] font-black text-white uppercase tracking-wider truncate">
        {{ stageLabel }}
      </span>
      <span class="text-[11px] font-extrabold text-sky-300 group-hover:text-sky-200 shrink-0 flex items-center gap-1">
        Track live
        <ChevronRight class="w-3 h-3" />
      </span>
    </div>
  </button>
</template>

<script setup>
/**
 * A small live route map for the dashboard.
 *
 * Why this is its own component rather than the radar reused:
 *   The full radar's SVG is wired into that view's animation state and station
 *   waypoint logic. Lifting it would couple the dashboard to internals it does
 *   not need. This is a purpose-built preview: same visual language, a fraction
 *   of the code, and it hands off to the real radar on click.
 */
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  // 0 to 100, how far along the route the train is.
  percent: { type: Number, default: 0 },
  fromCode: { type: String, default: '' },
  toCode: { type: String, default: '' },
  // Human label for where the journey currently stands.
  stageLabel: { type: String, default: '' }
})

defineEmits(['open'])

// Control points of the curve the train travels along.
const START = { x: 40, y: 104 }
const C1 = { x: 130, y: 60 }
const C2 = { x: 250, y: 110 }
const END = { x: 360, y: 40 }

const trackPath = `M ${START.x} ${START.y} C ${C1.x} ${C1.y} ${C2.x} ${C2.y} ${END.x} ${END.y}`

/**
 * Point on the cubic curve at a given fraction of the journey.
 *
 * Algorithm in plain English:
 *   Evaluate the standard cubic Bezier formula at t, which blends the four
 *   control points by weights that shift smoothly from the start point to the
 *   end point as t runs from zero to one. Doing the maths here rather than
 *   relying on CSS motion paths keeps the marker positioned identically in
 *   every browser.
 *
 * @param {Number} t - 0 to 1, fraction along the curve
 * @returns {{x: Number, y: Number}} the point in SVG coordinates
 */
function pointOnCurve(t) {
  const inverse = 1 - t
  const a = inverse ** 3
  const b = 3 * inverse ** 2 * t
  const c = 3 * inverse * t ** 2
  const d = t ** 3

  return {
    x: a * START.x + b * C1.x + c * C2.x + d * END.x,
    y: a * START.y + b * C1.y + c * C2.y + d * END.y
  }
}

const marker = computed(() => pointOnCurve(Math.max(0, Math.min(100, props.percent)) / 100))
</script>
