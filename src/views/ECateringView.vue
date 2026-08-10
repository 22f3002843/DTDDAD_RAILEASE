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

        <!-- RADIAL GAUGE METER VISUALIZATION WITH DYNAMIC MOVING WAVES -->
        <div class="flex flex-col md:flex-row items-center gap-6 bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
          <!-- Background Moving Wave Aura -->
          <div class="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

          <!-- Semi-Circular Radial SVG Speedometer Gauge Meter with Animated Waves -->
          <div class="relative w-48 h-28 flex flex-col items-center justify-end shrink-0 select-none pt-1 z-10">
            <svg class="w-48 h-26 overflow-visible" viewBox="0 0 200 115">
              <defs>
                <linearGradient id="foodGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ef4444" />
                  <stop offset="35%" stop-color="#f59e0b" />
                  <stop offset="70%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#10b981" />
                </linearGradient>

                <radialGradient id="sonarWaveGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                </radialGradient>

                <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.5" />
                </filter>
              </defs>

              <!-- Dynamic Sonar Wave Radial Rings (Pulsing & Rotating) -->
              <circle cx="100" cy="100" r="88" fill="url(#sonarWaveGlow)" class="animate-pulse" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.35" class="animate-spin" style="transform-origin: 100px 100px; animation-duration: 16s;" />
              <circle cx="100" cy="100" r="62" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6 12" opacity="0.25" class="animate-spin" style="transform-origin: 100px 100px; animation-duration: 10s; animation-direction: reverse;" />

              <!-- Outer Gauge Track Arc (Upward Arch) -->
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                stroke-width="14"
                stroke-linecap="round"
              />

              <!-- Active Rating Progress Arc (96% / 4.8 Rating) -->
              <path
                d="M 20 100 A 80 80 0 0 1 174 65"
                fill="none"
                stroke="url(#foodGaugeGrad)"
                stroke-width="14"
                stroke-linecap="round"
                filter="url(#gaugeShadow)"
              />

              <!-- Dynamic Electric Moving Wave Pulse overlay on active arc -->
              <path
                d="M 20 100 A 80 80 0 0 1 174 65"
                fill="none"
                stroke="#ffffff"
                stroke-width="4"
                stroke-linecap="round"
                stroke-dasharray="8 16"
                opacity="0.75"
                class="animate-pulse"
              />

              <!-- Tick Marks -->
              <line x1="20" y1="100" x2="30" y2="100" stroke="#64748b" stroke-width="2" />
              <line x1="100" y1="20" x2="100" y2="30" stroke="#64748b" stroke-width="2" />
              <line x1="180" y1="100" x2="170" y2="100" stroke="#64748b" stroke-width="2" />

              <!-- Animated Needle Pivot Point at (100, 100) -->
              <g transform="translate(100, 100) rotate(73)">
                <!-- Needle Line pointing up (-Y direction) -->
                <line x1="0" y1="0" x2="0" y2="-66" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round" filter="url(#gaugeShadow)" />
                <!-- Center Cap Pin with Sonar Wave Ring -->
                <circle cx="0" cy="0" r="12" fill="#10b981" fill-opacity="0.2" class="animate-ping" />
                <circle cx="0" cy="0" r="6" fill="#fbbf24" stroke="#0f172a" stroke-width="2" />
                <circle cx="0" cy="0" r="2.5" fill="#0f172a" />
              </g>

              <!-- Rating Score Text Inside Arch (Positioned above needle pin cap with zero overlap) -->
              <text x="100" y="64" text-anchor="middle" fill="#fbbf24" font-size="24" font-weight="900" font-family="sans-serif" class="drop-shadow-md">
                4.8★
              </text>
              <text x="100" y="80" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="900" font-family="sans-serif" letter-spacing="1">
                OUT OF 5.0
              </text>
            </svg>
          </div>

          <!-- Essential Key Performance Metrics (High-Legibility Larger Fonts) -->
          <div class="space-y-3 flex-1 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-1">
              <span class="text-sm font-black uppercase text-emerald-400 tracking-wide">96% Food Quality Index</span>
              <span class="text-xs font-extrabold text-slate-300">2,480 Verified Passenger Ratings</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div class="px-3.5 py-2.5 rounded-xl bg-slate-900 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 text-xs font-extrabold">
                <Clock class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2.5 Min Platform Delivery</span>
              </div>
              <div class="px-3.5 py-2.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/40 flex items-center gap-2 text-xs font-extrabold">
                <Flame class="w-4 h-4 text-amber-400 shrink-0" />
                <span>64°C Served Hot</span>
              </div>
              <div class="px-3.5 py-2.5 rounded-xl bg-slate-900 text-sky-300 border border-sky-500/40 flex items-center gap-2 text-xs font-extrabold">
                <ShieldCheck class="w-4 h-4 text-sky-400 shrink-0" />
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
import { ref, computed } from 'vue'
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
    temperature: 'Served Hot (64°C)',
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
