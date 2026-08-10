<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-5 font-sans">
      <!-- Compact Google Calendar Style Top Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow shrink-0">
            <CalendarIcon class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>My Journey Calendar</span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Synced to Today ({{ todayFormattedString }})
              </span>
            </h1>
            <p class="text-[11px] text-slate-500 font-medium">
              Real-time schedule calendar, departure milestones &amp; active train telemetry.
            </p>
          </div>
        </div>

        <!-- Google Calendar View Switcher & Month Navigation -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Month Navigator (< Today > Month Year) -->
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              @click="changeMonth(-1)"
              class="p-1 rounded hover:bg-white text-slate-700 font-bold transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
            </button>
            <button
              @click="resetToToday"
              class="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded shadow-xs transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              @click="changeMonth(1)"
              class="p-1 rounded hover:bg-white text-slate-700 font-bold transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
            <span class="px-2 text-[11px] font-black text-slate-900 uppercase tracking-tight">
              {{ currentMonthName }} {{ currentYear }}
            </span>
          </div>

          <!-- View Mode Tabs (Month vs List) -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              @click="calendarViewMode = 'month'"
              :class="[
                'px-3 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer',
                calendarViewMode === 'month' ? 'bg-rail-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Month View
            </button>
            <button
              @click="calendarViewMode = 'list'"
              :class="[
                'px-3 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer',
                calendarViewMode === 'list' ? 'bg-rail-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              List View
            </button>
          </div>

          <button
            @click="router.push('/search')"
            class="px-3.5 py-1.5 bg-rail-500 hover:bg-rail-600 text-white text-[11px] font-extrabold rounded-lg shadow transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>+ Add Train</span>
          </button>
        </div>
      </div>

      <!-- ==================== COMPACT MONTH VIEW ==================== -->
      <div v-if="calendarViewMode === 'month'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <!-- Day Names Header Row -->
        <div class="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2 text-[11px] font-black text-slate-500 uppercase tracking-wider">
          <span v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</span>
        </div>

        <!-- Compact 7-Column Month Days Grid -->
        <div class="grid grid-cols-7 divide-x divide-y divide-slate-200">
          <!-- Blank padding cells -->
          <div
            v-for="b in firstDayOfWeek"
            :key="'blank-' + b"
            class="bg-slate-50/50 p-1.5 min-h-[68px]"
          ></div>

          <!-- Active Days of Month -->
          <div
            v-for="dayNum in daysInMonth"
            :key="dayNum"
            @click="selectedDayIndex = dayNum"
            :class="[
              'p-1.5 min-h-[68px] space-y-1 transition-colors cursor-pointer group flex flex-col justify-between',
              isToday(dayNum) ? 'bg-blue-50/40 ring-1 ring-blue-400 inset-0' : 'hover:bg-slate-50'
            ]"
          >
            <!-- Day Number Header -->
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]',
                  isToday(dayNum) ? 'bg-rail-500 text-white shadow-sm ring-2 ring-blue-300' : 'text-slate-700 group-hover:text-slate-900'
                ]"
              >
                {{ dayNum }}
              </span>

              <span v-if="isToday(dayNum)" class="text-[9px] font-black text-rail-700 bg-blue-100 px-1.5 py-0.2 rounded">
                TODAY
              </span>
              <span v-else-if="getTripsForDay(dayNum).length" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <!-- Compact Event Chips on Calendar Day -->
            <div class="space-y-1 flex-1">
              <div
                v-for="trip in getTripsForDay(dayNum)"
                :key="trip.id"
                @click.stop="openTripDetails(trip)"
                :class="[
                  'p-1 rounded text-[9px] font-black border shadow-xs transition-all hover:scale-105 cursor-pointer truncate',
                  trip.statusType === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
                  trip.statusType === 'primary' ? 'bg-rail-500 text-white border-rail-600' : 'bg-amber-600 text-white border-amber-700'
                ]"
              >
                <div class="flex items-center gap-1 truncate">
                  <Train class="w-2.5 h-2.5 shrink-0" />
                  <span class="truncate">{{ trip.trainName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== LIST VIEW MODE ==================== -->
      <div v-else class="space-y-3 animate-fade-in">
        <div
          v-for="trip in journeyStore.upcomingTrips"
          :key="trip.id"
          class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-rail-600 flex items-center justify-center shrink-0">
              <Train class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  PNR: {{ trip.pnr }}
                </span>
                <span class="text-[11px] font-bold text-slate-500">{{ trip.seatInfo }}</span>
              </div>
              <h2 class="text-sm font-black text-slate-900 uppercase mt-0.5">
                {{ trip.trainName }} ({{ trip.trainNumber }})
              </h2>
              <p class="text-[11px] text-slate-500 font-medium">
                {{ trip.from }} &rarr; {{ trip.to }} • Departure: {{ trip.date }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {{ trip.status }}
            </span>
            <button
              @click="openTripDetails(trip)"
              class="px-3.5 py-1.5 bg-rail-500 hover:bg-rail-600 text-white font-bold text-xs rounded-lg shadow cursor-pointer transition-colors"
            >
              Inspect Telemetry &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Trip Details Popover Modal -->
      <TripDetailsModal
        v-if="selectedTripForModal"
        :trip="selectedTripForModal"
        @close="selectedTripForModal = null"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'
import TripDetailsModal from '@/components/common/TripDetailsModal.vue'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Train
} from 'lucide-vue-next'

const router = useRouter()
const journeyStore = useJourneyStore()

const calendarViewMode = ref('month')
const selectedTripForModal = ref(null)
const selectedDayIndex = ref(null)

// Initialize strictly synced to Today's date
const currentDate = ref(new Date())

const todayFormattedString = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonthName = computed(() => monthNames[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
})

function changeMonth(delta) {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + delta, 1)
}

function resetToToday() {
  currentDate.value = new Date()
}

function isToday(dayNum) {
  const t = new Date()
  return (
    t.getDate() === dayNum &&
    t.getMonth() === currentDate.value.getMonth() &&
    t.getFullYear() === currentDate.value.getFullYear()
  )
}

// Dynamically map active trips onto Today, Today + 3, and Today + 7 days relative to system today date
function getTripsForDay(dayNum) {
  const t = new Date()
  // Only map if viewing current active month
  if (currentDate.value.getMonth() !== t.getMonth() || currentDate.value.getFullYear() !== t.getFullYear()) {
    return []
  }

  const todayDay = t.getDate()
  const trip1Day = todayDay
  const trip2Day = (todayDay + 3) <= daysInMonth.value ? (todayDay + 3) : (todayDay + 3 - daysInMonth.value)
  const trip3Day = (todayDay + 7) <= daysInMonth.value ? (todayDay + 7) : (todayDay + 7 - daysInMonth.value)

  if (dayNum === trip1Day) {
    return [journeyStore.activeTrip || journeyStore.upcomingTrips[0]].filter(Boolean)
  }
  if (dayNum === trip2Day && journeyStore.upcomingTrips[1]) {
    return [journeyStore.upcomingTrips[1]].filter(Boolean)
  }
  if (dayNum === trip3Day && journeyStore.upcomingTrips[2]) {
    return [journeyStore.upcomingTrips[2]].filter(Boolean)
  }
  return []
}

function openTripDetails(trip) {
  selectedTripForModal.value = trip
}

onMounted(() => {
  resetToToday()
})
</script>
