<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'w-full flex items-center justify-between text-left transition-all cursor-pointer font-bold focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 select-none',
        sizeClasses,
        roundedClasses,
        fillModeClasses,
        isOpen ? 'ring-2 ring-rail-500/20 border-rail-500' : ''
      ]"
    >
      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        <component v-if="icon" :is="icon" class="w-4 h-4 text-slate-400 shrink-0" />
        <span class="truncate text-slate-900 font-bold">
          {{ selectedLabel }}
        </span>
      </div>

      <ChevronDown
        :class="[
          'w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ml-2',
          isOpen ? 'rotate-180 text-rail-500' : ''
        ]"
      />
    </button>

    <!-- Custom Floating Options Popover Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform opacity-0 scale-95 -translate-y-1"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-[100] p-1.5 max-h-60 overflow-y-auto space-y-1"
      >
        <div
          v-for="opt in options"
          :key="opt.value"
          @click="selectOption(opt)"
          :class="[
            'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
            modelValue === opt.value
              ? 'bg-rail-50 text-rail-700 font-extrabold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check v-if="modelValue === opt.value" class="w-4 h-4 text-rail-500 shrink-0" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'medium'
  },
  rounded: {
    type: String,
    default: 'medium'
  },
  fillMode: {
    type: String,
    default: 'solid'
  },
  icon: {
    type: [Object, Function],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)

const selectedLabel = computed(() => {
  const match = props.options.find(o => o.value === props.modelValue)
  return match ? match.label : props.modelValue || 'Select Option'
})

function selectOption(opt) {
  emit('update:modelValue', opt.value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small': return 'px-3 py-2 text-xs'
    case 'large': return 'px-4 py-3.5 text-sm sm:text-base'
    default: return 'px-3.5 py-2.5 text-xs sm:text-sm'
  }
})

const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'small': return 'rounded-md'
    case 'large': return 'rounded-2xl'
    case 'full': return 'rounded-full'
    default: return 'rounded-xl'
  }
})

const fillModeClasses = computed(() => {
  switch (props.fillMode) {
    case 'flat': return 'bg-slate-100/80 hover:bg-slate-100 border border-transparent text-slate-900'
    case 'outline': return 'bg-white border-2 border-slate-300 hover:border-rail-400 text-slate-900'
    default: return 'bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 shadow-sm'
  }
})
</script>
