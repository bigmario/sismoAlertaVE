import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({ description: 'Nombre de la ONG o aplicación aliada', example: 'Cruz Roja Venezolana' })
  @IsString()
  @IsNotEmpty()
  nombre_organizacion: string;

  @ApiProperty({ description: 'Límite de peticiones por ventana de tiempo para esta API Key', default: 1000, example: 5000 })
  @IsInt()
  @Min(1)
  @IsOptional()
  limite_rate?: number;
}
