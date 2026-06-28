import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../../modules/api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'];

    if (!key) {
      throw new UnauthorizedException('API Key faltante en cabeceras (x-api-key)');
    }

    const apiKeyRecord = await this.apiKeysService.validateKey(key as string);
    if (!apiKeyRecord) {
      throw new UnauthorizedException('API Key inválida o inactiva');
    }

    // Guardar en la request para auditoría y lógica posterior
    request.apiKey = apiKeyRecord;
    return true;
  }
}
