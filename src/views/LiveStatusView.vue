<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header (Wireframe Image 1 Top) -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          Live Train Tracking
        </h1>
      </div>

      <!-- Top Metric Cards Grid (Matching Image 1 Top Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Train Info Card -->
        <div class="md:col-span-5 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-rail-500">Active Telemetry</span>
            <h2 class="text-xl font-black text-rail-900 mt-1">
              Vande Bharat Express (22436)
            </h2>
            <p class="text-xs text-slate-500 font-medium mt-1">
              New Delhi (NDLS) &rarr; Varanasi Jn (BSB)
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Signal Clear • Priority Line Active
          </div>
        </div>

        <!-- Speed, Delay, Next Station Card (Matching Image 1: 3 Columns) -->
        <div class="md:col-span-7 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft grid grid-cols-3 divide-x divide-slate-100 text-center">
          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Speed</span>
            <div class="text-2xl sm:text-3xl font-black text-rail-900 tracking-tight">
              128 <span class="text-xs font-bold text-slate-500">km/h</span>
            </div>
            <span class="text-[10px] text-emerald-600 font-semibold mt-1">Cruising Speed</span>
          </div>

          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Delay</span>
            <div class="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              0 <span class="text-xs font-bold text-emerald-600">min</span>
            </div>
            <span class="text-[10px] text-emerald-600 font-semibold mt-1">Right On Time</span>
          </div>

          <div class="px-3 flex flex-col justify-center items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Next Station</span>
            <div class="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-full">
              Kanpur Central
            </div>
            <span class="text-[10px] text-slate-500 font-semibold mt-1">ETA: 09:45 AM</span>
          </div>
        </div>
      </div>

      <!-- Middle Map Section (Matching Image 1 Interactive SVG Track Map) -->
      <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft relative overflow-hidden space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Radio class="w-4 h-4 text-emerald-500 animate-pulse" />
            <h2 class="text-base font-bold text-slate-900">Live Satellite Line Radar</h2>
          </div>
          <span class="text-xs text-slate-400 font-medium">GPS Signal: 100% Strong</span>
        </div>

        <div class="relative w-full h-[320px] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
          <!-- Background SVG Track Map Lines -->
          <svg class="w-full h-full object-cover" viewBox="0 0 800 320" fill="none">
            <!-- Background Map Street Grid Lines -->
            <path d="M 0 100 Q 200 40 400 120 T 800 80" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M 0 240 Q 300 280 600 180 T 800 220" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M 120 0 Q 80 150 220 320" stroke="#E2E8F0" stroke-width="3" />
            <path d="M 650 0 Q 550 180 720 320" stroke="#E2E8F0" stroke-width="3" />

            <!-- Main High Speed Rail Line Curved Path -->
            <path id="rail-track" d="M 80 260 C 220 180 380 220 520 130 C 620 60 700 80 750 70" stroke="#334155" stroke-width="4" fill="none" stroke-linecap="round" />

            <!-- Past Station Node -->
            <circle cx="120" cy="240" r="10" fill="#334155" />
            <text x="100" y="275" fill="#475569" font-size="11" font-weight="bold">New Delhi (NDLS)</text>

            <!-- Mid Station Node -->
            <circle cx="505" cy="135" r="10" fill="#334155" />
            <text x="475" y="165" fill="#475569" font-size="11" font-weight="bold">Kanpur Central</text>

            <!-- Destination Node -->
            <circle cx="740" cy="72" r="10" fill="none" stroke="#334155" stroke-width="4" />
            <text x="690" y="100" fill="#475569" font-size="11" font-weight="bold">Varanasi (BSB)</text>

            <!-- Animated Train Icon Position Badge -->
            <g transform="translate(310, 185)">
              <circle cx="0" cy="0" r="24" fill="white" stroke="#2563EB" stroke-width="3" class="filter drop-shadow-md" />
              <path d="M -7 -7 L 7 -7 L 7 5 L -7 5 Z" fill="#2563EB" />
            </g>
          </svg>

          <!-- Map Zoom Controls (Matching Image 1: [+] [-]) -->
          <div class="absolute right-4 bottom-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-md divide-y divide-slate-100 overflow-hidden font-bold text-slate-700 text-sm">
            <button class="w-9 h-9 flex items-center justify-center hover:bg-slate-100 transition-colors">+</button>
            <button class="w-9 h-9 flex items-center justify-center hover:bg-slate-100 transition-colors">&minus;</button>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Verified by Passengers (Left) & Recent Crowd Updates (Right) (Matching Image 1) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Verified by Passengers Card -->
        <div class="md:col-span-6 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-rail-900">
              Verified by Passengers
            </h3>
            <div class="flex items-center gap-2">
              <!-- Avatar Stack -->
              <div class="flex -space-x-2 overflow-hidden">
                <img class="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" />
                <img class="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="" />
                <img class="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="" />
                <img class="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="" />
                <div class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-[11px] font-bold text-slate-600">
                  +123
                </div>
              </div>
              <span class="text-xs text-slate-500 font-medium">Passenger verifications today</span>
            </div>
          </div>
          <ChevronRight class="w-5 h-5 text-slate-400" />
        </div>

        <!-- Recent Crowd Updates Card -->
        <div class="md:col-span-6 bg-white p-6 rounded-card border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div class="space-y-1.5 flex-1 pr-4">
            <h3 class="text-sm font-bold text-rail-900">
              Recent Crowd Updates
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed truncate">
              Coach C4: 65% Occupancy • AC Temperature optimal 22°C • On-time platform entry
            </p>
          </div>
          <ChevronRight class="w-5 h-5 text-slate-400 shrink-0" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { ArrowLeft, Radio, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
</script>
