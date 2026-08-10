<template>
  <aside
    :class="[
      'bg-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 shadow-sm transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-0 opacity-0 -translate-x-full overflow-hidden border-r-0' : 'w-64 opacity-100 translate-x-0 border-r border-slate-200/80'
    ]"
  >
    <div class="w-64">
      <!-- Brand Logo Header & Collapse Toggle Button -->
      <div class="h-20 px-5 flex items-center justify-between border-b border-slate-100">
        <Logo showSub />
        
        <!-- Hide Sidebar Button (Left Arrow) -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-xl text-slate-400 hover:text-rail-600 hover:bg-rail-50 transition-all cursor-pointer"
          title="Collapse Sidebar"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
      </div>

      <!-- Main Navigation Menu -->
      <div class="px-3 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-100px)]">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all group relative',
            $route.path === item.path
              ? 'bg-gradient-to-r from-rail-600 via-sky-600 to-indigo-700 text-white shadow-md shadow-rail-600/30 font-extrabold border border-rail-500/80'
              : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 font-semibold'
          ]"
        >
          <!-- Active Crisp Indicator Bar -->
          <span
            v-if="$route.path === item.path"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-sm"
          ></span>

          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
              $route.path === item.path ? 'text-white' : 'text-slate-400 group-hover:text-rail-600'
            ]"
          />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Bottom Footer Brand Badge -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50 text-center w-64">
      <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
        RailEase v2.4 Intelligence
      </span>
    </div>
  </aside>
</template>

<script setup>
import Logo from '@/components/common/Logo.vue'
import { useSidebar } from '@/composables/useSidebar'
import {
  LayoutDashboard,
  Train,
  Compass,
  Clock,
  Bell,
  Utensils,
  Users,
  User,
  Settings,
  HelpCircle,
  ChevronLeft
} from 'lucide-vue-next'

const { isSidebarCollapsed, toggleSidebar } = useSidebar()

const navItems = [
  { label: 'Your travel', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Train Intelligence & Sync', path: '/train-intelligence', icon: Train },
  { label: 'I missed my train', path: '/journey-planner', icon: Compass },
  { label: 'Live Radar', path: '/live-status', icon: Clock },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'eCatering', path: '/ecatering', icon: Utensils },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Support', path: '/support', icon: HelpCircle },
]
</script>
