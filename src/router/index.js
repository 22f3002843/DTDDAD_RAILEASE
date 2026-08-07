import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SearchTrainsView from '@/views/SearchTrainsView.vue'
import JourneyPlannerView from '@/views/JourneyPlannerView.vue'
import BookingsView from '@/views/BookingsView.vue'
import LiveStatusView from '@/views/LiveStatusView.vue'
import ECateringView from '@/views/ECateringView.vue'
import CommunityView from '@/views/CommunityView.vue'
import AlertsView from '@/views/AlertsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: { layout: 'landing' }
  },
  {
    path: '/search',
    name: 'search-trains',
    component: SearchTrainsView,
    meta: { requiresAuth: false } // PUBLIC ACCESS: No login required to search & view trains
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/journey-planner',
    name: 'journey-planner',
    component: JourneyPlannerView,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings',
    name: 'my-bookings',
    component: BookingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/live-status',
    name: 'live-status',
    component: LiveStatusView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ecatering',
    name: 'ecatering',
    component: ECateringView,
    meta: { requiresAuth: true }
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityView,
    meta: { requiresAuth: true }
  },
  {
    path: '/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn('[RailEase Router Guard] Blocked protected route:', to.path, '-> redirecting to landing')
    next({ name: 'landing' })
  } else {
    next()
  }
})

export default router
