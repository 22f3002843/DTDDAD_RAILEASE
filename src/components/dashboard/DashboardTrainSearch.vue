<template>
  <div class="space-y-4 font-sans">
    <!-- COMPACT HIGH-DENSITY HERO SEARCH CARD WITH SUBTLE GRADIENT -->
    <div class="bg-gradient-to-r from-rail-50 via-sky-50/90 to-indigo-50/70 text-slate-900 rounded-2xl shadow-soft border border-rail-200/80 relative z-40">
      <!-- Ambient Glowing Wave Auras & Decorative Accent Bar (Clipped safely inside background) -->
      <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-rail-500/15 rounded-full blur-3xl"></div>
        <div class="absolute left-1/3 top-0 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl"></div>
        <div class="h-1 bg-gradient-to-r from-rail-600 via-sky-500 to-indigo-600"></div>
      </div>

      <!-- Integrated Header Strip: Description + Train # Quick Search + Compact PNR Sync -->
      <div class="px-4 sm:px-5 py-2.5 bg-white/70 backdrop-blur-xs border-b border-rail-200/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10 rounded-t-2xl">
        <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <div class="w-6 h-6 rounded-lg bg-rail-100/80 border border-rail-200 flex items-center justify-center shrink-0">
            <Train class="w-3.5 h-3.5 text-rail-700" />
          </div>
          <span>Search trains between any stations, analyze 30-day delay telemetry, or search by train number / PNR.</span>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <!-- Quick Search by Train # or Name Pill -->
          <div class="flex items-center gap-1.5 bg-white border border-slate-200/90 hover:border-rail-400 focus-within:border-rail-500 focus-within:ring-2 focus-within:ring-rail-500/20 rounded-lg p-0.5 shadow-2xs transition-all">
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchStore.trainNumberQuery"
                type="text"
                placeholder="Train # / Name (12952...)"
                class="w-36 sm:w-44 pl-7 pr-6 py-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-xs font-bold focus:outline-none"
              />
              <button
                v-if="searchStore.trainNumberQuery"
                @click="searchStore.trainNumberQuery = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                title="Clear train number search"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Compact PNR Pill -->
          <div class="flex items-center gap-1.5 bg-white border border-slate-200/90 hover:border-rail-400 focus-within:border-rail-500 focus-within:ring-2 focus-within:ring-rail-500/20 rounded-lg p-0.5 shadow-2xs transition-all">
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="pnrSearchInput"
                type="text"
                placeholder="Enter 10-digit PNR"
                class="w-32 sm:w-36 pl-7 pr-2 py-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-xs font-bold focus:outline-none"
                @keyup.enter="handlePnrSync"
              />
            </div>
            <button
              @click="handlePnrSync"
              class="px-3 py-1 bg-rail-600 hover:bg-gradient-to-r hover:from-rail-600 hover:to-emerald-500 text-white rounded text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1 shadow-2xs hover:shadow-emerald-500/20 shrink-0"
            >
              <CheckCircle2 class="w-3 h-3" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Original Station Controls Padding -->
      <div class="p-4 sm:p-5 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-end">
          <!-- From Station -->
          <div class="lg:col-span-3 relative z-30">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">FROM</label>
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
          <div class="lg:col-span-1 flex justify-center pb-0.5 relative z-20">
            <button
              type="button"
              @click="searchStore.swapStations()"
              class="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-rail-50 hover:text-rail-600 text-slate-600 flex items-center justify-center shadow-2xs cursor-pointer hover:rotate-180 transition-all duration-300"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- To Station -->
          <div class="lg:col-span-3 relative z-20">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">TO</label>
            <CustomSelect
              v-model="toCode"
              :options="stationOptions"
              size="small"
              rounded="medium"
              fillMode="solid"
              :icon="MapPin"
            />
          </div>

          <!-- Travel Date -->
          <div class="lg:col-span-2 relative z-20">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">DATE</label>
            <ModernDatePicker v-model="searchStore.travelDate" />
          </div>

          <!-- Class & Quota Dropdowns -->
          <div class="lg:col-span-3 relative z-10">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">CLASS &amp; QUOTA</label>
            <div class="grid grid-cols-2 gap-1.5">
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
    </div>

    <!-- CLEAN RESULTS BAR & MINIMALIST RELIABILITY LEGEND -->
    <div class="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
      <div>
        <span class="text-slate-900 font-black text-sm">{{ searchStore.filteredTrains.length }} Trains</span> for
        <span class="text-rail-700 font-extrabold uppercase px-1">{{ searchStore.fromStation?.code }} ➔ {{ searchStore.toStation?.code }}</span>
      </div>

      <div class="flex items-center gap-4 text-[11px]">
        <span class="flex items-center gap-1.5 text-emerald-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>70+ On time</span>
        </span>
        <span class="flex items-center gap-1.5 text-amber-700">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>55-69 Sometimes delayed</span>
        </span>
        <span class="flex items-center gap-1.5 text-red-700">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>Under 55 Often delayed</span>
        </span>
      </div>
    </div>

    <!-- TRAIN RESULT CARDS (CLEAN & UNCLUTTERED) -->
    <div class="space-y-4">
      <div
        v-for="train in searchStore.filteredTrains"
        :key="train.id"
        :class="[
          'bg-white rounded-2xl border transition-all shadow-soft hover:shadow-md',
          isTrainSelectedAsActive(train) ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200/90'
        ]"
      >
        <!-- Row 1: Train Identity + Schedule + Gauge -->
        <div class="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          <!-- Left: Train Name, Number, Star Rating (with info i), Runs, Telemetry -->
          <div class="flex flex-col gap-2 min-w-0">
            <div class="flex flex-wrap items-center gap-2.5">
              <span :class="['w-3 h-3 rounded-full shrink-0', getReliabilityDotClass(train)]"></span>
              <h3 class="text-lg font-black text-slate-900 uppercase hover:text-rail-600 transition-colors">
                {{ train.name }}
              </h3>
              <span class="text-sm font-extrabold bg-rail-50 text-rail-700 border border-rail-200 px-2.5 py-0.5 rounded-lg">({{ train.number }})</span>

              <!-- 5-STAR VISUAL RATING WITH (i) INLINE POPOVER -->
              <div class="relative flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-lg text-amber-900 text-xs font-black shadow-2xs">
                <!-- Visual 5 Stars -->
                <div class="flex items-center gap-px">
                  <template v-for="starIdx in 5" :key="starIdx">
                    <Star v-if="starIdx <= Math.floor(getTrainRating(train))" class="w-3 h-3 fill-amber-400 text-amber-400" />
                    <StarHalf v-else-if="starIdx === Math.ceil(getTrainRating(train)) && getTrainRating(train) % 1 >= 0.3" class="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star v-else class="w-3 h-3 text-amber-200" />
                  </template>
                </div>
                <span class="text-amber-800">{{ getTrainRating(train) }}</span>
                <button
                  type="button"
                  @click.stop="toggleRatingPopover(train.id)"
                  class="w-4 h-4 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 flex items-center justify-center text-[10px] font-black transition-colors cursor-pointer"
                  title="View Rating Parameters"
                >
                  i
                </button>

                <!-- Small Floating Info Box -->
                <div
                  v-if="activeRatingPopoverId === train.id"
                  class="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-amber-200 shadow-2xl p-3 z-[999] text-slate-900 space-y-2 font-sans"
                  @click.stop
                >
                  <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span class="text-[11px] font-black text-amber-950 flex items-center gap-1">
                      <Star class="w-3 h-3 fill-amber-400 text-amber-400" /> Rating Breakdown
                    </span>
                    <button @click="activeRatingPopoverId = null" class="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer">✕</button>
                  </div>
                  <div class="space-y-2 text-[11px] font-extrabold text-slate-700">
                    <div v-for="param in [
                      { label: '🍱 Food & Catering', val: getRatingBreakdown(train).food },
                      { label: '🧹 Cleanliness', val: getRatingBreakdown(train).cleanliness },
                      { label: '⏱️ On-Time', val: getRatingBreakdown(train).punctuality },
                      { label: '💬 Community', val: getRatingBreakdown(train).community }
                    ]" :key="param.label" class="flex items-center justify-between gap-2">
                      <span class="shrink-0">{{ param.label }}</span>
                      <div class="flex items-center gap-1">
                        <div class="flex items-center gap-px">
                          <template v-for="s in 5" :key="s">
                            <Star v-if="s <= Math.floor(param.val)" class="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <StarHalf v-else-if="s === Math.ceil(param.val) && param.val % 1 >= 0.3" class="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <Star v-else class="w-2.5 h-2.5 text-slate-200" />
                          </template>
                        </div>
                        <span class="text-amber-700 font-black text-[10px]">{{ param.val }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2.5 pl-5">
              <span class="bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded-lg text-slate-600 text-xs font-bold">
                Runs: <strong class="text-slate-900 font-black">{{ train.runsOn.join(' · ') }}</strong>
              </span>
              <button
                @click="openTelemetryModal(train, 'trend')"
                class="group inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-rail-500/30 bg-white text-rail-600 hover:bg-rail-600 hover:text-white hover:border-transparent text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                <TrendingUp class="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                <span>30-Day Telemetry</span>
              </button>
            </div>
          </div>

          <!-- Center: Departure → Duration → Arrival -->
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-center">
              <div class="text-xl font-black text-slate-900 tracking-tight leading-none">{{ train.deptTime }}</div>
              <div class="text-[11px] font-bold text-rail-600 uppercase mt-1">{{ train.fromCode }}</div>
            </div>

            <div class="flex flex-col items-center gap-1">
              <div class="text-xs font-black text-slate-500">{{ train.duration }}</div>
              <div class="w-24 h-[2px] bg-gradient-to-r from-rail-400 via-slate-300 to-rail-400 rounded-full relative">
                <div class="absolute -right-1 -top-[3px] w-2 h-2 rounded-full bg-rail-500"></div>
              </div>
            </div>

            <div class="text-center">
              <div class="text-xl font-black text-slate-900 tracking-tight leading-none">{{ train.arrTime }}</div>
              <div class="text-[11px] font-bold text-rail-600 uppercase mt-1">{{ train.toCode }}</div>
            </div>
          </div>

          <!-- Right: Gauge + (i) Button INLINE POPOVER -->
          <div class="relative flex items-center gap-2 shrink-0">
            <ReliabilityGaugeMeter
              :score="confidenceOf(train)"
              :width="100"
              :height="50"
              :showLabels="true"
            />
            <button
              type="button"
              @click.stop="togglePredictionPopover(train.id)"
              class="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center border border-amber-300 shadow-md hover:scale-110 transition-all cursor-pointer shrink-0"
              title="View Prediction Parameters"
            >
              i
            </button>

            <!-- Small Floating Info Box (Opens Upward) -->
            <div
              v-if="activePredictionPopoverId === train.id"
              class="absolute right-0 bottom-full mb-1.5 w-60 bg-white rounded-xl border border-rail-200 shadow-2xl p-3 z-[999] text-slate-900 space-y-2 font-sans"
              @click.stop
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span class="text-[11px] font-black text-rail-900 flex items-center gap-1">
                  <Gauge class="w-3 h-3 text-rail-600" /> Score Parameters
                </span>
                <button @click="activePredictionPopoverId = null" class="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer">✕</button>
              </div>
              <div class="space-y-1.5 text-[11px] font-extrabold text-slate-700">
                <div class="flex justify-between items-center"><span>📅 30-Day Punctuality</span><span class="text-rail-700 font-black">50% Weight</span></div>
                <div class="flex justify-between items-center"><span>🚥 Track Congestion</span><span class="text-rail-700 font-black">30% Weight</span></div>
                <div class="flex justify-between items-center"><span>🚉 Departure Delay Risk</span><span class="text-rail-700 font-black">20% Weight</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Class Availability + Action -->
        <div class="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Class Pills -->
          <div class="flex flex-wrap items-center gap-2">
            <div
              v-for="cls in train.classes"
              :key="cls.code"
              class="bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs hover:border-rail-300 transition-colors"
            >
              <span class="text-slate-900 font-black">{{ cls.code }}</span>
              <span :class="[
                'text-[11px] font-black px-2 py-0.5 rounded-md',
                cls.statusType === 'available' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                cls.statusType === 'rac' ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-slate-700 bg-slate-100 border border-slate-200'
              ]">{{ cls.status }}</span>
              <span class="text-slate-500 font-extrabold">₹{{ cls.price }}</span>
            </div>
          </div>

          <!-- Active Journey Sync CTA -->
          <button
            @click="handleSelectActiveJourney(train)"
            :class="[
              'group px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 cursor-pointer shrink-0 uppercase tracking-wider shadow-md hover:scale-[1.04] active:scale-95 border-2',
              isTrainSelectedAsActive(train)
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-500 shadow-emerald-100'
                : 'bg-white text-rail-600 border-rail-500 hover:bg-gradient-to-r hover:from-rail-600 hover:to-emerald-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-emerald-500/20'
            ]"
          >
            <CheckCircle2 v-if="isTrainSelectedAsActive(train)" class="w-4 h-4 text-emerald-600" />
            <Star v-else class="w-4 h-4 text-amber-500 group-hover:text-white group-hover:rotate-12 transition-all duration-300" />
            <span>{{ isTrainSelectedAsActive(train) ? 'Active Journey Synced ✅' : 'Sync Active Journey' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CLEAN TELEMETRY MODAL -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="selectedTrainForTelemetry"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        @click.self="selectedTrainForTelemetry = null"
      >
        <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col my-auto overflow-hidden animate-fade-in">
          <!-- Header -->
          <div class="p-5 border-b border-slate-100 flex items-center justify-between relative">
            <div>
              <h3 class="text-lg font-black text-slate-900 uppercase flex items-center gap-2">
                <span :class="['w-3 h-3 rounded-full shrink-0', getReliabilityDotClass(selectedTrainForTelemetry)]"></span>
                <span>{{ selectedTrainForTelemetry.name }} ({{ selectedTrainForTelemetry.number }})</span>
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                Past 30-day delay history and arrival punctuality
              </p>
            </div>

            <!-- View Tabs -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                @click="modalTabMode = 'trend'"
                :class="[
                  'px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  modalTabMode === 'trend' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Forecast Graph
              </button>
              <button
                @click="modalTabMode = 'table'"
                :class="[
                  'px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  modalTabMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Log Table
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <!-- Score Summary -->
            <div class="grid grid-cols-3 gap-3 items-center text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div class="flex flex-col items-center justify-center">
                <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Punctuality Rating</div>
                <ReliabilityGaugeMeter
                  :score="confidenceOf(selectedTrainForTelemetry)"
                  :width="90"
                  :height="48"
                  :showLabels="true"
                />
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-bold uppercase">Average Delay</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">
                  {{ getAverageDelay(selectedTrainForTelemetry) }} mins
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-bold uppercase">Buffer Rec.</div>
                <div class="text-xl font-black text-rail-700 mt-0.5">
                  {{ getReliabilityLevel(selectedTrainForTelemetry) === 'red' ? '+60m' : '+15m' }}
                </div>
              </div>
            </div>

            <!-- Forecast Graph View -->
            <div v-if="modalTabMode === 'trend'" class="space-y-3">
              <div class="relative h-48 w-full pt-2">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 560 150">
                  <defs>
                    <linearGradient id="cleanGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.2" />
                      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path :d="getSvgFilledAreaPath(selectedTrainForTelemetry)" fill="url(#cleanGlow)" />
                  <path :d="getSvgSolidTrendPath(selectedTrainForTelemetry)" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
                  <path :d="getSvgForecastPath(selectedTrainForTelemetry)" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="5,5" />

                  <g v-for="(point, pIdx) in getSvgPoints(selectedTrainForTelemetry)" :key="pIdx">
                    <circle :cx="point.x" :cy="point.y" r="5" :class="point.isForecast ? 'fill-orange-500' : 'fill-sky-600'" />
                    <text :x="point.x" :y="point.y - 10" text-anchor="middle" class="text-[10px] font-extrabold fill-slate-700">
                      {{ point.val }}m
                    </text>
                  </g>
                </svg>
              </div>

              <div class="flex justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100">
                <span v-for="(log, lIdx) in windowFor(selectedTrainForTelemetry)" :key="lIdx">
                  {{ log.day.split(',')[0] }}
                </span>
                <span class="text-orange-600 font-extrabold">Forecast</span>
              </div>
            </div>

            <!-- Table View -->
            <div v-else class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th class="p-2.5">Day &amp; Date</th>
                    <th class="p-2.5">Origin Dept</th>
                    <th class="p-2.5">Dest Arrival</th>
                    <th class="p-2.5 text-right">Delay</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr v-for="(log, idx) in windowFor(selectedTrainForTelemetry)" :key="idx">
                    <td class="p-2.5 font-bold text-slate-900">{{ log.day }}</td>
                    <td class="p-2.5 text-slate-600">{{ log.originDept }}</td>
                    <td class="p-2.5 text-slate-600">{{ log.destArr }}</td>
                    <td class="p-2.5 text-right font-extrabold">
                      <span :class="log.delayMinutes === 0 ? 'text-emerald-700' : 'text-amber-700'">{{ log.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              @click="handleSelectActiveJourney(selectedTrainForTelemetry); selectedTrainForTelemetry = null"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Sync Active Journey
            </button>
            <button
              @click="selectedTrainForTelemetry = null"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { POPULAR_STATIONS } from '@/data/stations'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import ModernDatePicker from '@/components/ui/ModernDatePicker.vue'
import ReliabilityGaugeMeter from '@/components/common/ReliabilityGaugeMeter.vue'
import { getHistory } from '@/services/history'
import { computeBaseConfidence } from '@/services/scoring'
import {
  getReliabilityLevel,
  getReliabilityLabel,
  getReliabilityBadgeClass,
  getReliabilityDotClass,
  getReliabilityTextClass,
  getReliabilityReason,
  getTrainRating,
  getRatingBreakdown
} from '@/services/reliability'
import {
  Train,
  MapPin,
  ArrowLeftRight,
  TrendingUp,
  ChevronRight,
  Search,
  CheckCircle2,
  Star,
  StarHalf,
  Gauge
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()

const pnrSearchInput = ref('')
const selectedTrainForTelemetry = ref(null)
const modalTabMode = ref('trend')
const activeRatingPopoverId = ref(null)
const activePredictionPopoverId = ref(null)

function toggleRatingPopover(trainId) {
  activePredictionPopoverId.value = null
  activeRatingPopoverId.value = activeRatingPopoverId.value === trainId ? null : trainId
}

function togglePredictionPopover(trainId) {
  activeRatingPopoverId.value = null
  activePredictionPopoverId.value = activePredictionPopoverId.value === trainId ? null : trainId
}

onMounted(() => {
  window.addEventListener('click', () => {
    activeRatingPopoverId.value = null
    activePredictionPopoverId.value = null
  })
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

// Reliability grading now lives in src/services/reliability.js so the public
// search page and this authenticated page grade every train identically. These
// local wrappers exist only so the template below needs no changes.

/**
 * The full running-history window backing this train's score.
 *
 * The chart and the log table below must read the SAME window the confidence
 * score is computed from. They previously read the seven hand-authored days
 * while the score used thirty, so the evidence on screen did not actually
 * support the verdict above it.
 *
 * @param {Object} train - train object
 * @returns {Array<Object>} the history window, oldest day first
 */
function windowFor(train) {
  return getHistory(train)
}

/**
 * Confidence score for a train, so no template reads the raw curated field.
 *
 * @param {Object} train - train object
 * @returns {Number} confidence from 0 to 100
 */
function confidenceOf(train) {
  return computeBaseConfidence(train)
}

/**
 * Mean delay across the full window, used for the forecast baseline.
 *
 * @param {Object} train - train object
 * @returns {Number} average delay in whole minutes
 */
function getAverageDelay(train) {
  const window = getHistory(train)
  if (!window.length) return 0
  const total = window.reduce((acc, log) => acc + (log.delayMinutes || 0), 0)
  return Math.round(total / window.length)
}

function getSvgPoints(train) {
  const window = getHistory(train)
  if (!window.length) return []
  const maxDelay = 200
  const width = 520
  const startX = 30
  const stepX = width / (window.length)

  const points = window.map((log, idx) => {
    const delay = log.delayMinutes || 0
    const x = startX + (idx * stepX)
    const y = Math.max(20, 130 - (delay / maxDelay) * 100)
    return { x, y, val: delay, isForecast: false }
  })

  const avg = getAverageDelay(train)
  const forecastVal = getReliabilityLevel(train) === 'red' ? Math.round(avg * 1.1) : Math.max(0, Math.round(avg * 0.7))
  const forecastX = startX + (window.length * stepX)
  const forecastY = Math.max(20, 130 - (forecastVal / maxDelay) * 100)

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
  return `${linePath} L ${last.x} 140 L ${first.x} 140 Z`
}

function openTelemetryModal(train, mode = 'trend') {
  selectedTrainForTelemetry.value = train
  modalTabMode.value = mode
}
</script>
