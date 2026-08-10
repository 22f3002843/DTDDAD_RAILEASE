<template>
  <div class="min-h-screen bg-rail-bg flex">
    <!-- Sidebar Navigation (Contains Bottom Logout) -->
    <Sidebar />

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
      <!-- Top Header -->
      <header class="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div class="flex items-center gap-4">
          <!-- Toggle Sidebar Button (Shown when sidebar is collapsed) -->
          <button
            v-if="isSidebarCollapsed"
            @click="toggleSidebar"
            class="p-2 rounded-xl text-slate-600 hover:text-rail-600 hover:bg-rail-50 border border-slate-200 shadow-sm transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Expand Sidebar Navigation"
          >
            <PanelLeftOpen class="w-5 h-5 text-rail-500" />
            <span class="hidden sm:inline">Show Sidebar</span>
          </button>

          <!-- Quick Search input -->
          <div class="relative w-72">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search train, PNR, or route..."
              class="w-full pl-10 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rail-500 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        <!-- Header Actions: Notifications, Profile & Top-Right Logout -->
        <div class="flex items-center gap-4">
          <!-- Back to Landing Page link -->
          <button
            @click="router.push('/')"
            class="text-xs font-semibold text-slate-600 hover:text-rail-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            &larr; Home Page
          </button>

          <div class="h-5 w-px bg-slate-200"></div>

          <!-- Notification Bell with Live Alerts Popover -->
          <div class="relative" ref="alertsContainerRef">
            <button
              @click.stop="isAlertsOpen = !isAlertsOpen"
              class="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-rail-600 transition-colors cursor-pointer focus:outline-none"
              title="Live Alerts & Notifications"
            >
              <Bell class="w-5 h-5" />
              <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rail-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            <!-- Sleek Live Alerts Popover Dropdown -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform opacity-0 scale-95 -translate-y-1"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform opacity-100 scale-100 translate-y-0"
              leave-to-class="transform opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="isAlertsOpen"
                class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-[120] overflow-hidden text-left font-sans"
              >
                <!-- Header -->
                <div class="p-3.5 px-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Bell class="w-4 h-4 text-rail-600" />
                    <span class="text-xs font-black text-slate-900 uppercase tracking-wider">Live Alerts &amp; Notifications</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-rail-50 text-rail-700 text-[10px] font-black border border-rail-200">
                    3 New
                  </span>
                </div>

                <!-- Quick Alerts List -->
                <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div
                    v-for="alert in quickAlerts"
                    :key="alert.id"
                    @click="router.push('/alerts'); isAlertsOpen = false"
                    class="p-3 px-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div class="space-y-0.5 flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span
                          :class="[
                            'px-1.5 py-0.5 rounded text-[10px] font-black uppercase',
                            alert.category === 'Delay' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            alert.category === 'Platform' ? 'bg-blue-50 text-rail-700 border border-rail-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          ]"
                        >
                          {{ alert.category }}
                        </span>
                        <span class="text-[11px] font-black text-slate-900 truncate group-hover:text-rail-600 transition-colors">{{ alert.title }}</span>
                      </div>
                      <p class="text-[11px] text-slate-500 font-medium line-clamp-1 leading-snug">
                        {{ alert.message }}
                      </p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">{{ alert.time }}</span>
                  </div>
                </div>

                <!-- Footer CTA -->
                <div class="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    @click="router.push('/alerts'); isAlertsOpen = false"
                    class="w-full py-1.5 rounded-lg bg-rail-500 hover:bg-rail-600 text-white text-xs font-black transition-all shadow-2xs hover:shadow-glow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View All Alerts</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </transition>
          </div>

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
            class="px-3.5 py-1.5 border border-slate-200 hover:border-red-500 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs rounded-btn shadow-sm transition-all flex items-center gap-1.5 ml-2 cursor-pointer"
            title="Logout"
          >
            <LogOut class="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Main Scrollable Content -->
      <main :key="route.path" class="flex-1 p-8 overflow-y-auto animate-page-enter">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSidebar } from '@/composables/useSidebar'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { Search, Bell, LogOut, PanelLeftOpen, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isSidebarCollapsed, toggleSidebar } = useSidebar()

const isAlertsOpen = ref(false)
const alertsContainerRef = ref(null)

const quickAlerts = [
  { id: 1, category: 'Delay', title: 'Chart Prepared - High Confidence On-Time', message: 'Vande Bharat Express (22436) chart prepared. Estimated departure 06:00 AM sharp.', time: '10:30 AM' },
  { id: 2, category: 'Platform', title: 'NDLS Platform #16 Assigned', message: 'Train #12952 (Mumbai Rajdhani) has been assigned Platform #16 at New Delhi.', time: '09:45 AM' },
  { id: 3, category: 'Info', title: 'High-Stakes Mode Active', message: 'Your Exam journey safeguards are active. Backup train options reserved.', time: 'Yesterday' }
]

function handleClickOutside(event) {
  if (alertsContainerRef.value && !alertsContainerRef.value.contains(event.target)) {
    isAlertsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
