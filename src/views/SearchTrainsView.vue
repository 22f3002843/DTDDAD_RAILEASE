<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-rail-500 selection:text-white">
    <!-- Clean Navbar -->
    <Navbar @openLogin="openAuthDialog('general')" />

    <!-- ==================== TOP NAVY MODIFY SEARCH BAR (MATCHING IRCTC SCREENSHOT) ==================== -->
    <div class="bg-white py-4 px-4 sm:px-10 lg:px-14 border-b border-slate-200 shadow-sm">
      <div class="max-w-[1700px] mx-auto space-y-3">
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

          <!-- Orange Update search Button -->
          <button
            type="button"
            @click="executeSearch"
            class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs tracking-wide shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
          >
            Update search
          </button>
        </div>

      </div>
    </div>

    <!-- ==================== MAIN CONTENT AREA (SIDEBAR + TRAIN RESULTS) ==================== -->
    <div class="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- ==================== LEFT SIDEBAR PANEL: REFINE RESULTS (TOGGLEABLE WITH SMOOTH ANIMATION) ==================== -->
      <transition
        enter-active-class="transition-all duration-300 ease-out transform"
        enter-from-class="opacity-0 -translate-x-6 scale-95"
        enter-to-class="opacity-100 translate-x-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in transform"
        leave-from-class="opacity-100 translate-x-0 scale-100"
        leave-to-class="opacity-0 -translate-x-6 scale-95"
      >
        <aside v-if="isFilterOpen" class="lg:col-span-3 space-y-5">
          <div class="bg-white rounded-card border border-slate-200 shadow-sm p-4 space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <SlidersHorizontal class="w-4 h-4 text-rail-600" />
                <span>Refine Results</span>
              </h3>
              <div class="flex items-center gap-2">
                <button @click="resetFilters" class="text-[11px] font-bold text-rail-600 hover:underline cursor-pointer">
                  Reset
                </button>
                <button
                  @click="isFilterOpen = false"
                  class="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-extrabold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Hide the filter panel"
                >
                  <PanelLeftClose class="w-3.5 h-3.5" />
                  <span>Hide</span>
                </button>
              </div>
            </div>

            <!-- JOURNEY CLASS FILTER -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">JOURNEY CLASS</span>
                <button @click="selectAllClasses" class="text-[10px] font-bold text-rail-600 hover:underline cursor-pointer">Select All</button>
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
                <button @click="selectAllTrainTypes" class="text-[10px] font-bold text-rail-600 hover:underline cursor-pointer">Select All</button>
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
                <button @click="searchStore.selectedTimeSlot = 'all'" class="text-[10px] font-bold text-rail-600 hover:underline cursor-pointer">Select All</button>
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px] font-bold text-center">
                <button
                  @click="searchStore.selectedTimeSlot = 'early'"
                  :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'early' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
                >
                  00:00 - 06:00<br /><span class="font-normal text-[10px]">Early Morning</span>
                </button>
                <button
                  @click="searchStore.selectedTimeSlot = 'morning'"
                  :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'morning' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
                >
                  06:00 - 12:00<br /><span class="font-normal text-[10px]">Morning</span>
                </button>
                <button
                  @click="searchStore.selectedTimeSlot = 'midday'"
                  :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'midday' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
                >
                  12:00 - 18:00<br /><span class="font-normal text-[10px]">Mid Day</span>
                </button>
                <button
                  @click="searchStore.selectedTimeSlot = 'night'"
                  :class="['p-2 rounded border transition-colors cursor-pointer', searchStore.selectedTimeSlot === 'night' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100']"
                >
                  18:00 - 24:00<br /><span class="font-normal text-[10px]">Night</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- ==================== RIGHT RESULTS PANEL ==================== -->
      <main :class="[isFilterOpen ? 'lg:col-span-9' : 'lg:col-span-12', 'space-y-4 transition-all']">
        
        <!-- Summary Header Banner Bar -->
        <div class="bg-white border border-slate-300 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-900 shadow-sm">
          <div class="flex items-center gap-3">
            <!-- Toggle Filter Button -->
            <button
              @click="isFilterOpen = !isFilterOpen"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs',
                isFilterOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              ]"
              title="Toggle Filter Options"
            >
              <SlidersHorizontal class="w-3.5 h-3.5" />
              <span>{{ isFilterOpen ? 'Hide Filters' : 'Filter Results' }}</span>
              <span v-if="activeFilterCount > 0" :class="['px-1.5 py-0.5 rounded text-[10px] font-extrabold leading-none', isFilterOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white']">
                {{ activeFilterCount }}
              </span>
              <ChevronDown v-if="!isFilterOpen" class="w-3.5 h-3.5 opacity-60" />
              <ChevronUp v-else class="w-3.5 h-3.5 opacity-60" />
            </button>

            <div>
              <span class="text-slate-900 text-sm font-black">{{ searchStore.filteredTrains.length }} Results</span> for
              <span class="text-slate-900 uppercase font-black px-1.5">{{ searchStore.fromStation?.name }} ➔ {{ searchStore.toStation?.name }}</span> |
              <span class="text-slate-600"> {{ formattedDate }}</span> | Quota:
              <span class="text-slate-900 px-1">{{ searchStore.selectedQuota }}</span>
            </div>
          </div>

          <!-- Day Navigation & Sorting Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="searchStore.activeFilter = 'Fastest'"
              :class="['px-3 py-1.5 rounded text-[11px] font-bold border transition-colors cursor-pointer', searchStore.activeFilter === 'Fastest' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200']"
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

        <!-- Authenticated Feature Promo Banner for Guests -->
        <div
          v-if="!authStore.isAuthenticated"
          @click="openAuthDialog('telemetry')"
          class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3.5 rounded-lg shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:brightness-110 transition-all border border-blue-700"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-700/60 border border-blue-400/40 flex items-center justify-center shrink-0">
              <Lock class="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <span class="text-xs font-black block text-sky-200 uppercase tracking-wider">Unlock Full 30-Day Delay Telemetry &amp; Live Journey Sync</span>
              <span class="text-[11px] text-blue-100">Sign In to sync a live journey and get alerts. Reliability scores are free for everyone.</span>
            </div>
          </div>
          <span class="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide shrink-0 shadow-sm">
            Sign In / Register &rarr;
          </span>
        </div>

        <!-- ==================== TRAIN CARDS LIST ==================== -->
        <div class="space-y-4">
          <div
            v-for="train in searchStore.filteredTrains"
            :key="train.id"
            :class="[
              'bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden',
              isBestTrain(train) ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
            ]"
          >
            <!-- One recommendation only. Three recommendations is a shrug;
                 one is a judgement, which is what this product is for. -->
            <div
              v-if="isBestTrain(train)"
              class="bg-emerald-600 text-white px-5 py-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider"
            >
              <Star class="w-3.5 h-3.5" />
              <span>Best for you &middot; {{ priorityLabel }}</span>
            </div>
            <!-- Card Header -->
            <div class="bg-slate-50/80 border-b border-slate-200/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-col gap-1.5">
                <h4 class="text-base font-black text-slate-900 uppercase">
                  {{ train.name }} ({{ train.number }})
                </h4>
                <!-- The full scorecard rather than a single pill: punctuality,
                     seat chance, predictability and realistic arrival, since a
                     booking is decided on more than whether it runs on time. -->
                <TrainScorecard :train="train" />
              </div>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span>Runs On: <strong class="text-slate-900 font-extrabold">{{ train.runsOn.join(' ') }}</strong></span>
                <!-- The route into the depth layer. Public, and phrased as a
                     question a passenger would actually ask. -->
                <button
                  @click="router.push(`/train/${train.number}`)"
                  class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 font-extrabold cursor-pointer transition-colors"
                >
                  <span>What could go wrong?</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
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
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {{ confidenceOf(train) }}/100 Confidence
                </div>
              </div>

              <!-- Arrival Station & Time -->
              <div class="text-right">
                <div class="text-xl font-black text-slate-900">{{ train.arrTime }}</div>
                <div class="text-xs font-bold text-slate-700 uppercase mt-0.5">
                  {{ train.toName }} ({{ train.toCode }})
                </div>
                <!-- Only rendered when the typical delay is large enough to matter.
                     A card that says nothing here is telling you there is nothing to worry about. -->
                <div
                  v-if="getRealisticArrival(train)"
                  class="text-[11px] font-bold text-amber-700 mt-1"
                >
                  Realistically around {{ getRealisticArrival(train) }}
                </div>
              </div>
            </div>

            <!-- Class Availability Grid Cards -->
            <div class="p-4 bg-slate-50/50 space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div
                  v-for="cls in train.classes"
                  :key="cls.code"
                  @click="requireAuthAction('class', train)"
                  class="bg-white border border-slate-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all space-y-1.5 group relative"
                >
                  <div class="flex items-center justify-between text-xs font-extrabold text-slate-900">
                    <span>{{ cls.name }}</span>
                    <span class="text-slate-500">₹{{ cls.price }}</span>
                  </div>

                  <div
                    :class="[
                      'text-xs font-black px-2 py-1 rounded text-center flex items-center justify-center gap-1.5 border',
                      cls.statusType === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      cls.statusType === 'rac' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      cls.statusType === 'regret' ? 'bg-slate-200 text-slate-800 border-slate-300 font-extrabold' :
                      'bg-rose-100 text-rose-800 border-rose-300'
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

                <div class="flex flex-wrap items-center gap-2.5">
                  <!-- + Add to Bookings Calendar Button with Auth Lock Check -->
                  <button
                    @click="handleAddToBookings(train)"
                    :class="[
                      'px-4 py-2.5 rounded font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider',
                      isTrainInBookings(train)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    ]"
                    :title="authStore.isAuthenticated ? 'Add Train to My Bookings' : 'Sign in required to add train to bookings'"
                  >
                    <Lock v-if="!authStore.isAuthenticated" class="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <Plus v-else-if="!isTrainInBookings(train)" class="w-3.5 h-3.5 text-white shrink-0" />
                    <Check v-else class="w-3.5 h-3.5 text-white shrink-0" />

                    <span>{{ isTrainInBookings(train) ? 'Added to Bookings ✅' : '+ Add to Bookings' }}</span>
                  </button>

                  <button
                    @click="requireAuthAction('book', train)"
                    class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer tracking-wide"
                  >
                    <span>Book Now / Track</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="requireAuthAction('dates', train)"
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

    <!-- Sign In / Register Modal Dialog -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      @click.self="showAuthModal = false"
    >
      <div class="relative w-full max-w-md">
        <!-- Close Button -->
        <button
          @click="showAuthModal = false"
          class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center z-10 font-black text-sm border border-slate-200 cursor-pointer"
        >
          ✕
        </button>

        <!-- Prompt Header Alert inside Modal -->
        <div class="bg-indigo-900 text-white p-4 rounded-t-2xl space-y-1 text-center border-b border-indigo-800">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
            <Lock class="w-3.5 h-3.5" />
            <span>Sign In Required</span>
          </div>
          <h4 class="text-sm font-black pt-1">
            Sign In or Register to Access Feature
          </h4>
          <p class="text-[11px] text-indigo-200 leading-tight">
            Create a free RailEase account to add trains to your bookings, track live PNR telemetry, and lock live safeguards.
          </p>
        </div>

        <div class="bg-white rounded-b-2xl p-2 shadow-2xl">
          <AuthWidget />
        </div>
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
import { useJourneyStore } from '@/stores/useJourneyStore'
import { POPULAR_STATIONS } from '@/data/stations'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/footer/Footer.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import TrainScorecard from '@/components/common/TrainScorecard.vue'
import { getRealisticArrival } from '@/services/reliability'
import { pickBestTrain, computeBaseConfidence } from '@/services/scoring'
import {
  MapPin,
  ArrowLeftRight,
  RefreshCw,
  ArrowRight,
  Lock,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  Plus,
  Check,
  Star,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const authStore = useAuthStore()
const journeyStore = useJourneyStore()

const showAuthModal = ref(false)

// The single recommended train, recomputed whenever results or priority change.
// This is what makes the priority selector visible: without it the re-ranking
// happens silently and the traveller never learns their choice did anything.
const bestTrain = computed(() =>
  pickBestTrain(searchStore.filteredTrains, {
    priority: searchStore.travelPriority,
    highStakes: false
  })
)

const priorityLabel = computed(() => ({
  reliability: 'most likely to arrive on time',
  price: 'best value that is still dependable',
  comfort: 'least crowded that is still dependable'
}[searchStore.travelPriority] || 'recommended'))

/**
 * Whether a train is the one being recommended.
 *
 * @param {Object} train - train object
 * @returns {Boolean} true when this is the recommended train
 */
function isBestTrain(train) {
  return !!bestTrain.value && bestTrain.value.number === train.number
}

/**
 * The confidence score for a train, used wherever a figure is shown inline.
 *
 * This exists so no template ever reaches for the raw punctualityScore field.
 * That field is now an INPUT to the model rather than something to display:
 * showing it beside a derived score produced two different percentages for the
 * same train on the same card, which is exactly the self-contradiction this
 * product cannot afford.
 *
 * @param {Object} train - train object
 * @returns {Number} confidence from 0 to 100
 */
function confidenceOf(train) {
  return computeBaseConfidence(train)
}
const isFilterOpen = ref(false)
const flexibleDate = ref(false)

onMounted(() => {
  console.log('[RailEase Public Search] Search Trains View Mounted!')
})

const activeFilterCount = computed(() => {
  let count = 0
  if (searchStore.selectedJourneyClasses.length < 7) count++
  if (searchStore.selectedTrainTypes.length < 5) count++
  if (searchStore.selectedTimeSlot !== 'all') count++
  return count
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

function isTrainInBookings(train) {
  if (!authStore.isAuthenticated || !journeyStore.activeTrip) return false
  return journeyStore.activeTrip.trainNumber === train.number
}

function handleAddToBookings(train) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    journeyStore.setActiveTripFromTrain(train, formattedDate.value)
    console.log('[RailEase Bookings] Added train to bookings calendar:', train.name, '(', train.number, ')')
  }
}

function openAuthDialog() {
  showAuthModal.value = true
}

function requireAuthAction(actionType, train) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    if (actionType === 'schedule') {
      router.push('/live-status')
    } else {
      if (train) {
        journeyStore.setActiveTripFromTrain(train, formattedDate.value)
      }
      router.push('/dashboard')
    }
  }
}

function executeSearch() {
  console.log('[RailEase Search Results] Search triggered for:', searchStore.fromStation?.code, '➔', searchStore.toStation?.code)
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
</script>
