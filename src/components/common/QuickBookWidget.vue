<template>
  <div class="w-full max-w-md bg-white rounded-card shadow-soft-lg border border-slate-200/80 overflow-hidden relative transition-all duration-300">
    <!-- Top bar states plainly what this tool does, and what it does not do.
         Booking links are still offered, but framed as a handoff rather than
         as our own function. -->
    <div class="bg-slate-900 text-white px-5 py-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-[11px] font-bold text-slate-300">
        <ShieldCheck class="w-4 h-4 text-emerald-400" />
        <span>We don't sell tickets</span>
      </div>
      <a
        href="https://www.irctc.co.in/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        title="Official IRCTC booking portal"
      >
        <span>Book on IRCTC</span>
        <ExternalLink class="w-3 h-3 opacity-70" />
      </a>
    </div>

    <!-- Main Widget Container -->
    <div class="p-6 sm:p-7 space-y-5">
      <!-- Title -->
      <div class="text-center pb-1">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">
          Check your train's reliability
        </h2>
        <p class="text-[11px] text-slate-500 font-medium mt-1">
          See how often it actually arrives on time before you book
        </p>
      </div>

      <!-- Quick Ticket Form -->
      <form @submit.prevent="handleQuickSearch" class="space-y-4">
        <!-- From & To Row with Swap Button -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div class="sm:col-span-5 relative">
            <label class="block text-[11px] font-bold text-slate-600 mb-1">From</label>
            <CustomSelect
              v-model="fromCode"
              :options="stationOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="Navigation"
            />
          </div>

          <!-- Swap Icon -->
          <div class="sm:col-span-2 flex justify-center pt-4 sm:pt-4">
            <button
              type="button"
              @click="handleSwap"
              class="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
            >
              <ArrowLeftRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="sm:col-span-5 relative">
            <label class="block text-[11px] font-bold text-slate-600 mb-1">To</label>
            <CustomSelect
              v-model="toCode"
              :options="stationOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="MapPin"
            />
          </div>
        </div>

        <!-- Date & Class Row -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">DD/MM/YYYY *</label>
            <div class="relative">
              <Calendar class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchStore.travelDate"
                type="date"
                class="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Class</label>
            <CustomSelect
              v-model="searchStore.selectedClass"
              :options="classOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="Briefcase"
            />
          </div>
        </div>

        <!-- Priority selector. One tap, optional, and it is the whole
             personalisation model: it re-weights how results are ranked without
             asking anyone to sign up or fill in a profile. -->
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5">What matters most?</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="option in priorityOptions"
              :key="option.value"
              type="button"
              @click="searchStore.travelPriority = option.value"
              :class="[
                'py-2 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer',
                searchStore.travelPriority === option.value
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
          <!-- States what the chosen ranking is based on, so the buttons stop
               being three unexplained words. -->
          <p class="text-[11px] text-slate-500 font-medium mt-1.5 leading-snug">{{ activeHint }}</p>
        </div>

        <!-- Primary CTA. The verb is "check", not "book", because checking is
             what this product actually does. -->
        <button
          type="submit"
          class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-3 cursor-pointer select-none"
        >
          <span>Check reliability</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { POPULAR_STATIONS } from '@/data/stations'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import {
  Navigation,
  MapPin,
  ArrowLeftRight,
  Calendar,
  Briefcase,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()

const stationOptions = computed(() =>
  POPULAR_STATIONS.map(st => ({ label: `${st.city} - ${st.code}`, value: st.code }))
)

const classOptions = [
  { label: 'All Classes', value: 'All Classes' },
  { label: 'Executive Chair', value: 'EC' },
  { label: 'AC Chair Car', value: 'CC' },
  { label: 'First AC (1A)', value: '1A' },
  { label: 'Second AC (2A)', value: '2A' },
  { label: 'Third AC (3A)', value: '3A' }
]

// Maps to the three ways a passenger can weigh a journey. Deliberately three,
// not five: this is a one-tap hint, not a preferences form.
// Labels name what is actually measured. "Comfort" was doing hidden work -
// it ranked on crowd level and train class - so a traveller choosing it had no
// idea what they were asking for. Each option now also carries a one-line
// explanation shown beneath the row.
const priorityOptions = [
  { label: 'On time', value: 'reliability', hint: 'Ranked by how often the train actually arrives on schedule.' },
  { label: 'Cheapest', value: 'price', hint: 'Ranked by lowest fare, with reliability breaking ties.' },
  { label: 'Less crowded', value: 'comfort', hint: 'Ranked by how busy the train usually is, and its seating class.' }
]

const activeHint = computed(
  () => priorityOptions.find((option) => option.value === searchStore.travelPriority)?.hint || ''
)

const fromCode = computed({
  get: () => searchStore.fromStation?.code || 'NDLS',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) {
      searchStore.fromStation = st
      console.log('[RailEase Search] Updated From Station to:', st.city, `(${st.code})`)
    }
  }
})

const toCode = computed({
  get: () => searchStore.toStation?.code || 'MMCT',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) {
      searchStore.toStation = st
      console.log('[RailEase Search] Updated To Station to:', st.city, `(${st.code})`)
    }
  }
})

function handleSwap() {
  console.log('[RailEase Search] Swapping stations...')
  searchStore.swapStations()
}

function handleQuickSearch(e) {
  if (e) e.preventDefault()
  
  const payload = {
    from: searchStore.fromStation?.name,
    to: searchStore.toStation?.name,
    date: searchStore.travelDate,
    class: searchStore.selectedClass,
    quota: searchStore.selectedQuota
  }
  
  console.log('--------------------------------------------------')
  console.log('[RailEase Search] 🚀 Search Trains button clicked!')
  console.log('[RailEase Search] Query Parameters:', payload)
  console.log('[RailEase Search] Total matching trains:', searchStore.filteredTrains.length)
  console.log('[RailEase Router] Navigating to /search view...')
  console.log('--------------------------------------------------')

  // Direct router navigation
  router.push('/search').catch(err => {
    console.error('[RailEase Router] Navigation Error:', err)
  })
}
</script>
