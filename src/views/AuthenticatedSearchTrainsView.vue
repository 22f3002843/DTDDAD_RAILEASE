<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-6">
      <!-- Title & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Train class="w-7 h-7 text-rail-600" />
            <span>Train Intelligence &amp; Sync</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Historical 30-day punctuality telemetry, AI delay predictions, and live PNR journey sync.
          </p>
        </div>

        <!-- Subtle Top-Right Active Journey Notification Badge -->
        <div v-if="journeyStore.activeTrip" class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600 shadow-2xs shrink-0 self-start sm:self-auto">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>Currently Synced: <strong class="text-slate-900 font-bold">{{ journeyStore.activeTrip.trainName }} ({{ journeyStore.activeTrip.trainNumber }})</strong></span>
        </div>
        <div v-else class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-400 shrink-0 self-start sm:self-auto">
          <span class="w-2 h-2 rounded-full bg-slate-300"></span>
          <span>No Active Trip Synced</span>
        </div>
      </div>

      <!-- Main Authenticated Search Component with 30-Day Past Delay Telemetry -->
      <DashboardTrainSearch />
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardTrainSearch from '@/components/dashboard/DashboardTrainSearch.vue'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { Train } from 'lucide-vue-next'

const journeyStore = useJourneyStore()
</script>
