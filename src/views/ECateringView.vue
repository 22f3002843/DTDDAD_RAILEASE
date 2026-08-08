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
            'px-5 py-2.5 rounded-btn text-xs font-semibold border transition-all whitespace-nowrap',
            activeDietFilter === chip ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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

            <button class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-btn font-semibold text-xs transition-all shadow-sm">
              Order for Seat Delivery
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
import AppLayout from '@/layouts/AppLayout.vue'
import { ArrowLeft, Search, SlidersHorizontal, Clock, Star } from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const activeDietFilter = ref('All')
const filterChips = ['All', 'Veg', 'Non-Veg', 'Jain', 'Vegan', 'Allergen-Safe']

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
</script>
