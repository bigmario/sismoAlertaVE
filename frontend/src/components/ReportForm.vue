<template>
  <div class="bg-[#161F38] border border-[#232F52] p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
    <!-- Success Screen -->
    <div v-if="submitted && createdRecord" class="text-center py-8 space-y-4">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-950/60 border border-emerald-500">
        <svg class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-brand-text">¡Reporte Registrado con Éxito!</h3>
      <p class="text-sm text-brand-muted max-w-md mx-auto">
        El registro para <strong class="text-brand-text">{{ createdRecord.nombre }} {{ createdRecord.apellido }}</strong> ha sido guardado. 
        El ID de seguimiento es:
      </p>
      <div class="bg-brand-dark px-4 py-2.5 rounded-lg border border-[#232F52] inline-block font-mono text-sm text-brand-blue">
        {{ createdRecord.id }}
      </div>
      <p class="text-xs text-brand-muted">
        Guarda este ID para buscar el estado o para que los rescatistas puedan actualizarlo.
      </p>
      <div class="pt-4">
        <button
          @click="resetForm"
          class="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-brand-text text-sm font-semibold rounded-lg shadow transition-all"
        >
          Reportar otra persona
        </button>
      </div>
    </div>

    <!-- Active Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-brand-text border-b border-[#232F52] pb-2">🚨 Reportar Persona Desaparecida</h2>
        <p class="text-xs text-brand-muted mt-1">
          Por favor, ingrese la mayor cantidad de información verídica posible. Los rescatistas en el área usarán estos datos para labores de búsqueda.
        </p>
      </div>

      <!-- Sección 1: Datos del Afectado -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-brand-blue">1. Datos de la Persona Desaparecida</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nombre -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.nombre ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Ej. Juan Carlos"
            />
            <span v-if="errors.nombre" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.nombre }}</span>
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1">Apellido *</label>
            <input
              v-model="form.apellido"
              type="text"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.apellido ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Ej. Pérez Gómez"
            />
            <span v-if="errors.apellido" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.apellido }}</span>
          </div>

          <!-- Cédula -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1">Cédula (Opcional)</label>
            <input
              v-model="form.cedula"
              type="text"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.cedula ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Ej. 12345678"
            />
            <span v-if="errors.cedula" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.cedula }}</span>
          </div>

          <!-- Edad -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1">Edad aproximada</label>
            <input
              v-model.number="form.edad"
              type="number"
              min="0"
              max="120"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.edad ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Ej. 34"
            />
            <span v-if="errors.edad" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.edad }}</span>
          </div>
        </div>

        <!-- Checkbox Menor No Acompañado -->
        <div class="bg-brand-red/10 border border-brand-red/30 p-4 rounded-xl space-y-2">
          <label class="flex items-center gap-2.5 cursor-pointer">
            <input
              v-model="form.es_menor_no_acompanado"
              type="checkbox"
              class="w-4 h-4 rounded text-brand-red bg-[#0A0F1D] border-[#2A3B66] focus:ring-brand-red focus:ring-opacity-50"
            />
            <span class="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
              🧒 Menor de Edad No Acompañado (Niño/Niña Solo)
            </span>
          </label>
          <p class="text-[11px] text-brand-muted leading-relaxed">
            Marque esta casilla **únicamente** si el reporte corresponde a un niño, niña o adolescente localizado/rescatado solo, extraviado o separado de sus representantes legales en la zona de desastre. Esto activará una alerta prioritaria para facilitar su reunificación familiar.
          </p>
        </div>

        <!-- Dirección de Último Avistamiento -->
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1">Último Lugar de Avistamiento / Estado de Venezuela *</label>
          <div class="flex gap-2 mb-2">
            <select
              v-model="form.venezuelaState"
              class="bg-[#0A0F1D] text-brand-text border border-[#2A3B66] px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
            >
              <option value="" disabled>Seleccione Estado...</option>
              <option v-for="st in VENEZUELAN_STATES" :key="st" :value="st">{{ st }}</option>
            </select>
            <input
              v-model="form.ultimo_avistamiento_direccion"
              type="text"
              class="flex-1 bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.ultimo_avistamiento_direccion ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Dirección detallada, calle, refugio o punto de referencia..."
            />
          </div>
          <span v-if="errors.ultimo_avistamiento_direccion" class="text-[11px] text-brand-red mt-0.5 block">
            {{ errors.ultimo_avistamiento_direccion }}
          </span>
        </div>

        <!-- Coordenadas Geográficas (GPS) -->
        <div class="bg-brand-dark/40 border border-[#232F52] p-3 rounded-lg space-y-3">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span class="text-xs font-bold text-brand-text block">Coordenadas del Incidente (Opcional)</span>
              <span class="text-[10px] text-brand-muted block">Ayuda a ubicar en mapas interactivos de rescate.</span>
            </div>
            <button
              type="button"
              @click="getCurrentLocation"
              :disabled="loadingGPS"
              class="px-3 py-1.5 bg-[#1B2749] hover:bg-[#232F52] text-brand-text text-[11px] font-semibold rounded-md border border-[#2A3B66] flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <svg v-if="loadingGPS" class="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ gpsStatusText }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label class="text-brand-muted block mb-0.5">Latitud</label>
              <input
                v-model.number="form.ultimo_avistamiento_lat"
                type="number"
                step="any"
                class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-2.5 py-1.5 rounded border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="10.4806"
              />
            </div>
            <div>
              <label class="text-brand-muted block mb-0.5">Longitud</label>
              <input
                v-model.number="form.ultimo_avistamiento_lng"
                type="number"
                step="any"
                class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-2.5 py-1.5 rounded border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="-66.9036"
              />
            </div>
          </div>
        </div>

        <!-- Salud / Físico -->
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1">Descripción de Salud / Rasgos Físicos (Opcional)</label>
          <textarea
            v-model="form.descripcion_salud"
            rows="2"
            class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all resize-none"
            placeholder="Ej. Vestía franela roja, cicatriz en la ceja, requiere medicación diaria para la hipertensión."
          ></textarea>
        </div>

        <!-- Foto URL (Opcional) -->
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1">Enlace de Foto / Retrato (Opcional)</label>
          <input
            v-model="form.fotoUrl"
            type="url"
            class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border border-[#2A3B66] focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
            placeholder="https://ejemplo.com/foto.jpg"
          />
          <p class="text-[10px] text-brand-muted mt-0.5">Permite adjuntar una foto pública para facilitar el reconocimiento facial.</p>
        </div>
      </div>

      <!-- Sección 2: Datos del Reportante -->
      <div class="space-y-4 border-t border-[#232F52] pt-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-brand-amber">2. Datos de Contacto (Reportante)</h3>
        <p class="text-[11px] text-brand-muted">Su información personal se mantendrá confidencial y sólo se usará para confirmar hallazgos.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Nombre Reportante -->
          <div class="sm:col-span-1">
            <label class="block text-xs font-semibold text-brand-text mb-1">Nombre Completo *</label>
            <input
              v-model="form.reportante_nombre"
              type="text"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.reportante_nombre ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Tu nombre y apellido"
            />
            <span v-if="errors.reportante_nombre" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.reportante_nombre }}</span>
          </div>

          <!-- Teléfono Reportante -->
          <div class="sm:col-span-1">
            <label class="block text-xs font-semibold text-brand-text mb-1">Teléfono Móvil *</label>
            <input
              v-model="form.reportante_telefono"
              type="text"
              class="w-full bg-[#0A0F1D] text-brand-text placeholder-brand-muted px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.reportante_telefono ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
              placeholder="Ej. 0414-1234567"
            />
            <span v-if="errors.reportante_telefono" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.reportante_telefono }}</span>
          </div>

          <!-- Parentesco -->
          <div class="sm:col-span-1">
            <label class="block text-xs font-semibold text-brand-text mb-1">Parentesco / Relación *</label>
            <select
              v-model="form.reportante_parentesco"
              class="w-full bg-[#0A0F1D] text-brand-text px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm transition-all"
              :class="errors.reportante_parentesco ? 'border-brand-red focus:ring-brand-red' : 'border-[#2A3B66]'"
            >
              <option value="" disabled>Seleccione relación...</option>
              <option value="Madre/Padre">Madre/Padre</option>
              <option value="Hermano/a">Hermano/a</option>
              <option value="Hijo/a">Hijo/a</option>
              <option value="Tío/a">Tío/a</option>
              <option value="Cónyuge/Pareja">Cónyuge/Pareja</option>
              <option value="Amigo/a">Amigo/a</option>
              <option value="Vecino/a">Vecino/a</option>
              <option value="Rescatista">Rescatista de Campo</option>
              <option value="Otro">Otro</option>
            </select>
            <span v-if="errors.reportante_parentesco" class="text-[11px] text-brand-red mt-0.5 block">{{ errors.reportante_parentesco }}</span>
          </div>
        </div>
      </div>

      <!-- General Errors summary -->
      <div v-if="hasGeneralErrors" class="bg-red-950/40 border border-red-900/60 p-3 rounded-lg text-xs text-red-400">
        Por favor, corrija los campos marcados en rojo antes de enviar el reporte.
      </div>

      <!-- Submit buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-dark rounded-lg border border-[#232F52] transition-all"
        >
          Borrar todo
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-brand-red hover:bg-red-600 text-brand-text text-sm font-semibold rounded-lg shadow-lg border border-red-700/60 flex items-center gap-1.5 transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Registrar Reporte de Emergencia
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apiService, type PersonaAfectada } from '../services/api';

const VENEZUELAN_STATES = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
  'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
  'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas (La Guaira)',
  'Yaracuy', 'Zulia'
];

interface FormState {
  nombre: string;
  apellido: string;
  cedula: string;
  edad: number | '';
  venezuelaState: string;
  ultimo_avistamiento_direccion: string;
  ultimo_avistamiento_lat: number | '';
  ultimo_avistamiento_lng: number | '';
  descripcion_salud: string;
  fotoUrl: string;
  reportante_nombre: string;
  reportante_telefono: string;
  reportante_parentesco: string;
  es_menor_no_acompanado: boolean;
}

const initialForm = (): FormState => ({
  nombre: '',
  apellido: '',
  cedula: '',
  edad: '',
  venezuelaState: '',
  ultimo_avistamiento_direccion: '',
  ultimo_avistamiento_lat: '',
  ultimo_avistamiento_lng: '',
  descripcion_salud: '',
  fotoUrl: '',
  reportante_nombre: '',
  reportante_telefono: '',
  reportante_parentesco: '',
  es_menor_no_acompanado: false
});

const form = ref<FormState>(initialForm());
const errors = ref<Record<string, string>>({});
const submitted = ref(false);
const createdRecord = ref<PersonaAfectada | null>(null);

// Geolocation GPS state
const loadingGPS = ref(false);
const gpsStatusText = ref('Usar mi GPS');

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    gpsStatusText.value = 'GPS No Soportado';
    return;
  }

  loadingGPS.value = true;
  gpsStatusText.value = 'Obteniendo GPS...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.ultimo_avistamiento_lat = position.coords.latitude;
      form.value.ultimo_avistamiento_lng = position.coords.longitude;
      loadingGPS.value = false;
      gpsStatusText.value = 'GPS Obtenido ✔';
      setTimeout(() => {
        gpsStatusText.value = 'Usar mi GPS';
      }, 3000);
    },
    (err) => {
      console.warn('Geolocation error:', err);
      loadingGPS.value = false;
      gpsStatusText.value = 'Error al obtener';
      setTimeout(() => {
        gpsStatusText.value = 'Usar mi GPS';
      }, 3000);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

// Validations
const validate = (): boolean => {
  errors.value = {};

  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es obligatorio.';
  } else if (form.value.nombre.trim().length < 2) {
    errors.value.nombre = 'El nombre debe tener al menos 2 letras.';
  }

  if (!form.value.apellido.trim()) {
    errors.value.apellido = 'El apellido es obligatorio.';
  } else if (form.value.apellido.trim().length < 2) {
    errors.value.apellido = 'El apellido debe tener al menos 2 letras.';
  }

  if (form.value.cedula.trim()) {
    const numeric = /^[0-9]+$/;
    if (!numeric.test(form.value.cedula.trim())) {
      errors.value.cedula = 'La cédula debe contener solo números.';
    } else if (form.value.cedula.trim().length < 6 || form.value.cedula.trim().length > 9) {
      errors.value.cedula = 'Cédula inválida (debe tener entre 6 y 9 dígitos).';
    }
  }

  if (form.value.edad !== '') {
    if (form.value.edad < 0 || form.value.edad > 120) {
      errors.value.edad = 'Ingrese una edad válida (0-120).';
    }
  }

  if (!form.value.ultimo_avistamiento_direccion.trim()) {
    errors.value.ultimo_avistamiento_direccion = 'La descripción de la ubicación es obligatoria.';
  } else if (form.value.ultimo_avistamiento_direccion.trim().length < 5) {
    errors.value.ultimo_avistamiento_direccion = 'Proporcione una dirección más detallada (mínimo 5 letras).';
  }

  // Reportante Validations
  if (!form.value.reportante_nombre.trim()) {
    errors.value.reportante_nombre = 'Su nombre completo es obligatorio.';
  }

  if (!form.value.reportante_telefono.trim()) {
    errors.value.reportante_telefono = 'El teléfono es obligatorio.';
  } else {
    // Simple Venezuelan format validator: e.g. 04141234567 or 0414-1234567
    const cleanPhone = form.value.reportante_telefono.replace(/[-\s]/g, '');
    const phonePattern = /^(0414|0424|0412|0416|0426|02)[0-9]{7}$/;
    if (!phonePattern.test(cleanPhone)) {
      errors.value.reportante_telefono = 'Teléfono inválido (ej. 0414-1234567 o 04127654321).';
    }
  }

  if (!form.value.reportante_parentesco) {
    errors.value.reportante_parentesco = 'El parentesco es obligatorio.';
  }

  return Object.keys(errors.value).length === 0;
};

const hasGeneralErrors = computed(() => Object.keys(errors.value).length > 0);

// Form Submit Handler
const handleSubmit = () => {
  if (!validate()) {
    return;
  }

  // Combine Venezuelan state with detailed address
  const fullAddress = form.value.venezuelaState 
    ? `[${form.value.venezuelaState}] ${form.value.ultimo_avistamiento_direccion.trim()}`
    : form.value.ultimo_avistamiento_direccion.trim();

  const record = apiService.createPersona({
    cedula: form.value.cedula.trim() || undefined,
    nombre: form.value.nombre.trim(),
    apellido: form.value.apellido.trim(),
    edad: form.value.edad !== '' ? form.value.edad : undefined,
    ultimo_avistamiento_direccion: fullAddress,
    ultimo_avistamiento_lat: form.value.ultimo_avistamiento_lat !== '' ? form.value.ultimo_avistamiento_lat : undefined,
    ultimo_avistamiento_lng: form.value.ultimo_avistamiento_lng !== '' ? form.value.ultimo_avistamiento_lng : undefined,
    estado: 'DESAPARECIDO', // default state when first reported
    descripcion_salud: form.value.descripcion_salud.trim() || undefined,
    fotos: form.value.fotoUrl.trim() ? [form.value.fotoUrl.trim()] : [],
    es_menor_no_acompanado: form.value.es_menor_no_acompanado,
    reportante: {
      nombre: form.value.reportante_nombre.trim(),
      telefono: form.value.reportante_telefono.trim(),
      parentesco: form.value.reportante_parentesco
    }
  });

  createdRecord.value = record;
  submitted.value = true;
};

// Reset Form
const resetForm = () => {
  form.value = initialForm();
  errors.value = {};
  submitted.value = false;
  createdRecord.value = null;
};
</script>
