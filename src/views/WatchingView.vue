<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <Navbar @openLogin="showAuthModal = true" />

    <div class="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Watching</h1>
        <p class="text-sm text-slate-600 font-medium mt-1">
          Trains you asked us to keep an eye on. We check their record so you don't have to.
        </p>
      </div>

      <!-- Empty state. Written to teach the feature rather than to apologise for
           being empty, because this is where most first-time visitors will land. -->
      <div
        v-if="!watchStore.watchCount"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4"
      >
        <Eye class="w-10 h-10 text-slate-300 mx-auto" />
        <div class="space-y-1.5">
          <p class="text-base font-extrabold text-slate-900">You're not watching any trains yet</p>
          <p class="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Find a train and tap <strong>Watch this train</strong>. We'll keep its reliability
            record here so you can check it again before you travel. No account needed.
          </p>
        </div>
        <button
          @click="router.push('/search')"
          class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold cursor-pointer transition-colors"
        >
          Find a train
        </button>
      </div>

      <!-- Watched trains -->
      <div v-else class="space-y-4">
        <div
          v-for="entry in watchStore.watchedNewestFirst"
          :key="entry.id"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="p-5 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-base font-black text-slate-900 uppercase truncate">
                  {{ entry.name }}
                  <span class="text-slate-400 font-bold">({{ entry.number }})</span>
                </h3>
                <p class="text-xs font-bold text-slate-500 uppercase mt-0.5">
                  {{ entry.fromCode }} {{ entry.deptTime }} &rarr; {{ entry.toCode }} {{ entry.arrTime }}
                </p>
              </div>

              <button
                @click="watchStore.removeWatch(entry.id)"
                class="shrink-0 text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                title="Stop watching"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- The same verdict language used everywhere else in the app. -->
            <div v-if="resolveTrain(entry)" class="pt-1">
              <ReliabilityBadge :train="resolveTrain(entry)" />
            </div>
            <p v-else class="text-xs text-slate-500 font-semibold">
              Search this route again to refresh its reliability record.
            </p>

            <div class="flex flex-wrap gap-2 pt-1">
              <button
                v-if="resolveTrain(entry)"
                @click="router.push(`/train/${entry.number}`)"
                class="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer transition-colors"
              >
                See what could go wrong
              </button>
              <button
                @click="router.push('/live-status')"
                class="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-extrabold cursor-pointer transition-colors"
              >
                Live status
              </button>
            </div>
          </div>
        </div>

        <!-- The only place an account is ever offered, and only as an upgrade
             to something the traveller has already chosen to do. -->
        <div class="bg-slate-900 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-white flex items-center gap-2">
              <Bell class="w-4 h-4 text-emerald-400" />
              Get alerts on your phone
            </p>
            <p class="text-xs text-slate-300 font-medium mt-1">
              We'll tell you if one of these trains is running late before you leave for the station.
            </p>
          </div>
          <button
            @click="showAuthModal = true"
            class="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-extrabold cursor-pointer hover:bg-slate-100 transition-colors shrink-0"
          >
            Set up alerts
          </button>
        </div>
      </div>
    </div>

    <Footer />
    <AuthWidget v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWatchStore } from '@/stores/useWatchStore'
import { useSearchStore } from '@/stores/useSearchStore'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/footer/Footer.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'
import ReliabilityBadge from '@/components/common/ReliabilityBadge.vue'
import { Eye, X, Bell } from 'lucide-vue-next'

const router = useRouter()
const watchStore = useWatchStore()
const searchStore = useSearchStore()
const showAuthModal = ref(false)

/**
 * Find the full train object behind a saved watchlist entry.
 *
 * Algorithm in plain English:
 *   The watchlist stores only a summary of each train, so scoring it needs the
 *   full record from the current search results. Look for a match by train
 *   number. When the traveller is searching a different route the match will be
 *   missing, and the caller shows a gentler message instead of a stale score.
 *
 * @param {Object} entry - a saved watchlist entry
 * @returns {Object|null} the matching train, or null when not in the current results
 */
function resolveTrain(entry) {
  return searchStore.filteredTrains.find((train) => train.number === entry.number) || null
}
</script>
