import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../../modules/api-keys/api-keys.service';
import { TokenHelper } from '../token.helper';

@Injectable()
export class RescatistaOrApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Verificar si tiene API Key en la cabecera x-api-key
    const key = request.headers['x-api-key'];
    if (key) {
      const apiKeyRecord = await this.apiKeysService.validateKey(key as string);
      if (apiKeyRecord) {
        request.apiKey = apiKeyRecord;
        return true;
      }
    }

    // 2. Verificar si tiene JWT en Authorization: Bearer <token>
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const payload = TokenHelper.verify(parts[1]);
        if (payload) {
          request.user = payload;
          return true;
        }
      }
    }

    throw new UnauthorizedException(
      'Debe proporcionar un token de rescatista válido o una API Key autorizada en x-api-key',
    );
  }
}
