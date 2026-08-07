<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header with Back Arrow -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
              Search Trains
            </h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Available trains between {{ searchStore.fromStation?.name }} &amp; {{ searchStore.toStation?.name }}
            </p>
          </div>
        </div>

        <span class="px-3.5 py-1 rounded-full bg-rail-100 text-rail-700 text-xs font-bold border border-rail-200">
          {{ searchStore.filteredTrains.length }} Trains Found
        </span>
      </div>

      <!-- Main Train Search Card Form -->
      <div class="bg-white p-6 sm:p-8 rounded-card border border-slate-200/80 shadow-soft card-glow-hover">
        <form @submit.prevent="executeSearch" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <!-- From Station Input -->
            <div class="md:col-span-5 space-y-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">From Station</label>
              <CustomSelect
                v-model="fromCode"
                :options="stationOptions"
                size="medium"
                rounded="medium"
                fillMode="solid"
                :icon="MapPin"
              />
            </div>

            <!-- Swap Stations Button -->
            <div class="md:col-span-2 flex justify-center pt-2 md:pt-5">
              <button
                type="button"
                @click="searchStore.swapStations()"
                class="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                title="Swap Stations"
              >
                <ArrowLeftRight class="w-4 h-4" />
              </button>
            </div>

            <!-- To Station Input -->
            <div class="md:col-span-5 space-y-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">To Station</label>
              <CustomSelect
                v-model="toCode"
                :options="stationOptions"
                size="medium"
                rounded="medium"
                fillMode="solid"
                :icon="MapPin"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <!-- Travel Date Picker -->
            <div class="md:col-span-4 space-y-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Journey</label>
              <div class="relative">
                <Calendar class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  v-model="searchStore.travelDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 font-bold cursor-pointer"
                />
              </div>
            </div>

            <!-- Travel Class Dropdown -->
            <div class="md:col-span-4 space-y-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Class Filter</label>
              <CustomSelect
                v-model="searchStore.selectedClass"
                :options="classOptions"
                size="medium"
                rounded="medium"
                fillMode="solid"
              />
            </div>

            <!-- Purpose of Travel -->
            <div class="md:col-span-4 space-y-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Purpose (Optional)</label>
              <CustomSelect
                v-model="searchStore.travelPurpose"
                :options="purposeOptions"
                size="medium"
                rounded="medium"
                fillMode="solid"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Filter Buttons Row -->
      <div class="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          @click="searchStore.activeFilter = 'All'"
          :class="[
            'px-5 py-2 rounded-btn text-xs font-bold border transition-all',
            searchStore.activeFilter === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
        >
          All Trains ({{ searchStore.filteredTrains.length }})
        </button>

        <button
          @click="searchStore.activeFilter = 'Fastest'"
          :class="[
            'px-5 py-2 rounded-btn text-xs font-bold border transition-all flex items-center gap-1.5',
            searchStore.activeFilter === 'Fastest' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <Zap class="w-3.5 h-3.5 text-amber-500" />
          Fastest
        </button>

        <button
          @click="searchStore.activeFilter = 'Most Reliable'"
          :class="[
            'px-5 py-2 rounded-btn text-xs font-bold border transition-all flex items-center gap-1.5',
            searchStore.activeFilter === 'Most Reliable' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
          Most Reliable
        </button>

        <button
          @click="searchStore.activeFilter = 'Cheapest'"
          :class="[
            'px-5 py-2 rounded-btn text-xs font-bold border transition-all flex items-center gap-1.5',
            searchStore.activeFilter === 'Cheapest' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <IndianRupee class="w-3.5 h-3.5 text-rail-500" />
          Cheapest
        </button>
      </div>

      <!-- Train Search Results List -->
      <div class="space-y-4">
        <div
          v-for="train in searchStore.filteredTrains"
          :key="train.id"
          class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover space-y-4"
        >
          <!-- Top Train Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-rail-50 text-rail-600 border border-rail-100 flex items-center justify-center font-bold shadow-sm">
                <Train class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-rail-900 flex items-center gap-2">
                  {{ train.name }}
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold border border-slate-200">
                    #{{ train.number }}
                  </span>
                </h3>
                <div class="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span class="font-bold text-slate-700">Runs On: {{ train.runsOn.join(', ') }}</span>
                  <span>•</span>
                  <span class="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck class="w-3.5 h-3.5" />
                    {{ train.punctualityScore }}% Historical Score
                  </span>
                </div>
              </div>
            </div>

            <!-- Price & Action Button -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <span class="text-xs text-slate-400 font-medium">Starts from</span>
                <div class="text-xl font-black text-rail-900">
                  ₹{{ train.price.toLocaleString('en-IN') }}
                </div>
              </div>
              <button
                @click="handleSelectTrain(train)"
                class="px-6 py-2.5 bg-rail-500 hover:bg-rail-600 text-white font-bold text-xs rounded-btn shadow transition-all flex items-center gap-1.5 glow-on-hover"
              >
                <span>Select &amp; Track</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Schedule & Duration Line -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2">
            <div class="md:col-span-4 text-left">
              <span class="text-2xl font-black text-slate-900">{{ train.deptTime }}</span>
              <div class="text-xs text-slate-600 font-bold">{{ train.fromName }} ({{ train.fromCode }})</div>
            </div>

            <div class="md:col-span-4 flex flex-col items-center justify-center">
              <span class="text-xs font-extrabold text-slate-600 mb-1">{{ train.duration }}</span>
              <div class="w-full flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-rail-500"></span>
                <div class="flex-1 h-0.5 bg-slate-300 relative">
                  <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-rail-500"></div>
                </div>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Superfast Express Line</span>
            </div>

            <div class="md:col-span-4 text-right">
              <span class="text-2xl font-black text-slate-900">{{ train.arrTime }}</span>
              <div class="text-xs text-slate-600 font-bold">{{ train.toName }} ({{ train.toCode }})</div>
            </div>
          </div>

          <!-- Class Availability Chips -->
          <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <div
              v-for="cls in train.classes"
              :key="cls.code"
              class="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs shadow-sm hover:border-rail-400 transition-colors"
            >
              <span class="font-extrabold text-slate-900">{{ cls.code }}</span>
              <span class="font-bold text-slate-600">₹{{ cls.price }}</span>
              <span
                :class="[
                  'px-2.5 py-0.5 rounded font-black text-[11px]',
                  cls.statusType === 'available' ? 'bg-emerald-100 text-emerald-800' :
                  cls.statusType === 'rac' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ cls.status }}
              </span>
            </div>

            <div v-if="!authStore.isAuthenticated" class="ml-auto text-xs text-rail-600 font-bold flex items-center gap-1.5 bg-rail-50 px-3 py-1.5 rounded-lg border border-rail-100">
              <Lock class="w-3.5 h-3.5" />
              <span>Sign in to unlock AI Delay Protection &amp; Risk Meter</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign In Modal -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      @click.self="showAuthModal = false"
    >
      <div class="relative w-full max-w-md card-glow-hover">
        <button
          @click="showAuthModal = false"
          class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center z-10 font-black text-sm border border-slate-200"
        >
          ✕
        </button>
        <AuthWidget />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { POPULAR_STATIONS } from '@/data/stations'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import {
  ArrowLeft,
  MapPin,
  ArrowLeftRight,
  Calendar,
  Zap,
  ShieldCheck,
  IndianRupee,
  Train,
  ArrowRight,
  Lock
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const authStore = useAuthStore()
const journeyStore = useJourneyStore()

const stationOptions = computed(() =>
  POPULAR_STATIONS.map(st => ({ label: `${st.city} (${st.code}) - ${st.name}`, value: st.code }))
)

const classOptions = [
  { label: 'All Classes (AC & Chair)', value: 'All Classes' },
  { label: 'Executive Chair (EC)', value: 'EC' },
  { label: 'AC Chair Car (CC)', value: 'CC' },
  { label: 'First AC (1A)', value: '1A' },
  { label: 'Second AC (2A)', value: '2A' },
  { label: 'Third AC (3A)', value: '3A' },
  { label: 'Sleeper Class (SL)', value: 'SL' }
]

const purposeOptions = [
  { label: 'Select Purpose (Exam, Business...)', value: '' },
  { label: 'Competitive Exam / Interview', value: 'exam' },
  { label: 'Airport Connect / Flight', value: 'flight' },
  { label: 'Medical Treatment', value: 'medical' },
  { label: 'Leisure / Vacation', value: 'vacation' }
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

const showAuthModal = ref(false)

function executeSearch() {
  // Store handles station pair filter automatically
}

function handleSelectTrain(train) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    router.push('/journey-planner')
  }
}
</script>
