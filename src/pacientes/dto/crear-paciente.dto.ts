// ============================================
// crear-paciente.dto.ts
// DTO para crear un paciente con validaciones.
// ============================================

import {
  IsString, IsEmail, IsEnum, IsNotEmpty,
  Length, IsOptional, Matches,
} from 'class-validator';
import { Sexo } from '../paciente.entity';

export class CrearPacienteDto {

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La cédula es obligatoria.' })
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos.' })
  @Matches(/^\d+$/, { message: 'La cédula debe contener solo números.' })
  cedula: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @Matches(/^\d{7,15}$/, { message: 'El teléfono debe contener entre 7 y 15 dígitos numéricos.' })
  telefono: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria.' })
  // Formato esperado: YYYY-MM-DD
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.' })
  fechaNac: string;

  @IsEnum(Sexo, { message: 'El sexo debe ser: masculino o femenino.' })
  sexo: Sexo;

  // Alergias es opcional
  @IsOptional()
  @IsString()
  alergias?: string;
}
