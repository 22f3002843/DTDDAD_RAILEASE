<template>
  <div class="flex flex-col gap-1">
    <!-- Layer 1: the verdict. A score is never shown without its plain-English phrase. -->
    <div class="flex items-center gap-2">
      <span :class="['w-2.5 h-2.5 rounded-full shrink-0', dotClass]"></span>
      <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border', badgeClass]">
        {{ label }}
      </span>
    </div>

    <!-- Layer 2: the reason. This line is what separates a metric from a judgement. -->
    <p v-if="showReason" class="text-[11px] text-slate-500 font-semibold leading-snug">
      {{ reason }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  getReliabilityLabel,
  getReliabilityBadgeClass,
  getReliabilityDotClass,
  getReliabilityReason
} from '@/services/reliability'

const props = defineProps({
  // Train object; see src/services/reliability.js for the expected shape.
  train: { type: Object, required: true },
  // When false, renders the badge alone. Default is true because a score
  // without its reason is the exact failure mode this component exists to prevent.
  showReason: { type: Boolean, default: true }
})

// All four derive from the pure functions in the service layer, so the public
// and authenticated search pages can never drift apart in how they grade a train.
const label = computed(() => getReliabilityLabel(props.train))
const badgeClass = computed(() => getReliabilityBadgeClass(props.train))
const dotClass = computed(() => getReliabilityDotClass(props.train))
const reason = computed(() => getReliabilityReason(props.train))
</script>
