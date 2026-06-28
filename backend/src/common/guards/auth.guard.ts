import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenHelper } from '../token.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token de autorización faltante');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token inválido (se requiere Bearer <token>)');
    }

    const token = parts[1];
    const payload = TokenHelper.verify(token);

    if (!payload) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Inyectar el usuario en la request
    request.user = payload;
    return true;
  }
}
