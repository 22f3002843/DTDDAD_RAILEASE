<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-rail-500 selection:text-white">
    <!-- Clean Navbar -->
    <Navbar @openLogin="showAuthModal = true" />

    <!-- ==================== TOP NAVY MODIFY SEARCH BAR (MATCHING IRCTC SCREENSHOT) ==================== -->
    <div class="bg-[#1E3A8A] text-white py-3.5 px-4 sm:px-8 border-b border-blue-900 shadow-md">
      <div class="max-w-7xl mx-auto space-y-3">
        <!-- Top Input Fields Row -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- From Station Input -->
          <div class="flex-1 min-w-[200px]">
            <CustomSelect
              v-model="fromCode"
              :options="stationOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="MapPin"
            />
          </div>

          <!-- Swap Icon Button -->
          <button
            type="button"
            @click="searchStore.swapStations()"
            class="w-8 h-8 rounded-full border border-blue-400/40 bg-blue-900/60 hover:bg-blue-800 text-white flex items-center justify-center shadow-sm shrink-0 cursor-pointer"
            title="Swap Stations"
          >
            <ArrowLeftRight class="w-3.5 h-3.5" />
          </button>

          <!-- To Station Input -->
          <div class="flex-1 min-w-[200px]">
            <CustomSelect
              v-model="toCode"
              :options="stationOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="MapPin"
            />
          </div>

          <!-- Date Picker -->
          <div class="w-40">
            <input
              v-model="searchStore.travelDate"
              type="date"
              class="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <!-- Class Dropdown -->
          <div class="w-44">
            <CustomSelect
              v-model="searchStore.selectedClass"
              :options="classOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
          </div>

          <!-- Quota Dropdown -->
          <div class="w-36">
            <CustomSelect
              v-model="searchStore.selectedQuota"
              :options="quotaOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
          </div>

          <!-- Orange Modify Search Button -->
          <button
            type="button"
            @click="executeSearch"
            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Modify Search
          </button>
        </div>

        <!-- Concession Checkboxes Sub-Bar -->
        <div class="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-blue-100 pt-1 border-t border-blue-800/60">
          <label class="flex items-center gap-2 cursor-pointer hover:text-white">
            <input type="checkbox" v-model="flexibleDate" class="rounded border-blue-400 text-blue-600 w-3.5 h-3.5" />
            <span>Flexible With Date</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:text-white">
            <input type="checkbox" v-model="disabilityConcession" class="rounded border-blue-400 text-blue-600 w-3.5 h-3.5" />
            <span>Person With Disability Concession</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:text-white">
            <input type="checkbox" v-model="railwayPass" class="rounded border-blue-400 text-blue-600 w-3.5 h-3.5" />
            <span>Railway Pass Concession</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ==================== MAIN CONTENT AREA (SIDEBAR + TRAIN RESULTS) ==================== -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- ==================== LEFT SIDEBAR PANEL: REFINE RESULTS ==================== -->
      <aside class="lg:col-span-3 space-y-5">
        <div class="bg-white rounded-card border border-slate-200 shadow-sm p-4 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Refine Results</h3>
            <button @click="resetFilters" class="text-[11px] font-bold text-orange-600 hover:underline">
              Remove Filter
            </button>
          </div>

          <!-- JOURNEY CLASS FILTER -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">JOURNEY CLASS</span>
              <button @click="selectAllClasses" class="text-[10px] font-bold text-rail-600 hover:underline">Select All</button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" value="1A" v-model="searchStore.selectedJourneyClasses" class="rounded text-rail-600" />
                <span>AC First Class (1A)</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" value="2A" v-model="searchStore.selectedJourneyClasses" class="rounded text-rail-600" />
                <span>AC 2 Tier (2A)</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" value="3A" v-model="searchStore.selectedJourneyClasses" class="rounded text-rail-600" />
                <span>AC 3 Tier (3A)</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" value="3E" v-model="searchStore.selectedJourneyClasses" class="rounded text-rail-600" />
                <span>AC 3 Economy (3E)</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" value="SL" v-model="searchStore.selectedJourneyClasses" class="rounded text-rail-600" />
                <span>Sleeper (SL)</span>
              </label>
            </div>
          </div>

          <!-- TRAIN TYPE FILTER -->
          <div class="space-y-2.5 border-t border-slate-100 pt-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">TRAIN TYPE</span>
              <button @click="selectAllTrainTypes" class="text-[10px] font-bold text-rail-600 hover:underline">Select All</button>
            </div>
            <div class="space-y-2 text-xs text-slate-700 font-semibold">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="OTHER" v-model="searchStore.selectedTrainTypes" class="rounded text-rail-600" />
                <span class="w-3 h-3 rounded-sm bg-purple-500 inline-block"></span>
                <span>OTHER</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="RAJDHANI" v-model="searchStore.selectedTrainTypes" class="rounded text-rail-600" />
                <span class="w-3 h-3 rounded-sm bg-pink-500 inline-block"></span>
                <span>RAJDHANI</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="VANDE BHARAT" v-model="searchStore.selectedTrainTypes" class="rounded text-rail-600" />
                <span class="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                <span>VANDE BHARAT</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="SHATABDI" v-model="searchStore.selectedTrainTypes" class="rounded text-rail-600" />
                <span class="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                <span>SHATABDI</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="DURONTO" v-model="searchStore.selectedTrainTypes" class="rounded text-rail-600" />
                <span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                <span>DURONTO</span>
              </label>
            </div>
          </div>

          <!-- DEPARTURE TIME FILTER -->
          <div class="space-y-2.5 border-t border-slate-100 pt-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">DEPARTURE TIME</span>
              <button @click="searchStore.selectedTimeSlot = 'all'" class="text-[10px] font-bold text-rail-600 hover:underline">Select All</button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-bold text-center">
              <button
                @click="searchStore.selectedTimeSlot = 'early'"
                :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'early' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
              >
                00:00 - 06:00<br /><span class="font-normal text-[10px]">Early Morning</span>
              </button>
              <button
                @click="searchStore.selectedTimeSlot = 'morning'"
                :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'morning' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
              >
                06:00 - 12:00<br /><span class="font-normal text-[10px]">Morning</span>
              </button>
              <button
                @click="searchStore.selectedTimeSlot = 'midday'"
                :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'midday' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
              >
                12:00 - 18:00<br /><span class="font-normal text-[10px]">Mid Day</span>
              </button>
              <button
                @click="searchStore.selectedTimeSlot = 'night'"
                :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'night' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
              >
                18:00 - 24:00<br /><span class="font-normal text-[10px]">Night</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- ==================== RIGHT RESULTS PANEL ==================== -->
      <main class="lg:col-span-9 space-y-4">
        
        <!-- Summary Header Banner Bar -->
        <div class="bg-white border border-slate-300 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-900 shadow-sm">
          <div>
            <span class="text-slate-900 text-sm font-black">{{ searchStore.filteredTrains.length }} Results</span> for
            <span class="text-[#1E3A8A] uppercase font-black px-1.5">{{ searchStore.fromStation?.name }} ➔ {{ searchStore.toStation?.name }}</span> |
            <span class="text-slate-600"> {{ formattedDate }}</span> For Quota |
            <span class="text-slate-900 px-1">{{ searchStore.selectedQuota }}</span>
          </div>

          <!-- Day Navigation & Sorting Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="searchStore.activeFilter = 'Fastest'"
              :class="['px-3 py-1.5 rounded text-[11px] font-bold border transition-colors cursor-pointer', searchStore.activeFilter === 'Fastest' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200']"
            >
              Sort By | Departure
            </button>
            <button class="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer">
              &lt; Previous Day
            </button>
            <button class="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer">
              Next Day &gt;
            </button>
          </div>
        </div>

        <!-- ==================== TRAIN CARDS LIST ==================== -->
        <div class="space-y-4">
          <div
            v-for="train in searchStore.filteredTrains"
            :key="train.id"
            class="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden"
          >
            <!-- Card Header -->
            <div class="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <h4 class="text-base font-black text-slate-900 uppercase">
                  {{ train.name }} ({{ train.number }})
                </h4>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span>Runs On: <strong class="text-slate-900 font-extrabold">{{ train.runsOn.join(' ') }}</strong></span>
                <a href="https://www.irctc.co.in" target="_blank" class="text-blue-700 hover:underline flex items-center gap-1 font-bold">
                  Train Schedule
                </a>
              </div>
            </div>

            <!-- Schedule & Route Timings Row -->
            <div class="p-5 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100">
              <!-- Departure Station & Time -->
              <div class="text-left">
                <div class="text-xl font-black text-slate-900">{{ train.deptTime }}</div>
                <div class="text-xs font-bold text-slate-700 uppercase mt-0.5">
                  {{ train.fromName }} ({{ train.fromCode }}) | {{ formattedDate }}
                </div>
              </div>

              <!-- Duration Line -->
              <div class="flex flex-col items-center justify-center flex-1 max-w-xs">
                <div class="text-xs font-extrabold text-slate-500">{{ train.duration }}</div>
                <div class="w-full flex items-center gap-2 my-1">
                  <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                  <div class="flex-1 h-0.5 bg-slate-300 relative"></div>
                  <span class="w-2 h-2 rounded-full bg-slate-900"></span>
                </div>
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Superfast Line</div>
              </div>

              <!-- Arrival Station & Time -->
              <div class="text-right">
                <div class="text-xl font-black text-slate-900">{{ train.arrTime }}</div>
                <div class="text-xs font-bold text-slate-700 uppercase mt-0.5">
                  {{ train.toName }} ({{ train.toCode }})
                </div>
              </div>
            </div>

            <!-- Class Availability Grid Cards -->
            <div class="p-4 bg-slate-50/50 space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div
                  v-for="cls in train.classes"
                  :key="cls.code"
                  @click="refreshClassStatus(cls)"
                  class="bg-white border border-slate-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all space-y-1.5 group"
                >
                  <div class="flex items-center justify-between text-xs font-extrabold text-slate-900">
                    <span>{{ cls.name }}</span>
                    <span class="text-slate-500">₹{{ cls.price }}</span>
                  </div>

                  <div
                    :class="[
                      'text-xs font-black px-2 py-1 rounded text-center flex items-center justify-center gap-1.5',
                      cls.statusType === 'available' ? 'bg-emerald-100 text-emerald-800' :
                      cls.statusType === 'rac' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    <span>{{ cls.status }}</span>
                    <RefreshCw class="w-3 h-3 group-hover:rotate-180 transition-transform text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- Warning Note & Book Buttons -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                <p class="text-slate-500 text-[11px] italic font-medium">
                  * Please check NTES website or NTES app for actual time before boarding.
                </p>

                <div class="flex items-center gap-3">
                  <button
                    @click="handleSelectTrain(train)"
                    class="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Book Now / Track</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="handleSelectTrain(train)"
                    class="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-bold text-xs transition-colors cursor-pointer"
                  >
                    OTHER DATES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { POPULAR_STATIONS } from '@/data/stations'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/footer/Footer.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import {
  MapPin,
  ArrowLeftRight,
  RefreshCw,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const authStore = useAuthStore()

const showAuthModal = ref(false)
const flexibleDate = ref(false)
const disabilityConcession = ref(false)
const railwayPass = ref(false)

onMounted(() => {
  console.log('--------------------------------------------------')
  console.log('[RailEase Search Results] 🟢 Search View Mounted!')
  console.log('[RailEase Search Results] Route:', searchStore.fromStation?.name, '➔', searchStore.toStation?.name)
  console.log('[RailEase Search Results] Total Filtered Trains:', searchStore.filteredTrains.length)
  console.log('--------------------------------------------------')
})

const stationOptions = computed(() =>
  POPULAR_STATIONS.map(st => ({ label: `${st.city} (${st.code}) - ${st.name}`, value: st.code }))
)

const classOptions = [
  { label: 'All Classes', value: 'All Classes' },
  { label: 'Executive Chair (EC)', value: 'EC' },
  { label: 'AC Chair Car (CC)', value: 'CC' },
  { label: 'First AC (1A)', value: '1A' },
  { label: 'Second AC (2A)', value: '2A' },
  { label: 'Third AC (3A)', value: '3A' },
  { label: 'AC 3 Economy (3E)', value: '3E' },
  { label: 'Sleeper (SL)', value: 'SL' }
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

const formattedDate = computed(() => {
  if (!searchStore.travelDate) return 'Fri, 07 Aug 2026'
  const d = new Date(searchStore.travelDate)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
})

function executeSearch() {
  console.log('[RailEase Search Results] Modify Search triggered for:', searchStore.fromStation?.code, '➔', searchStore.toStation?.code)
}

function selectAllClasses() {
  searchStore.selectedJourneyClasses = ['1A', '2A', '3A', '3E', 'SL', 'EC', 'CC']
}

function selectAllTrainTypes() {
  searchStore.selectedTrainTypes = ['RAJDHANI', 'VANDE BHARAT', 'SHATABDI', 'DURONTO', 'OTHER']
}

function resetFilters() {
  selectAllClasses()
  selectAllTrainTypes()
  searchStore.selectedTimeSlot = 'all'
}

function refreshClassStatus(cls) {
  console.log('[RailEase Search Results] Refreshed status for class:', cls.name, cls.status)
}

function handleSelectTrain(train) {
  console.log('[RailEase Search Results] Selected Train:', train.name, `#${train.number}`)
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    router.push('/journey-planner')
  }
}
</script>
