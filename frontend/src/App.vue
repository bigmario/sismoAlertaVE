<template>
  <div class="min-h-screen flex flex-col bg-brand-dark text-brand-text">
    <!-- Header -->
    <header class="bg-[#161F38] border-b border-[#232F52] sticky top-0 z-40 shadow-xl">
      <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Brand Info -->
        <div class="flex items-center gap-3">
          <div class="text-3xl animate-bounce">🚨</div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-brand-text flex items-center gap-2">
              SismoAlerta VE
              <span class="text-[10px] bg-red-600/20 text-brand-red border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Emergencia Símica
              </span>
            </h1>
            <p class="text-xs text-brand-muted">Plataforma Ciudadana de Búsqueda y Coordinación de Rescate</p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="flex bg-brand-dark/60 p-1.5 rounded-xl border border-[#232F52] overflow-x-auto max-w-full">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5',
              currentTab === tab.id
                ? 'bg-brand-blue text-brand-text shadow-md'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-dark/40'
            ]"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
      
      <!-- Real-time Stats Grid Dashboard -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#111A31]/50 p-3 rounded-xl border border-[#232F52]/60">
        <div class="bg-[#161F38] p-3.5 rounded-lg border border-[#232F52] flex flex-col justify-between">
          <span class="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Casos Totales</span>
          <span class="text-2xl font-black text-brand-text mt-1">{{ stats.total }}</span>
        </div>
        <div class="bg-[#161F38] p-3.5 rounded-lg border border-[#232F52] flex flex-col justify-between">
          <span class="text-[10px] text-brand-red font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Desaparecidos
          </span>
          <span class="text-2xl font-black text-brand-red mt-1">{{ stats.desaparecidos }}</span>
        </div>
        <div class="bg-[#161F38] p-3.5 rounded-lg border border-[#232F52] flex flex-col justify-between">
          <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Rescatados</span>
          <span class="text-2xl font-black text-emerald-400 mt-1">{{ stats.rescatados }}</span>
        </div>
        <div class="bg-[#161F38] p-3.5 rounded-lg border border-[#232F52] flex flex-col justify-between">
          <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Ubicados</span>
          <span class="text-2xl font-black text-cyan-400 mt-1">{{ stats.ubicados }}</span>
        </div>
      </section>

      <!-- Active Tab Render -->
      <div class="transition-all duration-300">
        <keep-alive>
          <component :is="activeComponent" />
        </keep-alive>
      </div>

      <!-- Emergency Helpline sidebar / contacts section -->
      <section class="bg-[#161F38]/60 border border-[#232F52] p-4 rounded-xl space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-brand-amber">📞 Números de Emergencia en Venezuela</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div class="p-2 bg-brand-dark/40 rounded border border-[#232F52]/50">
            <strong class="block text-brand-text">Emergencia Nacional</strong>
            <span class="text-brand-blue font-bold text-sm">911</span>
          </div>
          <div class="p-2 bg-brand-dark/40 rounded border border-[#232F52]/50">
            <strong class="block text-brand-text">Protección Civil</strong>
            <span class="text-brand-blue font-bold text-sm">0800-7248451</span>
          </div>
          <div class="p-2 bg-brand-dark/40 rounded border border-[#232F52]/50">
            <strong class="block text-brand-text">Bomberos Forestales</strong>
            <span class="text-brand-blue font-bold text-sm">0800-5894226</span>
          </div>
          <div class="p-2 bg-brand-dark/40 rounded border border-[#232F52]/50">
            <strong class="block text-brand-text">Cruz Roja Venezuela</strong>
            <span class="text-brand-blue font-bold text-sm">(0212) 571-4567</span>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-brand-dark border-t border-[#232F52] py-6 mt-auto text-xs text-brand-muted">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p>© 2026 SismoAlerta VE. Diseñado para optimización en redes móviles 3G/Edge.</p>
        <div class="flex gap-4">
          <span class="hover:text-brand-text transition-colors">Venezuela</span>
          <span class="text-[#232F52]">•</span>
          <span class="hover:text-brand-text transition-colors">Resiliencia Civil</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SearchEngine from './components/SearchEngine.vue';
import ReportForm from './components/ReportForm.vue';
import RescuerPanel from './components/RescuerPanel.vue';
import { apiService } from './services/api';

// Tabs list
const tabs = [
  { id: 'search', label: 'Búsqueda de Personas', icon: '🔍', component: SearchEngine },
  { id: 'report', label: 'Registrar Reporte', icon: '✍️', component: ReportForm },
  { id: 'rescuer', label: 'Panel de Rescatistas', icon: '👷', component: RescuerPanel }
];

const currentTab = ref('search');

// Select component dynamically based on tab
const activeComponent = computed(() => {
  const t = tabs.find(x => x.id === currentTab.value);
  return t ? t.component : SearchEngine;
});

// Dynamic dashboard stats from database/localStorage
const stats = ref({
  total: 0,
  desaparecidos: 0,
  rescatados: 0,
  ubicados: 0
});

const calculateStats = () => {
  const records = apiService.getPersonas();
  stats.value = {
    total: records.length,
    desaparecidos: records.filter(p => p.estado === 'DESAPARECIDO').length,
    rescatados: records.filter(p => p.estado === 'RESCATADO').length,
    ubicados: records.filter(p => p.estado === 'UBICADO').length
  };
};

onMounted(() => {
  calculateStats();
  // Listen for updates from forms or rescuer actions to refresh live stats
  window.addEventListener('sismoalerta-data-updated', calculateStats);
});

onUnmounted(() => {
  window.removeEventListener('sismoalerta-data-updated', calculateStats);
});
</script>
