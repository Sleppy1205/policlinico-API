// ============================================
// citas.module.ts — Módulo de Citas
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { Cita }            from './cita.entity';
import { CitasService }    from './citas.service';
import { CitasController } from './citas.controller';
import { PacientesModule } from '../pacientes/pacientes.module';
import { UsuariosModule }  from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    PacientesModule, // Para usar PacientesService
    UsuariosModule,  // Para usar UsuariosService
  ],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:     [CitasService],
})
export class CitasModule {}
