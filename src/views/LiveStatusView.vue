<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-5 font-sans">
      <!-- CLEAN UNIFIED HEADER & TRAIN SELECTOR WITH SUBTLE GRADIENT -->
      <div class="bg-gradient-to-r from-rail-50 via-sky-50/90 to-indigo-50/70 p-5 rounded-2xl border border-rail-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <!-- Ambient Glowing Wave Auras -->
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-rail-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-1/3 top-0 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="h-1 bg-gradient-to-r from-rail-600 via-sky-500 to-indigo-600 absolute top-0 left-0 right-0"></div>

        <div class="flex items-center gap-3 relative z-10">
          <button
            @click="router.back()"
            class="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-rail-200/80 transition-colors cursor-pointer shadow-2xs"
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
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-black border border-emerald-300 shadow-2xs">
                GPS LOCKED
              </span>
            </div>
            <p class="text-xs text-slate-600 font-semibold mt-0.5">
              {{ activeTripDetails.trainName }} ({{ activeTripDetails.trainNumber }}) &bull; {{ activeTripDetails.from }} &rarr; {{ activeTripDetails.to }}
            </p>
          </div>
        </div>

        <!-- Train Selector -->
        <div class="flex items-center gap-2.5 shrink-0 relative z-10">
          <span class="text-xs font-black text-slate-700">Select Train:</span>
          <select
            v-model="selectedTrainId"
            @change="handleTrainSwitch"
            class="px-3.5 py-2 bg-white/90 text-slate-900 border border-rail-200 rounded-xl text-xs font-extrabold shadow-2xs focus:outline-none focus:border-rail-500 cursor-pointer"
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
              Live Railway Corridor Map
            </h2>
            <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE TRACKING
            </span>
          </div>
          <button @click="resetTrainAnimation" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reset Marker</span>
          </button>
        </div>

        <!-- Dynamic Animated SVG Railway Map Canvas (ULTRA-CLEAN LIGHT GREY THEME) -->
        <div class="relative w-full h-[430px] rounded-2xl bg-gradient-to-br from-slate-100 via-slate-150 to-slate-100 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
          <!-- Ultra-Subtle Light Precision Grid Overlays -->
          <div class="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20"></div>
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:96px_96px] opacity-20"></div>

          <svg class="w-full h-full object-cover relative z-10" viewBox="0 0 900 420" fill="none">
            <defs>
              <linearGradient id="activeTrackGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#059669" />
                <stop offset="35%" stop-color="#0284c7" />
                <stop offset="70%" stop-color="#4f46e5" />
                <stop offset="100%" stop-color="#7c3aed" />
              </linearGradient>

              <radialGradient id="trainHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.7" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </radialGradient>

              <!-- Radar Sonar Ring Pulse -->
              <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- DYNAMIC ROUTE-SPECIFIC TERRAIN CONTOURS -->
            <path v-for="(tp, tpIdx) in routeGeography.terrain" :key="'t-'+tpIdx" :d="tp.d" :fill="tp.fill" :opacity="tp.opacity" />

            <!-- Dynamic Urban Zone Footprints -->
            <circle v-for="(uz, uzIdx) in routeGeography.urbanZones" :key="'u-'+uzIdx" :cx="uz.cx" :cy="uz.cy" :r="uz.r" fill="#94a3b8" opacity="0.15" />

            <!-- DYNAMIC ROUTE-SPECIFIC RIVER -->
            <template v-if="routeGeography.river">
              <path :d="routeGeography.river.d" stroke="#2563eb" stroke-width="26" fill="none" opacity="0.15" stroke-linecap="round" />
              <path :d="routeGeography.river.d" stroke="#3b82f6" stroke-width="8" fill="none" opacity="0.7" />
              <text :x="routeGeography.river.labelX" :y="routeGeography.river.labelY" fill="#1d4ed8" font-size="10" font-weight="900" font-family="sans-serif" opacity="0.9">
                {{ routeGeography.river.name }}
              </text>
            </template>

            <!-- MAIN EDGE-TO-EDGE RAILWAY TRACK LAYERS -->
            <!-- Layer 1: Crushed Stone Ballast Bed -->
            <path
              ref="railTrackRef"
              id="live-rail-track"
              :d="computedTrackPath"
              stroke="#334155"
              stroke-width="20"
              fill="none"
              stroke-linecap="round"
            />
            <path
              :d="computedTrackPath"
              stroke="#475569"
              stroke-width="14"
              fill="none"
              stroke-linecap="round"
            />

            <!-- Layer 2: Concrete Sleepers / Perpendicular Cross-Ties -->
            <path
              :d="computedTrackPath"
              stroke="#cbd5e1"
              stroke-width="12"
              stroke-dasharray="2 6"
              fill="none"
              stroke-linecap="round"
            />
            
            <!-- DYNAMIC BRIDGE TRUSSES -->
            <g v-for="(br, brIdx) in routeGeography.bridges" :key="'b-'+brIdx"
              :transform="`translate(${br.x}, ${br.y}) rotate(${br.rot})`">
              <rect x="-22" y="-14" width="44" height="28" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2" />
              <line x1="-22" y1="-14" x2="22" y2="14" stroke="#0f172a" stroke-width="1.5" />
              <line x1="-22" y1="14" x2="22" y2="-14" stroke="#0f172a" stroke-width="1.5" />
              <text x="0" y="-18" text-anchor="middle" fill="#475569" font-size="7.5" font-weight="900" font-family="sans-serif">{{ br.label }}</text>
            </g>

            <!-- Layer 3: Active Electrified Overhead Glowing Line -->
            <path
              :d="computedTrackPath"
              stroke="url(#activeTrackGlow)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
              opacity="0.95"
            />

            <!-- Dynamic Railway Signal Lights -->
            <g v-for="(sig, sigIdx) in routeGeography.signals" :key="'s-'+sigIdx"
              :transform="`translate(${sig.x}, ${sig.y})`">
              <line x1="0" y1="0" x2="0" y2="-16" stroke="#475569" stroke-width="2" />
              <circle cx="0" cy="-16" r="4" :fill="sig.color" />
              <circle v-if="sig.pulse" cx="0" cy="-16" r="8" :fill="sig.color" fill-opacity="0.4" class="animate-pulse" />
            </g>

            <!-- Station Nodes & Straight Clean Floating Callout Badges (Subtle Light Theme) -->
            <g
              v-for="(st, stIdx) in currentWaypoints"
              :key="stIdx"
              :transform="`translate(${st.x}, ${st.y})`"
              class="group cursor-pointer"
            >
              <!-- Outer Distance Ring -->
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '15' : '11'"
                fill="none"
                :stroke="st.status === 'passed' ? '#059669' : st.status === 'approaching' ? '#d97706' : '#2563eb'"
                stroke-width="2"
                stroke-dasharray="3 3"
                class="opacity-90"
              />

              <!-- Inner Station Circle -->
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '8' : '5.5'"
                :fill="st.status === 'passed' ? '#059669' : st.status === 'approaching' ? '#d97706' : '#ffffff'"
                :stroke="st.status === 'passed' ? '#047857' : st.status === 'approaching' ? '#b45309' : '#2563eb'"
                stroke-width="2.5"
                class="transition-transform group-hover:scale-125"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />

              <!-- Straight Clean Upright Badge (Top for Even Index, Bottom for Odd Index) -->
              <g :transform="stIdx % 2 === 0 ? 'translate(0, -24)' : 'translate(0, 24)'">
                <!-- Leader Line -->
                <line x1="0" y1="0" :x2="0" :y2="stIdx % 2 === 0 ? 14 : -14" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2 2" />

                <!-- Straight Upright Floating Pill Badge -->
                <rect
                  :x="-((st.name.length * 6.5 + 46) / 2)"
                  :y="stIdx % 2 === 0 ? -18 : 2"
                  :width="st.name.length * 6.5 + 46"
                  height="20"
                  rx="7"
                  :fill="st.status === 'passed' ? '#065f46' : st.status === 'approaching' ? '#9a3412' : '#ffffff'"
                  fill-opacity="0.98"
                  :stroke="st.status === 'passed' ? '#34d399' : st.status === 'approaching' ? '#fbbf24' : '#3b82f6'"
                  stroke-width="1.6"
                  class="shadow-sm"
                />
                <text
                  x="0"
                  :y="stIdx % 2 === 0 ? -4 : 16"
                  text-anchor="middle"
                  :fill="st.status === 'passed' ? '#ffffff' : st.status === 'approaching' ? '#ffffff' : '#1e40af'"
                  font-size="10"
                  font-weight="800"
                  class="select-none font-sans tracking-wide"
                >
                  {{ st.name }} ({{ st.code }})
                </text>
              </g>
            </g>

            <!-- SCENIC BEAUTY POINTS OF INTEREST (Clean Floating Pin Icons) -->
            <g v-for="(poi, poiIdx) in routeScenicPoints" :key="'poi-'+poiIdx"
              :transform="`translate(${poi.x}, ${poi.y})`"
              class="cursor-pointer group">
              <!-- Glow -->
              <circle cx="0" cy="0" r="15" fill="#f59e0b" opacity="0.15" />
              <!-- Pin Circle -->
              <circle cx="0" cy="0" r="11" fill="#fffbeb" stroke="#d97706" stroke-width="2" class="group-hover:scale-125 transition-transform shadow-sm" />
              <!-- Emoji -->
              <text x="0" y="4" text-anchor="middle" font-size="11" class="select-none">{{ poi.emoji }}</text>

              <!-- Clean Mini Label Pill -->
              <g transform="translate(15, -4)">
                <rect x="-2" y="-9" :width="poi.name.length * 5.8 + 12" height="17" rx="5"
                  fill="#ffffff" fill-opacity="0.95" stroke="#d97706" stroke-width="1" class="shadow-2xs" />
                <text x="4" y="3" fill="#78350f" font-size="8.5" font-weight="800" font-family="sans-serif" class="select-none">
                  {{ poi.name }}
                </text>
              </g>
              <title>{{ poi.name }} — {{ poi.desc }} ({{ poi.side }})</title>
            </g>

            <!-- Sleek Modern Circular Vector Train Target Badge (Subtle Rail-Blue Theme) -->
            <g :transform="`translate(${trainPositionX}, ${trainPositionY}) rotate(${trainRotationAngle})`">
              <!-- Glowing Sonar Ripple Rings -->
              <circle cx="0" cy="0" r="28" fill="#0284c7" opacity="0.12" />
              <circle cx="0" cy="0" r="18" fill="#0284c7" opacity="0.25" class="animate-ping" />

              <!-- Main Circular Engine Disc (Vibrant Rail Blue & Pure White Border) -->
              <g class="drop-shadow-[0_4px_12px_rgba(2,132,199,0.4)] cursor-pointer">
                <!-- Disc Background -->
                <circle cx="0" cy="0" r="17" fill="#0284c7" stroke="#ffffff" stroke-width="2.5" />
                
                <!-- Vector Bullet Train Silhouette in Pure White -->
                <g transform="translate(-1, 0) scale(0.95)">
                  <!-- Aerodynamic Train Nose & Body -->
                  <path d="M -10 -6 L 2 -6 C 8 -6 12 -2 12 0 C 12 2 8 6 2 6 L -10 6 Z" fill="#ffffff" />
                  <!-- Windshield -->
                  <path d="M 3 -4 L 8 -4 C 10 -4 11 -2 11 0 C 11 2 10 4 8 4 L 3 4 Z" fill="#0284c7" />
                  <!-- Side Stripe -->
                  <line x1="-8" y1="0" x2="3" y2="0" stroke="#0284c7" stroke-width="1.5" />
                  <!-- Headlight Glow -->
                  <polygon points="12,-2 18,-6 18,6 12,2" fill="#fef08a" opacity="0.9" />
                </g>
              </g>

              <!-- Upright Floating Speed Callout Badge (Rail-Blue Theme) -->
              <g :transform="`translate(0, -32) rotate(${-trainRotationAngle})`">
                <line x1="0" y1="6" x2="0" y2="18" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="2 2" />
                <rect x="-34" y="-11" width="68" height="22" rx="7" fill="#0284c7" stroke="#ffffff" stroke-width="1.8" class="shadow-md" />
                <text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="900" class="font-sans tracking-wide">
                  ⚡ {{ currentLiveSpeed }} km/h
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- WINDOW VIEW SCENIC BEAUTY HIGHLIGHTS SECTION -->
      <div class="bg-white p-5 rounded-card border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">🌄</span>
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">
                Window View Scenic Beauty Highlights
              </h3>
              <p class="text-xs text-slate-500 font-semibold">
                Mountains, rivers &amp; historic landmarks visible from your train window on this route
              </p>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-black border border-amber-300 self-start sm:self-auto shadow-2xs">
            {{ routeScenicPoints.length }} Scenic Spots Synced
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          <div
            v-for="(poi, idx) in routeScenicPoints"
            :key="idx"
            class="bg-gradient-to-br from-amber-50/70 via-slate-50 to-orange-50/50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div class="w-10 h-10 rounded-xl bg-white text-xl flex items-center justify-center border border-amber-200 shadow-2xs shrink-0 group-hover:scale-110 transition-transform">
              {{ poi.emoji }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1.5">
                <h4 class="text-xs font-black text-slate-900 truncate">{{ poi.name }}</h4>
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 shrink-0">
                  {{ poi.side }}
                </span>
              </div>
              <p class="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                {{ poi.desc }}
              </p>
            </div>
          </div>
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
import { ROUTE_MAP_DATA } from '@/data/routeMapData'

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
      { name: 'New Delhi', code: 'NDLS', x: 40, y: 220, platform: '16', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 175, y: 195, platform: '3', arrTime: '06:40 PM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kota Jn', code: 'KOTA', x: 310, y: 235, platform: '1', arrTime: '09:00 PM', halt: '10 mins', dist: 465, status: 'passed', statusText: 'Passed 09:10 PM', isMajor: true },
      { name: 'Ratlam Jn', code: 'RTM', x: 450, y: 190, platform: '4', arrTime: '12:05 AM', halt: '5 mins', dist: 731, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Vadodara Jn', code: 'BRC', x: 590, y: 230, platform: '2', arrTime: '03:20 AM', halt: '10 mins', dist: 992, status: 'upcoming', statusText: 'Next Major Junction', isMajor: true },
      { name: 'Surat', code: 'ST', x: 725, y: 195, platform: '1', arrTime: '04:45 AM', halt: '5 mins', dist: 1122, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Mumbai Central', code: 'MMCT', x: 860, y: 215, platform: '1', arrTime: '08:35 AM', halt: 'Destination', dist: 1386, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // CHENNAI CENTRAL → KSR BENGALURU (South Corridor)
  if ((routeText.includes('MAS') && routeText.includes('SBC')) || trainNum === '20607' || trainNum === '12027' || trainNum === '12639') {
    return [
      { name: 'Chennai Central', code: 'MAS', x: 40, y: 220, platform: '6', arrTime: '05:50 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Arakkonam Jn', code: 'AJJ', x: 175, y: 195, platform: '3', arrTime: '07:00 AM', halt: '2 mins', dist: 68, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Katpadi Jn', code: 'KPD', x: 310, y: 235, platform: '1', arrTime: '07:45 AM', halt: '5 mins', dist: 130, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Jolarpettai', code: 'JTJ', x: 450, y: 190, platform: '2', arrTime: '08:30 AM', halt: '3 mins', dist: 195, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Bangarpet', code: 'BWT', x: 590, y: 230, platform: '1', arrTime: '09:15 AM', halt: '2 mins', dist: 260, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Whitefield', code: 'WFD', x: 725, y: 195, platform: '1', arrTime: '09:50 AM', halt: '2 mins', dist: 315, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
      { name: 'KSR Bengaluru', code: 'SBC', x: 860, y: 215, platform: '4', arrTime: '10:20 AM', halt: 'Destination', dist: 360, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  // NEW DELHI → HOWRAH (Eastern Railway Corridor)
  if (routeText.includes('HWH') || trainNum === '12302' || trainNum === '12488' || trainNum === '15910' || trainNum === '12304') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 40, y: 220, platform: '5', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Kanpur Central', code: 'CNB', x: 175, y: 195, platform: '3', arrTime: '09:12 PM', halt: '5 mins', dist: 440, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Prayagraj Jn', code: 'PRYJ', x: 310, y: 235, platform: '2', arrTime: '11:30 PM', halt: '5 mins', dist: 634, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Gaya Jn', code: 'GAYA', x: 450, y: 190, platform: '1', arrTime: '02:10 AM', halt: '5 mins', dist: 900, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Dhanbad Jn', code: 'DHN', x: 590, y: 230, platform: '4', arrTime: '05:15 AM', halt: '3 mins', dist: 1040, status: 'upcoming', statusText: 'Next Stop', isMajor: true },
      { name: 'Asansol Jn', code: 'ASN', x: 725, y: 195, platform: '2', arrTime: '06:45 AM', halt: '2 mins', dist: 1115, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Howrah Jn', code: 'HWH', x: 860, y: 215, platform: '9', arrTime: '09:55 AM', halt: 'Destination', dist: 1445, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('SBC') || trainNum === '11301' || trainNum === '11013') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 40, y: 220, platform: '1', arrTime: '08:10 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Kalyan Jn', code: 'KYN', x: 175, y: 195, platform: '5', arrTime: '09:12 AM', halt: '3 mins', dist: 54, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Pune Jn', code: 'PUNE', x: 310, y: 235, platform: '2', arrTime: '11:45 AM', halt: '5 mins', dist: 192, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Solapur Jn', code: 'SUR', x: 450, y: 190, platform: '1', arrTime: '04:00 PM', halt: '5 mins', dist: 454, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Kalaburagi', code: 'KLBG', x: 590, y: 230, platform: '2', arrTime: '06:15 PM', halt: '3 mins', dist: 567, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Anantapur', code: 'ATP', x: 725, y: 195, platform: '1', arrTime: '01:30 AM', halt: '2 mins', dist: 940, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
      { name: 'KSR Bengaluru', code: 'SBC', x: 860, y: 215, platform: '4', arrTime: '06:00 AM', halt: 'Destination', dist: 1134, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('PUNE') || trainNum === '12123' || trainNum === '12125' || trainNum === '11007' || trainNum === '11009') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 40, y: 220, platform: '1', arrTime: '05:10 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Dadar', code: 'DR', x: 175, y: 195, platform: '8', arrTime: '05:22 PM', halt: '3 mins', dist: 9, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Thane', code: 'TNA', x: 310, y: 235, platform: '5', arrTime: '05:45 PM', halt: '2 mins', dist: 34, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kalyan Jn', code: 'KYN', x: 450, y: 190, platform: '6', arrTime: '06:08 PM', halt: '2 mins', dist: 54, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Karjat', code: 'KJT', x: 590, y: 230, platform: '1', arrTime: '06:48 PM', halt: '2 mins', dist: 100, status: 'upcoming', statusText: 'Banker Engine Attachment', isMajor: false },
      { name: 'Lonavala', code: 'LNL', x: 725, y: 195, platform: '1', arrTime: '07:33 PM', halt: '2 mins', dist: 128, status: 'upcoming', statusText: 'Ghat Peak Clearance', isMajor: true },
      { name: 'Pune Jn', code: 'PUNE', x: 860, y: 215, platform: '1', arrTime: '08:25 PM', halt: 'Destination', dist: 192, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('ADI') || trainNum === '82902' || trainNum === '12934' || trainNum === '12902') {
    return [
      { name: 'Ahmedabad Jn', code: 'ADI', x: 40, y: 220, platform: '5', arrTime: '06:40 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Nadiad Jn', code: 'ND', x: 175, y: 195, platform: '1', arrTime: '07:19 AM', halt: '2 mins', dist: 46, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Vadodara Jn', code: 'BRC', x: 310, y: 235, platform: '2', arrTime: '08:03 AM', halt: '5 mins', dist: 100, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Surat', code: 'ST', x: 450, y: 190, platform: '1', arrTime: '09:35 AM', halt: '5 mins', dist: 230, status: 'approaching', statusText: 'Approaching', isMajor: true },
      { name: 'Vapi', code: 'VAPI', x: 590, y: 230, platform: '2', arrTime: '10:46 AM', halt: '2 mins', dist: 325, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Mumbai Central', code: 'MMCT', x: 860, y: 215, platform: '1', arrTime: '01:05 PM', halt: 'Destination', dist: 493, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('BSB') || trainNum === '22436' || trainNum === '14258' || trainNum === '12392') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 40, y: 220, platform: '16', arrTime: '06:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 175, y: 195, platform: '3', arrTime: '07:25 AM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed 07:27 AM', isMajor: false },
      { name: 'Agra Cantt', code: 'AGC', x: 310, y: 235, platform: '1', arrTime: '08:05 AM', halt: '5 mins', dist: 195, status: 'passed', statusText: 'Passed 08:10 AM', isMajor: true },
      { name: 'Gwalior Jn', code: 'GWL', x: 450, y: 190, platform: '2', arrTime: '09:20 AM', halt: '3 mins', dist: 313, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Jhansi Jn', code: 'VGLJ', x: 590, y: 230, platform: '4', arrTime: '10:45 AM', halt: '8 mins', dist: 410, status: 'upcoming', statusText: 'Next Stop (ETA 10:45 AM)', isMajor: true },
      { name: 'Kanpur Central', code: 'CNB', x: 725, y: 195, platform: '5', arrTime: '12:30 PM', halt: '10 mins', dist: 630, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Varanasi Jn', code: 'BSB', x: 860, y: 215, platform: '1', arrTime: '02:00 PM', halt: 'Destination', dist: 780, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  const fromNameStr = activeTripDetails.value.from.split('(')[0].trim() || 'Origin'
  const fromCodeStr = activeTripDetails.value.from.match(/\(([^)]+)\)/)?.[1] || 'DEP'
  const toNameStr = activeTripDetails.value.to.split('(')[0].trim() || 'Destination'
  const toCodeStr = activeTripDetails.value.to.match(/\(([^)]+)\)/)?.[1] || 'ARR'

  return [
    { name: fromNameStr, code: fromCodeStr, x: 40, y: 220, platform: '1', arrTime: '07:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
    { name: 'Junction A', code: 'JNC-A', x: 175, y: 195, platform: '2', arrTime: '08:15 AM', halt: '2 mins', dist: 85, status: 'passed', statusText: 'Passed', isMajor: false },
    { name: 'Intermediate Hub B', code: 'HUB-B', x: 310, y: 235, platform: '3', arrTime: '09:40 AM', halt: '5 mins', dist: 190, status: 'passed', statusText: 'Passed', isMajor: true },
    { name: 'Mid Corridor C', code: 'MID-C', x: 450, y: 190, platform: '1', arrTime: '11:10 AM', halt: '3 mins', dist: 310, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
    { name: 'Major Junction D', code: 'JNC-D', x: 590, y: 230, platform: '4', arrTime: '01:00 PM', halt: '8 mins', dist: 460, status: 'upcoming', statusText: 'Next Major Stop', isMajor: true },
    { name: 'Sector Control E', code: 'SEC-E', x: 725, y: 195, platform: '2', arrTime: '02:45 PM', halt: '5 mins', dist: 610, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
    { name: toNameStr, code: toCodeStr, x: 860, y: 215, platform: '1', arrTime: '04:30 PM', halt: 'Destination', dist: 750, status: 'upcoming', statusText: 'Destination', isMajor: true }
  ]
})

const currentNextStationName = computed(() => {
  const upcoming = currentWaypoints.value.find(w => w.status === 'approaching' || w.status === 'upcoming')
  return upcoming ? `${upcoming.name} (${upcoming.code})` : 'Destination'
})

// Resolve current route key for map data lookup
const currentRouteKey = computed(() => {
  const rt = `${activeTripDetails.value.from} ${activeTripDetails.value.to} ${activeTripDetails.value.trainName}`.toUpperCase()
  const tn = activeTripDetails.value.trainNumber || ''
  if ((rt.includes('MAS') && rt.includes('SBC')) || tn === '20607' || tn === '12027' || tn === '12639') return 'MAS_SBC'
  if (rt.includes('HWH') || tn === '12302' || tn === '12488' || tn === '15910' || tn === '12304') return 'NDLS_HWH'
  if ((rt.includes('MMCT') && rt.includes('NDLS')) || tn === '19020' || tn === '12952' || tn === '12954' || tn === '12925' || tn === '12903' || tn === '12904' || tn === '12926' || tn === '11057') return 'NDLS_MMCT'
  if (rt.includes('SBC') || tn === '11301' || tn === '11013') return 'MMCT_SBC'
  if (rt.includes('PUNE') || tn === '12123' || tn === '12125' || tn === '11007' || tn === '11009') return 'MMCT_PUNE'
  if (rt.includes('ADI') || tn === '82902' || tn === '12934' || tn === '12902' || tn === '20902') return 'ADI_MMCT'
  if (rt.includes('BSB') || tn === '22436' || tn === '14258' || tn === '12392') return 'NDLS_BSB'
  return 'FALLBACK'
})

const routeScenicPoints = computed(() => {
  return (ROUTE_MAP_DATA[currentRouteKey.value] || ROUTE_MAP_DATA.FALLBACK).scenic
})

const routeGeography = computed(() => {
  const data = ROUTE_MAP_DATA[currentRouteKey.value] || ROUTE_MAP_DATA.FALLBACK
  return { terrain: data.terrain, river: data.river, bridges: data.bridges, signals: data.signals, urbanZones: data.urbanZones }
})

// Dynamic SVG track path — Catmull-Rom spline extending flush from edge to edge (0px to 900px)
const computedTrackPath = computed(() => {
  const pts = currentWaypoints.value
  if (pts.length < 2) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  
  let d = `M 0 ${first.y + 12} C 12 ${first.y + 6}, 24 ${first.y + 2}, ${first.x} ${first.y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const cp1x = Math.round(p1.x + (p2.x - p0.x) / 6)
    const cp1y = Math.round(p1.y + (p2.y - p0.y) / 6)
    const cp2x = Math.round(p2.x - (p3.x - p1.x) / 6)
    const cp2y = Math.round(p2.y - (p3.y - p1.y) / 6)
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`
  }
  d += ` C ${last.x + 12} ${last.y - 6}, 888 ${last.y - 12}, 900 ${last.y - 15}`
  return d
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
const trainRotationAngle = ref(-25)

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
    trainPositionX.value = Math.round(40 + p * 820)
    trainPositionY.value = Math.round(330 - (p * 260))
    trainRotationAngle.value = -35
    return
  }

  try {
    const totalLength = railTrackRef.value.getTotalLength()
    const currentLength = trainProgressPercent.value * totalLength
    const pt1 = railTrackRef.value.getPointAtLength(currentLength)
    const pt2 = railTrackRef.value.getPointAtLength(Math.min(totalLength, currentLength + 8))

    trainPositionX.value = Math.round(pt1.x)
    trainPositionY.value = Math.round(pt1.y)

    const dx = pt2.x - pt1.x
    const dy = pt2.y - pt1.y
    const angleRad = Math.atan2(dy, dx)
    // Counter-clockwise tilt (-20 deg offset) to align perfectly along the track trajectory
    trainRotationAngle.value = Math.round(angleRad * (180 / Math.PI)) - 20
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
