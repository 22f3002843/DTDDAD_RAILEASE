<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header (Matching Image 2 Top) -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          Alerts
        </h1>
      </div>

      <!-- Filter Tabs Row (Matching Image 2 Tabs: All Alerts | Delay | Platform | Offers | Info) -->
      <div class="flex items-center gap-8 border-b border-slate-200 text-sm font-bold text-slate-500 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'pb-3 border-b-2 transition-all whitespace-nowrap',
            activeTab === tab ? 'text-rail-900 border-slate-900 font-extrabold' : 'border-transparent hover:text-slate-700'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Alerts List Cards (Matching Image 2) -->
      <div class="space-y-3">
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-rail-500 group-hover:text-white transition-colors">
              <Bell class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">{{ alert.title }}</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">{{ alert.message }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold border',
                alert.category === 'Delay' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                alert.category === 'Platform' ? 'bg-blue-50 text-rail-700 border-rail-200' :
                alert.category === 'Offers' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-slate-100 text-slate-700 border-slate-200'
              ]"
            >
              {{ alert.category }}
            </span>
            <span class="text-xs text-slate-400 font-medium min-w-[70px] text-right">{{ alert.time }}</span>
            <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
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
