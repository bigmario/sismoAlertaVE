import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-key.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@prisma/client';

@ApiTags('api-keys')
@Controller('api/v1/api-keys')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolUsuario.SUPERADMIN)
@ApiBearerAuth()
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Generar una nueva API Key para una ONG o aplicación aliada (Sólo Superadmin)' })
  @ApiResponse({ status: 201, description: 'API Key generada con éxito. Asegúrese de guardar el valor retornado, ya que se almacena hasheado.' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido: requiere rol de Superadmin' })
  create(@Body() createKeyDto: CreateApiKeyDto) {
    return this.apiKeysService.createKey(
      createKeyDto.nombre_organizacion,
      createKeyDto.limite_rate,
    );
  }
}
