import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const { context, limit } = requestProps;
    const request = context.switchToHttp().getRequest();

    // Si la solicitud fue autenticada con una API Key, aplicamos su límite personalizado de rate limit
    if (request.apiKey) {
      const apiKeyLimit = request.apiKey.limite_rate || 1000;
      return super.handleRequest({ ...requestProps, limit: apiKeyLimit });
    }

    // Si es un rescatista o administrador autenticado por JWT, le asignamos un límite mayor (ej. 500 req/min)
    if (request.user) {
      return super.handleRequest({ ...requestProps, limit: 500 });
    }

    // Límite por defecto para usuarios anónimos (públicos)
    return super.handleRequest(requestProps);
  }
}
