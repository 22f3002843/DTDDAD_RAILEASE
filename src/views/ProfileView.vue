<template>
  <AppLayout>
    <div class="w-full space-y-6 font-sans pb-10">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          title="Go Back"
        >
          <ArrowLeft class="w-4 h-4" />
        </button>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          My Profile
        </h1>
      </div>

      <!-- Top Profile Card (Edge-to-Edge Full Width) -->
      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-soft flex items-start justify-between relative w-full">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-700 font-black text-2xl overflow-hidden shadow-2xs shrink-0">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>RT</span>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-extrabold text-slate-900">{{ authStore.user?.name || 'RailEase Traveler' }}</h2>
              <span class="px-3 py-1 rounded-full bg-rail-50 text-rail-700 text-xs font-black border border-rail-200/80 shadow-2xs">
                {{ authStore.user?.tier || 'Prime Member' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-semibold">Username: {{ authStore.user?.username }} &bull; Member since {{ authStore.user?.memberSince }}</p>
            <p class="text-xs text-slate-500 font-semibold">{{ authStore.user?.email }} &bull; {{ authStore.user?.phone }}</p>
          </div>
        </div>

        <button class="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer">
          <Pencil class="w-4 h-4" />
        </button>
      </div>

      <!-- Grid of Action Cards (Edge-to-Edge Full Width Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        <div
          v-for="card in profileCards"
          :key="card.title"
          @click="router.push(card.path)"
          class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-md hover:border-rail-300 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-rail-600 group-hover:text-white transition-colors shrink-0">
              <component :is="card.icon" class="w-5 h-5" />
            </div>
            <span class="text-sm font-extrabold text-slate-900 group-hover:text-rail-700 transition-colors">{{ card.title }}</span>
          </div>

          <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-rail-600 transition-all" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AppLayout from '@/layouts/AppLayout.vue'
import {
  ArrowLeft,
  Pencil,
  ClipboardList,
  Sliders,
  CreditCard,
  HelpCircle,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const profileCards = [
  { title: 'Your travel', path: '/dashboard', icon: ClipboardList },
  { title: 'Preferences', path: '/settings', icon: Sliders },
  { title: 'Payment Methods', path: '/settings', icon: CreditCard },
  { title: 'Help & Support', path: '/support', icon: HelpCircle },
]
</script>
