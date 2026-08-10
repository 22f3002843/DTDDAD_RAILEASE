<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
    <div class="flex flex-wrap items-baseline justify-between gap-3 mb-6">
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Route</p>
        <p class="text-sm font-extrabold text-slate-900 mt-0.5">
          {{ waypoints[0]?.name }} &rarr; {{ waypoints[waypoints.length - 1]?.name }}
        </p>
      </div>
      <div v-if="totalDistance" class="text-right">
        <p class="text-sm font-black text-slate-900">{{ coveredDistance }} / {{ totalDistance }} km</p>
        <p class="text-[11px] font-bold text-slate-500">{{ remainingDistance }} km to go</p>
      </div>
    </div>

    <!-- A railway strip diagram rather than a decorative curve: a straight line
         with sleeper ticks, named stations at their real distances, and the
         train where it actually is. This is how route boards are drawn because
         it is the shape that carries information; a wandering line looks like a
         map but tells you nothing about where you are. -->
    <div class="relative pb-14 pt-10">
      <!-- Track bed with sleeper ties -->
      <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[10px] rounded-full bg-slate-200 overflow-hidden">
        <div class="h-full w-full flex items-center justify-between px-1">
          <span
            v-for="tie in 60"
            :key="tie"
            class="w-[2px] h-full bg-white/70"
          ></span>
        </div>
      </div>

      <!-- Distance already covered -->
      <div
        class="absolute left-0 top-1/2 -translate-y-1/2 h-[10px] rounded-full bg-slate-900 transition-all duration-700"
        :style="{ width: `${progress * 100}%` }"
      ></div>

      <!-- Stations, positioned by real distance so the spacing means something -->
      <div
        v-for="(stop, index) in waypoints"
        :key="stop.code"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        :style="{ left: `${positionOf(stop, index) * 100}%` }"
      >
        <span
          :class="[
            'block rounded-full border-2 bg-white transition-colors',
            stop.isMajor ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5',
            stop.status === 'passed' ? 'border-slate-900'
              : stop.status === 'approaching' ? 'border-amber-500' : 'border-slate-300'
          ]"
        ></span>

        <!-- Labels alternate above and below so long station names do not collide -->
        <div
          :class="[
            'absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center',
            index % 2 === 0 ? 'top-5' : 'bottom-5'
          ]"
        >
          <p :class="['text-[10px] font-black leading-none', stop.status === 'approaching' ? 'text-amber-600' : 'text-slate-700']">
            {{ stop.code }}
          </p>
          <p v-if="stop.arrTime" class="text-[9px] font-bold text-slate-400 leading-none mt-1">
            {{ stop.arrTime }}
          </p>
        </div>
      </div>

      <!-- The train itself -->
      <div
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
        :style="{ left: `${progress * 100}%` }"
      >
        <span class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-emerald-400/25 animate-ping"></span>
          <span class="relative w-7 h-7 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg">
            <TrainFront class="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </span>
      </div>
    </div>

    <div v-if="nextStop" class="mt-2 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs font-semibold text-slate-600">
        Next stop
        <strong class="text-slate-900 font-black ml-1">{{ nextStop.name }}</strong>
        <span v-if="nextStop.arrTime" class="text-slate-500"> &middot; {{ nextStop.arrTime }}</span>
        <span v-if="nextStop.halt && nextStop.halt !== 'Destination'" class="text-slate-400"> &middot; halt {{ nextStop.halt }}</span>
      </p>
      <button
        type="button"
        @click="$emit('open')"
        class="text-xs font-extrabold text-slate-700 hover:text-slate-900 cursor-pointer flex items-center gap-1"
      >
        Full live map
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrainFront, ChevronRight } from 'lucide-vue-next'
import { getRouteProgress } from '@/services/routes'

const props = defineProps({
  // Waypoints from services/routes.js
  waypoints: { type: Array, required: true }
})

defineEmits(['open'])

const progress = computed(() => getRouteProgress(props.waypoints))

const totalDistance = computed(() => props.waypoints[props.waypoints.length - 1]?.dist || 0)
const coveredDistance = computed(() => Math.round(totalDistance.value * progress.value))
const remainingDistance = computed(() => totalDistance.value - coveredDistance.value)

const nextStop = computed(
  () => props.waypoints.find((stop) => stop.status === 'approaching')
    || props.waypoints.find((stop) => stop.status === 'upcoming')
    || null
)

/**
 * Where a station sits along the strip, as a fraction of the width.
 *
 * Algorithm in plain English:
 *   Use real distance from the origin where the route data carries it, so the
 *   gaps between stations reflect the actual journey rather than being evenly
 *   spaced. Fall back to even spacing only when no distances exist, and inset
 *   the whole strip slightly so the first and last markers are not clipped.
 *
 * @param {Object} stop - one waypoint
 * @param {Number} index - its position in the list
 * @returns {Number} 0 to 1 along the strip
 */
function positionOf(stop, index) {
  const inset = 0.02
  const span = 1 - inset * 2

  if (totalDistance.value > 0) {
    return inset + (stop.dist / totalDistance.value) * span
  }
  return inset + (index / Math.max(1, props.waypoints.length - 1)) * span
}
</script>
