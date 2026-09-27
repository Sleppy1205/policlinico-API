// ============================================
// crear-historial.dto.ts
// DTO para registrar un diagnóstico/historial clínico.
// ============================================

import {
  IsInt, IsPositive, IsString, IsNotEmpty, Matches,
} from 'class-validator';

export class CrearHistorialDto {

  @IsInt({ message: 'El ID del paciente debe ser un número entero.' })
  @IsPositive()
  pacienteId: number;

  @IsInt({ message: 'El ID del médico debe ser un número entero.' })
  @IsPositive()
  medicoId: number;

  @IsString()
  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener formato YYYY-MM-DD.' })
  fecha: string;

  @IsString()
  @IsNotEmpty({ message: 'Los síntomas son obligatorios.' })
  sintomas: string;

  @IsString()
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio.' })
  diagnostico: string;

  @IsString()
  @IsNotEmpty({ message: 'El tratamiento es obligatorio.' })
  tratamiento: string;
}
