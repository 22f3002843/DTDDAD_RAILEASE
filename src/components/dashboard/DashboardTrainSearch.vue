<template>
  <div class="space-y-5 font-sans">
    <!-- UNIFIED HERO CARD: LIGHT MODE TRAIN INTELLIGENCE & SYNC -->
    <div class="bg-white text-slate-900 rounded-card shadow-sm p-6 space-y-5 border border-slate-200">
      <!-- Top Row: Active Trip Indicator & Quick PNR Sync -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rail-50 border border-rail-200 flex items-center justify-center shrink-0">
            <Train class="w-5 h-5 text-rail-600" />
          </div>
          <div>
            <h2 class="text-base font-black uppercase tracking-wider text-slate-900">Train Intelligence &amp; Sync</h2>
            <p class="text-xs text-slate-500 font-medium">
              Select any train below or enter your 10-digit IRCTC PNR to lock live safeguards.
            </p>
          </div>
        </div>

        <!-- Right Side: Subtle Active Journey Pill + Compact PNR Sync -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Subtle Synced Journey Pill Tag -->
          <div v-if="journeyStore.activeTrip" class="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Synced: <strong class="text-emerald-950 font-bold">{{ journeyStore.activeTrip.trainName }} ({{ journeyStore.activeTrip.trainNumber }})</strong></span>
          </div>

          <!-- Compact PNR Search Bar -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="pnrSearchInput"
                type="text"
                placeholder="Enter 10-digit PNR"
                class="w-48 pl-8 pr-3 py-1.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-rail-600"
                @keyup.enter="handlePnrSync"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              @click="handlePnrSync"
              class="px-3.5 py-1.5 bg-rail-600 hover:bg-rail-700 text-white rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Station & Date Search Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <!-- From Station -->
        <div class="lg:col-span-3">
          <label class="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">From</label>
          <CustomSelect
            v-model="fromCode"
            :options="stationOptions"
            size="small"
            rounded="medium"
            fillMode="solid"
            :icon="MapPin"
          />
        </div>

        <!-- Swap Button -->
        <div class="lg:col-span-1 flex justify-center pt-3 lg:pt-4">
          <button
            type="button"
            @click="searchStore.swapStations()"
            class="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-2xs cursor-pointer hover:scale-105 transition-transform"
            title="Swap Stations"
          >
            <ArrowLeftRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- To Station -->
        <div class="lg:col-span-3">
          <label class="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">To</label>
          <CustomSelect
            v-model="toCode"
            :options="stationOptions"
            size="small"
            rounded="medium"
            fillMode="solid"
            :icon="MapPin"
          />
        </div>

        <!-- Travel Date -->
        <div class="lg:col-span-2">
          <label class="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">Travel Date</label>
          <ModernDatePicker v-model="searchStore.travelDate" />
        </div>

        <!-- Class & Quota Dropdowns -->
        <div class="lg:col-span-3">
          <label class="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">Class &amp; Quota</label>
          <div class="grid grid-cols-2 gap-2">
            <CustomSelect
              v-model="searchStore.selectedClass"
              :options="classOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
            <CustomSelect
              v-model="searchStore.selectedQuota"
              :options="quotaOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- CLEAN RESULTS BAR & MINIMALIST RELIABILITY LEGEND -->
    <div class="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
      <div>
        <span class="text-slate-900 font-black text-sm">{{ searchStore.filteredTrains.length }} Trains</span> for
        <span class="text-rail-700 font-extrabold uppercase px-1">{{ searchStore.fromStation?.code }} ➔ {{ searchStore.toStation?.code }}</span>
      </div>

      <div class="flex items-center gap-4 text-[11px]">
        <span class="flex items-center gap-1.5 text-emerald-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>70+ On time</span>
        </span>
        <span class="flex items-center gap-1.5 text-amber-700">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>55-69 Sometimes delayed</span>
        </span>
        <span class="flex items-center gap-1.5 text-red-700">
          <span class="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Under 55 Often delayed</span>
        </span>
      </div>
    </div>

    <!-- TRAIN RESULT CARDS (CLEAN & UNCLUTTERED) -->
    <div class="space-y-4">
      <div
        v-for="train in searchStore.filteredTrains"
        :key="train.id"
        :class="[
          'bg-white rounded-xl border transition-all overflow-hidden shadow-sm hover:shadow-md',
          isTrainSelectedAsActive(train) ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200'
        ]"
      >
        <!-- Card Header -->
        <div class="bg-slate-50/80 border-b border-slate-200/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span
              :class="['w-2.5 h-2.5 rounded-full shrink-0', getReliabilityDotClass(train)]"
            ></span>
            <h3 class="text-base font-black text-slate-900 uppercase">
              {{ train.name }} <span class="text-slate-500 font-bold">({{ train.number }})</span>
            </h3>

            <!-- Clean Reliability Badge -->
            <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border', getReliabilityBadgeClass(train)]">
              {{ getReliabilityLabel(train) }}
            </span>

            <!-- Layer 2: why the score is what it is, stated in plain English. -->
            <span class="text-[11px] text-slate-500 font-semibold">
              {{ getReliabilityReason(train) }}
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span>Runs: <strong class="text-slate-800">{{ train.runsOn.join(' ') }}</strong></span>
            
            <button
              @click="openTelemetryModal(train, 'trend')"
              class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp class="w-3.5 h-3.5 text-rail-600" />
              <span>30-Day Telemetry</span>
            </button>

            <!-- The same route into the risk breakdown that public search offers.
                 Without this a signed-in user had no way to reach the detail page. -->
            <button
              @click="router.push(`/train/${train.number}`)"
              class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>What could go wrong?</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Schedule & Timing Line -->
        <div class="p-5 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100">
          <div class="text-left">
            <div class="text-xl font-black text-slate-900">{{ train.deptTime }}</div>
            <div class="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {{ train.fromName }} ({{ train.fromCode }})
            </div>
          </div>

          <div class="flex flex-col items-center justify-center flex-1 max-w-xs">
            <div class="text-xs font-extrabold text-slate-500">{{ train.duration }}</div>
            <div class="w-full flex items-center gap-2 my-1">
              <span class="w-2 h-2 rounded-full bg-slate-400"></span>
              <div class="flex-1 h-0.5 bg-slate-200 relative"></div>
              <span class="w-2 h-2 rounded-full bg-slate-900"></span>
            </div>
            <div class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              Confidence: <strong :class="getReliabilityTextClass(train)">{{ confidenceOf(train) }}/100</strong>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xl font-black text-slate-900">{{ train.arrTime }}</div>
            <div class="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {{ train.toName }} ({{ train.toCode }})
            </div>
          </div>
        </div>

        <!-- Class Availability & Action Row -->
        <div class="p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Class Pills -->
          <div class="flex flex-wrap items-center gap-2">
            <div
              v-for="cls in train.classes"
              :key="cls.code"
              class="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-2xs"
            >
              <span class="text-slate-900 font-extrabold">{{ cls.code }}</span>
              <span :class="[
                'text-[11px] font-black px-1.5 py-0.5 rounded',
                cls.statusType === 'available' ? 'text-emerald-700 bg-emerald-50' :
                cls.statusType === 'rac' ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-100'
              ]">{{ cls.status }}</span>
              <span class="text-slate-400 font-normal">₹{{ cls.price }}</span>
            </div>
          </div>

          <!-- Active Journey Sync CTA -->
          <button
            @click="handleSelectActiveJourney(train)"
            :class="[
              'px-5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 uppercase tracking-wider',
              isTrainSelectedAsActive(train)
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            ]"
          >
            <CheckCircle2 v-if="isTrainSelectedAsActive(train)" class="w-4 h-4 text-white" />
            <Star v-else class="w-4 h-4 text-amber-300" />
            <span>{{ isTrainSelectedAsActive(train) ? 'Active Journey Synced ✅' : 'Sync Active Journey' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CLEAN TELEMETRY MODAL -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="selectedTrainForTelemetry"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        @click.self="selectedTrainForTelemetry = null"
      >
        <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col my-auto overflow-hidden animate-fade-in">
          <!-- Header -->
          <div class="p-5 border-b border-slate-100 flex items-center justify-between relative">
            <div>
              <h3 class="text-lg font-black text-slate-900 uppercase flex items-center gap-2">
                <span :class="['w-3 h-3 rounded-full shrink-0', getReliabilityDotClass(selectedTrainForTelemetry)]"></span>
                <span>{{ selectedTrainForTelemetry.name }} ({{ selectedTrainForTelemetry.number }})</span>
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                Past 30-day delay history and arrival punctuality
              </p>
            </div>

            <!-- View Tabs -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                @click="modalTabMode = 'trend'"
                :class="[
                  'px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  modalTabMode === 'trend' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Forecast Graph
              </button>
              <button
                @click="modalTabMode = 'table'"
                :class="[
                  'px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  modalTabMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Log Table
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <!-- Score Summary -->
            <div class="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div class="text-[11px] text-slate-500 font-bold uppercase">Punctuality Score</div>
                <div :class="['text-xl font-black mt-0.5', getReliabilityTextClass(selectedTrainForTelemetry)]">
                  {{ confidenceOf(selectedTrainForTelemetry) }}/100
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-bold uppercase">Average Delay</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">
                  {{ getAverageDelay(selectedTrainForTelemetry) }} mins
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-bold uppercase">Buffer Rec.</div>
                <div class="text-xl font-black text-rail-700 mt-0.5">
                  {{ getReliabilityLevel(selectedTrainForTelemetry) === 'red' ? '+60m' : '+15m' }}
                </div>
              </div>
            </div>

            <!-- Forecast Graph View -->
            <div v-if="modalTabMode === 'trend'" class="space-y-3">
              <div class="relative h-48 w-full pt-2">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 560 150">
                  <defs>
                    <linearGradient id="cleanGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.2" />
                      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path :d="getSvgFilledAreaPath(selectedTrainForTelemetry)" fill="url(#cleanGlow)" />
                  <path :d="getSvgSolidTrendPath(selectedTrainForTelemetry)" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
                  <path :d="getSvgForecastPath(selectedTrainForTelemetry)" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="5,5" />

                  <g v-for="(point, pIdx) in getSvgPoints(selectedTrainForTelemetry)" :key="pIdx">
                    <circle :cx="point.x" :cy="point.y" r="5" :class="point.isForecast ? 'fill-orange-500' : 'fill-sky-600'" />
                    <text :x="point.x" :y="point.y - 10" text-anchor="middle" class="text-[10px] font-extrabold fill-slate-700">
                      {{ point.val }}m
                    </text>
                  </g>
                </svg>
              </div>

              <div class="flex justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100">
                <span v-for="(log, lIdx) in windowFor(selectedTrainForTelemetry)" :key="lIdx">
                  {{ log.day.split(',')[0] }}
                </span>
                <span class="text-orange-600 font-extrabold">Forecast</span>
              </div>
            </div>

            <!-- Table View -->
            <div v-else class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th class="p-2.5">Day &amp; Date</th>
                    <th class="p-2.5">Origin Dept</th>
                    <th class="p-2.5">Dest Arrival</th>
                    <th class="p-2.5 text-right">Delay</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr v-for="(log, idx) in windowFor(selectedTrainForTelemetry)" :key="idx">
                    <td class="p-2.5 font-bold text-slate-900">{{ log.day }}</td>
                    <td class="p-2.5 text-slate-600">{{ log.originDept }}</td>
                    <td class="p-2.5 text-slate-600">{{ log.destArr }}</td>
                    <td class="p-2.5 text-right font-extrabold">
                      <span :class="log.delayMinutes === 0 ? 'text-emerald-700' : 'text-amber-700'">{{ log.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              @click="handleSelectActiveJourney(selectedTrainForTelemetry); selectedTrainForTelemetry = null"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Sync Active Journey
            </button>
            <button
              @click="selectedTrainForTelemetry = null"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { POPULAR_STATIONS } from '@/data/stations'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import ModernDatePicker from '@/components/ui/ModernDatePicker.vue'
import { getHistory } from '@/services/history'
import { computeBaseConfidence } from '@/services/scoring'
import {
  getReliabilityLevel,
  getReliabilityLabel,
  getReliabilityBadgeClass,
  getReliabilityDotClass,
  getReliabilityTextClass,
  getReliabilityReason
} from '@/services/reliability'
import {
  Train,
  MapPin,
  ArrowLeftRight,
  TrendingUp,
  ChevronRight,
  Search,
  CheckCircle2,
  Star
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()

const pnrSearchInput = ref('')
const selectedTrainForTelemetry = ref(null)
const modalTabMode = ref('trend')

const stationOptions = computed(() =>
  POPULAR_STATIONS.map(st => ({ label: `${st.city} (${st.code}) - ${st.name}`, value: st.code }))
)

const classOptions = [
  { label: 'All Classes', value: 'All Classes' },
  { label: 'Executive Chair (EC)', value: 'EC' },
  { label: 'AC Chair Car (CC)', value: 'CC' },
  { label: 'First AC (1A)', value: '1A' },
  { label: 'Second AC (2A)', value: '2A' },
  { label: 'Third AC (3A)', value: '3A' },
  { label: 'Sleeper (SL)', value: 'SL' }
]

const quotaOptions = [
  { label: 'GENERAL', value: 'GENERAL' },
  { label: 'TATKAL', value: 'TATKAL' },
  { label: 'LADIES', value: 'LADIES' }
]

const fromCode = computed({
  get: () => searchStore.fromStation?.code || 'NDLS',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) searchStore.fromStation = st
  }
})

const toCode = computed({
  get: () => searchStore.toStation?.code || 'MMCT',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) searchStore.toStation = st
  }
})

function isTrainSelectedAsActive(train) {
  if (!journeyStore.activeTrip) return false
  return journeyStore.activeTrip.trainNumber === train.number
}

function handleSelectActiveJourney(train) {
  journeyStore.setActiveTripFromTrain(train, searchStore.travelDate)
  console.log('[RailEase Journey Sync] Active trip set to:', train.name, '(', train.number, ')')
}

function handlePnrSync() {
  if (!pnrSearchInput.value) return
  const trip = journeyStore.fetchAndSetActiveTripByPnr(pnrSearchInput.value)
  if (trip) {
    pnrSearchInput.value = ''
    console.log('[RailEase PNR Sync] Trip synced via PNR:', trip.trainName, '(', trip.pnr, ')')
  }
}

// Reliability grading now lives in src/services/reliability.js so the public
// search page and this authenticated page grade every train identically. These
// local wrappers exist only so the template below needs no changes.

/**
 * The full running-history window backing this train's score.
 *
 * The chart and the log table below must read the SAME window the confidence
 * score is computed from. They previously read the seven hand-authored days
 * while the score used thirty, so the evidence on screen did not actually
 * support the verdict above it.
 *
 * @param {Object} train - train object
 * @returns {Array<Object>} the history window, oldest day first
 */
function windowFor(train) {
  return getHistory(train)
}

/**
 * Confidence score for a train, so no template reads the raw curated field.
 *
 * @param {Object} train - train object
 * @returns {Number} confidence from 0 to 100
 */
function confidenceOf(train) {
  return computeBaseConfidence(train)
}

/**
 * Mean delay across the full window, used for the forecast baseline.
 *
 * @param {Object} train - train object
 * @returns {Number} average delay in whole minutes
 */
function getAverageDelay(train) {
  const window = getHistory(train)
  if (!window.length) return 0
  const total = window.reduce((acc, log) => acc + (log.delayMinutes || 0), 0)
  return Math.round(total / window.length)
}

function getSvgPoints(train) {
  const window = getHistory(train)
  if (!window.length) return []
  const maxDelay = 200
  const width = 520
  const startX = 30
  const stepX = width / (window.length)

  const points = window.map((log, idx) => {
    const delay = log.delayMinutes || 0
    const x = startX + (idx * stepX)
    const y = Math.max(20, 130 - (delay / maxDelay) * 100)
    return { x, y, val: delay, isForecast: false }
  })

  const avg = getAverageDelay(train)
  const forecastVal = getReliabilityLevel(train) === 'red' ? Math.round(avg * 1.1) : Math.max(0, Math.round(avg * 0.7))
  const forecastX = startX + (window.length * stepX)
  const forecastY = Math.max(20, 130 - (forecastVal / maxDelay) * 100)

  points.push({ x: forecastX, y: forecastY, val: forecastVal, isForecast: true })
  return points
}

function getSvgSolidTrendPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const histPts = pts.filter(p => !p.isForecast)
  return histPts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '')
}

function getSvgForecastPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const lastHist = pts[pts.length - 2]
  const forecast = pts[pts.length - 1]
  return `M ${lastHist.x} ${lastHist.y} L ${forecast.x} ${forecast.y}`
}

function getSvgFilledAreaPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  const linePath = pts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '')
  return `${linePath} L ${last.x} 140 L ${first.x} 140 Z`
}

function openTelemetryModal(train, mode = 'trend') {
  selectedTrainForTelemetry.value = train
  modalTabMode.value = mode
}
</script>
