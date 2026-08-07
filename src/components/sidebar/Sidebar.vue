<template>
  <aside class="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 shadow-sm">
    <div>
      <!-- Brand Logo Header -->
      <div class="h-20 px-6 flex items-center border-b border-slate-100">
        <Logo showSub />
      </div>

      <!-- Main Navigation Menu -->
      <div class="px-3 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3.5 py-3 rounded-btn text-sm font-medium transition-all group relative',
            $route.path === item.path
              ? 'bg-slate-900 text-white shadow-md font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-rail-900'
          ]"
        >
          <!-- Active Indicator Bar -->
          <span
            v-if="$route.path === item.path"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-rail-400 rounded-r-full"
          ></span>

          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
              $route.path === item.path ? 'text-rail-400' : 'text-slate-400 group-hover:text-slate-600'
            ]"
          />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Bottom Actions & Logout -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group"
      >
        <LogOut class="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-all" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Logo from '@/components/common/Logo.vue'
import {
  LayoutDashboard,
  Search,
  Calendar,
  Compass,
  Clock,
  Bell,
  Utensils,
  Users,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Search Trains', path: '/search', icon: Search },
  { label: 'My Bookings', path: '/bookings', icon: Calendar },
  { label: 'Journey Planner', path: '/journey-planner', icon: Compass },
  { label: 'Live Status', path: '/live-status', icon: Clock },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'eCatering', path: '/ecatering', icon: Utensils },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Support', path: '/support', icon: HelpCircle },
]

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
