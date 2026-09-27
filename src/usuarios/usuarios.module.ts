// ============================================
// usuarios.module.ts
// Módulo de Usuarios — agrupa entidad, servicio
// y controlador en una unidad cohesiva de NestJS.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario }           from './usuario.entity';
import { UsuariosService }   from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  // TypeOrmModule.forFeature registra la entidad para que el
  // repositorio pueda ser inyectado en el servicio
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers:   [UsuariosService],
  // exports permite que otros módulos usen UsuariosService si lo necesitan
  exports: [UsuariosService],
})
export class UsuariosModule {}
