import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoPersona } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async registrarCambio(data: {
    personaId: string;
    estadoAnterior: EstadoPersona | null;
    estadoNuevo: EstadoPersona;
    fuente: string;
    motivo?: string;
    autorId?: string;
    autorNombre: string;
  }) {
    return this.prisma.historialEstado.create({
      data: {
        persona_id: data.personaId,
        estado_anterior: data.estadoAnterior,
        estado_nuevo: data.estadoNuevo,
        fuente: data.fuente,
        motivo: data.motivo,
        autor_id: data.autorId,
        autor_nombre: data.autorNombre,
      },
    });
  }
}
