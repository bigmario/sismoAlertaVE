import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoPersona } from '@prisma/client';

export class UpdateEstadoDto {
  @ApiProperty({
    description: 'Nuevo estado de la persona afectada',
    enum: EstadoPersona,
    example: EstadoPersona.RESCATADO,
  })
  @IsEnum(EstadoPersona)
  @IsNotEmpty()
  estado: EstadoPersona;

  @ApiProperty({
    description: 'Fuente de la actualización del estado (ej. ONG, Protección Civil, Ciudadano)',
    example: 'Protección Civil Chacao',
  })
  @IsString()
  @IsNotEmpty()
  fuente: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales sobre el rescate u ubicación',
    example: 'Encontrado sano y salvo bajo los escombros y trasladado al hospital local.',
  })
  @IsString()
  @IsOptional()
  motivo?: string;

  @ApiProperty({
    description: 'Nombre de la persona que realiza la actualización',
    example: 'Oficial Gómez',
  })
  @IsString()
  @IsNotEmpty()
  autor_nombre: string;
}
