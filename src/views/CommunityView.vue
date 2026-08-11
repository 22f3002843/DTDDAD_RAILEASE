<template>
  <AppLayout>
    <div class="w-full space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
              Community Updates
            </h1>
            <p class="text-xs text-slate-500 font-semibold">
              Live passenger crowd, delay, platform &amp; cleanliness updates
            </p>
          </div>
        </div>

        <span class="px-3 py-1.5 rounded-full bg-rail-50 text-rail-700 text-xs font-black border border-rail-200 shadow-2xs hidden sm:inline-block">
          {{ postsList.length }} Live Updates Active
        </span>
      </div>

      <!-- Top Navigation Tabs (All Updates | My Train | Stations) -->
      <div class="flex items-center gap-8 border-b border-slate-200 text-sm font-bold text-slate-500 pb-1">
        <button
          v-for="tab in topTabs"
          :key="tab"
          @click="activeTopTab = tab"
          :class="[
            'pb-3 border-b-2 transition-all cursor-pointer',
            activeTopTab === tab ? 'text-rail-600 border-rail-500 font-extrabold' : 'border-transparent hover:text-slate-700'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Post Creation Card -->
      <div class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft space-y-3">
        <div class="flex items-center gap-3">
          <input
            v-model="newPostText"
            type="text"
            placeholder="Share a live update (e.g. coach cleanliness, platform shift, food quality)..."
            class="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500"
          />
          <button class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-btn transition-colors cursor-pointer" title="Attach Photo">
            <Camera class="w-5 h-5" />
          </button>
          <button
            @click="publishPost"
            class="px-5 py-3 bg-rail-500 hover:bg-rail-600 text-white rounded-btn font-semibold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>

        <!-- Optional Category Picker when typing -->
        <div v-if="newPostText.trim()" class="flex items-center gap-2 pt-1 text-xs">
          <span class="font-bold text-slate-500">Category:</span>
          <button
            v-for="cat in ['Delay', 'Platform', 'Crowd', 'Cleanliness', 'Food', 'Other']"
            :key="cat"
            @click="newPostCategory = cat"
            :class="[
              'px-2.5 py-1 rounded-full border text-[11px] font-bold cursor-pointer transition-all',
              newPostCategory === cat ? 'bg-rail-600 text-white border-rail-600' : 'bg-slate-100 text-slate-600 border-slate-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Filter Chips Row -->
      <div class="flex items-center gap-2.5 overflow-x-auto pb-1 select-none">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-4 py-2 rounded-btn text-xs font-semibold border transition-all cursor-pointer shrink-0',
            activeFilter === filter ? 'bg-rail-500 text-white border-rail-500 shadow-glow font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-rail-50 hover:text-rail-600'
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Post Cards List -->
      <div class="space-y-4">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft space-y-3.5 hover:border-slate-300 transition-all"
        >
          <!-- Card Top Bar: Author, Avatar, Time, Category & Sentiment Pill -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-extrabold text-slate-600 text-sm shrink-0 border border-slate-200">
                <img v-if="post.avatar" :src="post.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else>{{ post.author[0] }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-black text-slate-900">{{ post.author }}</h3>
                  <!-- Sentiment Tag Badge -->
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] font-extrabold border',
                      post.type === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      post.type === 'negative' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    ]"
                  >
                    {{ post.type === 'positive' ? '🟢 Positive' : post.type === 'negative' ? '🛑 Issue' : '⚠️ Advisory' }}
                  </span>
                </div>
                <span class="text-xs text-slate-400 font-medium">{{ post.time }} • {{ post.trainOrStation }}</span>
              </div>
            </div>

            <!-- Category Pill -->
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              {{ post.category }}
            </span>
          </div>

          <!-- Post Content Text -->
          <p class="text-xs text-slate-800 leading-relaxed font-medium">
            {{ post.content }}
          </p>

          <!-- Likes & Comments Footer Bar -->
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold pt-2.5 border-t border-slate-100">
            <div class="flex items-center gap-6">
              <button @click="toggleLike(post)" class="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                <Heart :class="['w-4 h-4 transition-colors', post.liked ? 'text-red-500 fill-red-500' : 'text-slate-400']" />
                <span>{{ post.likes }}</span>
              </button>

              <button class="flex items-center gap-1.5 hover:text-rail-600 transition-colors cursor-pointer">
                <MessageSquare class="w-4 h-4 text-slate-400" />
                <span>{{ post.comments }}</span>
              </button>
            </div>

            <span class="text-[11px] font-semibold text-slate-400">Verified Passenger Update</span>
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
import { ArrowLeft, Camera, Send, Heart, MessageSquare } from 'lucide-vue-next'

const router = useRouter()

const activeTopTab = ref('All Updates')
const topTabs = ['All Updates', 'My Train', 'Stations']

const activeFilter = ref('All')
const filters = ['All', 'Delay', 'Platform', 'Crowd', 'Cleanliness', 'Food', 'Other']

const newPostText = ref('')
const newPostCategory = ref('Other')

// Balanced realistic dataset with positive AND negative passenger comments across all sections
const postsList = ref([
  // ──── DELAY ────
  {
    id: 1,
    author: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    time: '15 mins ago',
    trainOrStation: 'Vande Bharat Express (22436)',
    category: 'Delay',
    type: 'positive',
    content: 'Vande Bharat recovered 15 mins lost time after Agra! Passed Kanpur Central right on time. Smooth 130 km/h cruising speed and Coach C4 AC is working 10/10.',
    likes: 18,
    comments: 3,
    liked: false
  },
  {
    id: 2,
    author: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    time: '25 mins ago',
    trainOrStation: 'Mumbai Rajdhani Express (12952)',
    category: 'Delay',
    type: 'negative',
    content: 'Train is crawling at 20 km/h between Mathura and Kota due to unexpected freight signal precedence. Currently delayed by 32 minutes.',
    likes: 14,
    comments: 5,
    liked: false
  },

  // ──── PLATFORM ────
  {
    id: 3,
    author: 'Suresh Iyer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    time: '35 mins ago',
    trainOrStation: 'Kalyan Junction (KYN)',
    category: 'Platform',
    type: 'negative',
    content: 'Last minute platform change at Kalyan Jn! Deccan Queen shifted from PF 1 to PF 5 with only 8 mins warning. Escalator on PF 4 is out of service, heavy stair rush.',
    likes: 31,
    comments: 9,
    liked: false
  },
  {
    id: 4,
    author: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    time: '1 hour ago',
    trainOrStation: 'New Delhi Railway Station (NDLS)',
    category: 'Platform',
    type: 'positive',
    content: 'Platform 16 escalator and battery cart services for senior citizens are fully operational today. Clear digital signage for Rajdhani Express boarding.',
    likes: 24,
    comments: 7,
    liked: false
  },

  // ──── CROWD ────
  {
    id: 5,
    author: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    time: '1.5 hours ago',
    trainOrStation: 'Howrah Junction (HWH)',
    category: 'Crowd',
    type: 'negative',
    content: 'Heavy evening crowd at Howrah main concourse near Gate 3. Pre-paid taxi counter queue extends outside station building, wait time is around 25 minutes.',
    likes: 27,
    comments: 11,
    liked: false
  },
  {
    id: 6,
    author: 'Deepak Nair',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
    time: '2 hours ago',
    trainOrStation: 'IRCTC Tejas Express (82902)',
    category: 'Crowd',
    type: 'positive',
    content: 'Executive Coach E1 in Tejas Express is super quiet and comfortable today. Automatic sliding doors and ambient reading lights working great.',
    likes: 19,
    comments: 2,
    liked: false
  },

  // ──── CLEANLINESS ────
  {
    id: 7,
    author: 'Manish Mehta',
    avatar: '',
    time: '2.5 hours ago',
    trainOrStation: 'Udyan Express (11301)',
    category: 'Cleanliness',
    type: 'negative',
    content: 'Washroom in Coach S4 needs urgent cleaning and water refill after Solapur. Dustbin near vestibule area is overflowing.',
    likes: 22,
    comments: 6,
    liked: false
  },
  {
    id: 8,
    author: 'Kavita Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    time: '3 hours ago',
    trainOrStation: 'August Kranti Rajdhani (12954)',
    category: 'Cleanliness',
    type: 'positive',
    content: 'On-Board Housekeeping Staff (OBHS) responded within 6 minutes of logging request! Cleaned 3AC coach B3 floor and disinfected bathrooms thoroughly.',
    likes: 35,
    comments: 4,
    liked: false
  },

  // ──── FOOD & CATERING ────
  {
    id: 9,
    author: 'Rajesh Khanna',
    avatar: '',
    time: '3.5 hours ago',
    trainOrStation: 'Poorva Express (12304)',
    category: 'Food',
    type: 'negative',
    content: 'Dinner meal tray served near Gaya was lukewarm and rotis were dry. Pantry manager noted feedback and provided fresh hot tea.',
    likes: 16,
    comments: 8,
    liked: false
  },
  {
    id: 10,
    author: 'Sneha Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    time: '4 hours ago',
    trainOrStation: 'Vande Bharat Express (20902)',
    category: 'Food',
    type: 'positive',
    content: 'Delicious morning breakfast on Ahmedabad Vande Bharat! Fresh upma, hot tea, and sealed warm vegetable cutlets served promptly by courteous staff.',
    likes: 42,
    comments: 5,
    liked: false
  },

  // ──── OTHER / AMENITIES ────
  {
    id: 11,
    author: 'Amit Joshi',
    avatar: '',
    time: '4.5 hours ago',
    trainOrStation: 'Vadodara Junction (BRC)',
    category: 'Other',
    type: 'negative',
    content: 'Free Station RailWire Wi-Fi on Platform 2 is disconnecting repeatedly. Mobile network signal inside general waiting hall is also patchy.',
    likes: 11,
    comments: 4,
    liked: false
  },
  {
    id: 12,
    author: 'Sunita Menon',
    avatar: '',
    time: '5 hours ago',
    trainOrStation: 'KSR Bengaluru (SBC)',
    category: 'Other',
    type: 'positive',
    content: 'Air-conditioned Executive Lounge on Platform 1 at SBC is spotless with comfortable reclining chairs, fast Wi-Fi, and hot South Indian filter coffee!',
    likes: 29,
    comments: 3,
    liked: false
  }
])

const filteredPosts = computed(() => {
  if (activeFilter.value === 'All') return postsList.value
  return postsList.value.filter(p => p.category === activeFilter.value)
})

function toggleLike(post) {
  post.liked = !post.liked
  if (post.liked) {
    post.likes++
  } else {
    post.likes--
  }
}

function publishPost() {
  if (!newPostText.value.trim()) return
  postsList.value.unshift({
    id: Date.now(),
    author: 'RailEase Traveler',
    avatar: '',
    time: 'Just now',
    trainOrStation: 'Active Journey',
    category: newPostCategory.value,
    type: 'positive',
    content: newPostText.value,
    likes: 0,
    comments: 0,
    liked: false
  })
  newPostText.value = ''
}
</script>
