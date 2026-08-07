<template>
  <div class="w-full max-w-md bg-white rounded-card shadow-soft-lg border border-slate-100 p-8 relative overflow-hidden transition-all duration-300">
    <!-- Top Decorative Gradient Line -->
    <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rail-500 via-rail-400 to-indigo-500"></div>

    <!-- Header Tabs -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
      <div class="flex gap-4">
        <button
          @click="isRegister = false"
          :class="[
            'text-sm font-semibold pb-1 transition-all relative',
            !isRegister ? 'text-rail-900 border-b-2 border-rail-500' : 'text-slate-400 hover:text-slate-600'
          ]"
        >
          Sign In
        </button>
        <button
          @click="isRegister = true"
          :class="[
            'text-sm font-semibold pb-1 transition-all relative',
            isRegister ? 'text-rail-900 border-b-2 border-rail-500' : 'text-slate-400 hover:text-slate-600'
          ]"
        >
          Create Account
        </button>
      </div>
      <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-rail-50 text-rail-600 border border-rail-100">
        Prototype Mode
      </span>
    </div>

    <!-- Error Alert -->
    <div v-if="authStore.loginError" class="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
      <AlertCircle class="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
      <span>{{ authStore.loginError }}</span>
    </div>

    <!-- Sign In Form -->
    <form v-if="!isRegister" @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Username or Email
        </label>
        <div class="relative">
          <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="username"
            type="text"
            required
            placeholder="Enter your username"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 transition-all"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Password
          </label>
          <a href="#" @click.prevent class="text-xs font-medium text-rail-500 hover:underline">Forgot?</a>
        </div>
        <div class="relative">
          <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Enter your password"
            class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 transition-all"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="rememberMe" class="rounded border-slate-300 text-rail-500 focus:ring-rail-500 w-4 h-4" />
          <span class="text-xs text-slate-600">Remember me</span>
        </label>
      </div>

      <button
        type="submit"
        :disabled="authStore.isLoading"
        class="w-full py-3 bg-rail-500 hover:bg-rail-600 text-white rounded-btn font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group mt-2"
      >
        <span v-if="!authStore.isLoading">Sign In to Dashboard</span>
        <span v-else class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        <ArrowRight v-if="!authStore.isLoading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>

    <!-- Create Account / Register Form -->
    <form v-else @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Full Name
        </label>
        <input
          v-model="regName"
          type="text"
          required
          placeholder="RailEase Traveler"
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 transition-all"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Desired Username
        </label>
        <input
          v-model="regUsername"
          type="text"
          required
          placeholder="railease"
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 transition-all"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <input
          v-model="regPassword"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-btn text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-500/20 focus:border-rail-500 transition-all"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-rail-500 hover:bg-rail-600 text-white rounded-btn font-semibold text-sm shadow-md transition-all duration-200 mt-2"
      >
        Create Account
      </button>
    </form>

    <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span class="flex items-center gap-1.5">
        <ShieldCheck class="w-4 h-4 text-emerald-500" />
        256-bit Encrypted Session
      </span>
      <span class="font-medium text-slate-400">RailEase v1.0</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)

const regName = ref('')
const regUsername = ref('')
const regPassword = ref('')

function handleSignIn() {
  const success = authStore.login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}

function handleRegister() {
  // Demo auto-login with credentials
  authStore.login('railease', '123456')
  router.push('/dashboard')
}
</script>
