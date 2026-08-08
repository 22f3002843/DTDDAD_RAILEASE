<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      <!-- Header. Named as the question a stranded passenger actually asks,
           rather than as a feature ("Disruption Recovery" is language nobody uses). -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Missed your train?
        </h1>
        <p class="text-sm text-slate-600 font-medium mt-1">
          Tell us which train you missed and we will work out how you still get there.
        </p>
      </div>

      <!-- STEP 1. When the traveller already has a journey synced with us, we
           know which train they were on, so we should not make them tell us
           again. A stranded person should land on an answer, not a form. The
           picker stays available underneath for the cases we guessed wrong or
           where nothing is synced. -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div v-if="autoDetectedTrain && !isPickerOpen" class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 shrink-0 flex items-center justify-center">
              <CheckCircle2 class="w-4 h-4" />
            </span>
            <div class="min-w-0">
              <p class="text-[11px] font-black text-slate-500 uppercase tracking-wider">Using your synced journey</p>
              <p class="text-sm font-extrabold text-slate-900 uppercase truncate mt-0.5">
                {{ autoDetectedTrain.name }}
                <span class="text-slate-400">({{ autoDetectedTrain.number }})</span>
              </p>
              <p class="text-xs text-slate-600 font-semibold mt-0.5">
                Scheduled departure {{ autoDetectedTrain.deptTime }} &middot;
                {{ autoDetectedTrain.fromCode }} &rarr; {{ autoDetectedTrain.toCode }}
              </p>
            </div>
          </div>

          <button
            @click="isPickerOpen = true"
            class="text-xs font-extrabold text-slate-600 hover:text-slate-900 underline cursor-pointer shrink-0"
          >
            Not this train?
          </button>
        </div>

        <div v-else class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">1</span>
              <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Which train did you miss?</h2>
            </div>
            <button
              v-if="autoDetectedTrain"
              @click="cancelPicker()"
              class="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              v-for="train in searchStore.filteredTrains"
              :key="train.id"
              @click="selectMissedTrain(train.number)"
              :class="[
                'text-left px-4 py-3 rounded-xl border transition-all cursor-pointer',
                missedTrainNumber === train.number
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
              ]"
            >
              <div class="text-xs font-black uppercase truncate">{{ train.name }}</div>
              <div :class="['text-[11px] font-bold mt-0.5', missedTrainNumber === train.number ? 'text-slate-300' : 'text-slate-500']">
                {{ train.number }} &middot; departed {{ train.deptTime }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- STEP 2: the deadline. Optional, because a stressed person should never
           be blocked by a form. But when given it is the most valuable input we
           have, since it turns "here are trains" into "here is one that works". -->
      <div v-if="missedTrain" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">2</span>
          <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            When do you need to be there? <span class="text-slate-400 font-bold normal-case">(optional)</span>
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <input
            v-model="deadlineInput"
            type="time"
            class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500 cursor-pointer"
          />
          <span class="text-xs text-slate-500 font-semibold">
            We will tell you which options still make it.
          </span>
          <button
            v-if="deadlineInput"
            @click="deadlineInput = ''"
            class="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- STEP 3: the plan -->
      <div v-if="plan" class="space-y-4">
        <!-- The headline verdict, so the reader knows the shape of the answer
             before reading any option. -->
        <div
          :class="[
            'rounded-2xl p-5 border flex items-start gap-3',
            plan.best ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          ]"
        >
          <component
            :is="plan.best ? CheckCircle2 : AlertTriangle"
            :class="['w-5 h-5 shrink-0 mt-0.5', plan.best ? 'text-emerald-600' : 'text-red-600']"
          />
          <div>
            <p class="text-sm sm:text-base font-extrabold text-slate-900">{{ plan.summary }}</p>
            <p class="text-xs text-slate-600 font-semibold mt-1">
              You missed the {{ missedTrain.deptTime }} {{ missedTrain.name }}.
              Checked against {{ searchStore.filteredTrains.length }} trains on this route.
            </p>
          </div>
        </div>

        <!-- The single best option. One clear answer first; alternatives after. -->
        <div v-if="plan.best" class="bg-white rounded-2xl border-2 border-slate-900 shadow-md overflow-hidden">
          <div class="bg-slate-900 text-white px-5 py-2 text-[11px] font-black uppercase tracking-wider">
            Best option for you
          </div>

          <div class="p-5 sm:p-6 space-y-4">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="text-lg font-black text-slate-900 uppercase">
                {{ plan.best.train.name }}
                <span class="text-slate-400">({{ plan.best.train.number }})</span>
              </h3>
              <span class="text-sm font-extrabold text-slate-700">
                Departs {{ plan.best.train.deptTime }}
              </span>
            </div>

            <!-- Each fact carries its own tone, so the reader can scan for
                 blockers without reading every line. -->
            <ul class="space-y-2">
              <li
                v-for="(reason, index) in plan.best.reasons"
                :key="index"
                class="flex items-start gap-2.5 text-sm"
              >
                <component :is="toneIcon(reason.tone)" :class="['w-4 h-4 shrink-0 mt-0.5', toneClass(reason.tone)]" />
                <span class="text-slate-700 font-semibold">{{ reason.text }}</span>
              </li>
            </ul>

            <!-- The sentence that makes this a recommendation rather than a list. -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p class="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Why this one</p>
              <p class="text-sm text-slate-800 font-semibold leading-relaxed">{{ whyThisOne }}</p>
            </div>

            <div class="flex flex-wrap gap-2.5">
              <a
                href="https://www.irctc.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold flex items-center gap-2 transition-colors"
              >
                <span>Book on IRCTC</span>
                <ExternalLink class="w-3.5 h-3.5 opacity-70" />
              </a>
              <button
                @click="router.push(`/train/${plan.best.train.number}`)"
                class="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-extrabold cursor-pointer transition-colors"
              >
                What could go wrong?
              </button>
            </div>
          </div>
        </div>

        <!-- Alternatives, deliberately quieter than the recommendation. -->
        <div v-if="plan.alternatives.length" class="space-y-2.5">
          <h3 class="text-sm font-extrabold text-slate-900">Other options</h3>
          <div
            v-for="option in plan.alternatives"
            :key="option.train.number"
            class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div class="min-w-0">
              <p class="text-sm font-extrabold text-slate-900 uppercase truncate">
                {{ option.train.name }} <span class="text-slate-400">({{ option.train.number }})</span>
              </p>
              <p class="text-xs text-slate-600 font-semibold mt-0.5">
                {{ option.reasons[0].text }} &middot; {{ option.reasons[1].text }}
              </p>
            </div>
            <button
              @click="router.push(`/train/${option.train.number}`)"
              class="text-xs font-extrabold text-slate-700 hover:text-slate-900 cursor-pointer shrink-0"
            >
              Details &rsaquo;
            </button>
          </div>
        </div>

        <!-- Money back. Surfaced here because this is the one moment a traveller
             is thinking about the ticket they lost, and the filing window is
             short enough that most people miss it simply by not knowing. -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <IndianRupee class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-extrabold text-slate-900">You may be able to claim a refund</p>
            <p class="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
              For a missed train you can usually file a TDR (Ticket Deposit Receipt) on IRCTC.
              Time limits are short and depend on the ticket type, so check today rather than tomorrow.
            </p>
            <a
              href="https://www.irctc.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 mt-2 text-xs font-extrabold text-amber-800 hover:underline"
            >
              <span>File a TDR on IRCTC</span>
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <!-- Empty state before a train is chosen. -->
      <div v-else-if="!missedTrain" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <Compass class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="text-sm text-slate-600 font-semibold">
          Pick the train you missed above and we will build a recovery plan.
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useJourneyStore } from '@/stores/useJourneyStore'
import { buildRecoveryPlan } from '@/services/recovery'
import { parseTimeToMinutes } from '@/services/reliability'
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  IndianRupee,
  Compass
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const journeyStore = useJourneyStore()

const deadlineInput = ref('')
const isPickerOpen = ref(false)
const manualSelection = ref('')

/**
 * The train we believe the traveller was on, without being told.
 *
 * Algorithm in plain English:
 *   Look at the journey they have already synced with us, take its train number,
 *   and find that train among the ones running this route. If nothing is synced,
 *   or the synced train is not on the route currently loaded, return nothing and
 *   let the traveller pick manually.
 *
 * @returns {Object|null} the matching train object
 */
const autoDetectedTrain = computed(() => {
  const syncedNumber = journeyStore.activeTrip?.trainNumber
  if (!syncedNumber) return null
  return searchStore.filteredTrains.find((train) => train.number === syncedNumber) || null
})

// A manual choice always wins; otherwise fall back to what we detected.
const missedTrainNumber = computed(() => manualSelection.value || autoDetectedTrain.value?.number || '')

const missedTrain = computed(() =>
  searchStore.filteredTrains.find((train) => train.number === missedTrainNumber.value) || null
)

/**
 * Record a manual choice of missed train and close the picker.
 *
 * @param {String} trainNumber - the chosen train number
 * @returns {void}
 */
function selectMissedTrain(trainNumber) {
  manualSelection.value = trainNumber
  isPickerOpen.value = false
}

/**
 * Abandon a manual choice and fall back to the journey we detected.
 *
 * @returns {void}
 */
function cancelPicker() {
  manualSelection.value = ''
  isPickerOpen.value = false
}

// Current time expressed the way the recovery engine expects it.
const nowMinutes = computed(() => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
})

// A deadline entered as "09:00" is assumed to mean the next time that clock
// reading occurs, so an early-morning deadline correctly means tomorrow morning
// rather than a time that has already passed today.
const deadlineMinutes = computed(() => {
  if (!deadlineInput.value) return null
  const parsed = parseTimeToMinutes(`${deadlineInput.value} ${Number(deadlineInput.value.split(':')[0]) < 12 ? 'AM' : 'PM'}`)
  if (parsed === null) return null
  return parsed <= nowMinutes.value ? parsed + 24 * 60 : parsed
})

const plan = computed(() => {
  if (!missedTrain.value) return null
  return buildRecoveryPlan(missedTrain.value, searchStore.filteredTrains, {
    nowMinutes: nowMinutes.value,
    deadlineMinutes: deadlineMinutes.value
  })
})

/**
 * Compose the single sentence explaining the recommendation.
 *
 * Algorithm in plain English:
 *   Lead with whichever fact actually drove the choice. If the traveller gave a
 *   deadline and this option meets it, that is the reason. Otherwise, if seats
 *   are open, boardability is the reason. Otherwise fall back to how soon it
 *   leaves. Written as one plain sentence because the point is to sound like a
 *   person explaining a decision, not a system reporting a computation.
 *
 * @returns {String} the explanation shown under "Why this one"
 */
const whyThisOne = computed(() => {
  const best = plan.value?.best
  if (!best) return ''

  const boardable = best.boardability.score >= 75
  const meetsDeadline = best.deadline?.makesIt

  if (meetsDeadline && boardable) {
    return 'It is the soonest train you can actually board that still gets you there in time.'
  }
  if (meetsDeadline) {
    return 'It is the only remaining option that gets you there in time, though seats are tight.'
  }
  if (boardable) {
    return 'It leaves soonest among the trains that still have seats you can book right now.'
  }
  return 'It is the best of the remaining options, but seats are uncertain, so book quickly.'
})

/**
 * Icon matching the tone of a reason line.
 *
 * @param {String} tone - 'good' | 'warn' | 'bad'
 * @returns {Object} a Lucide icon component
 */
function toneIcon(tone) {
  if (tone === 'good') return CheckCircle2
  if (tone === 'warn') return AlertCircle
  return AlertTriangle
}

/**
 * Colour matching the tone of a reason line.
 *
 * @param {String} tone - 'good' | 'warn' | 'bad'
 * @returns {String} Tailwind classes
 */
function toneClass(tone) {
  if (tone === 'good') return 'text-emerald-600'
  if (tone === 'warn') return 'text-amber-600'
  return 'text-red-600'
}
</script>
