<template>
  <div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden selection:bg-rail-500 selection:text-white">
    <!-- Top Navbar with Clean RailEase Logo & Top-Right Sign In Button -->
    <Navbar @openLogin="showAuthModal = true" />

    <!-- ==================== AMBIENT LIGHT & VANDE BHARAT WATERMARK BACKGROUND ==================== -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <!-- Ultra-Transparent Vande Bharat Train Background Watermark Image -->
      <div class="absolute top-0 right-0 w-full lg:w-3/4 h-[750px] opacity-[0.07] mix-blend-multiply transition-opacity duration-1000 select-none">
        <img
          src="/vande_bharat_bg.png"
          alt="Vande Bharat Express Train Background"
          class="w-full h-full object-cover object-right-top filter brightness-105 contrast-125 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_40%,transparent_100%)]"
        />
      </div>

      <!-- Main Soft Ambient Glow Orb 1 (Top Left Hero Brand Area) -->
      <div
        class="absolute -top-20 left-10 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-rail-400/20 via-sky-300/15 to-indigo-300/10 blur-[120px] animate-ambient-glow"
      ></div>

      <!-- Rotating Cyan-Blue Glow Orb 2 (Behind Quick Book Widget) -->
      <div
        class="absolute top-10 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sky-400/15 via-rail-500/10 to-transparent blur-[120px] animate-slow-rotate"
      ></div>

      <!-- Pulsing Soft Indigo Tint Orb 3 (Bottom Hero Center) -->
      <div
        class="absolute top-96 left-1/3 -translate-x-1/2 w-[750px] h-[450px] rounded-full bg-gradient-to-r from-blue-200/25 via-indigo-150/20 to-sky-200/25 blur-[140px] animate-pulse-glow"
      ></div>

      <!-- Subtle Dot Grid Pattern Background -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
      ></div>
    </div>
    <!-- =================================================================================== -->

    <!-- Main Hero Section -->
    <section class="flex-1 max-w-7xl mx-auto px-6 py-10 lg:py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
      <!-- Left Hero Content -->
      <div class="lg:col-span-7 space-y-7 text-left reveal-on-scroll relative">
        <!-- Backlight Glow Aura behind Hero Text -->
        <div class="absolute -top-10 -left-10 w-[480px] h-[320px] bg-gradient-to-r from-blue-400/15 via-sky-300/15 to-indigo-400/10 rounded-full blur-3xl opacity-80 animate-pulse-glow pointer-events-none -z-10"></div>

        <!-- Premium Pill Badges & Mission Tagline -->
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-rail-200 text-rail-700 text-xs font-extrabold tracking-wide shadow-soft backdrop-blur-md">
            <Sparkles class="w-4 h-4 text-rail-500 animate-pulse" />
            <span>Indian Railway Reliability Intelligence</span>
          </div>

          <div class="text-xs font-black tracking-[0.25em] text-rail-500 uppercase flex items-center gap-2 pt-1">
            <span class="w-6 h-0.5 bg-rail-500 rounded-full"></span>
            From Uncertainty to Assurance
          </div>
        </div>

        <!-- Main Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-rail-900 leading-[1.10]">
          Plan better,<br />
          <span class="bg-gradient-to-r from-rail-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Travel smarter.
          </span>
        </h1>

        <!-- Subtitle Mission Statement -->
        <p class="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
          RailEase evaluates <strong>historical train telemetry</strong>, signal box history, and seasonal corridor data to provide <strong>reliable delay forecasts</strong> — giving you realistic travel foresight without blind guesswork.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button
            @click="showAuthModal = true"
            class="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-btn font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group relative cursor-pointer"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#features"
            class="px-7 py-4 bg-white/90 backdrop-blur-md border border-slate-300 hover:border-rail-400 text-slate-700 font-semibold text-sm rounded-btn shadow-sm hover:shadow transition-all"
          >
            Explore 4 Pillars
          </a>
        </div>

        <!-- Trust Stat Cards -->
        <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
          <div class="p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm card-glow-hover">
            <div class="text-2xl font-black text-rail-900">88-94%</div>
            <div class="text-xs text-slate-500 font-medium">Historical Pattern Match</div>
          </div>
          <div class="p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm card-glow-hover">
            <div class="text-2xl font-black text-rail-900">500+</div>
            <div class="text-xs text-slate-500 font-medium">Express Corridors</div>
          </div>
          <div class="p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm card-glow-hover">
            <div class="text-2xl font-black text-emerald-600">Smart Buffer</div>
            <div class="text-xs text-slate-500 font-medium">High-Stakes Mode</div>
          </div>
        </div>
      </div>

      <!-- Right Hero Section: Indian Railways Quick Book Ticket Widget -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end relative reveal-on-scroll delay-200">
        <!-- Soft glowing ambient backlight aura -->
        <div class="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-orange-500/20 rounded-card blur-xl opacity-80 animate-pulse-glow -z-10"></div>
        <QuickBookWidget />
      </div>
    </section>

    <!-- SECTION 1: 4 Reliability Pillars Showcase -->
    <section id="features" class="bg-white/80 backdrop-blur-md py-20 border-t border-slate-200/80 relative">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-100/40 via-sky-100/30 to-indigo-100/30 blur-[130px] pointer-events-none -z-10"></div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-on-scroll">
          <h2 class="text-xs font-extrabold uppercase tracking-widest text-rail-500">From Uncertainty to Assurance</h2>
          <h3 class="text-3xl font-black text-rail-900 tracking-tight">Engineered for Indian Railway Travelers</h3>
          <p class="text-slate-600 text-sm">Data-driven forecasts to help you plan travel buffer times with confidence.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1: Reliability Score -->
          <div id="predictions" class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-100">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-100/80 text-rail-600 flex items-center justify-center mb-5 shadow-sm">
                <BarChart3 class="w-6 h-6" />
              </div>
              <h4 class="text-base font-extrabold text-rail-900 mb-2">1. Reliability Score</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Evaluates 30-day historical punctuality logs, signal box history, and corridor data to calculate realistic travel confidence.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-rail-600 flex items-center gap-1">
              <span>View Score Meter</span> &rarr;
            </div>
          </div>

          <!-- Pillar 2: Delay Prediction -->
          <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-200">
            <div>
              <div class="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center mb-5 shadow-sm">
                <Clock class="w-6 h-6" />
              </div>
              <h4 class="text-base font-extrabold text-rail-900 mb-2">2. Delay Prediction</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Statistical modeling estimates arrival windows based on track maintenance, weather trends, and historical section delay.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>AI Forecast Logs</span> &rarr;
            </div>
          </div>

          <!-- Pillar 3: Live Tracking -->
          <div id="tracking" class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-300">
            <div>
              <div class="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center mb-5 shadow-sm">
                <Navigation class="w-6 h-6" />
              </div>
              <h4 class="text-base font-extrabold text-rail-900 mb-2">3. Live Tracking</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Station telemetry and GPS train tracking keeping you informed of actual block clearance along the line.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center gap-1">
              <span>Explore Radar</span> &rarr;
            </div>
          </div>

          <!-- Pillar 4: Disruption Recovery -->
          <div id="recovery" class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between reveal-on-scroll delay-400">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                <ShieldCheck class="w-6 h-6" />
              </div>
              <h4 class="text-base font-extrabold text-rail-900 mb-2">4. Disruption Recovery</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Delay protection guarantees, alternate train backup options, and emergency station cabs so missing your schedule is avoided.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Assurance Protection</span> &rarr;
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Live High-Speed Corridors Radar Section -->
    <section class="py-20 border-t border-slate-200/80 relative">
      <div class="max-w-7xl mx-auto px-6 space-y-12">
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
            v-for="corridor in expressCorridors"
            :key="corridor.name"
            class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover space-y-4 reveal-on-scroll delay-100"
          >
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-full bg-rail-50 text-rail-700 font-extrabold text-[11px] border border-rail-100">
                {{ corridor.type }}
              </span>
              <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" />
                {{ corridor.punctuality }} Historical Rating
              </span>
            </div>

            <div>
              <h4 class="text-base font-extrabold text-slate-900">{{ corridor.name }}</h4>
              <p class="text-xs text-slate-500 mt-0.5" v-html="corridor.route"></p>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
              <span>Avg Speed: <strong>{{ corridor.speed }}</strong></span>
              <span class="text-slate-400">Daily Runs</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: High-Stakes Trip Assurance Breakdown -->
    <section class="bg-slate-900 text-white py-20 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-rail-500/20 blur-[140px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div class="lg:col-span-6 space-y-6 reveal-on-scroll">
          <span class="px-3.5 py-1.5 rounded-full bg-rail-500/20 border border-rail-500/40 text-rail-300 font-extrabold text-xs">
            High-Stakes Mode Active
          </span>
          <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Smart buffer planning for critical exams & flights.
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed">
            When you select High-Stakes Mode for critical travel, RailEase provides realistic buffer options and backup ticket suggestions to safeguard your timetable.
          </p>

          <div class="space-y-4 pt-2">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rail-500/20 border border-rail-500/40 text-rail-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                01
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">Alternate Train Backup Recommendations</h4>
                <p class="text-xs text-slate-400 mt-0.5">Suggested secondary train schedules if your primary line shows historical delay trends.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rail-500/20 border border-rail-500/40 text-rail-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                02
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">Delay Protection Coverage</h4>
                <p class="text-xs text-slate-400 mt-0.5">Automated policy tracking for journey disruption compensation.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 flex justify-center lg:justify-end reveal-on-scroll delay-200">
          <div class="w-full max-w-md bg-slate-800/90 border border-slate-700 p-8 rounded-card shadow-2xl backdrop-blur-md card-glow-hover space-y-6">
            <div class="flex items-center justify-between border-b border-slate-700 pb-4">
              <h3 class="text-base font-extrabold text-white">Trip Assurance Shield</h3>
              <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">High Reliability</span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Selected Risk Profile:</span>
                <span class="text-white font-bold">Competitive Exam Priority</span>
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
              Configure High-Stakes Mode &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: Traveler Testimonials -->
    <section class="py-20 bg-white border-t border-slate-200/80">
      <div class="max-w-7xl mx-auto px-6 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-3 reveal-on-scroll">
          <h2 class="text-xs font-extrabold uppercase tracking-widest text-rail-500">Verified Passenger Stories</h2>
          <h3 class="text-3xl font-black text-rail-900 tracking-tight">Trusted by 100,000+ Indian Travelers</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="review in reviews"
            :key="review.author"
            class="bg-slate-50 p-6 rounded-card border border-slate-200/80 shadow-soft card-glow-hover flex flex-col justify-between space-y-4 reveal-on-scroll delay-100"
          >
            <p class="text-xs text-slate-700 leading-relaxed font-medium italic">
              "{{ review.text }}"
            </p>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-200/60">
              <img :src="review.avatar" alt="" class="w-9 h-9 rounded-full object-cover border border-slate-300" />
              <div>
                <span class="text-xs font-bold text-slate-900 block">{{ review.author }}</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ review.role }}</span>
              </div>
            </div>
          </div>
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
          class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center z-10 font-black text-sm border border-slate-200"
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
import { ref } from 'vue'
import Navbar from '@/components/navbar/Navbar.vue'
import QuickBookWidget from '@/components/common/QuickBookWidget.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import Logo from '@/components/common/Logo.vue'
import Footer from '@/components/footer/Footer.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { Sparkles, ArrowRight, BarChart3, Clock, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'

const showAuthModal = ref(false)

// Activate scroll reveal animations
useScrollReveal()

const expressCorridors = [
  { name: 'Vande Bharat Express', type: 'High-Speed AC', route: 'New Delhi &rarr; Varanasi', punctuality: '92.4%', speed: '130 km/h' },
  { name: 'Mumbai Rajdhani', type: 'Superfast AC', route: 'New Delhi &rarr; Varanasi', punctuality: '89.2%', speed: '120 km/h' },
  { name: 'IRCTC Tejas Express', type: 'Premium Chair', route: 'Ahmedabad &rarr; Mumbai Central', punctuality: '94.8%', speed: '125 km/h' }
]

const reviews = [
  {
    author: 'Aakash Mehta',
    role: 'UPSC Aspirant',
    text: 'RailEase historical pattern score gave me an early warning about delay trends so I planned an extra 2-hour buffer for my exam trip.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    author: 'Dr. Neha Sharma',
    role: 'Medical Specialist',
    text: 'The historical reliability rating is genuine and grounded. It helps me evaluate travel risk based on real past data.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    author: 'Rohan Gupta',
    role: 'Frequent Business Traveler',
    text: 'Great data-driven insights. Satellite train tracking and station food delivery work seamlessly.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
  }
]
</script>
