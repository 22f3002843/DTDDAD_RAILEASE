<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-6 font-sans">
      <!-- Header Bar with Back Button & Active Train Indicator -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Radio class="w-5 h-5 text-emerald-500 animate-pulse" />
              <span>Live Satellite Train Tracking Radar</span>
            </h1>
            <p class="text-xs text-slate-500 font-medium">
              Real-time GPS telemetry, custom route corridor waypoints, and dynamic speed monitoring.
            </p>
          </div>
        </div>

        <!-- Train Selector Dropdown -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-slate-600">Active Live Radar Train:</label>
          <select
            v-model="selectedTrainId"
            @change="handleTrainSwitch"
            class="px-3.5 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-extrabold shadow-sm focus:outline-none cursor-pointer"
          >
            <option v-for="tr in availableLiveTrainsList" :key="tr.id" :value="tr.id">
              {{ tr.name }} ({{ tr.number }}) - {{ tr.fromCode }} &rarr; {{ tr.toCode }}
            </option>
          </select>
        </div>
      </div>

      <!-- Active Journey Lock Indicator Banner -->
      <div class="bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-slate-900 text-white p-4 rounded-card border border-blue-700/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
            <Train class="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div class="flex items-center gap-2 text-[11px]">
              <span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-black border border-emerald-400/30">
                ACTIVE RADAR ROUTE LOCKED
              </span>
              <span class="text-blue-200 font-bold">PNR: {{ activeTripDetails.pnr }}</span>
            </div>
            <h2 class="text-lg font-black uppercase text-white mt-0.5">
              {{ activeTripDetails.trainName }} ({{ activeTripDetails.trainNumber }})
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs font-bold text-blue-200">
          <span>Route: <strong class="text-white">{{ activeTripDetails.from }} &rarr; {{ activeTripDetails.to }}</strong></span>
        </div>
      </div>

      <!-- Top Metric Cards Grid (Dynamic Live Speed & Telemetry Readouts) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Active Train Overview Card -->
        <div class="md:col-span-5 bg-white p-6 rounded-card border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-black border border-blue-200">
                ACTIVE SATELLITE TELEMETRY
              </span>
              <span class="text-xs font-bold text-slate-500">Block: #{{ currentBlockNumber }}</span>
            </div>
            <h2 class="text-xl font-black text-slate-900">
              {{ activeTripDetails.trainName }} ({{ activeTripDetails.trainNumber }})
            </h2>
            <p class="text-xs text-slate-600 font-bold mt-1">
              {{ activeTripDetails.from }} &rarr; {{ activeTripDetails.to }}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span class="text-emerald-600 font-bold flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Signal Clear • {{ currentWaypoints.length }} Route Station Waypoints Locked
            </span>
            <span class="text-slate-400 font-medium">GPS Sync: 100%</span>
          </div>
        </div>

        <!-- Dynamic Live Speed Meter -->
        <div class="md:col-span-7 bg-white p-6 rounded-card border border-slate-200 shadow-sm grid grid-cols-3 divide-x divide-slate-100 text-center">
          <!-- Dynamic Speed readout -->
          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Live Speed (Every 3s)</span>
            <div class="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
              <span class="transition-all duration-500 text-blue-700">{{ currentLiveSpeed }}</span>
              <span class="text-xs font-bold text-slate-500">km/h</span>
            </div>
            <span
              :class="[
                'text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1.5 transition-colors',
                speedTrend === 'accelerating' ? 'bg-emerald-100 text-emerald-800' :
                speedTrend === 'slowing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              ]"
            >
              ⚡ {{ speedStatusText }}
            </span>
          </div>

          <!-- Punctuality Status -->
          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Delay Status</span>
            <div class="text-3xl font-black text-emerald-600 tracking-tight">
              0 <span class="text-xs font-bold text-emerald-600">min</span>
            </div>
            <span class="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200">
              🟢 Right On Schedule
            </span>
          </div>

          <!-- Next Station & ETA -->
          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Next Junction ETA</span>
            <div class="text-base font-black text-slate-900 truncate max-w-full">
              {{ currentNextStationName }}
            </div>
            <span class="text-[10px] text-blue-700 font-bold mt-1">
              In {{ distanceToNext }} km • {{ nextStationEta }}
            </span>
          </div>
        </div>
      </div>

      <!-- ==================== ANIMATED LIVE ROUTE MAP WITH ACCURATE ROUTE WAYPOINTS ==================== -->
      <div class="bg-white p-6 rounded-card border border-slate-200 shadow-sm relative overflow-hidden space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Radio class="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
            <h2 class="text-base font-black text-slate-900 tracking-tight">
              Live Satellite Route Map (Verified Route Corridor for {{ activeTripDetails.trainName }})
            </h2>
          </div>
          <div class="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span class="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {{ currentWaypoints.length }} Waypoints Synced
            </span>
            <span class="text-slate-400 font-medium">Hover any station node to inspect platform &amp; halt</span>
          </div>
        </div>

        <!-- Dynamic Animated SVG Railway Map Canvas -->
        <div class="relative w-full h-[380px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
          
          <!-- Background Grid Lines -->
          <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] pointer-events-none"></div>

          <!-- SVG Live Railway Track & Station Waypoints -->
          <svg class="w-full h-full object-cover relative z-10" viewBox="0 0 900 380" fill="none">
            <defs>
              <linearGradient id="activeTrackGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>

              <radialGradient id="trainHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- Background Railway Grid/Terrain Paths -->
            <path d="M 0 120 Q 250 60 500 150 T 900 100" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 6" />
            <path d="M 0 280 Q 350 320 700 220 T 900 260" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 6" />
            <path d="M 150 0 Q 100 180 280 360" stroke="#1e293b" stroke-width="2" />
            <path d="M 750 0 Q 650 200 820 360" stroke="#1e293b" stroke-width="2" />

            <!-- Exact Curved Railway Track Line -->
            <path
              ref="railTrackRef"
              id="live-rail-track"
              d="M 100 290 C 260 190 440 240 600 140 C 720 60 800 90 840 75"
              stroke="#1e293b"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
            />
            <!-- Glowing Track Line Overlay -->
            <path
              d="M 100 290 C 260 190 440 240 600 140 C 720 60 800 90 840 75"
              stroke="url(#activeTrackGlow)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />

            <!-- ACCURATE CORRIDOR STATION WAYPOINTS FOR CURRENT SELECTED TRAIN -->
            <g
              v-for="(st, stIdx) in currentWaypoints"
              :key="stIdx"
              :transform="`translate(${st.x}, ${st.y})`"
              class="group cursor-pointer"
            >
              <!-- Outer Station Ring -->
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '10' : '7'"
                :fill="st.status === 'passed' ? '#10b981' : st.status === 'approaching' ? '#f59e0b' : '#0f172a'"
                :stroke="st.status === 'passed' ? '#059669' : st.status === 'approaching' ? '#fbbf24' : '#38bdf8'"
                :stroke-width="st.isMajor ? '3' : '2'"
                class="transition-transform group-hover:scale-125"
              />

              <circle cx="0" cy="0" r="3" fill="#ffffff" />

              <!-- Station Name Label -->
              <text
                :x="stIdx % 2 === 0 ? '-20' : '-10'"
                :y="stIdx % 2 === 0 ? '28' : '-16'"
                fill="#e2e8f0"
                font-size="11"
                font-weight="800"
                class="group-hover:fill-sky-300 transition-colors"
              >
                {{ st.name }} ({{ st.code }})
              </text>

              <!-- Hover Tooltip Popup for Station Details -->
              <foreignObject x="-90" y="-85" width="180" height="70" class="hidden group-hover:block overflow-visible z-30">
                <div class="bg-slate-900/95 border border-slate-700 text-white text-[10px] p-2 rounded-xl shadow-2xl space-y-0.5">
                  <div class="flex items-center justify-between font-black text-sky-300">
                    <span>{{ st.name }} ({{ st.code }})</span>
                    <span>PF {{ st.platform }}</span>
                  </div>
                  <div class="text-slate-300 font-semibold flex justify-between">
                    <span>Arr: {{ st.arrTime }}</span>
                    <span>Halt: {{ st.halt }}</span>
                  </div>
                  <div class="text-[9px] font-bold text-emerald-400">
                    Status: {{ st.statusText }} • Dist: {{ st.dist }} km
                  </div>
                </div>
              </foreignObject>
            </g>

            <!-- UNIFORM SLOW LIVE TRAIN MARKER -->
            <g :transform="`translate(${trainPositionX}, ${trainPositionY})`">
              <!-- Satellite Ring Halo -->
              <circle cx="0" cy="0" r="30" fill="url(#trainHalo)" class="animate-pulse" />
              <circle cx="0" cy="0" r="16" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2" class="animate-ping" />

              <!-- Main Train Marker Badge -->
              <rect x="-24" y="-14" width="48" height="28" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" class="shadow-2xl" />

              <!-- Mini Train Front Icon -->
              <g transform="translate(-16, -6)">
                <path d="M 0 0 L 10 0 L 10 12 L 0 12 Z" fill="#38bdf8" />
                <circle cx="3" cy="10" r="1.5" fill="#0f172a" />
                <circle cx="7" cy="10" r="1.5" fill="#0f172a" />
              </g>

              <!-- Speed text inside badge -->
              <text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="900">
                {{ currentLiveSpeed }}k
              </text>
            </g>
          </svg>

          <!-- Top Overlay: Live Telemetry Status Bar -->
          <div class="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 text-white flex items-center gap-3 shadow-lg text-xs font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Satellite Tracking: <strong class="text-sky-300">{{ activeTripDetails.trainName }}</strong></span>
            <span class="text-slate-400">|</span>
            <span class="text-amber-300">Speed: {{ currentLiveSpeed }} km/h</span>
          </div>

          <!-- Controls -->
          <div class="absolute right-4 bottom-4 flex flex-col bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-md divide-y divide-slate-800 overflow-hidden font-bold text-white text-xs">
            <button @click="resetTrainAnimation" class="px-3 py-2 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer">
              <RotateCcw class="w-3.5 h-3.5 text-sky-400" />
              <span>Reset Path</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Station Telemetry Waypoints Table Grid -->
      <div class="bg-white p-6 rounded-card border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">
          Corridor Station Telemetry Breakdown for {{ activeTripDetails.trainName }} ({{ currentWaypoints.length }} Waypoints)
        </h3>

        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th class="p-3">Station Name &amp; Code</th>
                <th class="p-3">Platform</th>
                <th class="p-3">Scheduled Arrival</th>
                <th class="p-3">Halt Duration</th>
                <th class="p-3 text-right">Live Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
              <tr
                v-for="(st, idx) in currentWaypoints"
                :key="idx"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <span
                    :class="[
                      'w-2.5 h-2.5 rounded-full',
                      st.status === 'passed' ? 'bg-emerald-500' :
                      st.status === 'approaching' ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
                    ]"
                  ></span>
                  <span>{{ st.name }} ({{ st.code }})</span>
                </td>
                <td class="p-3 text-slate-600">Platform {{ st.platform }}</td>
                <td class="p-3 text-slate-600">{{ st.arrTime }}</td>
                <td class="p-3 text-slate-600">{{ st.halt }}</td>
                <td class="p-3 text-right">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded text-[11px] font-black',
                      st.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                      st.status === 'approaching' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-700'
                    ]"
                  >
                    {{ st.statusText }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { MOCK_TRAINS } from '@/data/trains'
import AppLayout from '@/layouts/AppLayout.vue'
import { ArrowLeft, Radio, RotateCcw, Train } from 'lucide-vue-next'

const router = useRouter()
const journeyStore = useJourneyStore()
const railTrackRef = ref(null)

// Combined list of all available trains dynamically extracted from MOCK_TRAINS dataset + active trip
const availableLiveTrainsList = computed(() => {
  const map = new Map()

  // First add MOCK_TRAINS
  MOCK_TRAINS.forEach(t => {
    map.set(t.number, {
      id: t.id || t.number,
      number: t.number,
      name: t.name,
      fromCode: t.fromCode,
      toCode: t.toCode,
      fromName: t.fromName,
      toName: t.toName
    })
  })

  // Add active trip if present
  if (journeyStore.activeTrip) {
    const num = journeyStore.activeTrip.trainNumber
    if (num && !map.has(num)) {
      map.set(num, {
        id: `tr_${num}`,
        number: num,
        name: journeyStore.activeTrip.trainName,
        fromCode: 'DEP',
        toCode: 'ARR',
        fromName: journeyStore.activeTrip.from,
        toName: journeyStore.activeTrip.to
      })
    }
  }

  return Array.from(map.values())
})

const selectedTrainId = ref(journeyStore.activeTrip?.trainNumber || MOCK_TRAINS[0].number)

// Active Train Object Details
const activeTripDetails = computed(() => {
  const selectedNum = selectedTrainId.value
  const foundInMock = MOCK_TRAINS.find(t => t.number === selectedNum || t.id === selectedNum)

  if (journeyStore.activeTrip && (journeyStore.activeTrip.trainNumber === selectedNum || journeyStore.activeTrip.id === selectedNum)) {
    return {
      pnr: journeyStore.activeTrip.pnr || '84291039',
      trainNumber: journeyStore.activeTrip.trainNumber,
      trainName: journeyStore.activeTrip.trainName,
      from: journeyStore.activeTrip.from,
      to: journeyStore.activeTrip.to
    }
  }

  if (foundInMock) {
    return {
      pnr: '84291039',
      trainNumber: foundInMock.number,
      trainName: foundInMock.name,
      from: `${foundInMock.fromName} (${foundInMock.fromCode})`,
      to: `${foundInMock.toName} (${foundInMock.toCode})`
    }
  }

  return {
    pnr: '84291039',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    from: 'New Delhi (NDLS)',
    to: 'Varanasi (BSB)'
  }
})

// DYNAMIC ROUTE WAYPOINTS RESOLVER FOR EVERY SINGLE TRAIN & CORRIDOR
const currentWaypoints = computed(() => {
  const trainNum = activeTripDetails.value.trainNumber || ''
  const routeText = `${activeTripDetails.value.from} ${activeTripDetails.value.to} ${activeTripDetails.value.trainName}`.toUpperCase()

  // CORRIDOR 1: MUMBAI <-> DELHI (Dehradun Express 19020, Rajdhani 12952, August Kranti 12954, Paschim 12925, Golden Temple 12903)
  if (routeText.includes('MMCT') && routeText.includes('NDLS') || trainNum === '19020' || trainNum === '12952' || trainNum === '12954' || trainNum === '12925' || trainNum === '12903') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 100, y: 290, platform: '16', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 220, y: 240, platform: '3', arrTime: '06:40 PM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kota Jn', code: 'KOTA', x: 340, y: 200, platform: '1', arrTime: '09:00 PM', halt: '10 mins', dist: 465, status: 'passed', statusText: 'Passed 09:10 PM', isMajor: true },
      { name: 'Ratlam Jn', code: 'RTM', x: 470, y: 175, platform: '4', arrTime: '12:05 AM', halt: '5 mins', dist: 731, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Vadodara Jn', code: 'BRC', x: 600, y: 140, platform: '2', arrTime: '03:20 AM', halt: '10 mins', dist: 992, status: 'upcoming', statusText: 'Next Major Junction', isMajor: true },
      { name: 'Surat', code: 'ST', x: 730, y: 90, platform: '1', arrTime: '04:45 AM', halt: '5 mins', dist: 1122, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Mumbai Central', code: 'MMCT', x: 840, y: 75, platform: '1', arrTime: '08:35 AM', halt: 'Destination', dist: 1386, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // CORRIDOR 2: MUMBAI <-> BENGALURU (Udyan Express 11301, LTT Coimbatore 11013)
  if (routeText.includes('SBC') || trainNum === '11301' || trainNum === '11013') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 100, y: 290, platform: '1', arrTime: '08:10 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Kalyan Jn', code: 'KYN', x: 220, y: 240, platform: '5', arrTime: '09:12 AM', halt: '3 mins', dist: 54, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Pune Jn', code: 'PUNE', x: 340, y: 200, platform: '2', arrTime: '11:45 AM', halt: '5 mins', dist: 192, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Solapur Jn', code: 'SUR', x: 470, y: 175, platform: '1', arrTime: '04:00 PM', halt: '5 mins', dist: 454, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Kalaburagi', code: 'KLBG', x: 600, y: 140, platform: '2', arrTime: '06:15 PM', halt: '3 mins', dist: 567, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Anantapur', code: 'ATP', x: 730, y: 90, platform: '1', arrTime: '01:30 AM', halt: '2 mins', dist: 940, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
      { name: 'KSR Bengaluru', code: 'SBC', x: 840, y: 75, platform: '4', arrTime: '06:00 AM', halt: 'Destination', dist: 1134, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // CORRIDOR 3: MUMBAI <-> PUNE (Deccan Queen 12123, Pragati 12125, Deccan Express 11007, Sinhagad 11009)
  if (routeText.includes('PUNE') || trainNum === '12123' || trainNum === '12125' || trainNum === '11007' || trainNum === '11009') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 100, y: 290, platform: '1', arrTime: '05:10 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Dadar', code: 'DR', x: 220, y: 240, platform: '8', arrTime: '05:22 PM', halt: '3 mins', dist: 9, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Thane', code: 'TNA', x: 340, y: 200, platform: '5', arrTime: '05:45 PM', halt: '2 mins', dist: 34, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kalyan Jn', code: 'KYN', x: 470, y: 175, platform: '6', arrTime: '06:08 PM', halt: '2 mins', dist: 54, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Karjat', code: 'KJT', x: 600, y: 140, platform: '1', arrTime: '06:48 PM', halt: '2 mins', dist: 100, status: 'upcoming', statusText: 'Banker Engine Attachment', isMajor: false },
      { name: 'Lonavala', code: 'LNL', x: 730, y: 90, platform: '1', arrTime: '07:33 PM', halt: '2 mins', dist: 128, status: 'upcoming', statusText: 'Ghat Peak Clearance', isMajor: true },
      { name: 'Pune Jn', code: 'PUNE', x: 840, y: 75, platform: '1', arrTime: '08:25 PM', halt: 'Destination', dist: 192, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // CORRIDOR 4: AHMEDABAD <-> MUMBAI (Tejas 82902, Karnavati 12934, Gujarat Superfast 12902)
  if (routeText.includes('ADI') || trainNum === '82902' || trainNum === '12934' || trainNum === '12902') {
    return [
      { name: 'Ahmedabad Jn', code: 'ADI', x: 100, y: 290, platform: '5', arrTime: '06:40 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Nadiad Jn', code: 'ND', x: 230, y: 245, platform: '1', arrTime: '07:19 AM', halt: '2 mins', dist: 46, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Vadodara Jn', code: 'BRC', x: 380, y: 200, platform: '2', arrTime: '08:03 AM', halt: '5 mins', dist: 100, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Surat', code: 'ST', x: 530, y: 160, platform: '1', arrTime: '09:35 AM', halt: '5 mins', dist: 230, status: 'approaching', statusText: 'Approaching', isMajor: true },
      { name: 'Vapi', code: 'VAPI', x: 680, y: 110, platform: '2', arrTime: '10:46 AM', halt: '2 mins', dist: 325, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Mumbai Central', code: 'MMCT', x: 840, y: 75, platform: '1', arrTime: '01:05 PM', halt: 'Destination', dist: 493, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // CORRIDOR 5: DELHI <-> VARANASI (Vande Bharat 22436, Kashi Vishwanath 14258, Shramjeevi 12392)
  if (routeText.includes('BSB') || trainNum === '22436' || trainNum === '14258' || trainNum === '12392') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 100, y: 290, platform: '16', arrTime: '06:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 220, y: 240, platform: '3', arrTime: '07:25 AM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed 07:27 AM', isMajor: false },
      { name: 'Agra Cantt', code: 'AGC', x: 330, y: 200, platform: '1', arrTime: '08:05 AM', halt: '5 mins', dist: 195, status: 'passed', statusText: 'Passed 08:10 AM', isMajor: true },
      { name: 'Gwalior Jn', code: 'GWL', x: 460, y: 180, platform: '2', arrTime: '09:20 AM', halt: '3 mins', dist: 313, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Jhansi Jn', code: 'VGLJ', x: 600, y: 140, platform: '4', arrTime: '10:45 AM', halt: '8 mins', dist: 410, status: 'upcoming', statusText: 'Next Stop (ETA 10:45 AM)', isMajor: true },
      { name: 'Kanpur Central', code: 'CNB', x: 730, y: 90, platform: '5', arrTime: '12:30 PM', halt: '10 mins', dist: 630, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Varanasi Jn', code: 'BSB', x: 840, y: 75, platform: '1', arrTime: '02:00 PM', halt: 'Destination', dist: 780, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // DYNAMIC GENERIC ROUTE GENERATOR FOR ANY OTHER TRAIN / STATIONS
  const fromNameStr = activeTripDetails.value.from.split('(')[0].trim() || 'Origin'
  const fromCodeStr = activeTripDetails.value.from.match(/\(([^)]+)\)/)?.[1] || 'DEP'
  const toNameStr = activeTripDetails.value.to.split('(')[0].trim() || 'Destination'
  const toCodeStr = activeTripDetails.value.to.match(/\(([^)]+)\)/)?.[1] || 'ARR'

  return [
    { name: fromNameStr, code: fromCodeStr, x: 100, y: 290, platform: '1', arrTime: '07:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
    { name: 'Junction A', code: 'JNC-A', x: 220, y: 240, platform: '2', arrTime: '08:15 AM', halt: '2 mins', dist: 85, status: 'passed', statusText: 'Passed', isMajor: false },
    { name: 'Intermediate Hub B', code: 'HUB-B', x: 340, y: 200, platform: '3', arrTime: '09:40 AM', halt: '5 mins', dist: 190, status: 'passed', statusText: 'Passed', isMajor: true },
    { name: 'Mid Corridor C', code: 'MID-C', x: 470, y: 175, platform: '1', arrTime: '11:10 AM', halt: '3 mins', dist: 310, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
    { name: 'Major Junction D', code: 'JNC-D', x: 600, y: 140, platform: '4', arrTime: '01:00 PM', halt: '8 mins', dist: 460, status: 'upcoming', statusText: 'Next Major Stop', isMajor: true },
    { name: 'Sector Control E', code: 'SEC-E', x: 730, y: 90, platform: '2', arrTime: '02:45 PM', halt: '5 mins', dist: 610, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
    { name: toNameStr, code: toCodeStr, x: 840, y: 75, platform: '1', arrTime: '04:30 PM', halt: 'Destination', dist: 750, status: 'upcoming', statusText: 'Destination', isMajor: true }
  ]
})

const currentNextStationName = computed(() => {
  const upcoming = currentWaypoints.value.find(w => w.status === 'approaching' || w.status === 'upcoming')
  return upcoming ? `${upcoming.name} (${upcoming.code})` : 'Destination'
})

// Dynamic Live Speed & Progress State
const currentLiveSpeed = ref(128)
const speedTrend = ref('accelerating')
const speedStatusText = ref('Accelerating on Main Line')

const currentBlockNumber = ref(412)
const distanceToNext = ref(28)
const nextStationEta = ref('14 mins')

// Track Progress Normalized Distance (0.0 to 1.0)
const trainProgressPercent = ref(0.48)
const trainPositionX = ref(460)
const trainPositionY = ref(180)

let speedTimer = null
let animationFrameId = null

// Watch activeTrip changes in store
watch(() => journeyStore.activeTrip, (newTrip) => {
  if (newTrip && newTrip.trainNumber) {
    selectedTrainId.value = newTrip.trainNumber
    resetTrainAnimation()
  }
}, { immediate: true })

function handleTrainSwitch() {
  resetTrainAnimation()
}

// Exact calculation using SVG getPointAtLength to lock marker onto the curved track
function updateTrainCoordinatesOnTrack() {
  if (!railTrackRef.value) {
    const p = trainProgressPercent.value
    trainPositionX.value = Math.round(100 + p * 740)
    trainPositionY.value = Math.round(290 - (p * 215))
    return
  }

  try {
    const totalLength = railTrackRef.value.getTotalLength()
    const currentLength = trainProgressPercent.value * totalLength
    const pt = railTrackRef.value.getPointAtLength(currentLength)
    trainPositionX.value = Math.round(pt.x)
    trainPositionY.value = Math.round(pt.y)
  } catch (e) {
    console.warn('[RailEase Track Follower] SVG point calculation fallback', e)
  }
}

// Dynamic Speed Updater running every 3 seconds
function triggerDynamicSpeedUpdate() {
  const speedVariations = [118, 126, 134, 142, 138, 122, 114, 130, 136]
  const randomSpeed = speedVariations[Math.floor(Math.random() * speedVariations.length)]
  
  if (randomSpeed > currentLiveSpeed.value) {
    speedTrend.value = 'accelerating'
    speedStatusText.value = 'Accelerating on High-Speed Section'
  } else if (randomSpeed < currentLiveSpeed.value) {
    speedTrend.value = 'slowing'
    speedStatusText.value = 'Slowing for Station Approach'
  } else {
    speedTrend.value = 'cruising'
    speedStatusText.value = 'Cruising Speed Maintained'
  }

  currentLiveSpeed.value = randomSpeed
  currentBlockNumber.value = Math.floor(400 + Math.random() * 50)
  distanceToNext.value = Math.max(2, distanceToNext.value - 1)
}

// Ultra-slow, smooth, continuous linear motion loop from start to end
function animateTrainMovement() {
  trainProgressPercent.value += 0.0001
  if (trainProgressPercent.value >= 0.92) {
    trainProgressPercent.value = 0.15
  }
  updateTrainCoordinatesOnTrack()
  animationFrameId = requestAnimationFrame(animateTrainMovement)
}

function resetTrainAnimation() {
  trainProgressPercent.value = 0.15
  currentLiveSpeed.value = 124
  updateTrainCoordinatesOnTrack()
}

onMounted(() => {
  updateTrainCoordinatesOnTrack()
  speedTimer = setInterval(triggerDynamicSpeedUpdate, 3000)
  animationFrameId = requestAnimationFrame(animateTrainMovement)
})

onUnmounted(() => {
  if (speedTimer) clearInterval(speedTimer)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>
