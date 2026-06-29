import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPersona } from '@prisma/client';

export class SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Texto de búsqueda por nombre, apellido o cédula/pasaporte',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filtro por estado de la persona afectada',
    enum: EstadoPersona,
    example: EstadoPersona.DESAPARECIDO,
  })
  @IsEnum(EstadoPersona)
  @IsOptional()
  estado?: EstadoPersona;

  @ApiPropertyOptional({
    description: 'Filtrar por menores de edad no acompañados (separados de sus padres)',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  es_menor_no_acompanado?: boolean;

  @ApiPropertyOptional({
    description: 'Número de página para paginación (basado en 1)',
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
