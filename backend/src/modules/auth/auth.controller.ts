import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterFirstAdminDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@prisma/client';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión para rescatistas y administradores' })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa, retorna JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('bootstrap-admin')
  @ApiOperation({ summary: 'Registrar el primer superadministrador del sistema (Vía de Emergencia)' })
  @ApiResponse({ status: 201, description: 'Superadministrador registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Ya existen usuarios en el sistema o datos inválidos' })
  registerFirstAdmin(@Body() registerDto: RegisterFirstAdminDto) {
    return this.authService.registerFirstAdmin(registerDto);
  }

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar un nuevo rescatista o administrador (Sólo Superadmin)' })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito' })
  @ApiResponse({ status: 400, description: 'El correo electrónico ya está registrado o datos de entrada no válidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido: requiere rol de Superadmin' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
