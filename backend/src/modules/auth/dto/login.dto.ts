import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario rescatista/admin', example: 'rescatista@sismoalerta.org' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'Segura123*' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterFirstAdminDto {
  @ApiProperty({ description: 'Nombre completo', example: 'Administrador Principal' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'admin@sismoalerta.org' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña de superusuario', example: 'SuperSecurePass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
