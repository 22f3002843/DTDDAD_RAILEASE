import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SearchTrainsView from '@/views/SearchTrainsView.vue'
import AuthenticatedSearchTrainsView from '@/views/AuthenticatedSearchTrainsView.vue'
import JourneyPlannerView from '@/views/JourneyPlannerView.vue'
import BookingsView from '@/views/BookingsView.vue'
import LiveStatusView from '@/views/LiveStatusView.vue'
import ECateringView from '@/views/ECateringView.vue'
import CommunityView from '@/views/CommunityView.vue'
import AlertsView from '@/views/AlertsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SupportView from '@/views/SupportView.vue'
import TrainDetailView from '@/views/TrainDetailView.vue'
import WatchingView from '@/views/WatchingView.vue'
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
    component: SearchTrainsView
  },
  {
    // Public on purpose: the risk breakdown is the whole argument for this
    // product, and nobody signs up for a benefit they have not felt yet.
    path: '/train/:number',
    name: 'train-detail',
    component: TrainDetailView
  },
  {
    // Public: watching is stored in the browser, so no account is required.
    path: '/watching',
    name: 'watching',
    component: WatchingView
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
    // Kept reachable so existing links and the month calendar still work, but
    // no longer in the sidebar: the dashboard now carries the same trips.
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
    path: '/support',
    name: 'support',
    component: SupportView,
    meta: { requiresAuth: true }
  },
  {
    path: '/train-intelligence',
    name: 'train-intelligence',
    component: AuthenticatedSearchTrainsView,
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

// Dynamic Navigation Guard
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
