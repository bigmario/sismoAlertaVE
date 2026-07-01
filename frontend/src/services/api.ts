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
  es_menor_no_acompanado?: boolean;
}

const BASE_URL = 'http://localhost:3000/api/v1';

export const apiService = {
  async getPersonas(): Promise<PersonaAfectada[]> {
    try {
      const response = await fetch(`${BASE_URL}/afectados?limit=100`);
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createPersona(personaData: Omit<PersonaAfectada, 'id' | 'created_at' | 'updated_at'>): Promise<PersonaAfectada> {
    const response = await fetch(`${BASE_URL}/afectados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personaData),
    });
    if (!response.ok) throw new Error('Error al crear persona');
    const newPersona = await response.json();
    window.dispatchEvent(new Event('sismoalerta-data-updated'));
    return newPersona;
  },

  async updatePersonaEstado(
    id: string,
    newEstado: PersonaAfectada['estado'],
    fuente: string,
    motivo: string,
    autorNombre: string,
    autorId?: string
  ): Promise<PersonaAfectada | null> {
    const response = await fetch(`${BASE_URL}/afectados/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: newEstado,
        fuente,
        motivo,
        autor_nombre: autorNombre,
        autor_id: autorId
      }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
    const updatedPersona = await response.json();
    window.dispatchEvent(new Event('sismoalerta-data-updated'));
    return updatedPersona;
  },

  async updateMenorNoAcompanado(id: string, es_menor_no_acompanado: boolean): Promise<PersonaAfectada | null> {
    const response = await fetch(`${BASE_URL}/afectados/${id}/menor-no-acompanado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ es_menor_no_acompanado }),
    });
    if (!response.ok) throw new Error('Error al actualizar menor no acompañado');
    const updatedPersona = await response.json();
    window.dispatchEvent(new Event('sismoalerta-data-updated'));
    return updatedPersona;
  }
};
