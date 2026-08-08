<template>
  <!-- Signed in: keep the sidebar, so a page reached from the sidebar does not
       remove the sidebar and strand the user on a Back button. -->
  <AppLayout v-if="authStore.isAuthenticated">
    <slot />
  </AppLayout>

  <!-- Signed out: the public shell, since there is no sidebar to belong to. -->
  <div v-else class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <Navbar @openLogin="showAuthModal = true" />
    <div class="flex-1 w-full">
      <slot />
    </div>
    <Footer />
    <AuthWidget v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup>
/**
 * Chooses the right shell for a page that is reachable both signed in and out.
 *
 * Why this exists:
 *   Watching and Train Detail are public pages, so they were built with the
 *   public shell. But they are also linked from the sidebar, which meant a
 *   signed-in user clicking Watching watched the sidebar disappear and had to
 *   press Back to get it again. Choosing the shell from auth state rather than
 *   hardcoding it per view fixes both pages and stops the next public-but-also-
 *   linked page from repeating the mistake.
 */
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import AppLayout from '@/layouts/AppLayout.vue'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/footer/Footer.vue'
import AuthWidget from '@/components/common/AuthWidget.vue'

const authStore = useAuthStore()
const showAuthModal = ref(false)
</script>
