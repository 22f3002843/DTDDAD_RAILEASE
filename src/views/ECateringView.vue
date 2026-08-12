<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header (Matching Image 5 Top) -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          eCatering
        </h1>
      </div>

      <!-- Top Search & Filter Control Bar (Matching Image 5 Search Input + Filter Icon) -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <Search class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for food, cuisine..."
            class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-card text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 shadow-soft"
          />
        </div>
        <button class="p-3.5 bg-white border border-slate-200 rounded-card shadow-soft hover:bg-slate-50 text-slate-700 transition-colors">
          <SlidersHorizontal class="w-5 h-5" />
        </button>
      </div>

      <!-- Dietary Filter Chips Row (Matching Image 5: All | Veg | Non-Veg | Jain | Vegan | Allergen-Safe) -->
      <div class="flex items-center gap-3 overflow-x-auto pb-1">
        <button
          v-for="chip in filterChips"
          :key="chip"
          @click="activeDietFilter = chip"
          :class="[
            'px-5 py-2.5 rounded-btn text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer',
            activeDietFilter === chip ? 'bg-rail-500 text-white border-rail-500 shadow-glow font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-rail-50 hover:text-rail-600'
          ]"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Food Cards Grid (Matching Image 5: 4-Column Grid Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="meal in filteredMeals"
          :key="meal.id"
          class="bg-white rounded-card border border-slate-200/80 shadow-soft hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
        >
          <div>
            <!-- Image Container -->
            <div class="h-44 bg-slate-100 relative overflow-hidden">
              <img :src="meal.image" :alt="meal.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 text-slate-900 font-extrabold text-xs shadow-sm">
                ₹{{ meal.price }}
              </span>
            </div>

            <!-- Content Details -->
            <div class="p-5 space-y-2">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-rail-500 block">{{ meal.vendor }}</span>
              <h2 class="text-base font-extrabold text-slate-900 leading-snug">{{ meal.name }}</h2>
              <p class="text-xs text-slate-500 font-medium line-clamp-2">{{ meal.description }}</p>
            </div>
          </div>

          <!-- Bottom Delivery Time & Rating Bar (Matching Image 5 Card Footer) -->
          <div class="p-5 pt-0 space-y-3">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
              <span class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-slate-400" />
                {{ meal.deliveryTime }}
              </span>
              <span class="flex items-center gap-1 text-amber-600 font-bold">
                <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {{ meal.rating }}
              </span>
            </div>

            <button class="w-full py-2.5 bg-rail-500 hover:bg-rail-600 text-white rounded-btn font-semibold text-xs transition-all shadow-sm cursor-pointer">
              Order for Seat Delivery
            </button>
          </div>
        </div>
      </div>

      <!-- TRAIN-SYNCED FOOD RATING GAUGE METER & ESSENTIAL REVIEWS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-5">
        <!-- Section Header with Synced Train Callout -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Train Synced
              </span>
              <span class="text-xs font-bold text-slate-500">PNR: {{ activeTripDetails.pnr }}</span>
            </div>
            <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">
              Passenger Food Service Rating
            </h2>
          </div>

          <button
            @click="showWriteReviewModal = true"
            class="px-3.5 py-2 bg-rail-600 hover:bg-rail-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-all cursor-pointer self-start sm:self-auto"
          >
            <MessageSquarePlus class="w-3.5 h-3.5" />
            <span>Rate Your Meal</span>
          </button>
        </div>

        <!-- RADIAL GAUGE METER VISUALIZATION WITH BLUISH-PURPLE LIGHT GRADIENT BACKGROUND -->
        <div ref="meterCardRef" class="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-sky-50/80 text-slate-900 p-6 rounded-2xl border border-indigo-200/80 shadow-sm relative overflow-hidden">
          <!-- Background Soft Indigo/Purple Light Orb -->
          <div class="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Apple / Stripe Style Modern Concentric Circular Ring Meter UI (Dynamic Scroll Animation) -->
          <div class="relative w-44 h-44 flex items-center justify-center shrink-0 select-none z-10">
            <svg class="w-44 h-44 overflow-visible" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="appleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#10b981" />
                  <stop offset="45%" stop-color="#0284c7" />
                  <stop offset="90%" stop-color="#6366f1" />
                </linearGradient>

                <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.3" />
                </filter>
              </defs>

              <!-- Subtle Background Soft Halo Circle -->
              <circle cx="80" cy="80" r="70" fill="#f8fafc" opacity="0.6" />

              <!-- Outer Dashed Micro Accent Track (Slow Animated Rotation) -->
              <circle cx="80" cy="80" r="74" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 8" class="animate-spin" style="transform-origin: 80px 80px; animation-duration: 25s;" />

              <!-- Base Background Ring Track (280 Degree Arc) -->
              <path
                d="M 33 127 A 66 66 0 1 1 127 127"
                fill="none"
                stroke="#e2e8f0"
                stroke-width="12"
                stroke-linecap="round"
              />

              <!-- Active Glowing Ring Arc (Dynamic Stroke Offset Animation) -->
              <path
                d="M 33 127 A 66 66 0 1 1 127 127"
                fill="none"
                stroke="url(#appleRingGrad)"
                stroke-width="12"
                stroke-linecap="round"
                stroke-dasharray="322.5"
                :stroke-dashoffset="arcDashOffset"
                filter="url(#ringGlow)"
                class="transition-all duration-[1600ms] ease-out"
              />

              <!-- Electric Moving Light Bead dynamically tracking tip -->
              <g v-if="animatedPercent > 0">
                <circle :cx="beadPos.x" :cy="beadPos.y" r="5" fill="#ffffff" filter="url(#ringGlow)" class="animate-ping" />
                <circle :cx="beadPos.x" :cy="beadPos.y" r="6" fill="#6366f1" stroke="#ffffff" stroke-width="2" />
              </g>

              <!-- Center Score Display: Dynamic Ticking Score & Star Badge -->
              <g transform="translate(80, 68)">
                <text x="0" y="0" text-anchor="middle" font-size="26" font-weight="900" font-family="sans-serif" class="tracking-tight">
                  <tspan fill="#0f172a">{{ animatedScore.toFixed(1) }}</tspan>
                  <tspan fill="#f59e0b" font-size="17" dx="3" dy="-2">★</tspan>
                </text>
                <text x="0" y="22" text-anchor="middle" fill="#059669" font-size="9.5" font-weight="900" font-family="sans-serif" letter-spacing="0.6">
                  {{ animatedPercent }}% QUALITY
                </text>
              </g>
            </svg>
          </div>

          <!-- Essential Key Performance Metrics (Bluish-Purple Card Theme) -->
          <div class="space-y-3 flex-1 w-full z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-200/80 pb-2.5 gap-1">
              <span class="text-sm font-black uppercase text-indigo-950 tracking-wide">{{ animatedPercent }}% Food Quality Index</span>
              <span class="text-xs font-extrabold text-indigo-800">2,480 Verified Passenger Ratings</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Pill 1: Platform Delivery (Vibrant Emerald Highlight) -->
              <div class="px-3.5 py-3 rounded-2xl bg-emerald-50/90 text-emerald-950 border border-emerald-300 shadow-soft flex items-center gap-2.5 text-xs font-black hover:scale-[1.02] transition-transform cursor-default">
                <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300/80 shadow-2xs">
                  <Clock class="w-4 h-4" />
                </div>
                <span>2.5 Min Platform Delivery</span>
              </div>

              <!-- Pill 2: Served Hot (Vibrant Amber Highlight) -->
              <div class="px-3.5 py-3 rounded-2xl bg-amber-50/90 text-amber-950 border border-amber-300 shadow-soft flex items-center gap-2.5 text-xs font-black hover:scale-[1.02] transition-transform cursor-default">
                <div class="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300/80 shadow-2xs">
                  <Flame class="w-4 h-4" />
                </div>
                <span>Served Fresh &amp; Hot 🔥</span>
              </div>

              <!-- Pill 3: Tamper-Proof Seal (Vibrant Sky Highlight) -->
              <div class="px-3.5 py-3 rounded-2xl bg-sky-50/90 text-sky-950 border border-sky-300 shadow-soft flex items-center gap-2.5 text-xs font-black hover:scale-[1.02] transition-transform cursor-default">
                <div class="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-300/80 shadow-2xs">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <span>Tamper-Proof Seal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ESSENTIAL REVIEWS FEED (LARGER READABLE FONTS) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="rev in reviewsList.slice(0, 2)"
            :key="rev.id"
            class="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-rail-100 text-rail-800 font-black text-xs flex items-center justify-center border border-rail-200">
                  {{ rev.initials }}
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-slate-900">{{ rev.passengerName }}</h3>
                  <span class="text-xs text-slate-600 font-bold">Seat {{ rev.seat }} • {{ rev.station }}</span>
                </div>
              </div>
              <span class="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                ⭐ {{ rev.rating }}.0
              </span>
            </div>

            <p class="text-sm font-semibold text-slate-800 leading-relaxed italic">
              "{{ rev.comment }}"
            </p>

            <div class="flex items-center justify-between text-xs font-extrabold text-slate-600 border-t border-slate-200/80 pt-2.5">
              <span class="text-rail-700 font-black">Ordered: {{ rev.mealOrdered }}</span>
              <button @click="toggleHelpful(rev)" class="text-slate-700 hover:text-rail-600 flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <ThumbsUp class="w-3.5 h-3.5 text-rail-600" />
                <span>{{ rev.helpfulCount }} Helpful</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- WRITE REVIEW MODAL -->
      <div v-if="showWriteReviewModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <MessageSquarePlus class="w-5 h-5 text-rail-600" />
              <h3 class="text-base font-extrabold text-slate-900">Review Seat Food Delivery</h3>
            </div>
            <button @click="showWriteReviewModal = false" class="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Select Star Rating</label>
              <div class="flex items-center gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="newReview.rating = star"
                  class="p-1 cursor-pointer"
                >
                  <Star :class="['w-6 h-6', star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300']" />
                </button>
                <span class="text-xs font-bold text-slate-600 ml-2">{{ newReview.rating }}.0 / 5</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Meal / Thali Name</label>
              <input
                v-model="newReview.mealOrdered"
                type="text"
                placeholder="e.g. Royal Executive Veg Thali"
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rail-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Delivery Station</label>
              <select
                v-model="newReview.station"
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rail-500"
              >
                <option value="Kota Junction (PF 1)">Kota Junction (PF 1)</option>
                <option value="Vadodara Junction (PF 2)">Vadodara Junction (PF 2)</option>
                <option value="Ratlam Junction (PF 4)">Ratlam Junction (PF 4)</option>
                <option value="Surat (PF 1)">Surat (PF 1)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Your Review &amp; Service Feedback</label>
              <textarea
                v-model="newReview.comment"
                rows="3"
                placeholder="Share your experience about food taste, delivery speed, and hygiene..."
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rail-500"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              @click="showWriteReviewModal = false"
              class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="submitNewReview"
              class="px-5 py-2 bg-rail-600 text-white rounded-xl text-xs font-bold hover:bg-rail-700 shadow-soft cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/useJourneyStore'
import AppLayout from '@/layouts/AppLayout.vue'
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Clock,
  Star,
  CheckCircle2,
  ThumbsUp,
  UtensilsCrossed,
  Flame,
  ShieldCheck,
  MessageSquarePlus,
  X
} from 'lucide-vue-next'

const router = useRouter()
const journeyStore = useJourneyStore()

// DYNAMIC SCROLL & ENTRANCE ANIMATION FOR FOOD QUALITY METER SCALE
const meterCardRef = ref(null)
const animatedScore = ref(0.0)
const animatedPercent = ref(0)
const arcDashOffset = ref(322.5) // Total arc length = 322.5 (empty at 322.5, full 96% at 12.9)
const hasAnimated = ref(false)
let scrollObserver = null

// Real-time dynamic light bead positioning along 280° arc path
const beadPos = computed(() => {
  const angleDeg = 135 + (280 * (animatedPercent.value / 100))
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: 80 + 66 * Math.cos(rad),
    y: 80 + 66 * Math.sin(rad)
  }
})

function triggerMeterAnimation() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  // 1. Smoothly animate SVG stroke offset to target 96% arc position (12.9)
  arcDashOffset.value = 12.9

  // 2. Smoothly tick up numerical score (0.0 -> 4.8) and percent (0% -> 96%) over 1.6 seconds
  const duration = 1600
  const startTime = performance.now()

  function animateFrame(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease Out Cubic function for ultra-smooth realistic movement
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    animatedScore.value = +(easeProgress * 4.8).toFixed(1)
    animatedPercent.value = Math.round(easeProgress * 96)

    if (progress < 1) {
      requestAnimationFrame(animateFrame)
    } else {
      animatedScore.value = 4.8
      animatedPercent.value = 96
    }
  }

  requestAnimationFrame(animateFrame)
}

onMounted(() => {
  if ('IntersectionObserver' in window && meterCardRef.value) {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerMeterAnimation()
        }
      })
    }, { threshold: 0.15 })

    scrollObserver.observe(meterCardRef.value)
  } else {
    // Immediate fallback
    triggerMeterAnimation()
  }
})

onUnmounted(() => {
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
})

const searchQuery = ref('')
const activeDietFilter = ref('All')
const filterChips = ['All', 'Veg', 'Non-Veg', 'Jain', 'Vegan', 'Allergen-Safe']

const activeTripDetails = computed(() => {
  if (journeyStore.activeTrip) {
    return {
      pnr: journeyStore.activeTrip.pnr || '84291039',
      trainNumber: journeyStore.activeTrip.trainNumber || '12952',
      trainName: journeyStore.activeTrip.trainName || 'Mumbai Rajdhani Express'
    }
  }
  return {
    pnr: '84291039',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express'
  }
})

const mealsList = [
  {
    id: 1,
    name: 'Royal Executive Thali',
    vendor: 'IRCTC Premium Dining',
    price: 290,
    type: 'Veg',
    deliveryTime: '25-30 min',
    rating: '4.8',
    description: 'Paneer Butter Masala, Dal Makhani, Jeera Rice, 3 Butter Rotis, Gulab Jamun',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'South Indian Combo',
    vendor: 'Haldiram Express',
    price: 180,
    type: 'Veg',
    deliveryTime: '20-25 min',
    rating: '4.6',
    description: '2 Ghee Masala Dosas, Idli Sambar, Medu Vada, Coconut Chutney',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'Butter Chicken Meal Box',
    vendor: 'PUNJAB GRILL EXPRESS',
    price: 340,
    type: 'Non-Veg',
    deliveryTime: '25-30 min',
    rating: '4.9',
    description: 'Boneless Butter Chicken, Garlic Naan, Basmati Rice, Mint Chutney',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'Jain Special Thali (100% Satvik)',
    vendor: 'Sattvik Rail Meals',
    price: 250,
    type: 'Jain',
    deliveryTime: '20-25 min',
    rating: '4.9',
    description: '100% Pure Satvik Jain Meal (No Onion, No Garlic, No Root Veggies, No Eggs). Dal Fry, Matar Paneer, Phulka Rotis & Steamed Rice',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400'
  }
]

const filteredMeals = computed(() => {
  let result = [...mealsList]
  if (activeDietFilter.value !== 'All') {
    result = result.filter(m => m.type === activeDietFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q))
  }
  return result
})

// REVIEWS SYSTEM
const activeReviewTab = ref('All Passenger Reviews')
const reviewTabs = ['All Passenger Reviews', 'Verified Seat Deliveries', 'Kota Junction (PF 1)', 'Vadodara Junction (PF 2)']

const showWriteReviewModal = ref(false)
const newReview = ref({
  rating: 5,
  mealOrdered: 'Royal Executive Veg Thali',
  station: 'Kota Junction (PF 1)',
  comment: ''
})

const reviewsList = ref([
  {
    id: 101,
    passengerName: 'Rohan Malhotra',
    initials: 'RM',
    seat: 'B4-28',
    station: 'Kota Junction (PF 1)',
    date: 'Today, 09:12 PM',
    rating: 5,
    mealOrdered: 'Royal Executive Veg Thali',
    vendor: 'Haldiram Express',
    comment: 'Insanely punctual! The delivery executive was waiting right at coach B4 door as 12952 Rajdhani entered platform 1. Meal was piping hot, rotis wrapped in foil, paneer curry was super fresh.',
    deliverySpeed: '2 min Seat Delivery',
    temperature: 'Served Fresh & Hot 🔥',
    packaging: 'Tamper-Proof Seal',
    helpfulCount: 34,
    isHelpful: false
  },
  {
    id: 102,
    passengerName: 'Dr. Meera Iyer',
    initials: 'MI',
    seat: 'A1-12',
    station: 'Vadodara Junction (PF 2)',
    date: 'Yesterday, 03:25 AM',
    rating: 5,
    mealOrdered: 'Jain Special Satvik Thali',
    vendor: 'Sattvik Rail Meals',
    comment: 'Finding authentic 100% Satvik Jain food without onion/garlic on long distance trains used to be hard. RailEase delivered a sealed thali with pure ghee rotis and dal. Excellent service!',
    deliverySpeed: 'Delivered at Seat',
    temperature: 'Fresh & Warm',
    packaging: '100% Satvik Seal',
    helpfulCount: 29,
    isHelpful: false
  },
  {
    id: 103,
    passengerName: 'Vikram Singh',
    initials: 'VS',
    seat: 'B2-51',
    station: 'Ratlam Junction (PF 4)',
    date: '10 Aug 2026',
    rating: 5,
    mealOrdered: 'Butter Chicken Meal Box',
    vendor: 'PUNJAB GRILL EXPRESS',
    comment: 'Juicy chicken, rich makhani gravy, garlic naan was warm and soft. Packaging was completely leak-proof! Best food experience on Indian Railways.',
    deliverySpeed: '3 min Seat Delivery',
    temperature: 'Served Hot',
    packaging: 'Leak-Proof Box',
    helpfulCount: 19,
    isHelpful: false
  }
])

const filteredReviews = computed(() => {
  if (activeReviewTab.value === 'Verified Seat Deliveries') {
    return reviewsList.value
  }
  if (activeReviewTab.value.includes('Kota')) {
    return reviewsList.value.filter(r => r.station.includes('Kota'))
  }
  if (activeReviewTab.value.includes('Vadodara')) {
    return reviewsList.value.filter(r => r.station.includes('Vadodara'))
  }
  return reviewsList.value
})

function toggleHelpful(rev) {
  rev.isHelpful = !rev.isHelpful
  if (rev.isHelpful) {
    rev.helpfulCount++
  } else {
    rev.helpfulCount--
  }
}

function submitNewReview() {
  if (!newReview.value.comment.trim()) return

  reviewsList.value.unshift({
    id: Date.now(),
    passengerName: 'You (Passenger)',
    initials: 'YOU',
    seat: 'B4-42',
    station: newReview.value.station,
    date: 'Just now',
    rating: newReview.value.rating,
    mealOrdered: newReview.value.mealOrdered || 'Custom Meal Order',
    vendor: 'IRCTC Verified Partner',
    comment: newReview.value.comment,
    deliverySpeed: '2 min Seat Delivery',
    temperature: 'Hot Meal',
    packaging: 'Verified Package',
    helpfulCount: 1,
    isHelpful: true
  })

  newReview.value.comment = ''
  showWriteReviewModal.value = false
}
</script>
