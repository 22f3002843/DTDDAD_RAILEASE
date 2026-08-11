<template>
  <div
    class="flex items-center gap-4 cursor-pointer select-none group relative"
    @click="router.push('/')"
  >
    <!-- Ambient Soft Backlight Glow Ring behind Big Icon -->
    <div
      v-if="size === 'xl' || size === 'lg'"
      class="absolute -inset-2 bg-gradient-to-r from-blue-500/25 via-sky-400/20 to-indigo-500/25 rounded-3xl blur-md opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 -z-10 animate-pulse-glow"
    ></div>

    <!-- Big App Icon Container -->
    <div
      :class="[
        'relative overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-glow transition-all duration-300 bg-white p-0.5 border border-slate-200/80',
        size === 'xl' ? 'w-24 h-24 rounded-3xl' : size === 'lg' ? 'w-14 h-14 rounded-2xl' : 'w-11 h-11 rounded-xl'
      ]"
    >
      <img
        src="/logo.png"
        alt="RailEase Application Logo"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform rounded-[inherit]"
      />
    </div>

    <!-- Title & Subtitle Branding -->
    <div class="flex flex-col">
      <span
        :class="[
          'font-black tracking-tight leading-none transition-colors',
          dark ? 'text-white group-hover:text-sky-300' : 'text-rail-900 group-hover:text-rail-600',
          size === 'xl' ? 'text-4xl sm:text-5xl' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl'
        ]"
      >
        RailEase
      </span>
      <span
        v-if="showTagline"
        :class="[
          'font-extrabold tracking-wider uppercase mt-1.5',
          dark ? 'text-sky-400' : 'text-rail-500',
          size === 'xl' ? 'text-xs sm:text-sm' : 'text-[10px]'
        ]"
      >
        From Uncertainty to Assurance
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg', 'xl'
  },
  showTagline: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
</script>
