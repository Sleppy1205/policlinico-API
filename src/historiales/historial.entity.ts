// ============================================
// historial.entity.ts
// Entidad Historial Clínico — tabla "historiales".
// Registra el resultado de cada consulta médica.
// ============================================

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { Usuario }  from '../usuarios/usuario.entity';

@Entity('historiales')
export class Historial {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, (p) => p.historiales, { eager: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'medico_id' })
  medico: Usuario;

  // Fecha de la consulta
  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'text' })
  sintomas: string;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ type: 'text' })
  tratamiento: string;

  // Fecha de creación del registro
  @CreateDateColumn({ name: 'created_at' })
  creadoEn: Date;
}