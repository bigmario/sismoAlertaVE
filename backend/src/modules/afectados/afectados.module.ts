import { Module } from '@nestjs/common';
import { AfectadosService } from './afectados.service';
import { AfectadosController } from './afectados.controller';

@Module({
  controllers: [AfectadosController],
  providers: [AfectadosService],
  exports: [AfectadosService],
})
export class AfectadosModule {}
