<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Rescuer Login Screen (Simulated Auth) -->
    <div v-if="!isAuthenticated" class="bg-[#161F38] border border-[#232F52] p-8 rounded-xl shadow-lg max-w-md mx-auto space-y-5">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center p-3 rounded-full bg-brand-amber/10 border border-brand-amber/40 text-brand-amber">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-brand-text">Panel del Rescatista</h2>
        <p class="text-xs text-brand-muted">Acceso exclusivo para personal de Protección Civil, Bomberos y organizaciones autorizadas.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1">Correo Institucional</label>
          <input
            v-model="loginForm.email"
            type="email"
            class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-amber text-sm transition-all"
            placeholder="rescatista@proteccioncivil.gob.ve"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1">Clave de Acceso</label>
          <input
            v-model="loginForm.password"
            type="password"
            class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-amber text-sm transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="loginError" class="text-xs text-brand-red font-medium">
          {{ loginError }}
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-brand-amber hover:bg-amber-600 text-brand-dark text-sm font-bold rounded-lg shadow transition-all"
        >
          Iniciar Sesión
        </button>

        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-[#232F52]"></div>
          <span class="flex-shrink mx-4 text-brand-muted text-[10px] uppercase font-bold">Modo de Demostración</span>
          <div class="flex-grow border-t border-[#232F52]"></div>
        </div>

        <button
          type="button"
          @click="loginDemo"
          class="w-full py-2 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/40 text-xs font-semibold rounded-lg transition-all"
        >
          Acceso Rápido Demo (1-Click)
        </button>
      </form>
    </div>

    <!-- Authenticated Panel -->
    <div v-else class="space-y-6">
      <!-- Rescuer Profile Header -->
      <div class="bg-[#161F38] border border-[#232F52] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-brand-amber/10 text-brand-amber flex items-center justify-center font-bold border border-brand-amber/40">
            {{ activeRescuer.nombre.substring(0,2).toUpperCase() }}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-brand-text text-sm">{{ activeRescuer.nombre }}</h3>
              <span class="text-[10px] bg-brand-amber/20 text-brand-amber px-2 py-0.5 rounded-full border border-brand-amber/40 font-semibold uppercase">
                {{ activeRescuer.organizacion }}
              </span>
            </div>
            <p class="text-[11px] text-brand-muted">Rol: {{ activeRescuer.rol }} | email: {{ activeRescuer.email }}</p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="text-xs font-semibold text-brand-red border border-brand-red/30 hover:bg-brand-red/10 px-3 py-1.5 rounded-lg transition-all self-end sm:self-auto"
        >
          Cerrar Sesión
        </button>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Cases List column (Left) -->
        <div class="md:col-span-7 space-y-4">
          <div class="bg-[#161F38] border border-[#232F52] p-4 rounded-xl space-y-3">
            <h2 class="text-sm font-bold text-brand-text flex items-center justify-between">
              <span>Directorio de Casos Activos</span>
              <span class="text-xs font-normal text-brand-muted">Seleccione un caso para actualizar</span>
            </h2>
            
            <!-- Quick search inside rescuer panel -->
            <input
              v-model="panelSearchQuery"
              type="text"
              placeholder="Filtro rápido por nombre o cédula..."
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
            />
          </div>

          <!-- List -->
          <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <div 
              v-for="persona in filteredPersonas" 
              :key="persona.id"
              @click="selectCase(persona)"
              :class="[
                'p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                selectedCase?.id === persona.id 
                  ? 'bg-[#1F2E59] border-brand-blue shadow-lg' 
                  : 'bg-[#161F38] border-[#232F52] hover:border-[#33477C]'
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img 
                  :src="persona.fotos[0]" 
                  class="w-10 h-10 rounded-lg object-cover bg-brand-dark flex-shrink-0"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <h4 class="font-bold text-brand-text text-xs truncate flex items-center gap-1.5">
                    {{ persona.nombre }} {{ persona.apellido }}
                    <span v-if="persona.es_menor_no_acompanado" class="text-[8px] bg-red-600/20 text-brand-red border border-red-500/30 px-1 rounded font-bold uppercase tracking-wider">
                      🧒 Solo
                    </span>
                  </h4>
                  <p class="text-[10px] text-brand-muted">C.I. {{ persona.cedula || 'Sin Cédula' }} | ID: {{ persona.id.substring(0,8) }}</p>
                  <p class="text-[10px] text-brand-muted truncate">{{ persona.ultimo_avistamiento_direccion }}</p>
                </div>
              </div>
              <div class="flex-shrink-0 flex flex-col items-end gap-1">
                <span :class="getStatusBadgeClass(persona.estado)">
                  {{ persona.estado }}
                </span>
                <span class="text-[9px] text-[#7E8B9B]">{{ formatTimeAgo(persona.updated_at) }}</span>
              </div>
            </div>

            <!-- List empty state -->
            <div v-if="filteredPersonas.length === 0" class="bg-[#161F38] border border-[#232F52] p-8 rounded-xl text-center text-xs text-brand-muted">
              No hay personas que coincidan con la búsqueda.
            </div>
          </div>
        </div>

        <!-- Case Action Panel (Right) - Transition State in 2 clicks -->
        <div class="md:col-span-5 space-y-4">
          <div class="bg-[#161F38] border border-[#232F52] p-5 rounded-xl space-y-5 sticky top-4">
            <h2 class="text-sm font-bold text-brand-text border-b border-[#232F52] pb-2">⚡ Actualización de Estado (2 Clicks)</h2>

            <div v-if="!selectedCase" class="text-center py-12 space-y-3">
              <svg class="mx-auto h-8 w-8 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p class="text-xs text-brand-muted max-w-[220px] mx-auto">
                Seleccione una persona afectada del listado izquierdo para iniciar la actualización rápida.
              </p>
            </div>

            <!-- Active Selection Action Sheet -->
            <div v-else class="space-y-4">
              <!-- Selected Target Summary -->
              <div class="bg-brand-dark p-3 rounded-lg border border-[#232F52] flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img :src="selectedCase.fotos[0]" class="w-10 h-10 rounded-lg object-cover" />
                  <div class="min-w-0">
                    <span class="text-[10px] text-brand-muted uppercase font-bold block">Modificando registro de</span>
                    <span class="font-bold text-brand-text text-xs block truncate">{{ selectedCase.nombre }} {{ selectedCase.apellido }}</span>
                    <span class="text-[10px] text-brand-muted">Estado actual: <strong class="text-brand-text">{{ selectedCase.estado }}</strong></span>
                  </div>
                </div>
                <!-- Checkbox to toggle es_menor_no_acompanado -->
                <div class="flex items-center gap-1.5 p-2 bg-[#1A121F] rounded-lg border border-brand-red/30 flex-shrink-0">
                  <input
                    type="checkbox"
                    v-model="selectedCase.es_menor_no_acompanado"
                    @change="toggleMenorFlagInDB"
                    class="w-3.5 h-3.5 rounded text-brand-red bg-[#0A0F1D] border-[#2A3B66] focus:ring-brand-red focus:ring-opacity-50 cursor-pointer"
                  />
                  <span class="text-[9px] font-bold text-brand-red uppercase tracking-wide">🧒 Solo</span>
                </div>
              </div>

              <!-- Click 1 / State Selection -->
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-brand-text">Paso 1: Seleccione Nuevo Estado</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="st in ['DESAPARECIDO', 'UBICADO', 'RESCATADO', 'FALLECIDO'] as const"
                    :key="st"
                    type="button"
                    @click="setTargetStatus(st)"
                    :class="[
                      'py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1',
                      targetStatus === st
                        ? getSelectedStatusStyle(st)
                        : 'bg-[#0A0F1D] text-brand-muted border-transparent hover:border-[#2A3B66]'
                    ]"
                  >
                    <span :class="['w-2 h-2 rounded-full', getStatusDotColor(st)]"></span>
                    {{ st }}
                  </button>
                </div>
              </div>

              <!-- Click 2 / Quick motive template & confirmation -->
              <div class="space-y-3 pt-2 border-t border-[#232F52]">
                <label class="block text-xs font-semibold text-brand-text">Paso 2: Razón del Cambio</label>
                
                <!-- Quick templates (saves typing on phone!) -->
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="tmpl in getReasonTemplates(targetStatus)"
                    :key="tmpl"
                    type="button"
                    @click="quickReason = tmpl"
                    :class="[
                      'px-2.5 py-1 rounded text-[10px] transition-all border max-w-full truncate',
                      quickReason === tmpl
                        ? 'bg-[#1E293B] text-brand-text border-slate-600'
                        : 'bg-brand-dark text-brand-muted border-transparent hover:bg-brand-dark/80 hover:text-brand-text'
                    ]"
                  >
                    {{ tmpl }}
                  </button>
                </div>

                <!-- Custom reason text box -->
                <textarea
                  v-model="quickReason"
                  rows="2"
                  class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs resize-none"
                  placeholder="Detalle el motivo o edite el texto de arriba..."
                ></textarea>

                <div v-if="actionError" class="text-xs text-brand-red font-medium">
                  {{ actionError }}
                </div>

                <!-- Confirm Action button -->
                <button
                  @click="confirmTransition"
                  :disabled="!targetStatus || !quickReason.trim()"
                  class="w-full py-2.5 bg-brand-green hover:bg-emerald-600 text-brand-dark text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Confirmar Actualización de Estado
                </button>
              </div>

              <!-- Reset current select -->
              <button 
                @click="cancelSelection"
                class="w-full text-center text-xs text-brand-muted hover:text-brand-text mt-1"
              >
                Cancelar Edición
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiService, type PersonaAfectada } from '../services/api';

// Authenticated rescuer information
interface Rescuer {
  id: string;
  nombre: string;
  email: string;
  organizacion: string;
  rol: string;
}

const isAuthenticated = ref(false);
const loginForm = ref({ email: '', password: '' });
const loginError = ref('');
const activeRescuer = ref<Rescuer>({ id: '', nombre: '', email: '', organizacion: '', rol: '' });

// State for active panel
const personas = ref<PersonaAfectada[]>([]);
const panelSearchQuery = ref('');
const selectedCase = ref<PersonaAfectada | null>(null);

// Form updates
const targetStatus = ref<PersonaAfectada['estado'] | ''>('');
const quickReason = ref('');
const actionError = ref('');

// Load active cases
const loadData = () => {
  personas.value = apiService.getPersonas();
  // Keep the selected case reference updated
  if (selectedCase.value) {
    const updated = personas.value.find(p => p.id === selectedCase.value!.id);
    selectedCase.value = updated || null;
  }
};

onMounted(() => {
  // Check if session stored in localStorage
  const savedSession = localStorage.getItem('sismoalerta_rescuer_session');
  if (savedSession) {
    activeRescuer.value = JSON.parse(savedSession);
    isAuthenticated.value = true;
  }
  loadData();
  window.addEventListener('sismoalerta-data-updated', loadData);
});

onUnmounted(() => {
  window.removeEventListener('sismoalerta-data-updated', loadData);
});

// Login Handlers
const handleLogin = () => {
  loginError.value = '';
  // Hardcoded check for standard credentials
  if (loginForm.value.email === 'bombero@sismoalerta.ve' && loginForm.value.password === 'VE2026') {
    activeRescuer.value = {
      id: "resc_1",
      nombre: "Sgto. José Valero",
      email: loginForm.value.email,
      organizacion: "Bomberos de Distrito Capital",
      rol: "Comandante de Incidentes"
    };
    saveSession();
  } else if (loginForm.value.email === 'pc@sismoalerta.ve' && loginForm.value.password === 'VE2026') {
    activeRescuer.value = {
      id: "resc_2",
      nombre: "Lic. Yusmary Lugo",
      email: loginForm.value.email,
      organizacion: "Protección Civil Nacional",
      rol: "Coordinador de Albergues"
    };
    saveSession();
  } else {
    loginError.value = 'Credenciales institucionales incorrectas. Use la demo para pruebas.';
  }
};

const loginDemo = () => {
  activeRescuer.value = {
    id: "demo_1",
    nombre: "Ofic. Carlos Mendoza (PC)",
    email: "carlos.mendoza@proteccioncivil.gob.ve",
    organizacion: "Protección Civil Miranda",
    rol: "Paramédico / Rescatista"
  };
  saveSession();
};

const saveSession = () => {
  localStorage.setItem('sismoalerta_rescuer_session', JSON.stringify(activeRescuer.value));
  isAuthenticated.value = true;
  loginForm.value = { email: '', password: '' };
};

const handleLogout = () => {
  localStorage.removeItem('sismoalerta_rescuer_session');
  isAuthenticated.value = false;
  selectedCase.value = null;
};

// Filtered personas
const filteredPersonas = computed(() => {
  if (!panelSearchQuery.value.trim()) return personas.value;
  const q = panelSearchQuery.value.toLowerCase().trim();
  return personas.value.filter(p => 
    p.nombre.toLowerCase().includes(q) || 
    p.apellido.toLowerCase().includes(q) || 
    (p.cedula ? p.cedula.toLowerCase().includes(q) : false) ||
    p.id.toLowerCase().includes(q)
  );
});

// Selection actions
const selectCase = (persona: PersonaAfectada) => {
  selectedCase.value = persona;
  targetStatus.value = persona.estado;
  // Pre-fill reason with first template
  const tmpls = getReasonTemplates(persona.estado);
  quickReason.value = tmpls[0] || '';
  actionError.value = '';
};

const toggleMenorFlagInDB = () => {
  if (!selectedCase.value) return;
  const list = apiService.getPersonas();
  const index = list.findIndex(p => p.id === selectedCase.value!.id);
  if (index !== -1) {
    list[index].es_menor_no_acompanado = selectedCase.value!.es_menor_no_acompanado;
    list[index].updated_at = new Date().toISOString();
    apiService.savePersonas(list);
  }
};

const cancelSelection = () => {
  selectedCase.value = null;
  targetStatus.value = '';
  quickReason.value = '';
  actionError.value = '';
};

const setTargetStatus = (status: PersonaAfectada['estado']) => {
  targetStatus.value = status;
  // auto-assign first template when status changes
  const tmpls = getReasonTemplates(status);
  quickReason.value = tmpls[0] || '';
};

// Confirm state transition
const confirmTransition = () => {
  if (!selectedCase.value || !targetStatus.value) return;
  if (!quickReason.value.trim()) {
    actionError.value = 'Debe indicar la justificación o motivo del cambio.';
    return;
  }

  const updated = apiService.updatePersonaEstado(
    selectedCase.value.id,
    targetStatus.value,
    "Reporte de Campo PC/Bomberos",
    quickReason.value.trim(),
    activeRescuer.value.nombre,
    activeRescuer.value.id
  );

  if (updated) {
    // Clear selection or update
    cancelSelection();
    loadData();
  } else {
    actionError.value = 'Ocurrió un error al guardar el cambio en el almacén de datos.';
  }
};

// Quick Reason Templates
const getReasonTemplates = (status: PersonaAfectada['estado'] | '') => {
  switch (status) {
    case 'DESAPARECIDO':
      return [
        'Reporte inicial sin novedades de avistamiento.',
        'Se confirma pérdida de contacto telefónico y visual tras el sismo.',
        'Denuncia formal ratificada por familiares en el cuadrante de paz.'
      ];
    case 'UBICADO':
      return [
        'Encontrado ileso refugiado en la escuela local.',
        'Establecido contacto visual y telefónico, se encuentra a salvo con familiares.',
        'Ubicado refugiado en el Polideportivo central de contingencia.'
      ];
    case 'RESCATADO':
      return [
        'Evacuado con éxito de estructura colapsada por equipo de rescate.',
        'Trasladado a centro hospitalario por heridas leves, estable.',
        'Rescatado de zona de inundación/deslave y atendido por paramédicos.'
      ];
    case 'FALLECIDO':
      return [
        'Cuerpo recuperado y verificado por patología forense local.',
        'Confirmado fallecimiento por trauma contuso severo en el siniestro.',
        'Deceso ratificado por personal de salud en sitio del colapso.'
      ];
    default:
      return [];
  }
};

// CSS Badge & Dots helpers
const getStatusBadgeClass = (status: PersonaAfectada['estado']) => {
  switch (status) {
    case 'DESAPARECIDO': return 'bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5 rounded text-[10px] font-semibold';
    case 'RESCATADO': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded text-[10px] font-semibold';
    case 'UBICADO': return 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40 px-2 py-0.5 rounded text-[10px] font-semibold';
    case 'FALLECIDO': return 'bg-zinc-950 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-semibold';
  }
};

const getStatusDotColor = (status: PersonaAfectada['estado']) => {
  switch (status) {
    case 'DESAPARECIDO': return 'bg-red-500 animate-ping';
    case 'RESCATADO': return 'bg-emerald-500';
    case 'UBICADO': return 'bg-cyan-500';
    case 'FALLECIDO': return 'bg-zinc-500';
  }
};

const getSelectedStatusStyle = (status: PersonaAfectada['estado']) => {
  switch (status) {
    case 'DESAPARECIDO': return 'bg-red-950/70 border-red-500 text-red-300';
    case 'RESCATADO': return 'bg-emerald-950/70 border-emerald-500 text-emerald-300';
    case 'UBICADO': return 'bg-cyan-950/70 border-cyan-500 text-cyan-300';
    case 'FALLECIDO': return 'bg-zinc-800 border-zinc-500 text-zinc-300';
  }
};

// Relative date formatter
const formatTimeAgo = (isoString: string) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return new Date(isoString).toLocaleDateString('es-VE');
};
</script>
