<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all">
    <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
      <!-- Big Prominent App Icon & Brand Logo -->
      <Logo size="lg" />

      <!-- Center Navigation Links -->
      <nav class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors">
          Reliability Score
        </a>
        <a href="#predictions" class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors">
          Delay Prediction
        </a>
        <a href="#tracking" class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors">
          Live Tracking
        </a>
        <a href="#recovery" class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors">
          Disruption Recovery
        </a>
      </nav>

      <!-- Right Actions: Sign In / Register OR Dashboard & Logout buttons -->
      <div class="flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <!-- Go to Dashboard button -->
          <button
            @click="router.push('/dashboard')"
            class="px-5 py-2.5 bg-rail-500 hover:bg-rail-600 text-white font-semibold text-xs rounded-btn shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>

          <!-- Top-Right Logout button -->
          <button
            @click="handleLogout"
            class="px-4 py-2.5 border border-slate-300 hover:border-red-500 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs rounded-btn shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Log Out"
          >
            <LogOut class="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </template>

        <template v-else>
          <button
            @click="$emit('openLogin')"
            class="px-6 py-2.5 bg-rail-500 hover:bg-rail-600 text-white font-semibold text-sm rounded-btn shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
          >
            <User class="w-4 h-4" />
            <span>Sign In / Register</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Logo from '@/components/common/Logo.vue'
import { LayoutDashboard, LogOut, User, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['openLogin'])
const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
