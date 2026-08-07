<template>
  <div class="space-y-6 font-sans">
    <!-- Active Journey Locked Banner (if active trip is set) -->
    <div
      v-if="journeyStore.activeTrip"
      class="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-card border border-emerald-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-black uppercase text-emerald-300 tracking-wider">Active RailEase Journey Synced</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
              PNR: {{ journeyStore.activeTrip.pnr || 'SYNCED-84920' }}
            </span>
          </div>
          <h4 class="text-base font-black text-white uppercase mt-0.5">
            {{ journeyStore.activeTrip.trainName }} ({{ journeyStore.activeTrip.trainNumber }})
          </h4>
          <p class="text-xs text-slate-300 font-medium">
            {{ journeyStore.activeTrip.from }} &rarr; {{ journeyStore.activeTrip.to }} • Live Tracking, Safeguards &amp; eCatering Synced
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="router.push('/live-status')"
          class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold shadow transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Radio class="w-3.5 h-3.5" />
          <span>Open Live Tracking &rarr;</span>
        </button>
      </div>
    </div>

    <!-- PNR Direct Lookup / Sync Card -->
    <div class="bg-white p-5 rounded-card border border-slate-200 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Search class="w-4 h-4 text-rail-500" />
            <span>Already Booked Externally? Sync Trip by PNR Number</span>
          </h3>
          <p class="text-xs text-slate-500 font-medium">
            Enter your 10-digit IRCTC / ConfirmTkt PNR to lock RailEase Live Radar, Safeguards &amp; eCatering.
          </p>
        </div>
        <span class="text-[11px] font-bold text-slate-400">No Re-Booking Required</span>
      </div>

      <!-- PNR Search Bar Input & Sample Chips -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="relative flex-1 w-full">
          <input
            v-model="pnrSearchInput"
            type="text"
            placeholder="Enter 10-digit PNR Number (e.g. 84291039, 71940281)"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
            @keyup.enter="handlePnrSync"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button
          @click="handlePnrSync"
          class="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          <span>Sync PNR Trip</span>
        </button>
      </div>

      <!-- Quick Test Sample PNR Chips -->
      <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
        <span class="text-slate-500 font-bold">Sample PNRs to try:</span>
        <button
          @click="quickSelectSamplePnr('84291039')"
          class="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 rounded-md font-bold border border-slate-200 transition-colors cursor-pointer"
        >
          PNR: 84291039 (Vande Bharat 22436)
        </button>
        <button
          @click="quickSelectSamplePnr('71940281')"
          class="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 rounded-md font-bold border border-slate-200 transition-colors cursor-pointer"
        >
          PNR: 71940281 (Rajdhani 12952)
        </button>
      </div>
    </div>

    <!-- Top Navy Station Pair Search Header Bar -->
    <div class="bg-[#1E3A8A] text-white p-5 rounded-card shadow-md space-y-4">
      <div class="flex items-center justify-between border-b border-blue-800/80 pb-3">
        <h2 class="text-lg font-black uppercase tracking-wider flex items-center gap-2">
          <Train class="w-5 h-5 text-sky-400" />
          <span>Train Telemetry &amp; Active Journey Selection Engine</span>
        </h2>
        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          Select any train to align your dashboard
        </span>
      </div>

      <!-- Search Inputs Row with Modern Google-Style Date Picker -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <!-- From Station -->
        <div class="md:col-span-3">
          <label class="block text-[11px] font-bold text-blue-200 mb-1">From Station</label>
          <CustomSelect
            v-model="fromCode"
            :options="stationOptions"
            size="small"
            rounded="medium"
            fillMode="solid"
            :icon="MapPin"
          />
        </div>

        <!-- Swap Button -->
        <div class="md:col-span-1 flex justify-center pt-4 md:pt-4">
          <button
            type="button"
            @click="searchStore.swapStations()"
            class="w-9 h-9 rounded-full border border-blue-400/40 bg-blue-900/60 hover:bg-blue-800 text-white flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
            title="Swap Stations"
          >
            <ArrowLeftRight class="w-4 h-4" />
          </button>
        </div>

        <!-- To Station -->
        <div class="md:col-span-3">
          <label class="block text-[11px] font-bold text-blue-200 mb-1">To Station</label>
          <CustomSelect
            v-model="toCode"
            :options="stationOptions"
            size="small"
            rounded="medium"
            fillMode="solid"
            :icon="MapPin"
          />
        </div>

        <!-- Modern Date Picker (Google Calendar Style) -->
        <div class="md:col-span-2">
          <label class="block text-[11px] font-bold text-blue-200 mb-1">Travel Date</label>
          <ModernDatePicker v-model="searchStore.travelDate" />
        </div>

        <!-- Class & Quota -->
        <div class="md:col-span-3">
          <label class="block text-[11px] font-bold text-blue-200 mb-1">Class &amp; Quota</label>
          <div class="grid grid-cols-2 gap-2">
            <CustomSelect
              v-model="searchStore.selectedClass"
              :options="classOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
            <CustomSelect
              v-model="searchStore.selectedQuota"
              :options="quotaOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Reliability Color Indicator Legend Bar -->
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 font-bold text-slate-800">
        <span>Reliability Risk Indicator Legend:</span>
      </div>
      <div class="flex items-center gap-4 text-[11px] font-bold">
        <span class="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Green (90%+ Highly Reliable)</span>
        </span>
        <span class="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Yellow (75-89% Moderate Delays)</span>
        </span>
        <span class="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Red (&lt; 75% High Risk - Unreliable)</span>
        </span>
      </div>
    </div>

    <!-- Main Results Grid (Train Cards with "Mark As My Active Journey" CTA) -->
    <div class="space-y-4">
      <div
        v-for="train in searchStore.filteredTrains"
        :key="train.id"
        :class="[
          'bg-white rounded-xl border transition-all overflow-hidden shadow-sm hover:shadow-md',
          getReliabilityBorderClass(train),
          isTrainSelectedAsActive(train) ? 'ring-2 ring-emerald-500 border-emerald-500' : ''
        ]"
      >
        <!-- Card Header -->
        <div class="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="text-base font-black text-slate-900 uppercase flex items-center gap-2">
              <span
                :class="[
                  'w-3 h-3 rounded-full shrink-0',
                  getReliabilityDotClass(train)
                ]"
                :title="`Punctuality Score: ${train.punctualityScore}%`"
              ></span>
              <span>{{ train.name }} ({{ train.number }})</span>
            </h3>

            <!-- Prominent Reliability Badge -->
            <span
              :class="[
                'px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border',
                getReliabilityBadgeClass(train)
              ]"
            >
              <AlertTriangle v-if="getReliabilityLevel(train) === 'red'" class="w-3.5 h-3.5 text-red-600 animate-bounce" />
              <CheckCircle2 v-else-if="getReliabilityLevel(train) === 'green'" class="w-3.5 h-3.5 text-emerald-600" />
              <span>{{ getReliabilityLabel(train) }}</span>
            </span>

            <!-- Active Journey Locked Tag -->
            <span v-if="isTrainSelectedAsActive(train)" class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 class="w-3 h-3 text-emerald-600" />
              ACTIVE DASHBOARD TRIP LOCKED
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span class="text-slate-600">Runs On: <strong class="text-slate-900">{{ train.runsOn.join(' ') }}</strong></span>
            
            <!-- Button 1: Table Log -->
            <button
              @click="openTelemetryModal(train, 'table')"
              class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Table class="w-3.5 h-3.5 text-slate-600" />
              <span>Logs Table</span>
            </button>

            <!-- Button 2: Light Mode ETS Trend Forecast Graph Button -->
            <button
              @click="openTelemetryModal(train, 'trend')"
              class="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <TrendingUp class="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Forecast Graph</span>
            </button>
          </div>
        </div>

        <!-- Schedule & Timing Line -->
        <div class="p-5 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100">
          <div class="text-left">
            <div class="text-xl font-black text-slate-900">{{ train.deptTime }}</div>
            <div class="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {{ train.fromName }} ({{ train.fromCode }})
            </div>
          </div>

          <div class="flex flex-col items-center justify-center flex-1 max-w-xs">
            <div class="text-xs font-extrabold text-slate-500">{{ train.duration }}</div>
            <div class="w-full flex items-center gap-2 my-1">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <div class="flex-1 h-0.5 bg-slate-300 relative"></div>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            </div>
            <div class="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
              7-Day Score: <strong :class="getReliabilityTextClass(train)">{{ train.punctualityScore }}%</strong>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xl font-black text-slate-900">{{ train.arrTime }}</div>
            <div class="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {{ train.toName }} ({{ train.toCode }})
            </div>
          </div>
        </div>

        <!-- Class Availability Grid Cards -->
        <div class="p-4 bg-slate-50/50 space-y-3">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="cls in train.classes"
              :key="cls.code"
              class="bg-white border border-slate-300 rounded-lg p-3 space-y-1.5"
            >
              <div class="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span>{{ cls.name }}</span>
                <span class="text-slate-500">₹{{ cls.price }}</span>
              </div>
              <div
                :class="[
                  'text-xs font-black px-2 py-1 rounded text-center border',
                  cls.statusType === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  cls.statusType === 'rac' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  cls.statusType === 'regret' ? 'bg-slate-200 text-slate-800 border-slate-300 font-extrabold' :
                  'bg-rose-100 text-rose-800 border-rose-300'
                ]"
              >
                {{ cls.status }}
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <!-- Warning Alert for Red Trains -->
            <p v-if="getReliabilityLevel(train) === 'red'" class="text-[11px] font-black text-red-600 flex items-center gap-1">
              <AlertTriangle class="w-3.5 h-3.5" />
              <span>Unreliable: Heavy delays recorded over past week</span>
            </p>
            <p v-else class="text-[11px] text-slate-500 italic">
              * Verified telemetry recorded from signal clearance
            </p>

            <!-- PROMINENT CTA: MARK AS MY ACTIVE JOURNEY FOR RAIL EASE INTELLIGENCE -->
            <div class="flex items-center gap-2">
              <button
                @click="handleSelectActiveJourney(train)"
                :class="[
                  'px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer uppercase tracking-wider',
                  isTrainSelectedAsActive(train)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                ]"
              >
                <Star class="w-4 h-4 text-yellow-200" />
                <span>{{ isTrainSelectedAsActive(train) ? 'Active Journey Selected ✅' : '⭐ Mark As My Active Journey' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== LIGHT MODE ETS TREND FORECAST MODAL ==================== -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="selectedTrainForTelemetry"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        @click.self="selectedTrainForTelemetry = null"
      >
        <div class="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col my-auto overflow-hidden animate-fade-in">
          <!-- Sticky Modal Header -->
          <div class="p-6 pb-4 border-b border-slate-100 relative shrink-0 text-left space-y-3">
            <button
              @click="selectedTrainForTelemetry = null"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center cursor-pointer shadow-sm z-10"
            >
              ✕
            </button>

            <div class="flex items-center justify-between pr-8">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold">
                <TrendingUp class="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>ETS Time Series Forecast</span>
              </div>

              <!-- View Mode Tabs -->
              <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  @click="modalTabMode = 'table'"
                  :class="[
                    'px-3 py-1 rounded text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer',
                    modalTabMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  ]"
                >
                  <Table class="w-3.5 h-3.5" />
                  <span>Log Table</span>
                </button>
                <button
                  @click="modalTabMode = 'trend'"
                  :class="[
                    'px-3 py-1 rounded text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer',
                    modalTabMode === 'trend' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  ]"
                >
                  <TrendingUp class="w-3.5 h-3.5" />
                  <span>ETS Trend Graph</span>
                </button>
              </div>
            </div>

            <div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
                <span
                  :class="['w-3.5 h-3.5 rounded-full inline-block shrink-0', getReliabilityDotClass(selectedTrainForTelemetry)]"
                ></span>
                <span>{{ selectedTrainForTelemetry.name }} ({{ selectedTrainForTelemetry.number }})</span>
              </h3>

              <p class="text-xs text-slate-500 font-medium mt-0.5">
                Past 7-Day Telemetry + ETS Exponential Delay Forecast between {{ selectedTrainForTelemetry.fromName }} and {{ selectedTrainForTelemetry.toName }}
              </p>
            </div>
          </div>

          <!-- Scrollable Modal Content Body -->
          <div class="p-6 space-y-5 overflow-y-auto flex-1 text-left">
            <!-- Punctuality Score & Gauge Bar -->
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div class="text-xs text-slate-500 font-semibold">Punctuality Score</div>
                  <div :class="['text-2xl font-black mt-0.5', getReliabilityTextClass(selectedTrainForTelemetry)]">
                    {{ selectedTrainForTelemetry.punctualityScore }}%
                  </div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 font-semibold">ETS AI Model Status</div>
                  <div class="text-xs font-black text-slate-900 mt-1 uppercase">
                    {{ selectedTrainForTelemetry.reliabilityRating }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 font-semibold">Suggested Buffer</div>
                  <div class="text-xs font-black text-blue-700 mt-1">
                    {{ getReliabilityLevel(selectedTrainForTelemetry) === 'red' ? '+60 to 90 mins' : '+15 to 25 mins' }}
                  </div>
                </div>
              </div>

              <!-- Progress Meter Bar -->
              <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full transition-all duration-700 rounded-full',
                    getReliabilityLevel(selectedTrainForTelemetry) === 'green' ? 'bg-emerald-500' :
                    getReliabilityLevel(selectedTrainForTelemetry) === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  ]"
                  :style="{ width: `${selectedTrainForTelemetry.punctualityScore}%` }"
                ></div>
              </div>
            </div>

            <!-- RED WARNING ALERT BOX FOR UNRELIABLE TRAINS -->
            <div
              v-if="getReliabilityLevel(selectedTrainForTelemetry) === 'red'"
              class="bg-red-50 border-2 border-red-300 p-4 rounded-xl text-xs space-y-1 text-red-900"
            >
              <div class="flex items-center gap-2 font-black text-red-700 uppercase">
                <AlertTriangle class="w-4 h-4 text-red-600 animate-bounce" />
                <span>HIGH DISRUPTION RISK WARNING</span>
              </div>
              <p class="text-slate-700 leading-relaxed font-medium">
                This train accumulated over 120 minutes of delay over the past week. <strong>Do not rely on this train for urgent travel, exams, or connecting flights.</strong>
              </p>
            </div>

            <!-- LIGHT MODE ETS TREND GRAPH VIEW -->
            <div v-if="modalTabMode === 'trend'" class="space-y-4 animate-fade-in">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  ETS Exponential Delay Trend Line &amp; Forecast Projection
                </h4>
                <span class="text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Forecast Confidence: 91.4%
                </span>
              </div>

              <!-- Clean Light Mode SVG Trend Box -->
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-3">
                  <span>Y-Axis: Delay Minutes (0m - 200m)</span>
                  <span class="text-slate-900 font-extrabold">Avg Delay: {{ getAverageDelay(selectedTrainForTelemetry) }} mins/day</span>
                </div>

                <!-- Clean Light Theme SVG Canvas -->
                <div class="relative h-56 w-full pt-4">
                  <div class="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300 font-bold">
                    <div class="border-b border-slate-100 flex justify-between"><span>200 mins</span><span>High Delay Zone</span></div>
                    <div class="border-b border-slate-100 flex justify-between"><span>100 mins</span><span>Moderate Delay Zone</span></div>
                    <div class="border-b border-slate-100 flex justify-between"><span>0 mins</span><span>On Time Clearance</span></div>
                  </div>

                  <svg class="w-full h-full overflow-visible" viewBox="0 0 560 160">
                    <defs>
                      <linearGradient id="lightTrendGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path
                      :d="getSvgFilledAreaPath(selectedTrainForTelemetry)"
                      fill="url(#lightTrendGlow)"
                    />

                    <path
                      :d="getSvgSolidTrendPath(selectedTrainForTelemetry)"
                      fill="none"
                      stroke="#0284c7"
                      stroke-width="3.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <path
                      :d="getSvgForecastPath(selectedTrainForTelemetry)"
                      fill="none"
                      stroke="#ea580c"
                      stroke-width="3"
                      stroke-dasharray="6,6"
                      stroke-linecap="round"
                    />

                    <g v-for="(point, pIdx) in getSvgPoints(selectedTrainForTelemetry)" :key="pIdx">
                      <circle
                        :cx="point.x"
                        :cy="point.y"
                        r="7"
                        :class="[
                          'transition-all cursor-pointer hover:r-9',
                          point.isForecast ? 'fill-orange-100 stroke-orange-600' : 'fill-sky-100 stroke-sky-600'
                        ]"
                        stroke-width="2.5"
                      />
                      <circle
                        :cx="point.x"
                        :cy="point.y"
                        r="3.5"
                        :class="point.isForecast ? 'fill-orange-600' : 'fill-sky-600'"
                      />

                      <text
                        :x="point.x"
                        :y="point.y - 12"
                        text-anchor="middle"
                        class="text-[10px] font-black fill-slate-800"
                      >
                        {{ point.isForecast ? 'FC: ' + point.val + 'm' : point.val + 'm' }}
                      </text>
                    </g>
                  </svg>
                </div>

                <div class="flex justify-between text-[11px] font-extrabold text-slate-600 pt-2 border-t border-slate-100">
                  <span v-for="(log, lIdx) in selectedTrainForTelemetry.historyLogs" :key="lIdx">
                    {{ log.day.split(',')[0] }}
                  </span>
                  <span class="text-orange-600 font-black bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    Tomorrow (ETS Forecast)
                  </span>
                </div>

                <div class="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center justify-between text-xs text-sky-900">
                  <div class="flex items-center gap-2">
                    <Sparkles class="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      <strong>ETS Predictive Insight:</strong> Train trend indicates
                      <strong class="text-slate-900 underline">{{ getEtsPredictionText(selectedTrainForTelemetry) }}</strong> for tomorrow's run.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB MODE 1: 7-DAY PAST TELEMETRY TABLE -->
            <div v-else class="space-y-2 text-left animate-fade-in">
              <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">7-Day Past Week Delay Log Table</h4>
              
              <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <tr>
                      <th class="p-3">Day &amp; Date</th>
                      <th class="p-3">Origin Dept</th>
                      <th class="p-3">Dest Arrival</th>
                      <th class="p-3 text-right">Delay Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
                    <tr
                      v-for="(log, idx) in selectedTrainForTelemetry.historyLogs"
                      :key="idx"
                      class="hover:bg-slate-50/80 transition-colors"
                    >
                      <td class="p-3 font-bold text-slate-900">{{ log.day }}</td>
                      <td class="p-3 text-slate-600">{{ log.originDept }}</td>
                      <td class="p-3 text-slate-600">{{ log.destArr }}</td>
                      <td class="p-3 text-right">
                        <span
                          :class="[
                            'px-2.5 py-1 rounded text-[11px] font-black',
                            log.delayMinutes === 0 ? 'bg-emerald-100 text-emerald-800' :
                            log.delayMinutes <= 15 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800 animate-pulse'
                          ]"
                        >
                          {{ log.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Sticky Footer Action -->
          <div class="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <span class="text-[11px] text-slate-500 italic">Verified satellite telemetry logs + ETS forecasting</span>
            <div class="flex items-center gap-2">
              <button
                @click="handleSelectActiveJourney(selectedTrainForTelemetry); selectedTrainForTelemetry = null"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow flex items-center gap-1.5"
              >
                <Star class="w-3.5 h-3.5 text-yellow-200" />
                <span>Mark As Active Journey</span>
              </button>
              <button
                @click="selectedTrainForTelemetry = null"
                class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { POPULAR_STATIONS } from '@/data/stations'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import ModernDatePicker from '@/components/ui/ModernDatePicker.vue'
import {
  Train,
  MapPin,
  ArrowLeftRight,
  BarChart3,
  TrendingUp,
  Table,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Radio,
  Star
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()

const pnrSearchInput = ref('')
const selectedTrainForTelemetry = ref(null)
const modalTabMode = ref('trend')

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
  { label: 'Sleeper (SL)', value: 'SL' }
]

const quotaOptions = [
  { label: 'GENERAL', value: 'GENERAL' },
  { label: 'TATKAL', value: 'TATKAL' },
  { label: 'LADIES', value: 'LADIES' }
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

function isTrainSelectedAsActive(train) {
  if (!journeyStore.activeTrip) return false
  return journeyStore.activeTrip.trainNumber === train.number
}

function handleSelectActiveJourney(train) {
  journeyStore.setActiveTripFromTrain(train, searchStore.travelDate)
  console.log('[RailEase Journey Sync] Active trip set to:', train.name, '(', train.number, ')')
}

function handlePnrSync() {
  if (!pnrSearchInput.value) return
  const trip = journeyStore.fetchAndSetActiveTripByPnr(pnrSearchInput.value)
  if (trip) {
    pnrSearchInput.value = ''
    console.log('[RailEase PNR Sync] Trip synced via PNR:', trip.trainName, '(', trip.pnr, ')')
  }
}

function quickSelectSamplePnr(pnrCode) {
  pnrSearchInput.value = pnrCode
  handlePnrSync()
}

function getReliabilityLevel(train) {
  if (train.reliabilityColor) return train.reliabilityColor
  if (train.punctualityScore >= 90) return 'green'
  if (train.punctualityScore >= 75) return 'yellow'
  return 'red'
}

function getReliabilityLabel(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return `${train.punctualityScore}% High Punctuality`
  if (lvl === 'yellow') return `${train.punctualityScore}% Moderate Delays`
  return `⚠️ ${train.punctualityScore}% High Delay Risk`
}

function getReliabilityBadgeClass(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return 'bg-emerald-100 text-emerald-800 border-emerald-300'
  if (lvl === 'yellow') return 'bg-amber-100 text-amber-800 border-amber-300'
  return 'bg-red-100 text-red-800 border-red-300 animate-pulse'
}

function getReliabilityDotClass(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return 'bg-emerald-500'
  if (lvl === 'yellow') return 'bg-amber-500'
  return 'bg-red-500 animate-ping'
}

function getReliabilityBorderClass(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return 'border-slate-200 hover:border-emerald-500'
  if (lvl === 'yellow') return 'border-slate-200 hover:border-amber-500'
  return 'border-red-300/80 hover:border-red-500 bg-red-50/10'
}

function getReliabilityTextClass(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return 'text-emerald-600'
  if (lvl === 'yellow') return 'text-amber-700'
  return 'text-red-600 font-black'
}

function getAverageDelay(train) {
  if (!train?.historyLogs?.length) return 0
  const total = train.historyLogs.reduce((acc, l) => acc + (l.delayMinutes || 0), 0)
  return Math.round(total / train.historyLogs.length)
}

function getSvgPoints(train) {
  if (!train?.historyLogs?.length) return []
  const maxDelay = 200
  const width = 520
  const startX = 30
  const stepX = width / (train.historyLogs.length)

  const points = train.historyLogs.map((log, idx) => {
    const delay = log.delayMinutes || 0
    const x = startX + (idx * stepX)
    const y = Math.max(20, 140 - (delay / maxDelay) * 120)
    return { x, y, val: delay, isForecast: false }
  })

  const avg = getAverageDelay(train)
  const forecastVal = getReliabilityLevel(train) === 'red' ? Math.round(avg * 1.1) : Math.max(0, Math.round(avg * 0.7))
  const forecastX = startX + (train.historyLogs.length * stepX)
  const forecastY = Math.max(20, 140 - (forecastVal / maxDelay) * 120)

  points.push({ x: forecastX, y: forecastY, val: forecastVal, isForecast: true })
  return points
}

function getSvgSolidTrendPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const histPts = pts.filter(p => !p.isForecast)
  return histPts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '')
}

function getSvgForecastPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const lastHist = pts[pts.length - 2]
  const forecast = pts[pts.length - 1]
  return `M ${lastHist.x} ${lastHist.y} L ${forecast.x} ${forecast.y}`
}

function getSvgFilledAreaPath(train) {
  const pts = getSvgPoints(train)
  if (pts.length < 2) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  const linePath = pts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '')
  return `${linePath} L ${last.x} 150 L ${first.x} 150 Z`
}

function getEtsPredictionText(train) {
  const lvl = getReliabilityLevel(train)
  if (lvl === 'green') return 'High Punctuality (~0-5 mins delay)'
  if (lvl === 'yellow') return 'Minor Delay (~10-15 mins)'
  return 'Heavy Delay Risk (+60-120 mins expected)'
}

function openTelemetryModal(train, mode = 'trend') {
  selectedTrainForTelemetry.value = train
  modalTabMode.value = mode
}
</script>
