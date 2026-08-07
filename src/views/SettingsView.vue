<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-rail-900 tracking-tight">
          Application Settings
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">Customize notification channels, light theme options, and security preferences.</p>
      </div>

      <div class="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900">App Theme</h3>
            <p class="text-xs text-slate-500">RailEase is optimized exclusively for ultra-clean light mode UI aesthetics.</p>
          </div>
          <span class="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200">
            Light Mode (Fixed)
          </span>
        </div>

        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900">High-Stakes SMS Alerts</h3>
            <p class="text-xs text-slate-500">Receive instant SMS notifications if delay risk exceeds 15%.</p>
          </div>
          <input type="checkbox" checked class="w-4 h-4 text-rail-500 rounded border-slate-300" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900">WhatsApp PNR Live Tracking</h3>
            <p class="text-xs text-slate-500">Get automatic updates on chart preparation directly on WhatsApp.</p>
          </div>
          <input type="checkbox" checked class="w-4 h-4 text-rail-500 rounded border-slate-300" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
</script>
