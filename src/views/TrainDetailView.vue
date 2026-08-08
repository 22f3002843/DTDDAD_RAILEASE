<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <Navbar @openLogin="showAuthModal = true" />

    <div v-if="!train" class="flex-1 flex items-center justify-center p-8">
      <div class="text-center space-y-3">
        <p class="text-slate-600 font-bold">We couldn't find that train.</p>
        <button
          @click="router.push('/search')"
          class="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-extrabold cursor-pointer"
        >
          Back to search
        </button>
      </div>
    </div>

    <div v-else class="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- Back link -->
      <button
        @click="router.back()"
        class="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to results</span>
      </button>

      <!-- ============ LAYER 1: THE VERDICT ============
           One conclusion, readable at a glance. A traveller who reads only this
           block must still get full value; the layers below are optional depth. -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
          {{ train.name }}
          <span class="text-slate-400 font-bold">({{ train.number }})</span>
        </h1>
        <p class="text-xs font-bold text-slate-500 uppercase mt-1">
          {{ train.fromName }} {{ train.deptTime }} &rarr; {{ train.toName }} {{ train.arrTime }}
        </p>

        <div class="flex items-center gap-5 mt-6">
          <div :class="['w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2', scoreBoxClass]">
            <span class="text-3xl font-black leading-none">{{ confidence }}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider opacity-70 mt-1">out of 100</span>
          </div>

          <div class="min-w-0">
            <p class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {{ verdict.phrase }}
            </p>
            <p class="text-xs sm:text-sm text-slate-600 font-semibold mt-1.5 leading-relaxed">
              {{ reason }}
            </p>
            <p class="text-[11px] text-slate-400 font-bold mt-2">
              Based on {{ historyDays }} days of running history on this route.
            </p>
          </div>
        </div>
      </div>

      <!-- ============ LAYER 2: WHAT COULD GO WRONG ============
           Named in the words a passenger would use, not "predictive analytics".
           Cards that do not apply are absent, so the length of this list is
           itself the message: two cards means two things to think about. -->
      <div v-if="riskCards.length" class="space-y-3">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="text-base sm:text-lg font-black text-slate-900">What could go wrong</h2>
          <span class="text-[11px] font-bold text-slate-400">
            {{ riskCards.length }} thing{{ riskCards.length === 1 ? '' : 's' }} to know
          </span>
        </div>

        <RiskCard
          v-for="card in riskCards"
          :key="card.id"
          :card="card"
          @action="handleCardAction"
        />
      </div>

      <!-- ============ LAYER 3: THE EVIDENCE ============
           Collapsed by default. No task in this app ever requires opening it. -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          @click="showEvidence = !showEvidence"
          class="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span class="text-sm font-extrabold text-slate-900">
            See the full {{ historyDays }}-day record
          </span>
          <ChevronDown :class="['w-4 h-4 text-slate-500 transition-transform', showEvidence ? 'rotate-180' : '']" />
        </button>

        <div v-if="showEvidence" class="border-t border-slate-200">
          <!-- Summary figures first, so the table is interpretable before it is read. -->
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 border-b border-slate-200">
            <div v-for="figure in summaryFigures" :key="figure.label" class="p-4 text-center">
              <div class="text-lg font-black text-slate-900">{{ figure.value }}</div>
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {{ figure.label }}
              </div>
            </div>
          </div>

          <!-- Simple bar chart. Height encodes delay; colour encodes severity. -->
          <div class="p-5">
            <div class="flex items-end gap-[3px] h-24">
              <div
                v-for="(entry, index) in history"
                :key="index"
                :class="['flex-1 rounded-t-sm', barClass(entry)]"
                :style="{ height: barHeight(entry) }"
                :title="`${entry.day}: ${entry.cancelled ? 'Cancelled' : entry.delayMinutes + ' min late'}`"
              ></div>
            </div>
            <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-2">
              <span>{{ historyDays }} days ago</span>
              <span>Most recent</span>
            </div>
          </div>

          <!-- Honest limits, stated plainly rather than buried. -->
          <p class="px-5 pb-5 text-[11px] text-slate-500 font-medium leading-relaxed">
            Predictions are estimates based on past performance. Actual running depends on
            live conditions on the day.
          </p>
        </div>
      </div>

      <!-- ============ ACTIONS ============
           Two only. Watch is ours and is placed first; booking is the handoff. -->
      <div class="sticky bottom-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          @click="handleWatchToggle"
          :class="[
            'py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border',
            isWatched
              ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
          ]"
        >
          <Eye class="w-4 h-4" />
          <span>{{ isWatched ? 'Watching this train' : 'Watch this train' }}</span>
        </button>

        <a
          href="https://www.irctc.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          class="py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <span>Book on IRCTC</span>
          <ExternalLink class="w-4 h-4 opacity-70" />
        </a>
      </div>

      <p class="text-center text-[11px] text-slate-500 font-semibold pb-4">
        We don't sell tickets. Booking happens on IRCTC.
      </p>
    </div>

    <Footer />
    <AuthWidget v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { useWatchStore } from '@/stores/useWatchStore'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/footer/Footer.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import RiskCard from '@/components/common/RiskCard.vue'
import { generateRiskCards } from '@/services/predictions'
import { computeBaseConfidence, getVerdict, analyseHistory } from '@/services/scoring'
import { getReliabilityReason } from '@/services/reliability'
import { getHistory } from '@/services/history'
import { ArrowLeft, ChevronDown, Eye, ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()
const watchStore = useWatchStore()

const showAuthModal = ref(false)
const showEvidence = ref(false)

// Resolved from the current result set so the detail page always reflects the
// same route and date the traveller was just looking at.
const train = computed(() =>
  searchStore.filteredTrains.find((candidate) => candidate.number === route.params.number) || null
)

const confidence = computed(() => (train.value ? computeBaseConfidence(train.value) : 0))
const verdict = computed(() => getVerdict(confidence.value))
const reason = computed(() => (train.value ? getReliabilityReason(train.value) : ''))
const history = computed(() => (train.value ? getHistory(train.value) : []))
const historyDays = computed(() => history.value.length)
const stats = computed(() => (train.value ? analyseHistory(train.value) : null))

const isWatched = computed(() => watchStore.isWatched(train.value))

// The high-stakes journey type the traveller selected on the dashboard, if any.
// This is what makes those buttons change the advice rather than just highlight.
const highStakesType = computed(() => journeyStore.selectedStakesType || null)

const cheapestPrice = computed(() => {
  const prices = searchStore.filteredTrains.map((candidate) => candidate.price).filter(Boolean)
  return prices.length ? Math.min(...prices) : 0
})

const riskCards = computed(() =>
  train.value
    ? generateRiskCards(train.value, {
        highStakesType: highStakesType.value,
        cheapestPrice: cheapestPrice.value
      })
    : []
)

const summaryFigures = computed(() => {
  if (!stats.value) return []
  return [
    { label: 'On time', value: `${stats.value.onTimeDays}/${stats.value.totalDays}` },
    { label: 'Typical delay', value: `${stats.value.medianDelay}m` },
    { label: 'Bad day', value: `${stats.value.p90Delay}m` },
    { label: 'Worst', value: `${stats.value.worstDelay}m` }
  ]
})

const scoreBoxClass = computed(() => {
  if (verdict.value.level === 'green') return 'bg-emerald-50 border-emerald-300 text-emerald-700'
  if (verdict.value.level === 'amber') return 'bg-amber-50 border-amber-300 text-amber-700'
  return 'bg-red-50 border-red-300 text-red-700'
})

/**
 * Height of one bar in the evidence chart.
 *
 * Algorithm in plain English:
 *   Express the day's delay as a share of a three-hour ceiling, then give it a
 *   small floor so an on-time day still draws a visible baseline mark rather
 *   than vanishing, which would make the chart look like missing data.
 *
 * @param {Object} entry - one history day
 * @returns {String} a CSS height percentage
 */
function barHeight(entry) {
  const share = Math.min(1, (entry.delayMinutes || 0) / 180)
  return `${Math.max(6, share * 100)}%`
}

/**
 * Colour of one bar, matching the severity language used everywhere else.
 *
 * @param {Object} entry - one history day
 * @returns {String} Tailwind classes
 */
function barClass(entry) {
  if (entry.cancelled) return 'bg-slate-400'
  const minutes = entry.delayMinutes || 0
  if (minutes === 0) return 'bg-emerald-400'
  if (minutes <= 30) return 'bg-amber-300'
  if (minutes <= 90) return 'bg-amber-500'
  return 'bg-red-500'
}

/**
 * Handle the single action a risk card may carry.
 *
 * @param {Object} action - { label, type }
 * @returns {void}
 */
function handleCardAction(action) {
  if (action.type === 'watch') handleWatchToggle()
}

/**
 * Add or remove this train from the watchlist.
 *
 * No sign-in is requested here on purpose: the traveller has to feel the benefit
 * before an account is ever mentioned.
 *
 * @returns {void}
 */
function handleWatchToggle() {
  const nowWatching = watchStore.toggleWatch(train.value)
  console.log(
    '[RailEase Watch]',
    nowWatching ? 'Now watching' : 'Stopped watching',
    train.value?.number
  )
}
</script>
