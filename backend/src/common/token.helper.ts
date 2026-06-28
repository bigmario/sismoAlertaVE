import * as crypto from 'crypto';

export class TokenHelper {
  private static secret = process.env.JWT_SECRET || 'sismoalerta-ve-secret-key-emergencia-2026';

  static sign(payload: any, expiresInSeconds = 86400): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
    
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    return `${header}.${body}.${signature}`;
  }

  static verify(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return null; // Expirado
      }
      return payload;
    } catch {
      return null;
    }
  }
}
