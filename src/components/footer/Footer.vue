<template>
  <footer class="bg-slate-950 text-slate-400 border-t border-slate-800/80 relative overflow-hidden pt-16 pb-12">
    <!-- Glowing Background Aura for Footer -->
    <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-r from-blue-600/10 via-rail-500/10 to-indigo-600/10 blur-[140px] pointer-events-none"></div>

    <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 2xl:px-16 relative z-10 space-y-12">
      <!-- Main Footer Columns Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <!-- Brand Info Column (Span 4) -->
        <div class="lg:col-span-4 space-y-5">
          <Logo size="lg" showTagline dark />

          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md font-normal">
            RailEase is India's premier high-fidelity railway reliability super app. Transforming train travel by taking passengers from <em class="text-sky-400 font-semibold not-italic">uncertainty to assurance</em> through AI predictions, live satellite radar, and disruption protection.
          </p>

          <!-- Social Links -->
          <div class="flex items-center gap-3 pt-2">
            <a href="#" @click.prevent class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-400 hover:bg-sky-500/10 transition-all shadow-2xs">
              <Twitter class="w-4 h-4" />
            </a>
            <a href="#" @click.prevent class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-400 hover:bg-sky-500/10 transition-all shadow-2xs">
              <Linkedin class="w-4 h-4" />
            </a>
            <a href="#" @click.prevent class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-400 hover:bg-sky-500/10 transition-all shadow-2xs">
              <Github class="w-4 h-4" />
            </a>
            <a href="#" @click.prevent class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-400 hover:bg-sky-500/10 transition-all shadow-2xs">
              <Youtube class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Column 1: Reliability Solutions (Span 2) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-100">Reliability</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><a href="#features" class="hover:text-sky-400 transition-colors">Reliability Score</a></li>
            <li><a href="#predictions" class="hover:text-sky-400 transition-colors">AI Delay Engine</a></li>
            <li><a href="#tracking" class="hover:text-sky-400 transition-colors">Satellite Line Radar</a></li>
            <li><a href="#recovery" class="hover:text-sky-400 transition-colors">Disruption Recovery</a></li>
            <li><router-link to="/dashboard" class="hover:text-sky-400 transition-colors">High-Stakes Mode</router-link></li>
          </ul>
        </div>

        <!-- Column 2: Express Corridors (Span 2) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-100">Express Lines</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">Vande Bharat Express</router-link></li>
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">Mumbai Rajdhani</router-link></li>
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">Lucknow Shatabdi</router-link></li>
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">IRCTC Tejas Express</router-link></li>
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">Karnataka Superfast</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Platform Tools (Span 2) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-100">Platform</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><router-link to="/search" class="hover:text-sky-400 transition-colors">Search &amp; Book</router-link></li>
            <li><router-link to="/live-status" class="hover:text-sky-400 transition-colors">Live Train Tracking</router-link></li>
            <li><router-link to="/alerts" class="hover:text-sky-400 transition-colors">PNR Alerts</router-link></li>
            <li><router-link to="/ecatering" class="hover:text-sky-400 transition-colors">eCatering Food</router-link></li>
            <li><router-link to="/community" class="hover:text-sky-400 transition-colors">Community Feed</router-link></li>
          </ul>
        </div>

        <!-- Column 4: Trust & Legal (Span 2) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-100">Support &amp; Legal</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><router-link to="/profile" class="hover:text-sky-400 transition-colors">My Profile</router-link></li>
            <li><router-link to="/settings" class="hover:text-sky-400 transition-colors">Settings</router-link></li>
            <li><router-link to="/support" class="hover:text-sky-400 transition-colors">Help Center</router-link></li>
            <li><a href="#" @click.prevent class="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" @click.prevent class="hover:text-sky-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar: System Status & Copyright -->
      <div class="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <!-- Live System Status Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          All 500+ Indian Railway Corridors Operational
        </div>

        <p class="text-slate-400 text-center md:text-left font-medium">
          © 2026 RailEase Technologies Inc. Plan better, know before you go.
        </p>

        <!-- Country & Currency Badge -->
        <div class="flex items-center gap-2 text-slate-300 font-semibold bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
          <span>🇮🇳 India</span>
          <span class="text-slate-600">•</span>
          <span>INR ₹</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import Logo from '@/components/common/Logo.vue'
import { Twitter, Linkedin, Github, Youtube } from 'lucide-vue-next'
</script>
