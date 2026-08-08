<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      <!-- Every block below is something happening to THIS passenger, and every
           block has something to do about it. Anything that was only a link to a
           page already in the sidebar has been removed rather than restyled: a
           dashboard shows state, the sidebar handles navigation. -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Your travel</h1>
        <p class="text-sm text-slate-600 font-medium mt-1">
          {{ headerLine }}
        </p>
      </div>

      <!-- ============ NEXT TRIP ============
           The reason a passenger opens the app. Shows live running state, not a
           historical reliability score: once the ticket is booked the question
           has changed from "should I take this train" to "is it late right now". -->
      <div v-if="activeTrip" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-slate-900 text-white px-5 py-2.5 flex items-center justify-between gap-3">
          <span class="text-[11px] font-black uppercase tracking-wider">Your next trip</span>
          <span class="text-[11px] font-bold text-slate-300">PNR {{ activeTrip.pnr }}</span>
        </div>

        <div class="p-5 sm:p-6 space-y-5">
          <div>
            <h2 class="text-lg font-black text-slate-900 uppercase">
              {{ activeTrip.trainName }}
              <span class="text-slate-400">({{ activeTrip.trainNumber }})</span>
            </h2>
            <p class="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {{ activeTrip.from }} &rarr; {{ activeTrip.to }} &middot; {{ activeTrip.date }}
            </p>
          </div>

          <!-- Live state, in the largest type on the page. -->
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div class="flex items-center gap-2.5">
              <span :class="['w-3 h-3 rounded-full shrink-0', liveStatusDotClass]"></span>
              <span :class="['text-xl font-black', liveStatusTextClass]">{{ liveStatusPhrase }}</span>
            </div>

            <div v-if="countdown" class="text-sm">
              <span class="text-slate-500 font-semibold">Departs</span>
              <strong class="text-slate-900 font-black ml-1.5">{{ countdown }}</strong>
            </div>

            <div v-if="realisticArrival" class="text-sm">
              <span class="text-slate-500 font-semibold">Realistic arrival</span>
              <strong class="text-slate-900 font-black ml-1.5">{{ realisticArrival }}</strong>
            </div>
          </div>

          <!-- The live map, at dashboard size. Clicking it opens the full radar
               rather than replacing it: the big map is a sustained-attention
               page and deserves its own room. -->
          <LiveRoutePreview
            v-if="progress"
            :percent="progress.percent"
            :from-code="routeCodes.from"
            :to-code="routeCodes.to"
            :stage-label="progress.currentLabel"
            @open="router.push('/live-status')"
          />

          <div v-if="progress" class="space-y-2">
            <div class="relative h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                class="absolute inset-y-0 left-0 rounded-full bg-slate-900 transition-all duration-500"
                :style="{ width: `${progress.percent}%` }"
              ></div>
              <span
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow"
                :style="{ left: `${progress.percent}%` }"
              ></span>
            </div>
            <div class="flex justify-between text-[11px] font-bold text-slate-500">
              <span>{{ progress.fromLabel }}</span>
              <span class="text-slate-900">{{ progress.currentLabel }}</span>
              <span>{{ progress.toLabel }}</span>
            </div>
          </div>

          <!-- Thirty days of running, small enough to sit inline. Gives the
               card shape without sending anyone to another page. -->
          <div v-if="sparkline.length" class="space-y-1.5">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              How this train ran over 30 days
            </p>
            <div class="flex items-end gap-[2px] h-8">
              <div
                v-for="(bar, index) in sparkline"
                :key="index"
                :class="['flex-1 rounded-sm min-h-[2px]', bar.class]"
                :style="{ height: bar.height }"
                :title="bar.title"
              ></div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <button
              @click="router.push('/live-status')"
              class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer transition-colors"
            >
              Track live
            </button>
            <button
              v-if="matchedTrain"
              @click="router.push(`/train/${activeTrip.trainNumber}`)"
              class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-extrabold cursor-pointer transition-colors"
            >
              What could go wrong?
            </button>
            <button
              @click="router.push('/journey-planner')"
              class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-extrabold cursor-pointer transition-colors"
            >
              I missed my train
            </button>
          </div>
        </div>
      </div>

      <!-- ============ NEEDS YOUR ATTENTION ============
           Absent when nothing is wrong. The presence of this block is itself the
           signal, which is only true if it never appears for reassurance. -->
      <div v-if="attentionCards.length" class="space-y-3">
        <h2 class="text-base font-black text-slate-900">Needs your attention</h2>
        <RiskCard v-for="card in attentionCards" :key="card.id" :card="card" />
      </div>

      <!-- ============ WATCHING ============ -->
      <div v-if="watchStore.watchCount" class="space-y-3">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="text-base font-black text-slate-900">Watching</h2>
          <button
            @click="router.push('/watching')"
            class="text-xs font-extrabold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            See all &rsaquo;
          </button>
        </div>

        <div
          v-for="entry in watchStore.watchedNewestFirst.slice(0, 3)"
          :key="entry.id"
          class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-slate-900 uppercase truncate">
              {{ entry.name }} <span class="text-slate-400">({{ entry.number }})</span>
            </p>
            <p class="text-xs text-slate-600 font-semibold mt-0.5">
              {{ entry.fromCode }} {{ entry.deptTime }} &rarr; {{ entry.toCode }}
            </p>
          </div>
          <ReliabilityBadge
            v-if="resolveWatched(entry)"
            :train="resolveWatched(entry)"
            :show-reason="false"
          />
        </div>
      </div>

      <!-- ============ EARLIER TRIPS ============
           Kept despite looking like history, because this is where the refund
           window lives: a trip that ran badly last week is exactly when someone
           wants to be told they can still claim. -->
      <div v-if="earlierTrips.length" class="space-y-3">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="text-base font-black text-slate-900">Your other trips</h2>
          <span class="text-xs font-bold text-slate-400">{{ earlierTrips.length }} synced</span>
        </div>
        <div
          v-for="trip in earlierTrips"
          :key="trip.id"
          class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-slate-900 uppercase truncate">
              {{ trip.trainName }} <span class="text-slate-400">({{ trip.trainNumber }})</span>
            </p>
            <p class="text-xs text-slate-600 font-semibold mt-0.5">
              {{ trip.from }} &rarr; {{ trip.to }} &middot; {{ trip.date }}
            </p>
          </div>
          <span class="text-xs font-extrabold text-slate-600">{{ trip.status }}</span>
        </div>
      </div>

      <!-- ============ EMPTY STATE ============
           A passenger with no trips should be helped to start one, not shown a
           control panel with nothing in it. -->
      <div
        v-if="!activeTrip && !watchStore.watchCount && !earlierTrips.length"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4"
      >
        <Compass class="w-10 h-10 text-slate-300 mx-auto" />
        <div class="space-y-1.5">
          <p class="text-base font-extrabold text-slate-900">No trips yet</p>
          <p class="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Check how reliably a train actually runs before you book it, or sync a journey
            you have already booked using its PNR.
          </p>
        </div>
        <div class="flex flex-wrap gap-2.5 justify-center">
          <button
            @click="router.push('/search')"
            class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold cursor-pointer transition-colors"
          >
            Check a train
          </button>
          <button
            @click="router.push('/train-intelligence')"
            class="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-extrabold cursor-pointer transition-colors"
          >
            Sync by PNR
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { useWatchStore } from '@/stores/useWatchStore'
import RiskCard from '@/components/common/RiskCard.vue'
import ReliabilityBadge from '@/components/common/ReliabilityBadge.vue'
import LiveRoutePreview from '@/components/common/LiveRoutePreview.vue'
import { generateRiskCards } from '@/services/predictions'
import { getRealisticArrival } from '@/services/reliability'
import { getHistory } from '@/services/history'
import { minutesUntilDeparture, describeWait } from '@/services/recovery'
import { Compass } from 'lucide-vue-next'

const router = useRouter()
const journeyStore = useJourneyStore()
const searchStore = useSearchStore()
const watchStore = useWatchStore()

const activeTrip = computed(() => journeyStore.activeTrip)

// The full train record behind the synced trip, needed for anything derived.
const matchedTrain = computed(() =>
  searchStore.filteredTrains.find((train) => train.number === activeTrip.value?.trainNumber) || null
)

const headerLine = computed(() => {
  if (!activeTrip.value) return 'Trips you are taking, and trains you are keeping an eye on.'
  if (attentionCards.value.length) return 'Something on your trip needs a decision.'
  return 'Everything on your trip looks fine right now.'
})

// Station codes pulled out of the trip's "New Delhi (NDLS)" style strings so
// the map can label its endpoints without another data source.
const routeCodes = computed(() => {
  const extract = (text) => (/\(([A-Z]+)\)/.exec(text || '') || [])[1] || ''
  return {
    from: extract(activeTrip.value?.from),
    to: extract(activeTrip.value?.to)
  }
})

const liveStatusPhrase = computed(() => activeTrip.value?.status || 'Status unavailable')

const liveStatusDotClass = computed(() => {
  const type = activeTrip.value?.statusType
  if (type === 'success') return 'bg-emerald-500'
  if (type === 'warning') return 'bg-amber-500'
  if (type === 'danger') return 'bg-red-500 animate-pulse'
  return 'bg-slate-400'
})

const liveStatusTextClass = computed(() => {
  const type = activeTrip.value?.statusType
  if (type === 'success') return 'text-emerald-700'
  if (type === 'warning') return 'text-amber-700'
  if (type === 'danger') return 'text-red-700'
  return 'text-slate-700'
})

const realisticArrival = computed(() =>
  matchedTrain.value ? getRealisticArrival(matchedTrain.value) : null
)

// Minutes since midnight, used for the departure countdown.
const nowMinutes = computed(() => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
})

const countdown = computed(() => {
  if (!matchedTrain.value) return null
  const wait = minutesUntilDeparture(matchedTrain.value, nowMinutes.value)
  return describeWait(wait, nowMinutes.value)
})

/**
 * How far along the route the train currently is.
 *
 * Algorithm in plain English:
 *   The synced trip carries a timeline of stages and an index of the stage it
 *   has reached. Turn that into a percentage along the bar, and pull out the
 *   first, current and last stage labels so the bar can be read without a key.
 *   Returns nothing when the trip has no timeline, so the bar is simply absent
 *   rather than showing a meaningless zero.
 *
 * @returns {{percent: Number, fromLabel: String, currentLabel: String, toLabel: String}|null}
 */
const progress = computed(() => {
  const timeline = activeTrip.value?.timeline
  if (!Array.isArray(timeline) || timeline.length < 2) return null

  const index = Math.min(activeTrip.value.currentStepIndex ?? 0, timeline.length - 1)
  const percent = Math.round((index / (timeline.length - 1)) * 100)

  return {
    percent,
    fromLabel: timeline[0].label,
    currentLabel: timeline[index].label,
    toLabel: timeline[timeline.length - 1].label
  }
})

/**
 * Thirty days of delays reduced to a row of small bars.
 *
 * Algorithm in plain English:
 *   Take the running history, scale each day's delay against the worst day so
 *   the shape is visible whatever the train's range, and colour each bar by how
 *   bad that day was. On-time days keep a small floor height so they read as a
 *   baseline rather than as missing data.
 *
 * @returns {Array<{height: String, class: String, title: String}>}
 */
const sparkline = computed(() => {
  if (!matchedTrain.value) return []
  const history = getHistory(matchedTrain.value)
  if (!history.length) return []

  const worst = Math.max(30, ...history.map((entry) => entry.delayMinutes || 0))

  return history.map((entry) => {
    const minutes = entry.delayMinutes || 0
    const share = Math.min(1, minutes / worst)
    const tone =
      minutes === 0 ? 'bg-emerald-400'
        : minutes <= 30 ? 'bg-amber-300'
          : minutes <= 90 ? 'bg-amber-500'
            : 'bg-red-500'

    return {
      height: `${Math.max(12, share * 100)}%`,
      class: tone,
      title: `${entry.day}: ${minutes === 0 ? 'on time' : minutes + ' min late'}`
    }
  })
})

/**
 * Only the risks worth interrupting someone about.
 *
 * Algorithm in plain English:
 *   Generate the full risk set for the trip they are actually taking, then keep
 *   only the most serious ones. The dashboard is not the place to read every
 *   caveat; that is what the train detail page is for. Filtering to high
 *   severity keeps this section honest, because a block titled "needs your
 *   attention" that is always populated stops meaning anything.
 *
 * @returns {Array<Object>} high-severity risk cards, at most two
 */
const attentionCards = computed(() => {
  if (!matchedTrain.value) return []
  return generateRiskCards(matchedTrain.value, {
    highStakesType: journeyStore.selectedStakesType,
    cheapestPrice: 0
  })
    .filter((card) => card.severity === 'high')
    .slice(0, 2)
})

// Synced trips other than the active one, treated as history.
const earlierTrips = computed(() =>
  (journeyStore.upcomingTrips || [])
    .filter((trip) => trip.trainNumber !== activeTrip.value?.trainNumber)
    .slice(0, 3)
)

/**
 * Find the full train record behind a watchlist entry.
 *
 * @param {Object} entry - saved watchlist entry
 * @returns {Object|null} the matching train from the current results
 */
function resolveWatched(entry) {
  return searchStore.filteredTrains.find((train) => train.number === entry.number) || null
}
</script>
