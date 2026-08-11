import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STATIC_CREDENTIALS, MOCK_USER_PROFILE } from '@/data/auth'

export const useAuthStore = defineStore('auth', () => {
  const storedAuth = localStorage.getItem('railease_auth')
  // Default to true on initial visit so deployed demo users access all features immediately
  const initialAuthState = storedAuth === null ? true : storedAuth === 'true'

  const isAuthenticated = ref(initialAuthState)
  const user = ref(initialAuthState ? MOCK_USER_PROFILE : null)
  const loginError = ref('')
  const isLoading = ref(false)

  function login(username, password) {
    isLoading.value = true
    loginError.value = ''

    // Static check for railease / 123456
    const cleanUsername = (username || '').trim().toLowerCase()
    const cleanPassword = (password || '').trim()

    if (cleanUsername === STATIC_CREDENTIALS.username && cleanPassword === STATIC_CREDENTIALS.password) {
      isAuthenticated.value = true
      user.value = { ...MOCK_USER_PROFILE, username: cleanUsername }
      localStorage.setItem('railease_auth', 'true')
      isLoading.value = false
      return true
    } else {
      loginError.value = 'Invalid username or password. Please check your credentials.'
      isLoading.value = false
      return false
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    localStorage.setItem('railease_auth', 'false')
  }

  return {
    isAuthenticated,
    user,
    loginError,
    isLoading,
    login,
    logout
  }
})
