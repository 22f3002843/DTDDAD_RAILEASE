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
              Live Satellite Corridor Map
            </h2>
          </div>
          <button @click="resetTrainAnimation" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reset Marker</span>
          </button>
        </div>

        <!-- Dynamic Animated SVG Railway Map Canvas (TACTICAL CYBERPUNK DARK MODE) -->
        <div class="relative w-full h-[420px] rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-2xl shadow-emerald-950/20 flex items-center justify-center">
          <!-- Dark Slate Precision Grid Overlays -->
          <div class="absolute inset-0 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60"></div>
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:96px_96px] opacity-40"></div>

          <!-- Tactical Top-Left Telemetry HUD Card -->
          <div class="absolute top-3.5 left-4 text-[10px] font-mono font-black text-slate-200 flex items-center gap-2.5 z-20 select-none bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span class="flex items-center gap-1.5 text-emerald-400 font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              RADAR ACTIVE
            </span>
            <span class="text-slate-300 font-bold">28.6139° N, 77.2090° E</span>
            <span class="text-slate-600 hidden md:inline">|</span>
            <span class="text-slate-400 font-bold hidden md:inline">216m MSL</span>
          </div>

          <!-- Tactical Top-Right Satellite Pill -->
          <div class="absolute top-3.5 right-4 text-[10px] font-mono font-black text-sky-400 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md z-20 select-none hidden sm:flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span>ISRO NAVIC SATELLITE LOCK • 9.4 GHz</span>
          </div>

          <!-- Tactical Bottom Navigation Overlays: Scale Bar & Compass Rose -->
          <div class="absolute bottom-3.5 left-4 text-[10px] font-mono font-black text-slate-300 flex items-center gap-2.5 z-20 select-none bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span>SCALE 1:5,000,000</span>
            <span class="text-slate-600">|</span>
            <div class="flex items-center gap-1.5">
              <div class="w-8 h-1 bg-sky-500 rounded-xs"></div>
              <span>100 km</span>
            </div>
          </div>

          <div class="absolute bottom-3.5 right-4 z-20 select-none bg-slate-900/90 backdrop-blur-md p-2 rounded-full border border-slate-800 shadow-md text-emerald-400 flex items-center justify-center font-black text-xs w-9 h-9 hover:bg-slate-800 transition-colors" title="True North Alignment">
            <span class="text-[11px] font-mono font-black text-emerald-400">N ⇧</span>
          </div>

          <svg class="w-full h-full object-cover relative z-10" viewBox="0 0 900 420" fill="none">
            <defs>
              <linearGradient id="activeTrackGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="40%" stop-color="#38bdf8" />
                <stop offset="80%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>

              <radialGradient id="trainHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </radialGradient>

              <!-- Radar Sonar Ring Pulse -->
              <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- MAP BACKGROUND GEOGRAPHY: MOUNTAIN CONTOURS & TERRAIN -->
            <path d="M 0 170 Q 180 90 340 150 T 700 100 T 900 130 L 900 420 L 0 420 Z" fill="#1e293b" opacity="0.35" />
            <path d="M 0 250 Q 220 190 440 240 T 800 170 T 900 200 L 900 420 L 0 420 Z" fill="#0f172a" opacity="0.45" />

            <!-- Urban Zone City Footprints -->
            <circle cx="50" cy="325" r="38" fill="#334155" opacity="0.25" />
            <circle cx="315" cy="215" r="30" fill="#334155" opacity="0.25" />
            <circle cx="585" cy="165" r="34" fill="#334155" opacity="0.25" />
            <circle cx="850" cy="75" r="42" fill="#334155" opacity="0.25" />

            <!-- MAP BACKGROUND GEOGRAPHY: YAMUNA / CHAMBAL RIVER CURVE -->
            <path
              d="M 430 0 C 460 110 420 210 480 300 C 510 350 470 390 490 420"
              stroke="#0284c7"
              stroke-width="26"
              fill="none"
              opacity="0.2"
              stroke-linecap="round"
            />
            <path
              d="M 430 0 C 460 110 420 210 480 300 C 510 350 470 390 490 420"
              stroke="#38bdf8"
              stroke-width="9"
              fill="none"
              opacity="0.4"
            />
            <text x="450" y="115" fill="#38bdf8" font-size="9.5" font-weight="900" font-family="sans-serif" opacity="0.8">
              Chambal River
            </text>

            <!-- Station Loop Sidings & Yard Lines (Edge-to-Edge Realistic Junctions) -->
            <!-- Kota Yard Siding -->
            <path d="M 250 235 C 300 200 400 200 480 180" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <path d="M 250 235 C 300 200 400 200 480 180" stroke="#334155" stroke-width="8" stroke-dasharray="2 4" stroke-linecap="round" />
            <path d="M 250 234 C 300 199 400 199 480 179" stroke="#64748b" stroke-width="1.5" />
            <path d="M 250 236 C 300 201 400 201 480 181" stroke="#64748b" stroke-width="1.5" />

            <!-- Vadodara Junction Yard Siding -->
            <path d="M 540 180 C 600 140 680 120 770 95" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <path d="M 540 180 C 600 140 680 120 770 95" stroke="#334155" stroke-width="8" stroke-dasharray="2 4" stroke-linecap="round" />
            <path d="M 540 179 C 600 139 680 119 770 94" stroke="#64748b" stroke-width="1.5" />
            <path d="M 540 181 C 600 141 680 121 770 96" stroke="#64748b" stroke-width="1.5" />

            <!-- MAIN EDGE-TO-EDGE RAILWAY TRACK LAYERS (X: 40 to 860) -->
            <!-- Layer 1: Crushed Stone Ballast Bed -->
            <path
              ref="railTrackRef"
              id="live-rail-track"
              d="M 40 330 C 220 210 440 260 620 160 C 740 70 820 100 860 70"
              stroke="#0f172a"
              stroke-width="22"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M 40 330 C 220 210 440 260 620 160 C 740 70 820 100 860 70"
              stroke="#1e293b"
              stroke-width="16"
              fill="none"
              stroke-linecap="round"
            />

            <!-- Layer 2: Concrete Sleepers / Perpendicular Cross-Ties -->
            <path
              d="M 40 330 C 220 210 440 260 620 160 C 740 70 820 100 860 70"
              stroke="#475569"
              stroke-width="14"
              stroke-dasharray="2 6"
              fill="none"
              stroke-linecap="round"
            />

            <!-- Layer 3: Left Steel Rail -->
            <path
              d="M 40 327 C 220 207 440 257 620 157 C 740 67 820 97 860 67"
              stroke="#94a3b8"
              stroke-width="2.5"
              fill="none"
            />

            <!-- Layer 4: Right Steel Rail -->
            <path
              d="M 40 333 C 220 213 440 263 620 163 C 740 73 820 103 860 73"
              stroke="#94a3b8"
              stroke-width="2.5"
              fill="none"
            />

            <!-- STEEL GIRDER RAILWAY BRIDGE TRUSS (RIVER CROSSING AT KM 420) -->
            <g transform="translate(460, 222) rotate(-22)">
              <rect x="-18" y="-12" width="36" height="24" fill="#1e293b" stroke="#64748b" stroke-width="2" rx="3" />
              <line x1="-18" y1="-12" x2="18" y2="12" stroke="#64748b" stroke-width="1.5" />
              <line x1="-18" y1="12" x2="18" y2="-12" stroke="#64748b" stroke-width="1.5" />
              <text x="0" y="-15" text-anchor="middle" fill="#f8fafc" font-size="7.5" font-weight="900">BRIDGE #42</text>
            </g>

            <!-- Layer 5: Active Electrified Overhead (OHE) Glowing Line -->
            <path
              d="M 40 330 C 220 210 440 260 620 160 C 740 70 820 100 860 70"
              stroke="url(#activeTrackGlow)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
              opacity="0.95"
            />

            <!-- Railway Signal Lights & Automatic Block Posts -->
            <g transform="translate(200, 215)">
              <line x1="0" y1="0" x2="0" y2="-16" stroke="#475569" stroke-width="2" />
              <circle cx="0" cy="-16" r="4" fill="#10b981" />
              <circle cx="0" cy="-16" r="8" fill="#10b981" fill-opacity="0.3" class="animate-pulse" />
            </g>
            <g transform="translate(430, 210)">
              <line x1="0" y1="0" x2="0" y2="-16" stroke="#475569" stroke-width="2" />
              <circle cx="0" cy="-16" r="4" fill="#f59e0b" />
            </g>
            <g transform="translate(660, 130)">
              <line x1="0" y1="0" x2="0" y2="-16" stroke="#475569" stroke-width="2" />
              <circle cx="0" cy="-16" r="4" fill="#10b981" />
            </g>

            <!-- Station Nodes & Telemetry Rings with High-Contrast Dark Mode Badges -->
            <g
              v-for="(st, stIdx) in currentWaypoints"
              :key="stIdx"
              :transform="`translate(${st.x}, ${st.y})`"
              class="group cursor-pointer"
            >
              <!-- Outer Distance Radar Ring -->
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '16' : '11'"
                fill="none"
                :stroke="st.status === 'passed' ? '#10b981' : st.status === 'approaching' ? '#f59e0b' : '#38bdf8'"
                stroke-width="1.5"
                stroke-dasharray="3 3"
                class="opacity-80"
              />

              <!-- Inner Node Point -->
              <circle
                cx="0"
                cy="0"
                :r="st.isMajor ? '8' : '5.5'"
                :fill="st.status === 'passed' ? '#10b981' : st.status === 'approaching' ? '#f59e0b' : '#0f172a'"
                :stroke="st.status === 'passed' ? '#059669' : st.status === 'approaching' ? '#fbbf24' : '#38bdf8'"
                stroke-width="2.5"
                class="transition-transform group-hover:scale-125"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />

              <!-- Sideways Angled Station Callout Badge (-35 Deg Rotation in Cyberpunk Dark Mode) -->
              <g transform="translate(10, -14)">
                <!-- Pointer Leader Line from Node to Badge -->
                <line x1="-10" y1="14" x2="0" y2="0" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2 2" />

                <!-- Angled Sideways Dark Pill Badge -->
                <g transform="rotate(-35)">
                  <rect
                    x="-4"
                    y="-13"
                    :width="st.name.length * 7 + 52"
                    height="19"
                    rx="5"
                    :fill="st.status === 'passed' ? '#064e3b' : st.status === 'approaching' ? '#78350f' : '#0f172a'"
                    fill-opacity="0.94"
                    :stroke="st.status === 'passed' ? '#10b981' : st.status === 'approaching' ? '#f59e0b' : '#38bdf8'"
                    stroke-width="1.5"
                    class="shadow-md"
                  />
                  <text
                    x="2"
                    y="0"
                    text-anchor="start"
                    :fill="st.status === 'passed' ? '#a7f3d0' : st.status === 'approaching' ? '#fef3c7' : '#e0f2fe'"
                    font-size="10"
                    font-weight="900"
                    class="select-none font-sans tracking-wide"
                  >
                    {{ st.name }} ({{ st.code }})
                  </text>
                </g>
              </g>
            </g>

            <!-- Real Vande Bharat High-Speed Bullet Train Marker with Dynamic Heading Rotation -->
            <g :transform="`translate(${trainPositionX}, ${trainPositionY}) rotate(${trainRotationAngle})`">
              <!-- Radar Sonar Wave Pulse -->
              <circle cx="0" cy="0" r="38" fill="url(#radarScan)" />
              <circle cx="0" cy="0" r="24" fill="url(#trainHalo)" class="animate-pulse" />
              <circle cx="0" cy="0" r="14" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2" class="animate-ping" />

              <!-- Authentic 3D Vande Bharat High-Speed Train Image from /trainmap.png -->
              <g transform="scale(-1, 1)">
                <image
                  href="/trainmap.png"
                  x="-48"
                  y="-26"
                  width="96"
                  height="52"
                  preserveAspectRatio="xMidYMid meet"
                  class="drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                />
              </g>

              <!-- Elevated Upright Floating Speed Callout Tag (Stays Level & Upright in Dark Mode) -->
              <g :transform="`translate(0, -38) rotate(${-trainRotationAngle})`">
                <line x1="0" y1="8" x2="0" y2="24" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2 2" />
                <rect x="-38" y="-12" width="76" height="22" rx="7" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" class="shadow-lg shadow-sky-950/60" />
                <text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900" class="font-sans tracking-wide">
                  ⚡ {{ currentLiveSpeed }} km/h
                </text>
              </g>
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

      <!-- Moved here from the dashboard. Corridor health is about the network,
           not about one passenger's trip, so it belongs on the page where the
           network is the subject. -->
      <div class="bg-white rounded-card border border-slate-200 shadow-sm p-5 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">Live Network Rail Telemetry</h3>
          <span class="text-[11px] font-bold text-emerald-600">99.2% Corridor Operational Health</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            v-for="corridor in journeyStore.networkStatus"
            :key="corridor.corridor"
            class="border border-slate-200 rounded-xl p-3"
          >
            <p class="text-[11px] font-extrabold text-slate-900">{{ corridor.corridor }}</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-[11px] text-slate-500 font-semibold">Signal: <strong class="text-slate-700">{{ corridor.status }}</strong></span>
              <span class="text-[11px] font-black text-slate-600">{{ corridor.load }}</span>
            </div>
          </div>
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
      { name: 'New Delhi', code: 'NDLS', x: 50, y: 325, platform: '16', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 180, y: 245, platform: '3', arrTime: '06:40 PM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kota Jn', code: 'KOTA', x: 315, y: 215, platform: '1', arrTime: '09:00 PM', halt: '10 mins', dist: 465, status: 'passed', statusText: 'Passed 09:10 PM', isMajor: true },
      { name: 'Ratlam Jn', code: 'RTM', x: 450, y: 190, platform: '4', arrTime: '12:05 AM', halt: '5 mins', dist: 731, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Vadodara Jn', code: 'BRC', x: 585, y: 165, platform: '2', arrTime: '03:20 AM', halt: '10 mins', dist: 992, status: 'upcoming', statusText: 'Next Major Junction', isMajor: true },
      { name: 'Surat', code: 'ST', x: 720, y: 110, platform: '1', arrTime: '04:45 AM', halt: '5 mins', dist: 1122, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Mumbai Central', code: 'MMCT', x: 850, y: 75, platform: '1', arrTime: '08:35 AM', halt: 'Destination', dist: 1386, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('SBC') || trainNum === '11301' || trainNum === '11013') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 50, y: 325, platform: '1', arrTime: '08:10 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Kalyan Jn', code: 'KYN', x: 180, y: 245, platform: '5', arrTime: '09:12 AM', halt: '3 mins', dist: 54, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Pune Jn', code: 'PUNE', x: 315, y: 215, platform: '2', arrTime: '11:45 AM', halt: '5 mins', dist: 192, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Solapur Jn', code: 'SUR', x: 450, y: 190, platform: '1', arrTime: '04:00 PM', halt: '5 mins', dist: 454, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Kalaburagi', code: 'KLBG', x: 585, y: 165, platform: '2', arrTime: '06:15 PM', halt: '3 mins', dist: 567, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Anantapur', code: 'ATP', x: 720, y: 110, platform: '1', arrTime: '01:30 AM', halt: '2 mins', dist: 940, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
      { name: 'KSR Bengaluru', code: 'SBC', x: 850, y: 75, platform: '4', arrTime: '06:00 AM', halt: 'Destination', dist: 1134, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('PUNE') || trainNum === '12123' || trainNum === '12125' || trainNum === '11007' || trainNum === '11009') {
    return [
      { name: 'Mumbai Central', code: 'MMCT', x: 50, y: 325, platform: '1', arrTime: '05:10 PM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Dadar', code: 'DR', x: 180, y: 245, platform: '8', arrTime: '05:22 PM', halt: '3 mins', dist: 9, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Thane', code: 'TNA', x: 315, y: 215, platform: '5', arrTime: '05:45 PM', halt: '2 mins', dist: 34, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Kalyan Jn', code: 'KYN', x: 450, y: 190, platform: '6', arrTime: '06:08 PM', halt: '2 mins', dist: 54, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Karjat', code: 'KJT', x: 585, y: 165, platform: '1', arrTime: '06:48 PM', halt: '2 mins', dist: 100, status: 'upcoming', statusText: 'Banker Engine Attachment', isMajor: false },
      { name: 'Lonavala', code: 'LNL', x: 720, y: 110, platform: '1', arrTime: '07:33 PM', halt: '2 mins', dist: 128, status: 'upcoming', statusText: 'Ghat Peak Clearance', isMajor: true },
      { name: 'Pune Jn', code: 'PUNE', x: 850, y: 75, platform: '1', arrTime: '08:25 PM', halt: 'Destination', dist: 192, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('ADI') || trainNum === '82902' || trainNum === '12934' || trainNum === '12902') {
    return [
      { name: 'Ahmedabad Jn', code: 'ADI', x: 50, y: 325, platform: '5', arrTime: '06:40 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Nadiad Jn', code: 'ND', x: 210, y: 240, platform: '1', arrTime: '07:19 AM', halt: '2 mins', dist: 46, status: 'passed', statusText: 'Passed', isMajor: false },
      { name: 'Vadodara Jn', code: 'BRC', x: 370, y: 200, platform: '2', arrTime: '08:03 AM', halt: '5 mins', dist: 100, status: 'passed', statusText: 'Passed', isMajor: true },
      { name: 'Surat', code: 'ST', x: 530, y: 160, platform: '1', arrTime: '09:35 AM', halt: '5 mins', dist: 230, status: 'approaching', statusText: 'Approaching', isMajor: true },
      { name: 'Vapi', code: 'VAPI', x: 690, y: 115, platform: '2', arrTime: '10:46 AM', halt: '2 mins', dist: 325, status: 'upcoming', statusText: 'Next Stop', isMajor: false },
      { name: 'Mumbai Central', code: 'MMCT', x: 850, y: 75, platform: '1', arrTime: '01:05 PM', halt: 'Destination', dist: 493, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  if (routeText.includes('BSB') || trainNum === '22436' || trainNum === '14258' || trainNum === '12392') {
    return [
      { name: 'New Delhi', code: 'NDLS', x: 50, y: 325, platform: '16', arrTime: '06:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
      { name: 'Mathura Jn', code: 'MTJ', x: 180, y: 245, platform: '3', arrTime: '07:25 AM', halt: '2 mins', dist: 141, status: 'passed', statusText: 'Passed 07:27 AM', isMajor: false },
      { name: 'Agra Cantt', code: 'AGC', x: 315, y: 215, platform: '1', arrTime: '08:05 AM', halt: '5 mins', dist: 195, status: 'passed', statusText: 'Passed 08:10 AM', isMajor: true },
      { name: 'Gwalior Jn', code: 'GWL', x: 450, y: 190, platform: '2', arrTime: '09:20 AM', halt: '3 mins', dist: 313, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
      { name: 'Jhansi Jn', code: 'VGLJ', x: 585, y: 165, platform: '4', arrTime: '10:45 AM', halt: '8 mins', dist: 410, status: 'upcoming', statusText: 'Next Stop (ETA 10:45 AM)', isMajor: true },
      { name: 'Kanpur Central', code: 'CNB', x: 720, y: 110, platform: '5', arrTime: '12:30 PM', halt: '10 mins', dist: 630, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: true },
      { name: 'Varanasi Jn', code: 'BSB', x: 850, y: 75, platform: '1', arrTime: '02:00 PM', halt: 'Destination', dist: 780, status: 'upcoming', statusText: 'Destination', isMajor: true }
    ]
  }

  const fromNameStr = activeTripDetails.value.from.split('(')[0].trim() || 'Origin'
  const fromCodeStr = activeTripDetails.value.from.match(/\(([^)]+)\)/)?.[1] || 'DEP'
  const toNameStr = activeTripDetails.value.to.split('(')[0].trim() || 'Destination'
  const toCodeStr = activeTripDetails.value.to.match(/\(([^)]+)\)/)?.[1] || 'ARR'

  return [
    { name: fromNameStr, code: fromCodeStr, x: 50, y: 325, platform: '1', arrTime: '07:00 AM', halt: 'Origin', dist: 0, status: 'passed', statusText: 'Departed On Time', isMajor: true },
    { name: 'Junction A', code: 'JNC-A', x: 180, y: 245, platform: '2', arrTime: '08:15 AM', halt: '2 mins', dist: 85, status: 'passed', statusText: 'Passed', isMajor: false },
    { name: 'Intermediate Hub B', code: 'HUB-B', x: 315, y: 215, platform: '3', arrTime: '09:40 AM', halt: '5 mins', dist: 190, status: 'passed', statusText: 'Passed', isMajor: true },
    { name: 'Mid Corridor C', code: 'MID-C', x: 450, y: 190, platform: '1', arrTime: '11:10 AM', halt: '3 mins', dist: 310, status: 'approaching', statusText: 'Approaching Platform', isMajor: true },
    { name: 'Major Junction D', code: 'JNC-D', x: 585, y: 165, platform: '4', arrTime: '01:00 PM', halt: '8 mins', dist: 460, status: 'upcoming', statusText: 'Next Major Stop', isMajor: true },
    { name: 'Sector Control E', code: 'SEC-E', x: 720, y: 110, platform: '2', arrTime: '02:45 PM', halt: '5 mins', dist: 610, status: 'upcoming', statusText: 'Scheduled Stop', isMajor: false },
    { name: toNameStr, code: toCodeStr, x: 850, y: 75, platform: '1', arrTime: '04:30 PM', halt: 'Destination', dist: 750, status: 'upcoming', statusText: 'Destination', isMajor: true }
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
