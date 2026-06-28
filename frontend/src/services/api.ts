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

const INITIAL_MOCK_DATA: PersonaAfectada[] = [
  {
    id: "1",
    cedula: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    edad: 34,
    ultimo_avistamiento_lat: 10.4806,
    ultimo_avistamiento_lng: -66.9036,
    ultimo_avistamiento_direccion: "Altamira, Caracas - Cerca de la plaza",
    estado: "DESAPARECIDO",
    descripcion_salud: "Sufre de asma, vestía camisa azul y jean.",
    fotos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    reportante: {
      nombre: "María Pérez",
      telefono: "0414-1234567",
      parentesco: "Hermana"
    },
    historial_estados: []
  },
  {
    id: "2",
    cedula: "20456789",
    nombre: "Yusnavy",
    apellido: "González",
    edad: 22,
    ultimo_avistamiento_lat: 10.2522,
    ultimo_avistamiento_lng: -67.6011,
    ultimo_avistamiento_direccion: "El Limón, Maracay - Av. Universidad",
    estado: "UBICADO",
    descripcion_salud: "Estable, sin heridas visibles. Encontrada en refugio temporal.",
    fotos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    reportante: {
      nombre: "Carlos González",
      telefono: "0424-7654321",
      parentesco: "Padre"
    },
    historial_estados: [
      {
        id: "h1",
        persona_id: "2",
        estado_anterior: "DESAPARECIDO",
        estado_nuevo: "UBICADO",
        fuente: "Rescatista de Campo",
        motivo: "Ubicada sana en el polideportivo El Limón",
        autor_nombre: "Protección Civil Aragua",
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: "3",
    cedula: "9876543",
    nombre: "Alejandro",
    apellido: "Rodríguez",
    edad: 45,
    ultimo_avistamiento_lat: 10.1667,
    ultimo_avistamiento_lng: -68.0000,
    ultimo_avistamiento_direccion: "Trigal Centro, Valencia",
    estado: "RESCATADO",
    descripcion_salud: "Fractura leve en brazo izquierdo, atendido en Cruz Roja.",
    fotos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"],
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    reportante: {
      nombre: "Ana Rodríguez",
      telefono: "0412-5555555",
      parentesco: "Esposa"
    },
    historial_estados: [
      {
        id: "h2",
        persona_id: "3",
        estado_anterior: "DESAPARECIDO",
        estado_nuevo: "RESCATADO",
        fuente: "Bomberos de Valencia",
        motivo: "Evacuado de estructura colapsada",
        autor_nombre: "Sgto. Luis Gómez",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]
  }
];

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
