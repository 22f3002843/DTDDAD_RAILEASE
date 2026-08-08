<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-5 font-sans">
      <!-- CLEAN UNIFIED HEADER & TRAIN SELECTOR -->
      <div class="bg-white p-5 rounded-card border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Radio class="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                <span>Live Satellite Train Tracking Radar</span>
              </h1>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                GPS LOCKED
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              {{ activeTripDetails.trainName }} ({{ activeTripDetails.trainNumber }}) • {{ activeTripDetails.from }} &rarr; {{ activeTripDetails.to }}
            </p>
          </div>
        </div>

        <!-- Train Selector -->
        <div class="flex items-center gap-2.5 shrink-0">
          <span class="text-xs font-bold text-slate-600">Select Train:</span>
          <select
            v-model="selectedTrainId"
            @change="handleTrainSwitch"
            class="px-3.5 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs font-extrabold shadow-2xs focus:outline-none focus:border-rail-500 cursor-pointer"
          >
            <option v-for="tr in availableLiveTrainsList" :key="tr.id" :value="tr.id">
              {{ tr.name }} ({{ tr.number }})
            </option>
          </select>
        </div>
      </div>

      <!-- UNIFIED LIVE METRICS BAR (SPEED 90 - 130 km/h, ON TIME, NEXT STOP) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Live Speed (Bounded strictly between 90 km/h and 130 km/h) -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            ⚡
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Speed</div>
            <div class="text-xl font-black text-slate-900 flex items-baseline gap-1">
              <span class="text-blue-700 font-black transition-all">{{ currentLiveSpeed }}</span>
              <span class="text-xs font-bold text-slate-500">km/h</span>
            </div>
          </div>
        </div>

        <!-- Delay Status -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
            🟢
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Schedule Status</div>
            <div class="text-base font-black text-emerald-700">Right On Time (0m)</div>
          </div>
        </div>

        <!-- Next Stop -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
            <Train class="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next Station</div>
            <div class="text-sm font-black text-slate-900 truncate max-w-[160px]">{{ currentNextStationName }}</div>
          </div>
        </div>

        <!-- Waypoints Count -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0 font-extrabold text-xs">
            GPS
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Corridor Waypoints</div>
            <div class="text-base font-black text-slate-900">{{ currentWaypoints.length }} Stations Synced</div>
          </div>
        </div>
      </div>

      <!-- ANIMATED LIVE ROUTE CANVAS -->
      <div class="bg-white p-5 rounded-card border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Radio class="w-4 h-4 text-emerald-500 animate-pulse" />
            <h2 class="text-sm font-black text-slate-900 uppercase tracking-wider">
              Live Satellite Corridor Map
            </h2>
          </div>
          <button @click="resetTrainAnimation" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reset Marker</span>
          </button>
        </div>

        <!-- Dynamic Animated SVG Railway Map Canvas -->
        <div class="relative w-full h-[360px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg flex items-center justify-center">
          <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          <svg class="w-full h-full object-cover relative z-10" viewBox="0 0 900 360" fill="none">
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

            <!-- Railway Track -->
            <path
              ref="railTrackRef"
              id="live-rail-track"
              d="M 100 270 C 260 170 440 220 600 130 C 720 50 800 80 840 65"
              stroke="#1e293b"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M 100 270 C 260 170 440 220 600 130 C 720 50 800 80 840 65"
              stroke="url(#activeTrackGlow)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />

            <!-- Station Nodes -->
            <g
              v-for="(st, stIdx) in currentWaypoints"
              :key="stIdx"
              :transform="`translate(${st.x}, ${st.y})`"
              class="group cursor-pointer"
            >
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '9' : '6'"
                :fill="st.status === 'passed' ? '#10b981' : st.status === 'approaching' ? '#f59e0b' : '#0f172a'"
                :stroke="st.status === 'passed' ? '#059669' : st.status === 'approaching' ? '#fbbf24' : '#38bdf8'"
                stroke-width="2"
                class="transition-transform group-hover:scale-125"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />

              <text
                :x="stIdx % 2 === 0 ? '-15' : '-10'"
                :y="stIdx % 2 === 0 ? '24' : '-14'"
                fill="#e2e8f0"
                font-size="11"
                font-weight="800"
              >
                {{ st.name }} ({{ st.code }})
              </text>
            </g>

            <!-- Animated Train Marker with Bounded Speed (90 - 130 km/h) -->
            <g :transform="`translate(${trainPositionX}, ${trainPositionY})`">
              <circle cx="0" cy="0" r="24" fill="url(#trainHalo)" class="animate-pulse" />
              <circle cx="0" cy="0" r="14" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" class="animate-ping" />
              <rect x="-22" y="-12" width="44" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
              <text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="900">
                {{ currentLiveSpeed }}km/h
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- STATION TELEMETRY BREAKDOWN TABLE -->
      <div class="bg-white p-5 rounded-card border border-slate-200 shadow-sm space-y-3">
        <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">
          Station Telemetry Breakdown
        </h3>

        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th class="p-3">Station Name &amp; Code</th>
                <th class="p-3">Platform</th>
                <th class="p-3">Arrival Time</th>
                <th class="p-3">Halt</th>
                <th class="p-3 text-right">Status</th>
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
                      'w-2 h-2 rounded-full',
                      st.status === 'passed' ? 'bg-emerald-500' :
                      st.status === 'approaching' ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
                    ]"
                  ></span>
                  <span>{{ st.name }} ({{ st.code }})</span>
                </td>
                <td class="p-3 text-slate-600">PF {{ st.platform }}</td>
                <td class="p-3 text-slate-600">{{ st.arrTime }}</td>
                <td class="p-3 text-slate-600">{{ st.halt }}</td>
                <td class="p-3 text-right">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded text-[11px] font-black',
                      st.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                      st.status === 'approaching' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
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

const availableLiveTrainsList = computed(() => {
  const map = new Map()

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

const currentWaypoints = computed(() => {
  const trainNum = activeTripDetails.value.trainNumber || ''
  const routeText = `${activeTripDetails.value.from} ${activeTripDetails.value.to} ${activeTripDetails.value.trainName}`.toUpperCase()

  if (routeText.includes('MMCT') && routeText.includes('NDLS') || trainNum === '19020' || trainNum === '12952' || trainNum === '12954' || trainNum === '12925' || trainNum === '12903') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 100, y: 270, platform: '16', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 220, y: 220, platform: '3', arrTime: '06:40 PM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kota Jn', code: 'KOTA', x: 340, y: 180, platform: '1', arrTime: '09:00 PM', halt: '10 mins', dist: 465, status: 'passed', statusText: 'Passed 09:10 PM', isMajor: true },
      { name: 'Ratlam Jn', code: 'RTM', x: 470, y: 155, platform: '4', arrTime: '12:05 AM', halt: '5 mins', dist: 731, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Vadodara Jn', code: 'BRC', x: 600, y: 130, platform: '2', arrTime: '03:20 AM', halt: '10 mins', dist: 992, status: 'upcoming', statusText: 'Next Major Junction', isMajor: true },
      { name: 'Surat', code: 'ST', x: 730, y: 80, platform: '1', arrTime: '04:45 AM', halt: '5 mins', dist: 1122, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Mumbai Central', code: 'MMCT', x: 840, y: 65, platform: '1', arrTime: '08:35 AM', halt: 'Destination', dist: 1386, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('SBC') || trainNum === '11301' || trainNum === '11013') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 100, y: 270, platform: '1', arrTime: '08:10 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Kalyan Jn', code: 'KYN', x: 220, y: 220, platform: '5', arrTime: '09:12 AM', halt: '3 mins', dist: 54, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Pune Jn', code: 'PUNE', x: 340, y: 180, platform: '2', arrTime: '11:45 AM', halt: '5 mins', dist: 192, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Solapur Jn', code: 'SUR', x: 470, y: 155, platform: '1', arrTime: '04:00 PM', halt: '5 mins', dist: 454, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Kalaburagi', code: 'KLBG', x: 600, y: 130, platform: '2', arrTime: '06:15 PM', halt: '3 mins', dist: 567, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Anantapur', code: 'ATP', x: 730, y: 80, platform: '1', arrTime: '01:30 AM', halt: '2 mins', dist: 940, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
      { name: 'KSR Bengaluru', code: 'SBC', x: 840, y: 65, platform: '4', arrTime: '06:00 AM', halt: 'Destination', dist: 1134, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('PUNE') || trainNum === '12123' || trainNum === '12125' || trainNum === '11007' || trainNum === '11009') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 100, y: 270, platform: '1', arrTime: '05:10 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Dadar', code: 'DR', x: 220, y: 220, platform: '8', arrTime: '05:22 PM', halt: '3 mins', dist: 9, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Thane', code: 'TNA', x: 340, y: 180, platform: '5', arrTime: '05:45 PM', halt: '2 mins', dist: 34, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kalyan Jn', code: 'KYN', x: 470, y: 155, platform: '6', arrTime: '06:08 PM', halt: '2 mins', dist: 54, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Karjat', code: 'KJT', x: 600, y: 130, platform: '1', arrTime: '06:48 PM', halt: '2 mins', dist: 100, status: 'upcoming', statusText: 'Banker Engine Attachment', isMajor: false },
      { name: 'Lonavala', code: 'LNL', x: 730, y: 80, platform: '1', arrTime: '07:33 PM', halt: '2 mins', dist: 128, status: 'upcoming', statusText: 'Ghat Peak Clearance', isMajor: true },
      { name: 'Pune Jn', code: 'PUNE', x: 840, y: 65, platform: '1', arrTime: '08:25 PM', halt: 'Destination', dist: 192, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('ADI') || trainNum === '82902' || trainNum === '12934' || trainNum === '12902') {
    return [
      { name: 'Ahmedabad Jn', code: 'ADI', x: 100, y: 270, platform: '5', arrTime: '06:40 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Nadiad Jn', code: 'ND', x: 230, y: 225, platform: '1', arrTime: '07:19 AM', halt: '2 mins', dist: 46, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Vadodara Jn', code: 'BRC', x: 380, y: 180, platform: '2', arrTime: '08:03 AM', halt: '5 mins', dist: 100, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Surat', code: 'ST', x: 530, y: 145, platform: '1', arrTime: '09:35 AM', halt: '5 mins', dist: 230, status: 'approaching', statusText: 'Approaching', isMajor: true },
      { name: 'Vapi', code: 'VAPI', x: 680, y: 100, platform: '2', arrTime: '10:46 AM', halt: '2 mins', dist: 325, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Mumbai Central', code: 'MMCT', x: 840, y: 65, platform: '1', arrTime: '01:05 PM', halt: 'Destination', dist: 493, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('BSB') || trainNum === '22436' || trainNum === '14258' || trainNum === '12392') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 100, y: 270, platform: '16', arrTime: '06:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 220, y: 220, platform: '3', arrTime: '07:25 AM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed 07:27 AM', isMajor: false },
      { name: 'Agra Cantt', code: 'AGC', x: 330, y: 180, platform: '1', arrTime: '08:05 AM', halt: '5 mins', dist: 195, status: 'passed', statusText: 'Passed 08:10 AM', isMajor: true },
      { name: 'Gwalior Jn', code: 'GWL', x: 460, y: 160, platform: '2', arrTime: '09:20 AM', halt: '3 mins', dist: 313, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Jhansi Jn', code: 'VGLJ', x: 600, y: 130, platform: '4', arrTime: '10:45 AM', halt: '8 mins', dist: 410, status: 'upcoming', statusText: 'Next Stop (ETA 10:45 AM)', isMajor: true },
      { name: 'Kanpur Central', code: 'CNB', x: 730, y: 80, platform: '5', arrTime: '12:30 PM', halt: '10 mins', dist: 630, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Varanasi Jn', code: 'BSB', x: 840, y: 65, platform: '1', arrTime: '02:00 PM', halt: 'Destination', dist: 780, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  const fromNameStr = activeTripDetails.value.from.split('(')[0].trim() || 'Origin'
  const fromCodeStr = activeTripDetails.value.from.match(/\(([^)]+)\)/)?.[1] || 'DEP'
  const toNameStr = activeTripDetails.value.to.split('(')[0].trim() || 'Destination'
  const toCodeStr = activeTripDetails.value.to.match(/\(([^)]+)\)/)?.[1] || 'ARR'

  return [
    { name: fromNameStr, code: fromCodeStr, x: 100, y: 270, platform: '1', arrTime: '07:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
    { name: 'Junction A', code: 'JNC-A', x: 220, y: 220, platform: '2', arrTime: '08:15 AM', halt: '2 mins', dist: 85, status: 'passed', statusText: 'Passed', isMajor: false },
    { name: 'Intermediate Hub B', code: 'HUB-B', x: 340, y: 180, platform: '3', arrTime: '09:40 AM', halt: '5 mins', dist: 190, status: 'passed', statusText: 'Passed', isMajor: true },
    { name: 'Mid Corridor C', code: 'MID-C', x: 470, y: 155, platform: '1', arrTime: '11:10 AM', halt: '3 mins', dist: 310, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
    { name: 'Major Junction D', code: 'JNC-D', x: 600, y: 130, platform: '4', arrTime: '01:00 PM', halt: '8 mins', dist: 460, status: 'upcoming', statusText: 'Next Major Stop', isMajor: true },
    { name: 'Sector Control E', code: 'SEC-E', x: 730, y: 80, platform: '2', arrTime: '02:45 PM', halt: '5 mins', dist: 610, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
    { name: toNameStr, code: toCodeStr, x: 840, y: 65, platform: '1', arrTime: '04:30 PM', halt: 'Destination', dist: 750, status: 'upcoming', statusText: 'Destination', isMajor: true }
  ]
})

const currentNextStationName = computed(() => {
  const upcoming = currentWaypoints.value.find(w => w.status === 'approaching' || w.status === 'upcoming')
  return upcoming ? `${upcoming.name} (${upcoming.code})` : 'Destination'
})

// Dynamic Live Speed Bounded Strictly Between 90 km/h and 130 km/h
const currentLiveSpeed = ref(112)
const speedTrend = ref('cruising')
const speedStatusText = ref('Cruising Speed Maintained')

const currentBlockNumber = ref(412)
const distanceToNext = ref(28)
const nextStationEta = ref('14 mins')

const trainProgressPercent = ref(0.48)
const trainPositionX = ref(460)
const trainPositionY = ref(160)

let speedTimer = null
let animationFrameId = null

watch(() => journeyStore.activeTrip, (newTrip) => {
  if (newTrip && newTrip.trainNumber) {
    selectedTrainId.value = newTrip.trainNumber
    resetTrainAnimation()
  }
}, { immediate: true })

function handleTrainSwitch() {
  resetTrainAnimation()
}

function updateTrainCoordinatesOnTrack() {
  if (!railTrackRef.value) {
    const p = trainProgressPercent.value
    trainPositionX.value = Math.round(100 + p * 740)
    trainPositionY.value = Math.round(270 - (p * 205))
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

// Speed is strictly bounded between 90 km/h and 130 km/h
function triggerDynamicSpeedUpdate() {
  const speedVariations = [92, 98, 105, 112, 118, 124, 128, 130, 122, 115, 108, 96, 102, 126, 110, 114]
  const randomSpeed = speedVariations[Math.floor(Math.random() * speedVariations.length)]
  
  if (randomSpeed > currentLiveSpeed.value) {
    speedTrend.value = 'accelerating'
    speedStatusText.value = 'Accelerating'
  } else if (randomSpeed < currentLiveSpeed.value) {
    speedTrend.value = 'slowing'
    speedStatusText.value = 'Slowing'
  } else {
    speedTrend.value = 'cruising'
    speedStatusText.value = 'Cruising'
  }

  currentLiveSpeed.value = randomSpeed
  currentBlockNumber.value = Math.floor(400 + Math.random() * 50)
  distanceToNext.value = Math.max(2, distanceToNext.value - 1)
}

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
  currentLiveSpeed.value = 112
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
