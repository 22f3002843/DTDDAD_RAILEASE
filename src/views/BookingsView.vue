<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
            My Bookings
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage and track your active, upcoming, and past railway tickets.</p>
        </div>

        <button
          @click="router.push('/search')"
          class="px-5 py-2.5 bg-rail-500 hover:bg-rail-600 text-white rounded-btn font-semibold text-xs shadow-md transition-all"
        >
          + Book New Journey
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="trip in journeyStore.upcomingTrips"
          :key="trip.id"
          class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded bg-rail-100 text-rail-700">PNR: {{ trip.pnr }}</span>
                <span class="text-xs text-slate-400">|</span>
                <span class="text-xs text-slate-500 font-medium">{{ trip.seatInfo }}</span>
              </div>
              <h2 class="text-lg font-bold text-rail-900 mt-1">
                {{ trip.trainName }} ({{ trip.trainNumber }})
              </h2>
            </div>

            <div class="flex items-center gap-3">
              <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                {{ trip.status }}
              </span>
              <button
                @click="openDetails(trip)"
                class="px-4 py-2 border border-slate-300 hover:border-rail-500 text-slate-700 hover:text-rail-600 font-semibold text-xs rounded-btn transition-all"
              >
                Track Live &rarr;
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-600">
            <div>
              <span class="block font-bold text-slate-900">{{ trip.from }}</span>
              <span>Departure: {{ trip.date }}</span>
            </div>
            <div class="text-right">
              <span class="block font-bold text-slate-900">{{ trip.to }}</span>
              <span>Estimated Arrival: {{ trip.predictedArrival }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'

const router = useRouter()
const journeyStore = useJourneyStore()

function openDetails(trip) {
  journeyStore.selectTrip(trip)
  router.push('/journey-planner')
}
</script>
