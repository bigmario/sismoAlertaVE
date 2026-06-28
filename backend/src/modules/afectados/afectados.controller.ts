import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { AfectadosService } from './afectados.service';
import { CreatePersonaAfectadaDto } from './dto/create-persona.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { RescatistaOrApiKeyGuard } from '../../common/guards/rescatista-or-api-key.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@prisma/client';

@ApiTags('afectados')
@Controller('api/v1/afectados')
export class AfectadosController {
  constructor(private readonly afectadosService: AfectadosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo reporte ciudadano de persona afectada' })
  @ApiResponse({ status: 201, description: 'Persona afectada registrada con éxito' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos' })
  create(@Body() createPersonaAfectadaDto: CreatePersonaAfectadaDto) {
    return this.afectadosService.create(createPersonaAfectadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar y listar personas afectadas (público)' })
  @ApiResponse({ status: 200, description: 'Listado de personas afectadas con paginación' })
  search(@Query() searchQueryDto: SearchQueryDto) {
    return this.afectadosService.search(searchQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles y auditoría de una persona afectada' })
  @ApiResponse({ status: 200, description: 'Detalle de la persona afectada' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  findOne(@Param('id') id: string) {
    return this.afectadosService.findOne(id);
  }

  @Patch(':id/estado')
  @UseGuards(RescatistaOrApiKeyGuard)
  @ApiOperation({ summary: 'Actualizar el estado de una persona afectada' })
  @ApiHeader({ name: 'x-api-key', required: false, description: 'API Key de la organización' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Estado actualizado y registrado en auditoría' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoDto,
    @Req() req: any,
  ) {
    const authUserId = req.user?.id;
    return this.afectadosService.updateEstado(id, updateEstadoDto, authUserId);
  }

  @Patch(':id/desactivar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar registro de persona afectada (soft-delete)' })
  @ApiResponse({ status: 200, description: 'Registro de la persona desactivado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  deactivate(@Param('id') id: string) {
    return this.afectadosService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.SUPERADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar físicamente un registro de persona afectada (Sólo Superadmin)' })
  @ApiResponse({ status: 200, description: 'Registro eliminado físicamente de la base de datos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido: requiere rol de Superadmin' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  hardDelete(@Param('id') id: string) {
    return this.afectadosService.hardDelete(id);
  }
}
