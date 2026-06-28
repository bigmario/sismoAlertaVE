import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePersonaAfectadaDto } from './dto/create-persona.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { EstadoPersona, Prisma } from '@prisma/client';

@Injectable()
export class AfectadosService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(createDto: CreatePersonaAfectadaDto) {
    // 1. Crear el reportante
    const reportante = await this.prisma.reportante.create({
      data: {
        nombre: createDto.reportante.nombre,
        telefono: createDto.reportante.telefono,
        parentesco: createDto.reportante.parentesco,
      },
    });

    // 2. Crear la persona afectada
    const persona = await this.prisma.personaAfectada.create({
      data: {
        cedula: createDto.cedula,
        nombre: createDto.nombre,
        apellido: createDto.apellido,
        edad: createDto.edad,
        ultimo_avistamiento_lat: createDto.ultimo_avistamiento_lat,
        ultimo_avistamiento_lng: createDto.ultimo_avistamiento_lng,
        ultimo_avistamiento_direccion: createDto.ultimo_avistamiento_direccion,
        descripcion_salud: createDto.descripcion_salud,
        fotos: createDto.fotos || [],
        estado: EstadoPersona.DESAPARECIDO, // Por defecto se registra como desaparecido
        reportante_id: reportante.id,
      },
    });

    // 3. Registrar el estado inicial en la auditoría
    await this.auditService.registrarCambio({
      personaId: persona.id,
      estadoAnterior: null,
      estadoNuevo: EstadoPersona.DESAPARECIDO,
      fuente: 'Formulario Ciudadano de Reporte',
      motivo: 'Registro inicial de la persona afectada',
      autorNombre: reportante.nombre,
    });

    return this.findOne(persona.id);
  }

  async search(searchDto: SearchQueryDto) {
    const { q, estado, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const where: Prisma.PersonaAfectadaWhereInput = {
      is_active: true,
    };

    if (estado) {
      where.estado = estado;
    }

    if (q) {
      const cleanQuery = q.trim();
      where.OR = [
        { nombre: { contains: cleanQuery, mode: 'insensitive' } },
        { apellido: { contains: cleanQuery, mode: 'insensitive' } },
        { cedula: { contains: cleanQuery, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.personaAfectada.count({ where }),
      this.prisma.personaAfectada.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          reportante: {
            select: {
              nombre: true,
              telefono: true,
              parentesco: true,
            },
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const persona = await this.prisma.personaAfectada.findFirst({
      where: { id, is_active: true },
      include: {
        reportante: true,
        historial_estados: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!persona) {
      throw new NotFoundException(`Persona afectada con ID ${id} no encontrada`);
    }

    return persona;
  }

  async updateEstado(
    id: string,
    updateEstadoDto: UpdateEstadoDto,
    authUserId?: string,
  ) {
    const persona = await this.findOne(id);

    if (persona.estado === updateEstadoDto.estado) {
      return persona; // No hay cambio
    }

    // Actualizar el estado de la persona
    const personaActualizada = await this.prisma.personaAfectada.update({
      where: { id },
      data: { estado: updateEstadoDto.estado },
    });

    // Registrar en auditoría
    await this.auditService.registrarCambio({
      personaId: id,
      estadoAnterior: persona.estado,
      estadoNuevo: updateEstadoDto.estado,
      fuente: updateEstadoDto.fuente,
      motivo: updateEstadoDto.motivo,
      autorId: authUserId,
      autorNombre: updateEstadoDto.autor_nombre,
    });

    return this.findOne(id);
  }

  async deactivate(id: string) {
    const persona = await this.findOne(id);
    await this.prisma.personaAfectada.update({
      where: { id },
      data: { is_active: false },
    });
    return { success: true, message: 'Registro desactivado (soft-delete).' };
  }

  async hardDelete(id: string) {
    // Para hacer hard-delete de verdad, eliminamos primero su historial
    await this.prisma.historialEstado.deleteMany({
      where: { persona_id: id },
    });

    const persona = await this.prisma.personaAfectada.findUnique({
      where: { id },
    });

    if (!persona) {
      throw new NotFoundException(`Persona afectada con ID ${id} no encontrada`);
    }

    await this.prisma.personaAfectada.delete({
      where: { id },
    });

    // También eliminamos a su reportante si no tiene más personas a cargo
    const otrasPersonas = await this.prisma.personaAfectada.count({
      where: { reportante_id: persona.reportante_id },
    });
    if (otrasPersonas === 0) {
      await this.prisma.reportante.delete({
        where: { id: persona.reportante_id },
      });
    }

    return { success: true, message: 'Registro eliminado físicamente de la base de datos.' };
  }
}
