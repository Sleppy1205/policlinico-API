import {
  IsInt, IsPositive, IsString, IsNotEmpty, Matches,
} from 'class-validator';

export class CrearCitaDto {

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
  @IsNotEmpty({ message: 'La hora es obligatoria.' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe tener formato HH:mm.' })
  hora: string;

  @IsString()
  @IsNotEmpty({ message: 'El motivo de la cita es obligatorio.' })
  motivo: string;
}