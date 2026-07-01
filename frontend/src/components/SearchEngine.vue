<template>
  <div class="space-y-6">
    <!-- Search and Filters Bar -->
    <div class="bg-[#161F38] border border-[#232F52] p-4 rounded-xl shadow-lg space-y-4">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Text Search -->
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-muted">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, apellido, cédula o ID de reporte..."
            class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted pl-10 pr-4 py-2.5 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-sm"
          />
        </div>

        <!-- Latency / Clear info -->
        <div class="flex items-center justify-between md:justify-end gap-2 text-xs text-brand-muted">
          <span>{{ filteredPersonas.length }} de {{ personas.length }} registros</span>
          <button 
            v-if="searchQuery || statusFilter !== 'ALL'"
            @click="clearFilters"
            class="text-brand-blue hover:underline focus:outline-none"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Status Quick Filters -->
      <div class="flex flex-wrap gap-2 pt-1 border-t border-[#232F52]">
        <button
          @click="statusFilter = 'ALL'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
            statusFilter === 'ALL'
              ? 'bg-[#1E293B] text-brand-text border-slate-600'
              : 'bg-[#0A0F1D] text-brand-muted border-transparent hover:border-[#232F52] hover:text-brand-text'
          ]"
        >
          Todos ({{ personas.length }})
        </button>

        <button
          @click="statusFilter = 'DESAPARECIDO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            statusFilter === 'DESAPARECIDO'
              ? 'bg-red-950/80 text-red-400 border-red-700/60'
              : 'bg-[#0A0F1D] text-red-500/80 border-transparent hover:border-red-900/40 hover:text-red-400'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          Desaparecidos ({{ getCount('DESAPARECIDO') }})
        </button>

        <button
          @click="statusFilter = 'RESCATADO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            statusFilter === 'RESCATADO'
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
              : 'bg-[#0A0F1D] text-emerald-500/80 border-transparent hover:border-emerald-900/40 hover:text-emerald-400'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Rescatados ({{ getCount('RESCATADO') }})
        </button>

        <button
          @click="statusFilter = 'UBICADO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            statusFilter === 'UBICADO'
              ? 'bg-cyan-950/80 text-cyan-400 border-cyan-700/60'
              : 'bg-[#0A0F1D] text-cyan-500/80 border-transparent hover:border-cyan-900/40 hover:text-cyan-400'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          Ubicados ({{ getCount('UBICADO') }})
        </button>

        <button
          @click="statusFilter = 'FALLECIDO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            statusFilter === 'FALLECIDO'
              ? 'bg-zinc-900 text-zinc-400 border-zinc-700'
              : 'bg-[#0A0F1D] text-zinc-500 border-transparent hover:border-zinc-800 hover:text-zinc-400'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
          Fallecidos ({{ getCount('FALLECIDO') }})
        </button>

        <button
          @click="toggleMenoresFilter"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ml-auto md:ml-0',
            showOnlyMenores
              ? 'bg-red-950/85 text-brand-red border-red-600/60 shadow-lg shadow-brand-red/10'
              : 'bg-[#0A0F1D] text-brand-muted border-transparent hover:border-brand-red/40 hover:text-brand-red'
          ]"
        >
          <span>🧒</span>
          <span>Menores No Acompañados ({{ getMenoresCount() }})</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPersonas.length === 0" class="bg-[#161F38] border border-[#232F52] p-12 rounded-xl text-center">
      <svg class="mx-auto h-12 w-12 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-brand-text">No se encontraron registros</h3>
      <p class="mt-2 text-sm text-brand-muted max-w-md mx-auto">
        Prueba ajustando los términos de búsqueda o cambiando el filtro de estado. Si deseas reportar un nuevo caso, puedes hacerlo en el formulario de reporte.
      </p>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="persona in filteredPersonas" 
        :key="persona.id"
        class="bg-[#161F38] border border-[#232F52] hover:border-brand-blue/30 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
      >
        <!-- Header: Image and Basic details -->
        <div class="p-4 flex gap-4 items-start">
          <img
            :src="persona.fotos[0]"
            :alt="persona.nombre"
            loading="lazy"
            class="w-16 h-16 rounded-lg object-cover bg-brand-dark flex-shrink-0 border border-[#232F52]"
          />
          <div class="space-y-1 min-w-0">
            <h3 class="text-base font-bold text-brand-text truncate leading-tight">
              {{ persona.nombre }} {{ persona.apellido }}
            </h3>
            <div class="flex flex-wrap items-center gap-1.5">
              <span :class="getStatusBadgeClass(persona.estado)">
                {{ persona.estado }}
              </span>
              <span v-if="persona.edad" class="text-xs text-brand-muted bg-brand-dark px-1.5 py-0.5 rounded border border-[#232F52]">
                {{ persona.edad }} años
              </span>
              <span v-if="persona.es_menor_no_acompanado" class="text-[9px] bg-red-600/20 text-brand-red border border-red-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Menor No Acompañado
              </span>
            </div>
            <p v-if="persona.cedula" class="text-xs text-brand-muted">
              C.I. {{ persona.cedula }}
            </p>
            <p class="text-[10px] text-brand-muted">
              ID: <span class="font-mono text-brand-text">{{ persona.id.substring(0, 8) }}</span>
            </p>
          </div>
        </div>

        <!-- Sighting & Description -->
        <div class="px-4 pb-3 space-y-2 text-xs flex-1">
          <div class="bg-brand-dark/50 p-2.5 rounded-lg border border-[#232F52]/50 space-y-1">
            <span class="text-brand-muted font-semibold block text-[10px] uppercase tracking-wider">Último avistamiento</span>
            <p class="text-brand-text line-clamp-2">
              {{ persona.ultimo_avistamiento_direccion }}
            </p>
          </div>
          <p v-if="persona.descripcion_salud" class="text-brand-muted italic line-clamp-2">
            "{{ persona.descripcion_salud }}"
          </p>
        </div>

        <!-- Footer / Timeline Trigger -->
        <div class="px-4 py-3 bg-[#1B2749]/40 border-t border-[#232F52] flex items-center justify-between text-xs">
          <span class="text-brand-muted">
            Reportado: {{ formatDate(persona.created_at) }}
          </span>
          <button 
            @click="openDetails(persona)"
            class="text-brand-blue hover:text-blue-400 font-semibold flex items-center gap-1 transition-all"
          >
            Ver Historial
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Timeline Details Modal -->
    <div 
      v-if="selectedPersona" 
      class="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      @click.self="selectedPersona = null"
    >
      <div class="bg-[#161F38] border border-[#232F52] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <!-- Modal Header -->
        <div class="p-4 border-b border-[#232F52] flex items-center justify-between bg-[#1B2749]/30">
          <div class="flex items-center gap-3">
            <img 
              :src="selectedPersona.fotos[0]" 
              :alt="selectedPersona.nombre" 
              class="w-10 h-10 rounded-lg object-cover bg-brand-dark border border-[#232F52]"
            />
            <div>
              <h2 class="font-bold text-brand-text text-sm">
                {{ selectedPersona.nombre }} {{ selectedPersona.apellido }}
              </h2>
              <p class="text-[11px] text-brand-muted">
                C.I.: {{ selectedPersona.cedula || 'No especificada' }}
              </p>
            </div>
          </div>
          <button 
            @click="selectedPersona = null" 
            class="text-brand-muted hover:text-brand-text p-1 bg-brand-dark/40 rounded-full border border-[#232F52]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto space-y-5 text-sm">
          <!-- Status Banner -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-brand-dark/40 border border-[#232F52]">
            <span class="text-xs text-brand-muted font-medium">Estado Actual:</span>
            <div class="flex gap-2">
              <span v-if="selectedPersona.es_menor_no_acompanado" class="bg-red-600/20 text-brand-red border border-red-500/30 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Menor No Acompañado
              </span>
              <span :class="getStatusBadgeClass(selectedPersona.estado)">
                {{ selectedPersona.estado }}
              </span>
            </div>
          </div>

          <!-- Basic Metadata -->
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-brand-muted block">Edad:</span>
              <span class="text-brand-text font-medium">{{ selectedPersona.edad ? `${selectedPersona.edad} años` : 'Desconocida' }}</span>
            </div>
            <div>
              <span class="text-brand-muted block">Fecha de Registro:</span>
              <span class="text-brand-text font-medium">{{ formatDate(selectedPersona.created_at) }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-brand-muted block">Dirección de Avistamiento:</span>
              <span class="text-brand-text font-medium">{{ selectedPersona.ultimo_avistamiento_direccion }}</span>
            </div>
            <div v-if="selectedPersona.ultimo_avistamiento_lat" class="col-span-2 flex gap-4">
              <div>
                <span class="text-brand-muted block">Latitud:</span>
                <span class="text-brand-text font-mono">{{ selectedPersona.ultimo_avistamiento_lat.toFixed(6) }}</span>
              </div>
              <div>
                <span class="text-brand-muted block">Longitud:</span>
                <span class="text-brand-text font-mono">{{ selectedPersona.ultimo_avistamiento_lng?.toFixed(6) }}</span>
              </div>
            </div>
            <div class="col-span-2" v-if="selectedPersona.descripcion_salud">
              <span class="text-brand-muted block">Observaciones médicas/físicas:</span>
              <span class="text-brand-text italic">{{ selectedPersona.descripcion_salud }}</span>
            </div>
          </div>

          <!-- Contacto del Reportante (Oculto parcialmente para privacidad pública, o visible para rescate) -->
          <div class="bg-blue-950/20 border border-blue-900/40 p-3 rounded-xl space-y-1">
            <span class="text-brand-blue font-bold text-xs uppercase tracking-wider block">Contacto de Familia/Reportante</span>
            <div class="text-xs space-y-0.5">
              <p><span class="text-brand-muted">Nombre:</span> {{ selectedPersona.reportante.nombre }} ({{ selectedPersona.reportante.parentesco }})</p>
              <p><span class="text-brand-muted">Teléfono:</span> {{ selectedPersona.reportante.telefono }}</p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-[#232F52] pb-1.5">
              Historial de Actualizaciones (Línea de Tiempo)
            </h4>

            <div class="relative pl-5 border-l-2 border-[#232F52] space-y-4">
              <!-- Initial Report -->
              <div class="relative">
                <span class="absolute -left-[26px] top-0 w-3 h-3 rounded-full bg-brand-blue border-2 border-[#161F38]"></span>
                <div class="text-xs">
                  <p class="font-bold text-brand-text">Caso reportado inicialmente</p>
                  <p class="text-brand-muted text-[10px]">{{ formatDate(selectedPersona.created_at) }}</p>
                  <p class="text-brand-muted mt-1">Registrado por el reportante con el estado <span class="text-red-400 font-semibold">DESAPARECIDO</span>.</p>
                </div>
              </div>

              <!-- State Changes -->
              <div 
                v-for="hist in selectedPersona.historial_estados" 
                :key="hist.id" 
                class="relative"
              >
                <span 
                  :class="[
                    'absolute -left-[26px] top-0 w-3 h-3 rounded-full border-2 border-[#161F38]',
                    hist.estado_nuevo === 'RESCATADO' ? 'bg-emerald-500' :
                    hist.estado_nuevo === 'UBICADO' ? 'bg-cyan-500' :
                    hist.estado_nuevo === 'FALLECIDO' ? 'bg-zinc-500' : 'bg-red-500'
                  ]"
                ></span>
                <div class="text-xs">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-bold text-brand-text">Estado cambiado a {{ hist.estado_nuevo }}</span>
                    <span class="text-[10px] bg-brand-dark px-1.5 py-0.5 border border-[#232F52] rounded text-brand-muted font-mono">
                      {{ hist.fuente }}
                    </span>
                  </div>
                  <p class="text-brand-muted text-[10px]">{{ formatDate(hist.created_at) }}</p>
                  <p v-if="hist.motivo" class="text-brand-text/90 mt-1 bg-brand-dark/30 p-2 rounded border border-[#232F52]/30 italic">
                    "{{ hist.motivo }}"
                  </p>
                  <p class="text-brand-muted mt-1 text-[10px]">
                    Autorizado por: <span class="text-brand-text">{{ hist.autor_nombre }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-3 border-t border-[#232F52] bg-brand-dark/30 flex justify-end">
          <button 
            @click="selectedPersona = null" 
            class="px-4 py-1.5 text-xs font-semibold text-brand-text hover:bg-[#1E293B] border border-[#232F52] rounded-lg transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiService, type PersonaAfectada } from '../services/api';

const personas = ref<PersonaAfectada[]>([]);
const searchQuery = ref('');
const statusFilter = ref<'ALL' | PersonaAfectada['estado']>('ALL');
const showOnlyMenores = ref(false);
const selectedPersona = ref<PersonaAfectada | null>(null);

// Fetch data from local storage
const loadData = async () => {
  personas.value = await apiService.getPersonas();
};

onMounted(() => {
  loadData();
  // Listen for changes emitted by other components
  window.addEventListener('sismoalerta-data-updated', loadData);
});

onUnmounted(() => {
  window.removeEventListener('sismoalerta-data-updated', loadData);
});

// Clear query and filter
const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'ALL';
  showOnlyMenores.value = false;
};

// Filter personas based on search query and status filter
const filteredPersonas = computed(() => {
  return personas.value.filter(p => {
    // Status Filter
    if (statusFilter.value !== 'ALL' && p.estado !== statusFilter.value) {
      return false;
    }

    // Unaccompanied minors filter
    if (showOnlyMenores.value && !p.es_menor_no_acompanado) {
      return false;
    }

    // Search query filter
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = p.nombre.toLowerCase().includes(q);
      const matchApellido = p.apellido.toLowerCase().includes(q);
      const matchCedula = p.cedula ? p.cedula.toLowerCase().includes(q) : false;
      const matchId = p.id.toLowerCase().includes(q);
      const matchDireccion = p.ultimo_avistamiento_direccion.toLowerCase().includes(q);
      
      if (!matchName && !matchApellido && !matchCedula && !matchId && !matchDireccion) {
        return false;
      }
    }

    return true;
  });
});

// Count status for badge displays
const getCount = (status: PersonaAfectada['estado']) => {
  return personas.value.filter(p => p.estado === status).length;
};

const getMenoresCount = () => {
  return personas.value.filter(p => p.es_menor_no_acompanado).length;
};

const toggleMenoresFilter = () => {
  showOnlyMenores.value = !showOnlyMenores.value;
};

// Open details popup
const openDetails = (persona: PersonaAfectada) => {
  selectedPersona.value = persona;
};

// Status CSS helpers
const getStatusBadgeClass = (status: PersonaAfectada['estado']) => {
  switch (status) {
    case 'DESAPARECIDO':
      return 'bg-red-950/40 text-red-400 border border-red-800/80 px-2 py-0.5 rounded-full text-xs font-semibold';
    case 'RESCATADO':
      return 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full text-xs font-semibold';
    case 'UBICADO':
      return 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded-full text-xs font-semibold';
    case 'FALLECIDO':
      return 'bg-zinc-950/40 text-zinc-400 border border-zinc-800/80 px-2 py-0.5 rounded-full text-xs font-semibold';
    default:
      return 'bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold';
  }
};

// Date Formatter
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
