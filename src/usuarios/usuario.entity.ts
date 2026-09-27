// ============================================
// usuario.entity.ts
// Entidad Usuario — define la tabla "usuarios"
// en PostgreSQL mediante decoradores de TypeORM.
// ============================================

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

// Roles posibles en el sistema
export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  MEDICO        = 'medico',
  RECEPCIONISTA = 'recepcionista',
  PACIENTE      = 'paciente',
}

@Entity('usuarios') // Nombre de la tabla en la BD
export class Usuario {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  // unique: true → no puede haber dos usuarios con la misma cédula
  @Column({ length: 10, unique: true })
  cedula: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Columna ENUM — solo acepta los valores del enum RolUsuario
  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.PACIENTE })
  rol: RolUsuario;

  // true = cuenta activa, false = cuenta desactivada
  @Column({ default: true })
  activo: boolean;

  // Fecha de creación — se llena automáticamente al insertar
  @CreateDateColumn({ name: 'created_at' })
  creadoEn: Date;

  // Fecha de última actualización — se actualiza automáticamente
  @UpdateDateColumn({ name: 'updated_at' })
  actualizadoEn: Date;
}
