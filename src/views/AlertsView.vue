<template>
  <AppLayout>
    <div class="w-full space-y-6 font-sans pb-10">
      <!-- CLEAN HEADER BAR WITH SUBTLE GRADIENT -->
      <div class="bg-gradient-to-r from-rail-50 via-sky-50/90 to-indigo-50/70 p-6 rounded-2xl border border-rail-200/80 shadow-soft flex items-center justify-between gap-4 relative overflow-hidden">
        <!-- Ambient Glowing Wave Auras -->
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-rail-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-1/3 top-0 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="h-1 bg-gradient-to-r from-rail-600 via-sky-500 to-indigo-600 absolute top-0 left-0 right-0"></div>

        <div class="flex items-center gap-3 relative z-10">
          <button
            @click="router.back()"
            class="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-rail-200/80 transition-colors cursor-pointer shadow-2xs"
            title="Go Back"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Bell class="w-6 h-6 text-rail-600" />
              <span>Real-Time PNR &amp; Trip Alerts</span>
            </h1>
            <p class="text-xs text-slate-600 font-semibold mt-0.5">
              Live updates on chart preparation, platform assignments, delay risk telemetry, and trip safeguards.
            </p>
          </div>
        </div>
      </div>

      <!-- Filter Tabs Row (Edge-to-Edge Card Container) -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div class="flex items-center gap-8 border-b border-slate-100 text-sm font-bold text-slate-500 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'pb-3 border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === tab ? 'text-rail-600 border-rail-600 font-extrabold' : 'border-transparent hover:text-slate-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Alerts List Cards (Edge-to-Edge Full Width) -->
      <div class="space-y-3">
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-md hover:border-rail-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
        >
          <div class="flex items-start sm:items-center gap-4">
            <div class="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-rail-600 group-hover:text-white transition-all shrink-0 mt-0.5 sm:mt-0">
              <Bell class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900 group-hover:text-rail-700 transition-colors">{{ alert.title }}</h3>
              <p class="text-xs text-slate-600 font-semibold mt-0.5 leading-relaxed">{{ alert.message }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <span
              :class="[
                'px-3.5 py-1.5 rounded-full text-xs font-extrabold border shadow-2xs',
                alert.category === 'Delay' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                alert.category === 'Platform' ? 'bg-blue-50 text-rail-700 border-rail-200' :
                alert.category === 'Offers' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                'bg-slate-100 text-slate-700 border-slate-200'
              ]"
            >
              {{ alert.category }}
            </span>
            <span class="text-xs text-slate-500 font-extrabold min-w-[70px] text-right">{{ alert.time }}</span>
            <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-rail-600 transition-all" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { ArrowLeft, Bell, ChevronRight } from 'lucide-vue-next'

const router = useRouter()

const activeTab = ref('All Alerts')
const tabs = ['All Alerts', 'Delay', 'Platform', 'Offers', 'Info']

const alertsList = [
  { id: 1, category: 'Delay', title: 'Chart Prepared - High Confidence On-Time', message: 'Vande Bharat Express (22436) chart prepared. Estimated departure 06:00 AM sharp.', time: '10:30 AM' },
  { id: 2, category: 'Platform', title: 'Platform Assigned - NDLS Platform #16', message: 'Train #12952 (Mumbai Rajdhani) has been assigned Platform #16 at New Delhi.', time: '09:45 AM' },
  { id: 3, category: 'Info', title: 'High-Stakes Mode Active', message: 'Your Exam journey safeguards are active. Backup train options reserved.', time: 'Yesterday' },
  { id: 4, category: 'Offers', title: 'Free Seat Delivery Voucher', message: 'Claim your 15% discount on eCatering meal orders for your upcoming trip.', time: '2 days ago' }
]

const filteredAlerts = computed(() => {
  if (activeTab.value === 'All Alerts') return alertsList
  return alertsList.filter(a => a.category === activeTab.value)
})
</script>
