<template>
  <AppLayout>
    <div class="max-w-[1700px] mx-auto space-y-6 font-sans">
      <!-- CLEAN HEADER BAR & FAQ SEARCH -->
      <div class="bg-white p-6 rounded-card border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle class="w-6 h-6 text-rail-600" />
            <span>Support &amp; Knowledgebase</span>
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-1">
            Frequently asked questions, system guides, and direct passenger contact channels.
          </p>
        </div>

        <!-- Quick FAQ Search Bar -->
        <div class="relative w-full md:w-96">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search FAQs (e.g. PNR, telemetry, refund)..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-rail-600"
          />
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <!-- DIRECT CONTACT CHANNELS TABLE -->
      <div class="bg-white p-6 rounded-card border border-slate-200 shadow-sm space-y-3">
        <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Mail class="w-4 h-4 text-rail-600" />
          <span>Contact Support Channels</span>
        </h3>

        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th class="p-3">Support Channel</th>
                <th class="p-3">Details / Target</th>
                <th class="p-3">Availability</th>
                <th class="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <Mail class="w-4 h-4 text-blue-600" />
                  <span>Passenger Email Support</span>
                </td>
                <td class="p-3 text-rail-700 font-bold">support@railease.in</td>
                <td class="p-3 text-emerald-700 font-bold">1-2 Hour SLA Response</td>
                <td class="p-3 text-right">
                  <button
                    @click="showContactModal = true"
                    class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Send Email Ticket
                  </button>
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <Phone class="w-4 h-4 text-emerald-600" />
                  <span>24x7 Passenger Helpline</span>
                </td>
                <td class="p-3 text-slate-900 font-black">1800-RAIL-EASE</td>
                <td class="p-3 text-emerald-700 font-bold">24 Hours / 7 Days</td>
                <td class="p-3 text-right">
                  <a
                    href="tel:180072453273"
                    class="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs inline-block transition-colors"
                  >
                    Call Helpline
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ KNOWLEDGEBASE TABLE -->
      <div class="bg-white p-6 rounded-card border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle class="w-4 h-4 text-rail-600" />
            <span>Frequently Asked Questions Directory</span>
          </h3>

          <!-- Category Quick Filters -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              :class="[
                'px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer',
                selectedCategory === cat.id
                  ? 'bg-rail-600 text-white border-rail-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Clean FAQ Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th class="p-3 w-1/3">Question / Topic</th>
                <th class="p-3">Answer &amp; Resolution Guide</th>
                <th class="p-3 w-32 text-right">Category</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-800">
              <tr
                v-for="faq in filteredFaqs"
                :key="faq.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="p-3.5 font-extrabold text-slate-900 align-top">
                  {{ faq.question }}
                </td>
                <td class="p-3.5 text-slate-700 leading-relaxed align-top" v-html="faq.answer"></td>
                <td class="p-3.5 text-right align-top">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200 text-[10px]">
                    {{ getCategoryLabel(faq.categoryId) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CONTACT FORM MODAL DIALOG -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="showContactModal"
          class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          @click.self="showContactModal = false"
        >
          <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div class="flex items-center gap-2">
                <Mail class="w-4 h-4 text-sky-400" />
                <h3 class="text-sm font-black uppercase tracking-wider">Email RailEase Support</h3>
              </div>
              <button
                @click="showContactModal = false"
                class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form @submit.prevent="submitContactForm" class="p-6 space-y-3.5 text-xs font-bold text-slate-800">
              <div v-if="formSubmitted" class="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center space-y-2">
                <CheckCircle2 class="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 class="text-sm font-black">Support Ticket Submitted</h4>
                <p class="text-[11px] text-emerald-700 font-medium">
                  We will reply to your email within 1-2 hours.
                </p>
                <button
                  type="button"
                  @click="showContactModal = false; formSubmitted = false"
                  class="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs"
                >
                  Close
                </button>
              </div>

              <template v-else>
                <div>
                  <label class="block text-slate-600 mb-1">Name *</label>
                  <input
                    v-model="contactForm.name"
                    type="text"
                    required
                    placeholder="Full name"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-rail-600"
                  />
                </div>

                <div>
                  <label class="block text-slate-600 mb-1">Email *</label>
                  <input
                    v-model="contactForm.email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-rail-600"
                  />
                </div>

                <div>
                  <label class="block text-slate-600 mb-1">Message *</label>
                  <textarea
                    v-model="contactForm.message"
                    required
                    rows="3"
                    placeholder="Describe your issue or question..."
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-rail-600 font-sans"
                  ></textarea>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    @click="showContactModal = false"
                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-5 py-2 bg-rail-600 hover:bg-rail-700 text-white rounded-xl font-extrabold shadow flex items-center gap-1.5"
                  >
                    <Send class="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </template>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import {
  HelpCircle,
  Search,
  Mail,
  Phone,
  Send,
  CheckCircle2
} from 'lucide-vue-next'

const searchQuery = ref('')
const selectedCategory = ref('all')
const showContactModal = ref(false)
const formSubmitted = ref(false)

const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

const categories = [
  { id: 'all', name: 'All FAQs' },
  { id: 'pnr', name: 'PNR & Sync' },
  { id: 'telemetry', name: 'Telemetry' },
  { id: 'ecatering', name: 'eCatering' },
  { id: 'account', name: 'Account' }
]

const faqs = ref([
  {
    id: 1,
    categoryId: 'pnr',
    question: 'How do I sync an existing IRCTC PNR ticket?',
    answer: 'Enter your 10-digit PNR in <strong>Train Intelligence & Sync</strong> or the top search bar. RailEase locks satellite live tracking, safeguards, and eCatering automatically without re-booking.'
  },
  {
    id: 2,
    categoryId: 'telemetry',
    question: 'What is the Confidence Score?',
    answer: 'RailEase calculates a <strong>Confidence Score (0-100)</strong> from the past 30 days of running history. It combines how often the train arrives close to schedule, how consistent it is, and how bad a bad day gets - because a train that is reliably 20 minutes late is easier to plan around than one that is randomly between 0 and 3 hours late. 70 and above is on time (green), 55 to 69 is sometimes delayed (amber), below 55 is often delayed (red). Every score is shown with the record behind it, so you can check the reasoning yourself.'
  },
  {
    id: 3,
    categoryId: 'telemetry',
    question: 'How accurate is Live Satellite Train Tracking?',
    answer: 'The Live Radar updates every 3 seconds with GPS coordinates and real-time section speed (bounded between 90 km/h and 130 km/h).'
  },
  {
    id: 4,
    categoryId: 'ecatering',
    question: 'How does in-train food delivery work?',
    answer: 'Select your train under <strong>eCatering</strong>, choose hygiene partners, and enter seat details. Meals are delivered directly to your berth.'
  },
  {
    id: 5,
    categoryId: 'account',
    question: 'What are the default test login credentials?',
    answer: 'This is a prototype build. Demo sign-in details are shared separately by the RailEase team and are not published here. Your session persists locally in your browser once signed in.'
  }
])

const filteredFaqs = computed(() => {
  return faqs.value.filter(faq => {
    const matchesCategory = selectedCategory.value === 'all' || faq.categoryId === selectedCategory.value
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch = !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })
})

function getCategoryLabel(catId) {
  const c = categories.find(cat => cat.id === catId)
  return c ? c.name : 'General'
}

function submitContactForm() {
  formSubmitted.value = true
  console.log('[RailEase Support] Email ticket submitted:', contactForm.value)
}
</script>
