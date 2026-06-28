import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterFirstAdminDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenHelper } from '../../common/token.helper';
import * as bcrypt from 'bcrypt';
import { RolUsuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Firmar token JWT con nuestro TokenHelper
    const token = TokenHelper.sign({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async registerFirstAdmin(registerDto: RegisterFirstAdminDto) {
    // Verificar si ya existe algún usuario en el sistema
    const userCount = await this.prisma.usuario.count();
    if (userCount > 0) {
      throw new BadRequestException('El sistema ya cuenta con usuarios registrados. No es posible usar esta vía de emergencia.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: registerDto.nombre,
        email: registerDto.email,
        password_hash: passwordHash,
        rol: RolUsuario.SUPERADMIN,
      },
    });

    const token = TokenHelper.sign({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    // Verificar si el correo ya está registrado
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya se encuentra registrado.');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: createUserDto.nombre,
        email: createUserDto.email,
        password_hash: passwordHash,
        rol: createUserDto.rol,
      },
    });

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      created_at: user.created_at,
    };
  }
}
