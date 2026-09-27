// archivo pendiente - myke// ============================================
// cita.entity.ts
// Entidad Cita — tabla "citas".
// Representa una cita médica entre un paciente y un médico.
// ============================================

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { Usuario }  from '../usuarios/usuario.entity';

export enum EstadoCita {
  PENDIENTE  = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA  = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity('citas')
export class Cita {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, { eager: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'medico_id' })
  medico: Usuario;

  // Fecha de la cita
  @Column({ type: 'date' })
  fecha: string;

  // Hora de la cita (formato HH:mm)
  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;

  // Fecha de creación del registro
  @CreateDateColumn({ name: 'created_at' })
  creadoEn: Date;
}