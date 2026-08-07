<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-6">
      <!-- Title & Header -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Search class="w-6 h-6 text-rail-500" />
            <span>Authenticated Train Search &amp; 7-Day Delay Telemetry</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Search station pairs to inspect past 7-day historical delay logs, section speeds, and arrival punctuality.
          </p>
        </div>
      </div>

      <!-- Main Authenticated Search Component with 7-Day Past Delay Telemetry -->
      <DashboardTrainSearch />
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardTrainSearch from '@/components/dashboard/DashboardTrainSearch.vue'
import { Search } from 'lucide-vue-next'
</script>
