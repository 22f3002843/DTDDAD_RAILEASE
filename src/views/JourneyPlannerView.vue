<template>
  <AppLayout>
    <div class="w-full space-y-6 font-sans pb-10">
      <!-- LIGHT GRADIENT EMERGENCY RECOVERY HERO HEADER -->
      <div class="bg-gradient-to-r from-rail-50 via-sky-50/90 to-indigo-50/70 rounded-2xl p-6 sm:p-8 border border-rail-200/80 shadow-soft relative overflow-hidden">
        <!-- Ambient Glowing Wave Auras -->
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-rail-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-1/3 top-0 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="h-1 bg-gradient-to-r from-rail-600 via-sky-500 to-indigo-600 absolute top-0 left-0 right-0"></div>

        <div class="relative z-10 space-y-3 max-w-4xl pt-2">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 text-rail-900 text-xs font-black uppercase tracking-wider border border-rail-200 shadow-2xs">
            <AlertTriangle class="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Emergency Rail Recovery • Active Assist System</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Missed Your Train? We've Got You Covered.
          </h1>

          <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Tell us which train you missed and we will calculate <strong class="text-slate-900">3 instant alternative pathways</strong> (Express Catch-Up Cabs, Parallel Vande Bharat Tatkal, &amp; TDR Refunds) to get you to your destination on time!
          </p>
        </div>
      </div>

      <!-- STEP 1: SYNCED OR MANUAL TRAIN SELECTION CARD (EDGE-TO-EDGE) -->
      <div class="bg-white rounded-2xl shadow-soft border border-slate-200/90 overflow-hidden">
        <div class="p-6 space-y-4">
          <div v-if="autoDetectedTrain && !isPickerOpen" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 flex items-center justify-center border border-emerald-200 mt-0.5">
                <CheckCircle2 class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    Synced Journey Active
                  </span>
                  <span class="text-xs font-extrabold text-slate-500">PNR: {{ activeTripPnr }}</span>
                </div>
                <h2 class="text-base sm:text-lg font-extrabold text-slate-900 uppercase truncate mt-1">
                  {{ autoDetectedTrain.name }}
                  <span class="text-rail-600 font-black">({{ autoDetectedTrain.number }})</span>
                </h2>
                <p class="text-xs text-slate-600 font-semibold mt-0.5">
                  Scheduled departure <strong class="text-slate-900">{{ autoDetectedTrain.deptTime }}</strong> &middot;
                  {{ autoDetectedTrain.fromCode }} &rarr; {{ autoDetectedTrain.toCode }}
                </p>
              </div>
            </div>

            <button
              @click="isPickerOpen = true"
              class="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-rail-600 hover:text-rail-700 transition-all shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Select Different Train
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-xl bg-rail-600 text-white text-xs font-black flex items-center justify-center shadow-soft">1</span>
                <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Which train did you miss?</h2>
              </div>
              <button
                v-if="autoDetectedTrain"
                @click="cancelPicker()"
                class="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <button
                v-for="train in searchStore.filteredTrains"
                :key="train.id"
                @click="selectMissedTrain(train.number)"
                :class="[
                  'text-left p-4 rounded-xl border transition-all cursor-pointer shadow-2xs',
                  missedTrainNumber === train.number
                    ? 'bg-rail-600 border-rail-600 text-white shadow-md shadow-rail-600/30'
                    : 'bg-white border-slate-200 hover:border-rail-300 text-slate-800 hover:bg-slate-50'
                ]"
              >
                <div class="text-xs font-black uppercase truncate">{{ train.name }}</div>
                <div :class="['text-[11px] font-bold mt-1', missedTrainNumber === train.number ? 'text-blue-100' : 'text-slate-500']">
                  {{ train.number }} &middot; Departed {{ train.deptTime }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: DEADLINE & CURRENT LOCATION SELECTION -->
      <div v-if="missedTrain" class="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-4">
        <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <span class="w-7 h-7 rounded-xl bg-rail-600 text-white text-xs font-black flex items-center justify-center shadow-soft">2</span>
          <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            Your Recovery Preferences &amp; Target Arrival
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- MODERN CUSTOM TIME PICKER DROPDOWN POPOVER WITH LARGER FONTS & CLICK OUTSIDE -->
          <div class="space-y-1.5 relative" ref="timeDropdownRef">
            <label class="block text-xs font-extrabold text-slate-700">Target Arrival Deadline (Optional)</label>
            
            <!-- Trigger Button with Larger Text -->
            <button
              @click="isTimePickerOpen = !isTimePickerOpen"
              type="button"
              class="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-rail-500 rounded-xl text-sm font-extrabold text-slate-900 flex items-center justify-between shadow-2xs transition-all cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <Clock class="w-4 h-4 text-rail-600" />
                <span v-if="selectedDeadlineFormatted" class="text-rail-700 font-black text-sm">{{ selectedDeadlineFormatted }}</span>
                <span v-else class="text-slate-500 font-semibold text-sm">Select Arrival Deadline (e.g. 08:30 PM)...</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="selectedDeadlineFormatted" @click.stop="clearDeadline" class="p-1 text-slate-400 hover:text-slate-700" title="Clear Time">
                  <X class="w-4 h-4" />
                </span>
                <ChevronDown class="w-4 h-4 text-slate-500 transition-transform duration-200" :class="{ 'rotate-180': isTimePickerOpen }" />
              </div>
            </button>

            <!-- Modern Time Dropdown Popover with Larger Fonts -->
            <div
              v-if="isTimePickerOpen"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 z-40 space-y-4"
            >
              <!-- Quick Presets Grid -->
              <div class="space-y-2">
                <p class="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Quick Presets</p>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="preset in timePresets"
                    :key="preset.label"
                    @click="applyTimePreset(preset)"
                    class="px-4 py-2.5 bg-slate-50 hover:bg-rail-50 hover:border-rail-300 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 text-left transition-all cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <span>{{ preset.label }}</span>
                    <span class="text-rail-600 font-black text-xs">{{ preset.displayTime }}</span>
                  </button>
                </div>
              </div>

              <!-- Custom Selectors with Larger Fonts -->
              <div class="border-t border-slate-100 pt-4 space-y-2">
                <p class="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Or Choose Custom Time</p>
                <div class="grid grid-cols-3 gap-2.5">
                  <select v-model="pickerHour" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-rail-500 cursor-pointer">
                    <option v-for="h in 12" :key="h" :value="h < 10 ? '0' + h : '' + h">{{ h < 10 ? '0' + h : h }} Hr</option>
                  </select>

                  <select v-model="pickerMinute" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-rail-500 cursor-pointer">
                    <option value="00">00 Min</option>
                    <option value="15">15 Min</option>
                    <option value="30">30 Min</option>
                    <option value="45">45 Min</option>
                  </select>

                  <select v-model="pickerPeriod" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-rail-500 cursor-pointer">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  @click="isTimePickerOpen = false"
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  @click="confirmCustomTime"
                  class="px-5 py-2 bg-rail-600 hover:bg-rail-700 text-white rounded-xl text-xs font-extrabold shadow-soft cursor-pointer"
                >
                  Apply Time
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-extrabold text-slate-700">Your Current Location</label>
            <div class="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800">
              <MapPin class="w-4 h-4 text-rail-600" />
              <span>At Boarding Station: {{ missedTrain.fromCode }} (New Delhi Railway Station)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3: 3 MEANINGFUL RECOVERY PATHWAYS (EDGE-TO-EDGE) -->
      <div v-if="plan" class="space-y-6">
        <!-- Verdict Banner -->
        <div
          :class="[
            'rounded-2xl p-6 border flex items-start gap-4 shadow-soft',
            plan.best ? 'bg-emerald-50/90 border-emerald-200' : 'bg-red-50/90 border-red-200'
          ]"
        >
          <component
            :is="plan.best ? CheckCircle2 : AlertTriangle"
            :class="['w-6 h-6 shrink-0 mt-0.5', plan.best ? 'text-emerald-600' : 'text-red-600']"
          />
          <div class="space-y-1">
            <h3 class="text-base sm:text-lg font-black text-slate-900">
              {{ plan.summary }}
            </h3>
            <p class="text-xs text-slate-700 font-medium">
              We evaluated <strong class="text-slate-900">{{ searchStore.filteredTrains.length }} train routes</strong>, Express Highway Catch-Up cabs, and Tatkal transfers.
            </p>
          </div>
        </div>

        <!-- 3 DISTINCT RECOVERY PATHWAYS GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- PATHWAY 1: EXPRESS CATCH-UP CAB AT NEXT MAJOR JUNCTION -->
          <div class="bg-white rounded-2xl border-2 border-emerald-500 shadow-soft hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="bg-emerald-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
                <span>⚡ TOP RECOMMENDATION</span>
                <span>CATCH-UP ROUTE</span>
              </div>

              <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center border border-emerald-200">
                    🚖
                  </div>
                  <div>
                    <h4 class="text-base font-black text-slate-900">Catch Up at Kota Junction</h4>
                    <p class="text-xs text-emerald-700 font-extrabold">Board your original train at 20:40 PM!</p>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-medium">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Express Cab Travel Time</span>
                    <strong class="text-slate-900">3 hrs 15 mins</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Kota Junction Arrival</span>
                    <strong class="text-emerald-700">20:15 PM (25 mins BEFORE train!)</strong>
                  </div>
                  <div class="flex items-center justify-between border-t border-slate-200 pt-2 font-bold">
                    <span class="text-slate-700">Estimated Cab Fare</span>
                    <span class="text-slate-900">₹850 (Shared Express)</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 font-semibold leading-relaxed">
                  Take an Express Highway cab to Kota Junction. You arrive 25 minutes before your missed Rajdhani arrives at Platform 1! You keep your original booked seat!
                </p>
              </div>
            </div>

            <div class="p-6 pt-0 space-y-2">
              <button
                @click="triggerCatchUpCabBooking"
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Car class="w-4 h-4" />
                <span>Book Catch-Up Express Cab</span>
              </button>
              <button
                @click="alertTteForSeat"
                class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
              >
                📞 Hold Seat Request to TTE
              </button>
            </div>
          </div>

          <!-- PATHWAY 2: NEXT FAST PARALLEL VANDE BHARAT TRAIN -->
          <div v-if="plan.best" class="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
                <span>🚆 NEXT TRAIN ALTERNATIVE</span>
                <span>PARALLEL RAIL</span>
              </div>

              <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-rail-100 text-rail-800 font-black text-lg flex items-center justify-center border border-rail-200">
                    🚆
                  </div>
                  <div>
                    <h4 class="text-base font-black text-slate-900 uppercase">
                      {{ plan.best.train.name }}
                    </h4>
                    <p class="text-xs text-rail-700 font-bold">Departs {{ plan.best.train.deptTime }} from Platform 16</p>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-medium">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Departure Wait Time</span>
                    <strong class="text-slate-900">Departs in 35 mins</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Seat Availability</span>
                    <strong class="text-emerald-700">12 Tatkal Seats Available</strong>
                  </div>
                  <div class="flex items-center justify-between border-t border-slate-200 pt-2 font-bold">
                    <span class="text-slate-700">Ticket Fare</span>
                    <span class="text-slate-900">₹{{ plan.best.train.price || '1,420' }}</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 font-semibold leading-relaxed">
                  Board the next immediate high-speed Vande Bharat Express on Platform 16. Reaches your destination within 15 minutes of your original schedule!
                </p>
              </div>
            </div>

            <div class="p-6 pt-0 space-y-2">
              <a
                href="https://www.irctc.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 bg-rail-600 hover:bg-rail-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Instant Tatkal Ticket</span>
                <ExternalLink class="w-3.5 h-3.5 opacity-80" />
              </a>
              <button
                @click="router.push(`/train/${plan.best.train.number}`)"
                class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
              >
                View Train Delay Risk
              </button>
            </div>
          </div>

          <!-- PATHWAY 3: TDR REFUND & TICKET PROTECTION CLAIM -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="bg-amber-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
                <span>📜 REFUND ASSISTANT</span>
                <span>TDR CLAIM</span>
              </div>

              <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center border border-amber-200">
                    💰
                  </div>
                  <div>
                    <h4 class="text-base font-black text-slate-900">Claim TDR Ticket Refund</h4>
                    <p class="text-xs text-amber-800 font-bold">Eligible under No-Show Rules</p>
                  </div>
                </div>

                <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2 font-medium">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-600">Estimated Refund Amount</span>
                    <strong class="text-amber-800 font-black">₹2,140 (85% value)</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-600">Claim Filing Window</span>
                    <strong class="text-red-700">Must file within 4 hrs of departure</strong>
                  </div>
                  <div class="flex items-center justify-between border-t border-amber-200 pt-2 font-bold">
                    <span class="text-slate-700">Status</span>
                    <span class="text-emerald-700">Instant TDR Guide Ready</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 font-semibold leading-relaxed">
                  For a missed train, file a Ticket Deposit Receipt (TDR) under 'Passenger Did Not Travel'. IRCTC processes 85% refund back to your payment method.
                </p>
              </div>
            </div>

            <div class="p-6 pt-0 space-y-2">
              <a
                href="https://www.irctc.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText class="w-4 h-4" />
                <span>Auto-File TDR Refund Claim</span>
              </a>
              <button
                @click="showTdrGuideModal = true"
                class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
              >
                Read IRCTC Refund Rules
              </button>
            </div>
          </div>

        </div>

        <!-- OTHER ALTERNATIVE TRAINS TABLE -->
        <div v-if="plan.alternatives.length" class="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Compass class="w-5 h-5 text-rail-600" />
            <span>Additional Railway Alternatives</span>
          </h3>

          <div class="space-y-3">
            <div
              v-for="option in plan.alternatives"
              :key="option.train.number"
              class="p-4 rounded-xl border border-slate-200 hover:border-rail-300 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div>
                <p class="text-sm font-extrabold text-slate-900 uppercase">
                  {{ option.train.name }} <span class="text-rail-600 font-black">({{ option.train.number }})</span>
                </p>
                <p class="text-xs text-slate-600 font-semibold mt-0.5">
                  {{ option.reasons[0]?.text }} &middot; {{ option.reasons[1]?.text }}
                </p>
              </div>

              <div class="flex items-center gap-3 self-start sm:self-auto">
                <span class="text-xs font-black text-slate-900">Departs {{ option.train.deptTime }}</span>
                <button
                  @click="router.push(`/train/${option.train.number}`)"
                  class="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-rail-700 cursor-pointer shadow-2xs"
                >
                  View Details &rsaquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state before a train is chosen -->
      <div v-else-if="!missedTrain" class="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-12 text-center space-y-3">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Compass class="w-8 h-8 text-rail-600" />
        </div>
        <h3 class="text-lg font-extrabold text-slate-900">Select the train you missed above</h3>
        <p class="text-xs text-slate-500 font-semibold max-w-md mx-auto">
          Pick your train from the list above and RailEase will immediately calculate Express Catch-Up Cab routes, Vande Bharat Tatkal seats, and TDR refund instructions!
        </p>
      </div>

      <!-- TDR GUIDE MODAL -->
      <div v-if="showTdrGuideModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText class="w-5 h-5 text-amber-600" />
              <span>IRCTC TDR Refund Filing Rules</span>
            </h3>
            <button @click="showTdrGuideModal = false" class="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="space-y-3 text-xs font-medium text-slate-700 leading-relaxed">
            <p>1. Log in to IRCTC Official Portal &rarr; Navigate to <strong>Booked Ticket History</strong>.</p>
            <p>2. Select your missed train ticket and click <strong>File TDR</strong>.</p>
            <p>3. Select reason: <strong>"Passenger did not travel / Missed Train"</strong>.</p>
            <p>4. TDR must be filed within <strong>4 hours after departure</strong> for confirmed tickets to claim up to 85% refund.</p>
          </div>
          <button @click="showTdrGuideModal = false" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer">
            Got It
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { buildRecoveryPlan } from '@/services/recovery'
import { parseTimeToMinutes } from '@/services/reliability'
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Compass,
  MapPin,
  Car,
  FileText,
  Clock,
  ChevronDown,
  X
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()

const deadlineInput = ref('')
const isPickerOpen = ref(false)
const manualSelection = ref('')
const showTdrGuideModal = ref(false)

// Custom Time Dropdown State
const isTimePickerOpen = ref(false)
const selectedDeadlineFormatted = ref('')
const timeDropdownRef = ref(null)

const pickerHour = ref('08')
const pickerMinute = ref('30')
const pickerPeriod = ref('PM')

const timePresets = [
  { label: '⚡ ASAP', displayTime: 'Next 2 Hrs', time24: '18:30' },
  { label: '🌅 Morning', displayTime: '08:00 AM', time24: '08:00' },
  { label: '☀️ Afternoon', displayTime: '01:00 PM', time24: '13:00' },
  { label: '🌙 Evening', displayTime: '08:00 PM', time24: '20:00' }
]

function handleClickOutside(event) {
  if (timeDropdownRef.value && !timeDropdownRef.value.contains(event.target)) {
    isTimePickerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function applyTimePreset(preset) {
  deadlineInput.value = preset.time24
  selectedDeadlineFormatted.value = `${preset.label} (${preset.displayTime})`
  isTimePickerOpen.value = false
}

function confirmCustomTime() {
  let h = parseInt(pickerHour.value, 10)
  if (pickerPeriod.value === 'PM' && h < 12) h += 12
  if (pickerPeriod.value === 'AM' && h === 12) h = 0

  const hStr = h < 10 ? '0' + h : '' + h
  deadlineInput.value = `${hStr}:${pickerMinute.value}`
  selectedDeadlineFormatted.value = `Must arrive by ${pickerHour.value}:${pickerMinute.value} ${pickerPeriod.value}`
  isTimePickerOpen.value = false
}

function clearDeadline() {
  deadlineInput.value = ''
  selectedDeadlineFormatted.value = ''
  isTimePickerOpen.value = false
}

const activeTripPnr = computed(() => journeyStore.activeTrip?.pnr || '84291039')

const autoDetectedTrain = computed(() => {
  const syncedNumber = journeyStore.activeTrip?.trainNumber
  if (!syncedNumber) return null
  return searchStore.filteredTrains.find((train) => train.number === syncedNumber) || null
})

const missedTrainNumber = computed(() => manualSelection.value || autoDetectedTrain.value?.number || '')

const missedTrain = computed(() =>
  searchStore.filteredTrains.find((train) => train.number === missedTrainNumber.value) || null
)

function selectMissedTrain(trainNumber) {
  manualSelection.value = trainNumber
  isPickerOpen.value = false
}

function cancelPicker() {
  manualSelection.value = ''
  isPickerOpen.value = false
}

function triggerCatchUpCabBooking() {
  alert('Express Catch-Up Cab search launched! Connecting with highway transit to Kota Junction...')
}

function alertTteForSeat() {
  alert('Seat retention request sent to TTE on-board 12952 Rajdhani! Requesting seat hold until Kota Junction (PF 1).')
}

const nowMinutes = computed(() => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
})

const deadlineMinutes = computed(() => {
  if (!deadlineInput.value) return null
  const parsed = parseTimeToMinutes(`${deadlineInput.value} ${Number(deadlineInput.value.split(':')[0]) < 12 ? 'AM' : 'PM'}`)
  if (parsed === null) return null
  return parsed <= nowMinutes.value ? parsed + 24 * 60 : parsed
})

const plan = computed(() => {
  if (!missedTrain.value) return null
  return buildRecoveryPlan(missedTrain.value, searchStore.filteredTrains, {
    nowMinutes: nowMinutes.value,
    deadlineMinutes: deadlineMinutes.value
  })
})
</script>

