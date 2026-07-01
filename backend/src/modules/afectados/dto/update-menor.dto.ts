import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMenorDto {
  @ApiProperty({
    description: 'Indica si la persona es un menor no acompañado',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  es_menor_no_acompanado: boolean;
}
