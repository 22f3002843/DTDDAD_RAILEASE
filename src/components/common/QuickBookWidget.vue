<template>
  <div class="w-full max-w-md bg-white rounded-card shadow-soft-lg border border-slate-200/80 overflow-hidden relative transition-all duration-300">
    <!-- Top Navy Action Bar (With Direct IRCTC/IndianRail External Links) -->
    <div class="grid grid-cols-2 bg-[#1E3A8A] text-white text-xs font-bold divide-x divide-blue-900/50">
      <!-- PNR STATUS Button -->
      <a
        href="https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en"
        target="_blank"
        rel="noopener noreferrer"
        class="py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-blue-900/90 text-blue-100 transition-colors group cursor-pointer"
        title="Official Indian Railways PNR Status Portal"
      >
        <FileCheck class="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
        <span>PNR STATUS</span>
        <ExternalLink class="w-3 h-3 opacity-60" />
      </a>

      <!-- CHARTS / VACANCY Button -->
      <a
        href="https://www.irctc.co.in/online-charts/"
        target="_blank"
        rel="noopener noreferrer"
        class="py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-blue-900/90 text-blue-100 transition-colors group cursor-pointer"
        title="Official IRCTC Reservation Charts &amp; Vacancy Portal"
      >
        <ClipboardList class="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
        <span>CHARTS / VACANCY</span>
        <ExternalLink class="w-3 h-3 opacity-60" />
      </a>
    </div>

    <!-- Main Widget Container -->
    <div class="p-6 sm:p-7 space-y-5">
      <!-- Title -->
      <div class="text-center pb-1">
        <h2 class="text-2xl font-black text-[#1E3A8A] tracking-wider uppercase">
          BOOK TICKET
        </h2>
        <p class="text-[11px] text-slate-500 font-medium mt-0.5">
          Fast &amp; Reliable Indian Railways Search
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
              @click="searchStore.swapStations()"
              class="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
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

        <!-- Quota Dropdown -->
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Quota</label>
          <CustomSelect
            v-model="selectedQuota"
            :options="quotaOptions"
            size="small"
            rounded="medium"
            fillMode="solid"
            :icon="Grid"
          />
        </div>

        <!-- Concession Checkboxes -->
        <div class="space-y-2 pt-1 text-[11px] font-semibold text-[#1E3A8A]">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="disabilityConcession" class="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" />
            <span>Person With Disability Concession</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="flexibleDate" class="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" />
            <span>Flexible With Date</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="railwayPass" class="rounded border-slate-300 text-blue-600 w-3.5 h-3.5" />
            <span>Railway Pass Concession</span>
          </label>
        </div>

        <!-- Orange CTA Button (Search Trains) -->
        <button
          type="submit"
          class="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-3"
        >
          <span>Search Trains</span>
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
  FileCheck,
  ClipboardList,
  Navigation,
  MapPin,
  ArrowLeftRight,
  Calendar,
  Briefcase,
  Grid,
  ArrowRight,
  ExternalLink
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

const quotaOptions = [
  { label: 'GENERAL', value: 'GENERAL' },
  { label: 'TATKAL', value: 'TATKAL' },
  { label: 'LADIES', value: 'LADIES' },
  { label: 'PREMIUM TATKAL', value: 'PREMIUM TATKAL' }
]

const fromCode = computed({
  get: () => searchStore.fromStation?.code || 'NDLS',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) searchStore.fromStation = st
  }
})

const toCode = computed({
  get: () => searchStore.toStation?.code || 'MMCT',
  set: (val) => {
    const st = POPULAR_STATIONS.find(s => s.code === val)
    if (st) searchStore.toStation = st
  }
})

const selectedQuota = ref('GENERAL')
const disabilityConcession = ref(false)
const flexibleDate = ref(false)
const railwayPass = ref(false)

function handleQuickSearch() {
  router.push('/search')
}
</script>
