<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all">
    <div class="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
      <!-- Big Prominent App Icon & Brand Logo -->
      <Logo size="lg" />

      <!-- Center Navigation Links (Protected Features Require Auth for Guests) -->
      <nav class="hidden md:flex items-center gap-8">
        <button
          @click="handleFeatureClick('/dashboard', 'Reliability Score')"
          class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          <span>Reliability Score</span>
          <Lock v-if="!authStore.isAuthenticated" class="w-3 h-3 text-slate-400 group-hover:text-rail-500 transition-colors" />
        </button>

        <button
          @click="handleFeatureClick('/dashboard', 'Delay Prediction')"
          class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          <span>Delay Prediction</span>
          <Lock v-if="!authStore.isAuthenticated" class="w-3 h-3 text-slate-400 group-hover:text-rail-500 transition-colors" />
        </button>

        <button
          @click="handleFeatureClick('/live-status', 'Live Tracking')"
          class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          <span>Live Tracking</span>
          <Lock v-if="!authStore.isAuthenticated" class="w-3 h-3 text-slate-400 group-hover:text-rail-500 transition-colors" />
        </button>

        <button
          @click="handleFeatureClick('/journey-planner', 'Disruption Recovery')"
          class="text-sm font-medium text-slate-600 hover:text-rail-500 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          <span>Disruption Recovery</span>
          <Lock v-if="!authStore.isAuthenticated" class="w-3 h-3 text-slate-400 group-hover:text-rail-500 transition-colors" />
        </button>
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
import { LayoutDashboard, LogOut, User, ArrowRight, Lock } from 'lucide-vue-next'

const emit = defineEmits(['openLogin'])
const router = useRouter()
const authStore = useAuthStore()

function handleFeatureClick(targetRoute, featureName) {
  if (authStore.isAuthenticated) {
    router.push(targetRoute)
  } else {
    // Guest users clicking protected feature links trigger the Sign In / Register dialog
    emit('openLogin', featureName)
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
