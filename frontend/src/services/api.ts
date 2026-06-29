export interface Reportante {
  nombre: string;
  telefono: string;
  parentesco: string;
}

export interface HistorialEstado {
  id: string;
  persona_id: string;
  estado_anterior: string | null;
  estado_nuevo: string;
  fuente: string;
  motivo?: string;
  autor_id?: string;
  autor_nombre: string;
  created_at: string;
}

export interface PersonaAfectada {
  id: string;
  cedula?: string;
  nombre: string;
  apellido: string;
  edad?: number;
  ultimo_avistamiento_lat?: number;
  ultimo_avistamiento_lng?: number;
  ultimo_avistamiento_direccion: string;
  estado: 'DESAPARECIDO' | 'RESCATADO' | 'UBICADO' | 'FALLECIDO';
  descripcion_salud?: string;
  fotos: string[];
  created_at: string;
  updated_at: string;
  reportante: Reportante;
  historial_estados?: HistorialEstado[];
}

const INITIAL_MOCK_DATA: PersonaAfectada[] = [];

export const apiService = {
  getPersonas(): PersonaAfectada[] {
    const data = localStorage.getItem('sismoalerta_personas');
    if (!data) {
      localStorage.setItem('sismoalerta_personas', JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      localStorage.setItem('sismoalerta_personas', JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
  },

  savePersonas(personas: PersonaAfectada[]) {
    localStorage.setItem('sismoalerta_personas', JSON.stringify(personas));
    // Dispatch a custom event so other components know data changed
    window.dispatchEvent(new Event('sismoalerta-data-updated'));
  },

  createPersona(personaData: Omit<PersonaAfectada, 'id' | 'created_at' | 'updated_at'>): PersonaAfectada {
    const personas = this.getPersonas();
    const newPersona: PersonaAfectada = {
      ...personaData,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      fotos: personaData.fotos && personaData.fotos.length > 0 && personaData.fotos[0]
        ? personaData.fotos
        : [`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(personaData.nombre + ' ' + personaData.apellido)}`]
    };
    personas.unshift(newPersona);
    this.savePersonas(personas);
    return newPersona;
  },

  updatePersonaEstado(
    id: string,
    newEstado: PersonaAfectada['estado'],
    fuente: string,
    motivo: string,
    autorNombre: string,
    autorId?: string
  ): PersonaAfectada | null {
    const personas = this.getPersonas();
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return null;

    const persona = personas[index];
    const estadoAnterior = persona.estado;
    persona.estado = newEstado;
    persona.updated_at = new Date().toISOString();

    if (!persona.historial_estados) {
      persona.historial_estados = [];
    }

    const hist: HistorialEstado = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      persona_id: id,
      estado_anterior: estadoAnterior,
      estado_nuevo: newEstado,
      fuente,
      motivo,
      autor_id: autorId,
      autor_nombre: autorNombre,
      created_at: new Date().toISOString()
    };

    persona.historial_estados.push(hist);
    personas[index] = persona;
    this.savePersonas(personas);
    return persona;
  }
};
