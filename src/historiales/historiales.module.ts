// ============================================
// historiales.module.ts — Módulo de Historiales
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule }        from '@nestjs/typeorm';
import { Historial }            from './historial.entity';
import { HistorialesService }   from './historiales.service';
import { HistorialesController } from './historiales.controller';
import { PacientesModule }      from '../pacientes/pacientes.module';
import { UsuariosModule }       from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Historial]),
    PacientesModule,
    UsuariosModule,
  ],
  controllers: [HistorialesController],
  providers:   [HistorialesService],
})
export class HistorialesModule {}
