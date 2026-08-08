<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header (Matching Image 3 Top) -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          My Profile
        </h1>
      </div>

      <!-- Top Profile Card (Matching Image 3 Top Card) -->
      <div class="bg-white p-8 rounded-card border border-slate-200/80 shadow-soft flex items-start justify-between relative">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-700 font-bold text-2xl overflow-hidden shadow-sm">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>RT</span>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-extrabold text-slate-900">{{ authStore.user?.name || 'RailEase Traveler' }}</h2>
              <span class="px-3 py-1 rounded-full bg-rail-100 text-rail-700 text-xs font-bold border border-rail-200">
                {{ authStore.user?.tier || 'Prime Member' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium">Username: {{ authStore.user?.username }} • Member since {{ authStore.user?.memberSince }}</p>
            <p class="text-xs text-slate-500 font-medium">{{ authStore.user?.email }} • {{ authStore.user?.phone }}</p>
          </div>
        </div>

        <button class="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors">
          <Pencil class="w-4 h-4" />
        </button>
      </div>

      <!-- Grid of 6 Action Cards (Matching Image 3: 2 Rows x 3 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="card in profileCards"
          :key="card.title"
          @click="router.push(card.path)"
          class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:bg-rail-500 group-hover:text-white transition-colors">
              <component :is="card.icon" class="w-5 h-5" />
            </div>
            <span class="text-sm font-bold text-slate-900">{{ card.title }}</span>
          </div>

          <ChevronRight class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
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
