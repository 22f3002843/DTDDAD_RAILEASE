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

    <!-- Big App Icon Container with Glowing Border Hover Effect -->
    <div
      :class="[
        'relative bg-white border border-slate-200/80 flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:shadow-glow transition-all duration-300 card-glow-hover',
        size === 'xl' ? 'w-24 h-24 p-3 rounded-3xl' : size === 'lg' ? 'w-16 h-16 p-2.5 rounded-2xl' : 'w-12 h-12 p-2 rounded-2xl'
      ]"
    >
      <img
        src="/logo.png"
        alt="RailEase Application Logo"
        class="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
      />
    </div>

    <!-- Title & Subtitle Branding -->
    <div class="flex flex-col">
      <span
        :class="[
          'font-black tracking-tight text-rail-900 leading-none group-hover:text-rail-600 transition-colors',
          size === 'xl' ? 'text-4xl sm:text-5xl' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl'
        ]"
      >
        RailEase
      </span>
      <span
        v-if="showTagline"
        :class="[
          'font-extrabold text-rail-500 tracking-wider uppercase mt-1.5',
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
  }
})

const router = useRouter()
</script>
