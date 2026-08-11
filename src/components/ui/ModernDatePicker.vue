<template>
  <div class="relative font-sans text-left" ref="containerRef">
    <!-- Trigger Input Bar -->
    <div
      @click="isOpen = !isOpen"
      class="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs hover:border-blue-600 cursor-pointer transition-all"
    >
      <div class="flex items-center gap-2">
        <CalendarIcon class="w-3.5 h-3.5 text-blue-600" />
        <span>{{ formattedDisplayDate }}</span>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </div>

    <!-- Compact Floating Dropdown Picker -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 mt-1.5 z-[999] w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 space-y-2.5 animate-fade-in text-slate-900"
      >
        <!-- Header Month Navigator -->
        <div class="flex items-center justify-between text-xs font-black text-slate-900 pb-1.5 border-b border-slate-100">
          <button
            type="button"
            @click="prevMonth"
            class="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>

          <span class="text-xs font-black tracking-tight uppercase">
            {{ currentMonthName }} {{ currentYear }}
          </span>

          <button
            type="button"
            @click="nextMonth"
            class="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Day Names Header Row -->
        <div class="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-slate-400 uppercase">
          <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day">{{ day }}</span>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          <span v-for="b in firstDayOfWeek" :key="'blank-' + b"></span>

          <button
            type="button"
            v-for="d in daysInMonth"
            :key="d"
            @click="selectDay(d)"
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] transition-all cursor-pointer mx-auto',
              isSelected(d)
                ? 'bg-blue-600 text-white shadow-sm font-black scale-105'
                : isToday(d)
                ? 'bg-sky-100 text-blue-800 font-black border border-blue-300'
                : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            {{ d }}
          </button>
        </div>

        <!-- Quick Select Preset Badges -->
        <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-extrabold">
          <button
            type="button"
            @click="selectToday"
            class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            @click="selectTomorrow"
            class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors cursor-pointer"
          >
            Tomorrow
          </button>
          <button
            type="button"
            @click="selectWeekend"
            class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors cursor-pointer"
          >
            Weekend
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)

const selectedDate = computed({
  get: () => props.modelValue ? new Date(props.modelValue) : new Date(),
  set: (val) => {
    const iso = val.toISOString().split('T')[0]
    emit('update:modelValue', iso)
  }
})

const viewDate = ref(new Date(selectedDate.value))

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const currentMonthName = computed(() => monthNames[viewDate.value.getMonth()])
const currentYear = computed(() => viewDate.value.getFullYear())

const daysInMonth = computed(() => {
  return new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1).getDay()
})

const formattedDisplayDate = computed(() => {
  const d = selectedDate.value
  if (isNaN(d.getTime())) return 'Select Travel Date'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
})

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

function isSelected(day) {
  const d = selectedDate.value
  return (
    d.getDate() === day &&
    d.getMonth() === viewDate.value.getMonth() &&
    d.getFullYear() === viewDate.value.getFullYear()
  )
}

function isToday(day) {
  const t = new Date()
  return (
    t.getDate() === day &&
    t.getMonth() === viewDate.value.getMonth() &&
    t.getFullYear() === viewDate.value.getFullYear()
  )
}

function selectDay(day) {
  const newDate = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), day)
  emit('update:modelValue', newDate.toISOString().split('T')[0])
  isOpen.value = false
}

function selectToday() {
  const today = new Date()
  viewDate.value = new Date(today)
  emit('update:modelValue', today.toISOString().split('T')[0])
  isOpen.value = false
}

function selectTomorrow() {
  const tom = new Date()
  tom.setDate(tom.getDate() + 1)
  viewDate.value = new Date(tom)
  emit('update:modelValue', tom.toISOString().split('T')[0])
  isOpen.value = false
}

function selectWeekend() {
  const sat = new Date()
  const diff = (6 - sat.getDay() + 7) % 7
  sat.setDate(sat.getDate() + (diff === 0 ? 7 : diff))
  viewDate.value = new Date(sat)
  emit('update:modelValue', sat.toISOString().split('T')[0])
  isOpen.value = false
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
