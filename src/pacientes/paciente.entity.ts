// ============================================
// paciente.entity.ts
// Entidad Paciente — tabla "pacientes" en PostgreSQL.
// Es el RECURSO PRINCIPAL de la API para esta etapa.
// ============================================

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Cita }      from '../citas/cita.entity';
import { Historial } from '../historiales/historial.entity';

export enum Sexo {
  MASCULINO = 'masculino',
  FEMENINO  = 'femenino',
}

@Entity('pacientes')
export class Paciente {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 10, unique: true })
  cedula: string;

  @Column({ length: 20 })
  telefono: string;

  @Column()
  email: string;

  // Fecha de nacimiento — almacenada como date (sin hora)
  @Column({ type: 'date', name: 'fecha_nac' })
  fechaNac: string;

  @Column({ type: 'enum', enum: Sexo })
  sexo: Sexo;

  // Alergias es opcional — puede estar vacío
  @Column({ type: 'text', nullable: true })
  alergias: string;

  // Relación uno-a-muchos con Citas
  // Un paciente puede tener muchas citas
  @OneToMany(() => Cita, (cita) => cita.paciente)
  citas: Cita[];

  // Relación uno-a-muchos con Historiales
  @OneToMany(() => Historial, (h) => h.paciente)
  historiales: Historial[];

  @CreateDateColumn({ name: 'created_at' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  actualizadoEn: Date;
}
