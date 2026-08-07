<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header (Matching Image 4 Top) -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          Community Updates
        </h1>
      </div>

      <!-- Top Navigation Tabs (Matching Image 4: All Updates | My Train | Stations) -->
      <div class="flex items-center gap-8 border-b border-slate-200 text-sm font-bold text-slate-500 pb-1">
        <button
          v-for="tab in topTabs"
          :key="tab"
          @click="activeTopTab = tab"
          :class="[
            'pb-3 border-b-2 transition-all',
            activeTopTab === tab ? 'text-rail-900 border-slate-900 font-extrabold' : 'border-transparent hover:text-slate-700'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Post Creation Card (Matching Image 4: "Share an update...") -->
      <div class="bg-white p-5 rounded-card border border-slate-200/80 shadow-soft flex items-center gap-3">
        <input
          v-model="newPostText"
          type="text"
          placeholder="Share an update..."
          class="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500"
        />
        <button class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-btn transition-colors" title="Attach Photo">
          <Camera class="w-5 h-5" />
        </button>
        <button
          @click="publishPost"
          class="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-btn font-semibold text-xs transition-all flex items-center gap-2"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>

      <!-- Filter Chips Row (Matching Image 4: All | Delay | Platform | Crowd | Cleanliness | Other) -->
      <div class="flex items-center gap-3 overflow-x-auto pb-1">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-5 py-2 rounded-btn text-xs font-semibold border transition-all',
            activeFilter === filter ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Post Cards List (Matching Image 4) -->
      <div class="space-y-4">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600 text-sm">
                <img v-if="post.avatar" :src="post.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else>{{ post.author[0] }}</span>
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">{{ post.author }}</h3>
                <span class="text-xs text-slate-400 font-medium">{{ post.time }} • {{ post.trainOrStation }}</span>
              </div>
            </div>

            <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {{ post.category }}
            </span>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed font-normal">
            {{ post.content }}
          </p>

          <!-- Likes & Comments Bar (Matching Image 4 Bottom Bar) -->
          <div class="flex items-center gap-6 text-xs text-slate-500 font-bold pt-2 border-t border-slate-100">
            <button @click="post.likes++" class="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart class="w-4 h-4 text-slate-400 hover:text-red-500" />
              <span>{{ post.likes }}</span>
            </button>

            <button class="flex items-center gap-1.5 hover:text-rail-600 transition-colors">
              <MessageSquare class="w-4 h-4 text-slate-400" />
              <span>{{ post.comments }}</span>
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
import { ArrowLeft, Camera, Send, Heart, MessageSquare } from 'lucide-vue-next'

const router = useRouter()

const activeTopTab = ref('All Updates')
const topTabs = ['All Updates', 'My Train', 'Stations']

const activeFilter = ref('All')
const filters = ['All', 'Delay', 'Platform', 'Crowd', 'Cleanliness', 'Other']

const newPostText = ref('')

const postsList = ref([
  {
    id: 1,
    author: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    time: '15 mins ago',
    trainOrStation: 'Vande Bharat Express (22436)',
    category: 'Delay',
    content: 'Vande Bharat is running right on time passing Kanpur Central. Coach C4 air conditioning and cleanliness 10/10.',
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    author: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    time: '1 hour ago',
    trainOrStation: 'New Delhi Railway Station (NDLS)',
    category: 'Platform',
    content: 'Platform 16 escalator is fully operational. Clear signage for Rajdhani Express boarding.',
    likes: 24,
    comments: 7
  }
])

const filteredPosts = computed(() => {
  if (activeFilter.value === 'All') return postsList.value
  return postsList.value.filter(p => p.category === activeFilter.value)
})

function publishPost() {
  if (!newPostText.value.trim()) return
  postsList.value.unshift({
    id: Date.now(),
    author: 'RailEase Traveler',
    avatar: '',
    time: 'Just now',
    trainOrStation: 'Active Journey',
    category: 'Other',
    content: newPostText.value,
    likes: 0,
    comments: 0
  })
  newPostText.value = ''
}
</script>
