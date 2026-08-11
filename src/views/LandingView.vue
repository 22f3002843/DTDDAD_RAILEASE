<template>
  <div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden selection:bg-rail-500 selection:text-white">
    <!-- Minimal Top Scroll Line with User's Custom White Train Icon -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-slate-200/40 z-[100] pointer-events-none select-none">
      <div
        class="h-full bg-rail-500 relative transition-all duration-75 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      >
        <!-- Small White Double-Coach High Speed Train travelling Left to Right -->
        <div
          v-if="scrollProgress > 0"
          class="absolute -right-5 -top-2.5 flex items-center justify-center transition-all duration-75 ease-out text-white drop-shadow-[0_2px_4px_rgba(15,23,42,0.6)]"
        >
          <ScrollTrainIcon class="w-9 h-4.5 text-white" />
        </div>
      </div>
    </div>

    <!-- Top Navbar with Clean RailEase Logo & Top-Right Sign In Button -->
    <Navbar @openLogin="showAuthModal = true" />

    <!-- ==================== AMBIENT LIGHT HERO BACKDROP ==================== -->
    <div class="absolute inset-x-0 top-0 h-[750px] overflow-hidden pointer-events-none z-0">

      <!-- Soft Gradient Overlay to blend bottom into slate-50 -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-slate-50/60 to-slate-50"></div>

      <!-- Main Soft Ambient Glow Orb 1 (Top Left Hero Brand Area) -->
      <div
        class="absolute -top-20 left-10 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-rail-400/20 via-sky-300/15 to-indigo-300/10 blur-[120px] animate-ambient-glow"
      ></div>

      <!-- Rotating Cyan-Blue Glow Orb 2 (Behind Quick Book Widget) -->
      <div
        class="absolute top-10 right-10 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-sky-400/15 via-rail-500/10 to-transparent blur-[120px] animate-slow-rotate"
      ></div>

      <!-- Subtle Dot Grid Pattern Background -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25"
      ></div>
    </div>
    <!-- =================================================================================== -->

    <!-- Main Hero Section (Scaled to max-w-[1700px] for widescreen & 14" compatibility) -->
    <section class="flex-1 max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 py-10 lg:py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
      <!-- Left Hero Content -->
      <div class="lg:col-span-7 space-y-7 text-left reveal-left relative">
        <!-- Backlight Glow Aura behind Hero Text -->
        <div class="absolute -top-10 -left-10 w-[550px] h-[350px] bg-gradient-to-r from-blue-400/20 via-sky-300/20 to-indigo-400/15 rounded-full blur-3xl opacity-80 animate-pulse-glow pointer-events-none -z-10"></div>

        <!-- Premium Pill Badges & Mission Tagline -->
        <div class="space-y-3 reveal-on-scroll delay-75">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-rail-200 text-rail-700 text-xs font-extrabold tracking-wide shadow-soft backdrop-blur-md">
            <Sparkles class="w-4 h-4 text-rail-500 animate-pulse" />
            <span>Indian Railway Reliability Intelligence</span>
          </div>
        </div>

        <!-- Main Headline: Plan better, Know before you go. -->
        <div class="space-y-2 reveal-on-scroll delay-150">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black tracking-tight text-rail-900 leading-[1.10]">
            Plan better,<br />
            <span class="bg-gradient-to-r from-rail-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Know before you go.
            </span>
          </h1>
        </div>

        <!-- Subtitle Mission Statement -->
        <p class="text-base sm:text-lg 2xl:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal reveal-on-scroll delay-250">
          See how often a train <strong>actually</strong> arrives on time, from its last 30 days of
          running, before you book.
        </p>

        <!-- Trust Stat Cards (Staggered Entrance Animation) -->
        <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left max-w-2xl">
          <div class="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm card-glow-hover reveal-scale delay-300">
            <div class="text-2xl sm:text-3xl font-black text-rail-900">88-94%</div>
            <div class="text-xs text-slate-500 font-medium mt-0.5">Historical Pattern Match</div>
          </div>
          <div class="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm card-glow-hover reveal-scale delay-400">
            <div class="text-2xl sm:text-3xl font-black text-rail-900">500+</div>
            <div class="text-xs text-slate-500 font-medium mt-0.5">Express Corridors</div>
          </div>
          <div class="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm card-glow-hover reveal-scale delay-500">
            <div class="text-2xl sm:text-3xl font-black text-emerald-600">Smart Buffer</div>
            <div class="text-xs text-slate-500 font-medium mt-0.5">Everyday Travel Protection</div>
          </div>
        </div>
      </div>

      <!-- Right Hero Section: Indian Railways Quick Book Ticket Widget -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end relative reveal-right delay-200">
        <!-- Soft glowing ambient backlight aura -->
        <div class="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-orange-500/20 rounded-card blur-xl opacity-80 animate-pulse-glow -z-10"></div>
        <QuickBookWidget />
      </div>
    </section>

    <!-- SECTION 1: 4 Reliability Pillars Showcase -->
    <section id="features" class="bg-white/80 backdrop-blur-md py-20 border-t border-slate-200/80 relative">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-r from-blue-100/40 via-sky-100/30 to-indigo-100/30 blur-[140px] pointer-events-none -z-10"></div>

      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal-on-scroll">
          <h2 class="text-xs font-extrabold uppercase tracking-widest text-rail-500">From Uncertainty to Assurance</h2>
          <h3 class="text-3xl sm:text-4xl font-black text-rail-900 tracking-tight">What RailEase answers</h3>
          <p class="text-slate-600 text-sm sm:text-base">Four questions, answered before and during your journey.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1: will my train be on time -->
          <div id="predictions" class="bg-white p-6 sm:p-7 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-100">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-100/80 text-rail-600 flex items-center justify-center mb-5 shadow-sm">
                <BarChart3 class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-extrabold text-rail-900 mb-2">1. Reliability score of your train</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A confidence score from 30 days of real running, with the record behind it.
              </p>
            </div>
            <div class="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-rail-600 flex items-center gap-1">
              <span>Check any train</span> &rarr;
            </div>
          </div>

          <!-- Pillar 2: how late will it really be -->
          <div class="bg-white p-6 sm:p-7 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-200">
            <div>
              <div class="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center mb-5 shadow-sm">
                <Clock class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-extrabold text-rail-900 mb-2">2. How late will it really be?</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The arrival time to plan around, not the one on the timetable.
              </p>
            </div>
            <div class="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>See the real arrival time</span> &rarr;
            </div>
          </div>

          <!-- Pillar 3: where is my train -->
          <div id="tracking" class="bg-white p-6 sm:p-7 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-300">
            <div>
              <div class="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center mb-5 shadow-sm">
                <Navigation class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-extrabold text-rail-900 mb-2">3. Where is my train right now?</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Follow it live, and see what the delay means for your arrival.
              </p>
            </div>
            <div class="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center gap-1">
              <span>Track it live</span> &rarr;
            </div>
          </div>

          <!-- Pillar 4: recovery after a missed train -->
          <div id="recovery" class="bg-white p-6 sm:p-7 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-400">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                <ShieldCheck class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-extrabold text-rail-900 mb-2">4. What if I miss my train?</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us the train you missed and we work out how you still get there.
              </p>
            </div>
            <div class="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Get a recovery plan</span> &rarr;
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW SECTION: 30-Day Delay Telemetry & Pattern Match Showcase (Interactive Scroll Delay Section) -->
    <section class="py-20 bg-slate-100/70 border-t border-slate-200/80 relative">
      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3 reveal-on-scroll">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rail-100 text-rail-700 text-xs font-extrabold uppercase tracking-wider">
            <Activity class="w-3.5 h-3.5 text-rail-500 animate-pulse" />
            <span>30-Day Historical Telemetry Engine</span>
          </span>
          <h3 class="text-3xl sm:text-4xl font-black text-rail-900 tracking-tight">
            See the exact delay log before you step out
          </h3>
          <p class="text-slate-600 text-sm sm:text-base">
            Every train card exposes real historical delay minutes from past runs so you never rely on unverified timetables.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left: 7-Day Delay Log Cascading Animation Cards -->
          <div class="lg:col-span-7 space-y-3">
            <div class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 reveal-on-scroll">
              Sample 7-Day Delay Telemetry • Udyan Express (11301)
            </div>

            <div
              v-for="(log, idx) in sampleDelayLogs"
              :key="log.day"
              :class="[
                'bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between transition-all card-glow-hover',
                'reveal-scale',
                `delay-${(idx + 1) * 75}`
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-3 h-3 rounded-full shrink-0',
                    log.delayMinutes === 0 ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'
                  ]"
                ></div>
                <div>
                  <span class="text-xs font-extrabold text-slate-900 block">{{ log.day }}</span>
                  <span class="text-[11px] text-slate-400 font-medium">Avg Speed: {{ log.avgSpeed }}</span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-right">
                  <span
                    :class="[
                      'text-xs font-extrabold block',
                      log.delayMinutes === 0 ? 'text-emerald-600' : 'text-amber-600'
                    ]"
                  >
                    {{ log.status }}
                  </span>
                  <span class="text-[10px] text-slate-400">Dept: {{ log.originDept }} | Arr: {{ log.destArr }}</span>
                </div>
                <div class="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-1000"
                    :class="log.delayMinutes === 0 ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-[65%]'"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Live Risk Analytics Summary Card -->
          <div class="lg:col-span-5 reveal-right delay-300">
            <div class="bg-white p-7 rounded-card border border-slate-200/90 shadow-soft space-y-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-rail-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Corridor Reliability</span>
                  <h4 class="text-xl font-black text-rail-900">88.4% Confidence</h4>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-rail-50 border border-rail-100 flex items-center justify-center text-rail-600 font-black">
                  88%
                </div>
              </div>

              <div class="space-y-4 text-xs">
                <div class="space-y-1">
                  <div class="flex justify-between font-bold text-slate-700">
                    <span>On-Time Arrival Probability</span>
                    <span class="text-emerald-600">88%</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full w-[88%] rounded-full"></div>
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="flex justify-between font-bold text-slate-700">
                    <span>Minor Delay Risk (+10-25m)</span>
                    <span class="text-amber-600">12%</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full w-[12%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
                <TrendingUp class="w-4 h-4 text-rail-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Insight:</strong> Historical records over 30 days show minimal congestion along Western Ghats section with an average buffer delay under 14 minutes.
                </span>
              </div>

              <button
                @click="router.push('/search')"
                class="w-full py-3 bg-rail-900 hover:bg-slate-800 text-white font-bold text-xs rounded-btn shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Any Train Reliability Score</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Live High-Speed Corridors Radar Section -->
    <section class="py-20 border-t border-slate-200/80 relative">
      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal-on-scroll">
          <div>
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-rail-500">Live Express Radar</h2>
            <h3 class="text-3xl font-black text-rail-900 tracking-tight mt-1">Real-Time Indian Railway Corridors</h3>
          </div>
          <router-link to="/live-status" class="text-xs font-bold text-rail-600 hover:underline">
            View Live Signal Map &rarr;
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(corridor, index) in expressCorridors"
            :key="corridor.name"
            :class="['bg-white p-6 sm:p-7 rounded-card border border-slate-200/80 shadow-soft card-glow-hover space-y-4 reveal-on-scroll', `delay-${(index + 1) * 100}`]"
          >
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-rail-50 text-rail-700 font-extrabold text-[11px] border border-rail-100">
                {{ corridor.type }}
              </span>
              <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" />
                {{ corridor.punctuality }} Historical Rating
              </span>
            </div>

            <div>
              <h4 class="text-lg font-extrabold text-slate-900">{{ corridor.name }}</h4>
              <p class="text-xs sm:text-sm text-slate-500 mt-0.5" v-html="corridor.route"></p>
            </div>

            <div class="flex items-center justify-between text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3">
              <span>Avg Speed: <strong>{{ corridor.speed }}</strong></span>
              <span class="text-slate-400">Daily Runs</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: General Traveler Trip Assurance Breakdown -->
    <section class="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-20 relative overflow-hidden border-t border-slate-800">
      <div class="absolute top-0 right-0 w-[700px] h-[700px] bg-rail-500/20 blur-[150px] pointer-events-none"></div>

      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <!-- Left Text Content -->
        <div class="lg:col-span-7 space-y-6 text-left reveal-left">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rail-500/20 border border-rail-500/40 text-rail-300 font-extrabold text-xs reveal-on-scroll delay-75">
            <Sparkles class="w-3.5 h-3.5 text-rail-400" />
            <span>Smart Travel Shield Active</span>
          </span>
          
          <h2 class="text-3xl sm:text-4xl 2xl:text-5xl font-black tracking-tight text-white leading-tight reveal-on-scroll delay-150">
            Smart buffer &amp; delay planning for every journey.
          </h2>

          <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal reveal-on-scroll delay-250">
            Whether traveling home for festivals, daily work commutes, family vacations, or urgent trips, RailEase provides realistic buffer recommendations, live train tracking, and backup options for every Indian Railway passenger.
          </p>

          <div class="space-y-4 pt-2 max-w-xl">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm reveal-left delay-300">
              <div class="w-9 h-9 rounded-lg bg-rail-500/20 border border-rail-500/40 text-rail-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                01
              </div>
              <div>
                <h4 class="text-sm font-extrabold text-white">Alternate Train Backup Options</h4>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">Suggested secondary train routes if your primary line shows historical delay trends.</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm reveal-left delay-400">
              <div class="w-9 h-9 rounded-lg bg-rail-500/20 border border-rail-500/40 text-rail-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                02
              </div>
              <div>
                <h4 class="text-sm font-extrabold text-white">Delay Protection Coverage</h4>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">Automated journey tracking and disruption support for peace of mind.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Card (Trip Assurance Shield) -->
        <div class="lg:col-span-5 flex justify-center lg:justify-end reveal-right delay-300">
          <div class="w-full max-w-md bg-slate-900/90 border border-slate-700/80 p-8 rounded-card shadow-2xl backdrop-blur-md space-y-6">
            <div class="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <h3 class="text-base font-extrabold text-white">Trip Assurance Shield</h3>
              <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">High Reliability</span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Selected Risk Profile:</span>
                <span class="text-white font-bold">Everyday &amp; Family Priority</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Punctuality Rating:</span>
                <span class="text-emerald-400 font-bold">92.4% Historical Score</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Station Cab Backup:</span>
                <span class="text-white font-bold">Pre-assigned at Destination</span>
              </div>
            </div>

            <button
              @click="showAuthModal = true"
              class="w-full py-3 bg-rail-500 hover:bg-rail-600 text-white font-bold text-xs rounded-btn shadow transition-all cursor-pointer"
            >
              Configure Travel Shield &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: Traveler Testimonials -->
    <section class="py-20 bg-white border-t border-slate-200/80">
      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-3 reveal-on-scroll">
          <h2 class="text-xs font-extrabold uppercase tracking-widest text-rail-500">Verified Passenger Stories</h2>
          <h3 class="text-3xl font-black text-rail-900 tracking-tight">Trusted by Indian Travelers</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(review, index) in reviews"
            :key="review.author"
            :class="['bg-slate-50 p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between space-y-4 reveal-scale', `delay-${(index + 1) * 100}`]"
          >
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
              "{{ review.text }}"
            </p>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-200/60">
              <img :src="review.avatar" alt="" class="w-9 h-9 rounded-full object-cover border border-slate-300" />
              <div>
                <span class="text-xs sm:text-sm font-bold text-slate-900 block">{{ review.author }}</span>
                <span class="text-[10px] sm:text-xs text-slate-400 font-semibold">{{ review.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Final CTA Banner -->
    <section class="py-16 bg-gradient-to-r from-rail-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
      <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 text-center space-y-6 reveal-scale delay-150 relative z-10">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          Never get caught off-guard by railway delays again.
        </h2>
        <p class="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto font-normal">
          Join thousands of smart passengers planning journeys with real historical data.
        </p>
        <div class="pt-2 flex justify-center items-center gap-4">
          <button
            @click="router.push('/search')"
            class="px-8 py-3.5 bg-white text-rail-700 hover:bg-slate-100 font-black text-sm rounded-btn shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <BarChart3 class="w-4 h-4 text-rail-600" />
            <span>Search Train Reliability Score</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Sign In / Register Modal Dialog -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      @click.self="showAuthModal = false"
    >
      <div class="relative w-full max-w-md">
        <button
          @click="showAuthModal = false"
          class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center z-10 font-black text-sm border border-slate-200 cursor-pointer"
        >
          ✕
        </button>
        <AuthWidget />
      </div>
    </div>

    <!-- Premium Multi-Column Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/navbar/Navbar.vue'
import QuickBookWidget from '@/components/common/QuickBookWidget.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import Logo from '@/components/common/Logo.vue'
import ScrollTrainIcon from '@/components/common/ScrollTrainIcon.vue'
import Footer from '@/components/footer/Footer.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import {
  Sparkles,
  BarChart3,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Activity,
  TrendingUp,
  ArrowRight,
  Train
} from 'lucide-vue-next'

const router = useRouter()
const showAuthModal = ref(false)
const scrollProgress = ref(0)

// Calculate top scroll progress bar
function handleScroll() {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight
  if (totalScroll > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100))
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Activate scroll reveal animations
useScrollReveal()

const sampleDelayLogs = [
  { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '78 km/h' },
  { day: 'Tue, 04 Aug', status: 'Delayed +14m', delayMinutes: 14, originDept: '+5m', destArr: '+14m', avgSpeed: '75 km/h' },
  { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '79 km/h' },
  { day: 'Thu, 06 Aug', status: 'Delayed +22m', delayMinutes: 22, originDept: '+10m', destArr: '+22m', avgSpeed: '72 km/h' },
  { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '78 km/h' },
  { day: 'Sat, 01 Aug', status: 'Delayed +8m', delayMinutes: 8, originDept: '+2m', destArr: '+8m', avgSpeed: '77 km/h' },
  { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '79 km/h' }
]

const expressCorridors = [
  { name: 'Vande Bharat Express', type: 'High-Speed AC', route: 'New Delhi &rarr; Varanasi', punctuality: '92.4%', speed: '130 km/h' },
  { name: 'Mumbai Rajdhani', type: 'Superfast AC', route: 'New Delhi &rarr; Varanasi', punctuality: '89.2%', speed: '120 km/h' },
  { name: 'IRCTC Tejas Express', type: 'Premium Chair', route: 'Ahmedabad &rarr; Mumbai Central', punctuality: '94.8%', speed: '125 km/h' }
]

const reviews = [
  {
    author: 'Aakash Mehta',
    role: 'Daily Commuter & Traveler',
    text: 'RailEase historical pattern score gave me an early warning about delay trends so I planned an extra 2-hour buffer for my family festival trip.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    author: 'Dr. Neha Sharma',
    role: 'Medical Professional',
    text: 'The historical reliability rating is genuine and grounded. It helps me evaluate travel risk based on real past data.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    author: 'Rohan Gupta',
    role: 'Frequent Business & Vacation Traveler',
    text: 'Great data-driven insights. Satellite train tracking and station food delivery work seamlessly for all our family trips.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
  }
]
</script>
