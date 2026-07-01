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
      <section class="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#111A31]/50 p-3 rounded-xl border border-[#232F52]/60">
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
        <div class="bg-[#161F38] p-3.5 rounded-lg border border-[#232F52] flex flex-col justify-between">
          <span class="text-[10px] text-brand-red font-bold uppercase tracking-wider flex items-center gap-1">
            🧒 Menores Solos
          </span>
          <span class="text-2xl font-black text-brand-red mt-1 flex items-baseline gap-1">
            {{ stats.menores }}
            <span class="text-[9px] text-brand-muted font-normal block">prioridad</span>
          </span>
        </div>
      </section>

      <!-- Active Tab Render -->
      <div class="transition-all duration-300">
        <keep-alive>
          <component :is="activeComponent" />
        </keep-alive>
      </div>

      <!-- Emergency Helpline sidebar / contacts section (Updated from PC & Bomberos flyer) -->
      <section class="bg-[#161F38] border-2 border-brand-red p-5 rounded-2xl space-y-5 shadow-2xl">
        <!-- Title bar -->
        <div class="flex items-center gap-3 border-b border-[#232F52] pb-3 text-brand-red">
          <div class="text-2xl animate-pulse">⚠️</div>
          <div>
            <h3 class="text-sm font-black uppercase tracking-wider text-brand-text">NÚMEROS DE EMERGENCIA ACTUALIZADOS</h3>
            <p class="text-[10px] text-brand-amber font-bold tracking-tight uppercase animate-pulse">ACABA DE TEMBLAR - MANTÉN LA CALMA Y COMUNÍCATE</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <!-- Nacional -->
          <div class="space-y-2 p-3 bg-brand-dark/50 rounded-xl border border-[#232F52]">
            <h4 class="font-bold text-brand-amber text-xs uppercase tracking-wide border-b border-[#232F52] pb-1">Nivel Nacional</h4>
            <div class="space-y-2 mt-2">
              <div>
                <span class="text-[10px] text-brand-muted block">Emergencias Nacionales</span>
                <a href="tel:911" class="text-xl font-black text-brand-text hover:text-brand-blue transition-colors flex items-center gap-1.5">
                  📞 911
                </a>
              </div>
              <div>
                <span class="text-[10px] text-brand-muted block">Protección Civil Nacional</span>
                <a href="tel:08007248451" class="text-sm font-bold text-brand-text hover:text-brand-blue transition-colors block">
                  0800-PCIVIL-1
                </a>
                <span class="text-[10px] text-brand-muted">(0800-724-8451)</span>
              </div>
            </div>
          </div>

          <!-- Caracas -->
          <div class="space-y-2 p-3 bg-brand-dark/50 rounded-xl border border-[#232F52]">
            <h4 class="font-bold text-brand-amber text-xs uppercase tracking-wide border-b border-[#232F52] pb-1">Caracas</h4>
            <div class="space-y-2 mt-2">
              <div>
                <span class="text-[10px] text-brand-muted block font-semibold mb-1 text-brand-text">Protección Civil Distrito Capital</span>
                <div class="grid grid-cols-2 gap-2 text-[11px] font-semibold text-brand-text">
                  <a href="tel:02125751829" class="hover:text-brand-blue flex items-center gap-1">📞 575-1829</a>
                  <a href="tel:02125753332" class="hover:text-brand-blue flex items-center gap-1">📞 575-3332</a>
                  <a href="tel:02125751823" class="hover:text-brand-blue flex items-center gap-1">📞 575-1823</a>
                  <a href="tel:02123774019" class="hover:text-brand-blue flex items-center gap-1">📞 377-4019</a>
                </div>
              </div>
              <div class="pt-1">
                <span class="text-[10px] text-brand-muted block">Bomberos de Caracas (Central)</span>
                <a href="tel:02125454545" class="text-[11px] font-bold text-brand-text hover:text-brand-blue transition-colors flex items-center gap-1">
                  📞 0212-545-4545
                </a>
              </div>
            </div>
          </div>

          <!-- Valencia / Carabobo -->
          <div class="space-y-2 p-3 bg-brand-dark/50 rounded-xl border border-[#232F52]">
            <h4 class="font-bold text-brand-amber text-xs uppercase tracking-wide border-b border-[#232F52] pb-1">Valencia / Carabobo</h4>
            <div class="space-y-2 mt-2">
              <div>
                <span class="text-[10px] text-brand-muted block font-semibold mb-1 text-brand-text">Protección Civil Carabobo</span>
                <div class="grid grid-cols-3 gap-1 text-[10px] font-semibold text-brand-text">
                  <a href="tel:02418593969" class="hover:text-brand-blue">859-3969</a>
                  <a href="tel:02418592171" class="hover:text-brand-blue">859-2171</a>
                  <a href="tel:02418593801" class="hover:text-brand-blue">859-3801</a>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1 border-t border-[#232F52]/50 mt-1">
                <div>
                  <span class="text-[9px] text-brand-muted block">PC Valencia</span>
                  <a href="tel:04128274252" class="text-[10px] font-bold text-brand-text hover:text-brand-blue">
                    0412-827-4252
                  </a>
                </div>
                <div>
                  <span class="text-[9px] text-brand-muted block">Bomberos Val.</span>
                  <a href="tel:04144333952" class="text-[10px] font-bold text-brand-text hover:text-brand-blue">
                    0414-433-3952
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Importance Banner -->
        <div class="bg-brand-red/10 border border-brand-red/30 p-3.5 rounded-xl flex items-start gap-3">
          <span class="text-lg text-brand-red">⚠️</span>
          <div class="text-[11px] leading-relaxed">
            <strong class="text-brand-red font-black uppercase block mb-0.5">IMPORTANTE:</strong>
            Si estás en un edificio con grietas nuevas, olor a gas, cables caídos o daños estructurales, <span class="underline decoration-brand-red font-semibold text-brand-text">evacúa con calma</span> y repórtalo de inmediato a Protección Civil o Bomberos.
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
  ubicados: 0,
  menores: 0
});

const calculateStats = async () => {
  const records = await apiService.getPersonas();
  stats.value = {
    total: records.length,
    desaparecidos: records.filter(p => p.estado === 'DESAPARECIDO').length,
    rescatados: records.filter(p => p.estado === 'RESCATADO').length,
    ubicados: records.filter(p => p.estado === 'UBICADO').length,
    menores: records.filter(p => p.es_menor_no_acompanado).length
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
