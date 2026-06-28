import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  async validateKey(key: string) {
    const keyHash = this.hashKey(key);
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key_hash: keyHash },
    });
    if (!apiKey || !apiKey.is_active) {
      return null;
    }
    return apiKey;
  }

  async createKey(nombreOrganizacion: string, limiteRate = 1000) {
    const rawKey = 'sa_ve_' + crypto.randomBytes(24).toString('hex');
    const keyHash = this.hashKey(rawKey);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        key_hash: keyHash,
        nombre_organizacion: nombreOrganizacion,
        limite_rate: limiteRate,
      },
    });

    return {
      rawKey,
      apiKey,
    };
  }
}
