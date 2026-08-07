<template>
  <div class="min-h-screen bg-rail-bg flex">
    <!-- Sidebar Navigation (Contains Bottom Logout) -->
    <Sidebar />

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <header class="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <!-- Quick Search input -->
        <div class="relative w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search train, PNR, or route..."
            class="w-full pl-10 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rail-500 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
          />
        </div>

        <!-- Header Actions: Notifications, Profile & Top-Right Logout -->
        <div class="flex items-center gap-4">
          <!-- Back to Landing Page link -->
          <button
            @click="router.push('/')"
            class="text-xs font-semibold text-slate-600 hover:text-rail-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            &larr; Home Page
          </button>

          <div class="h-5 w-px bg-slate-200"></div>

          <!-- Notification Bell -->
          <button class="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell class="w-5 h-5 text-slate-600" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rail-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div class="h-5 w-px bg-slate-200"></div>

          <!-- User Profile Avatar & Info -->
          <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/profile')">
            <div class="w-9 h-9 rounded-full bg-rail-100 border border-rail-200 flex items-center justify-center text-rail-700 font-semibold text-sm shadow-sm overflow-hidden">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover" />
              <span v-else>RT</span>
            </div>
            <div class="hidden sm:flex flex-col text-left">
              <span class="text-xs font-bold text-slate-900 leading-tight">
                {{ authStore.user?.name || 'RailEase User' }}
              </span>
              <span class="text-[10px] font-medium text-slate-400">
                {{ authStore.user?.tier || 'Prime Member' }}
              </span>
            </div>
          </div>

          <!-- Top-Right Header Logout Button -->
          <button
            @click="handleLogout"
            class="px-3.5 py-1.5 border border-slate-200 hover:border-red-500 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs rounded-btn shadow-sm transition-all flex items-center gap-1.5 ml-2"
            title="Logout"
          >
            <LogOut class="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Main Scrollable Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { Search, Bell, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
