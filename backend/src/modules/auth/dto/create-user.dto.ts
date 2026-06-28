import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Pedro Armas' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico institucional', example: 'parmas@proteccioncivil.gob.ve' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña de acceso', example: 'ClaveRescate2026*' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Rol asignado al usuario', enum: RolUsuario, default: RolUsuario.RESCATISTA })
  @IsEnum(RolUsuario)
  @IsNotEmpty()
  rol: RolUsuario;
}
