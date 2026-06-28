import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportanteDto {
  @ApiProperty({ description: 'Nombre completo del reportante', example: 'Ana Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Teléfono de contacto del reportante', example: '+58 412 1234567' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ description: 'Parentesco con la persona afectada (ej. Familiar, Amigo, Vecino)', example: 'Familiar' })
  @IsString()
  @IsNotEmpty()
  parentesco: string;
}

export class CreatePersonaAfectadaDto {
  @ApiPropertyOptional({ description: 'Cédula o Pasaporte de la persona afectada', example: 'V-12345678' })
  @IsString()
  @IsOptional()
  cedula?: string;

  @ApiProperty({ description: 'Nombre de la persona afectada', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido de la persona afectada', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiPropertyOptional({ description: 'Edad aproximada', example: 35 })
  @IsInt()
  @IsOptional()
  edad?: number;

  @ApiPropertyOptional({ description: 'Latitud del último avistamiento', example: 10.4806 })
  @IsNumber()
  @IsOptional()
  ultimo_avistamiento_lat?: number;

  @ApiPropertyOptional({ description: 'Longitud del último avistamiento', example: -66.9036 })
  @IsNumber()
  @IsOptional()
  ultimo_avistamiento_lng?: number;

  @ApiProperty({ description: 'Dirección o descripción física de la última localización', example: 'Av. Francisco de Miranda, Chacao' })
  @IsString()
  @IsNotEmpty()
  ultimo_avistamiento_direccion: string;

  @ApiPropertyOptional({ description: 'Descripción de su estado de salud', example: 'Estable pero requiere medicamentos para la tensión' })
  @IsString()
  @IsOptional()
  descripcion_salud?: string;

  @ApiPropertyOptional({ description: 'URLs de fotos asociadas', type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fotos?: string[];

  @ApiProperty({ description: 'Datos de quien reporta' })
  @ValidateNested()
  @Type(() => CreateReportanteDto)
  reportante: CreateReportanteDto;
}
