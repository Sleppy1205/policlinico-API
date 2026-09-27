import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CrearCitaDto } from './crear-cita.dto';
import { EstadoCita } from '../cita.entity';

export class ActualizarCitaDto extends PartialType(CrearCitaDto) {
  @IsOptional()
  @IsEnum(EstadoCita, { message: 'Estado inválido. Use: pendiente, confirmada, cancelada o completada.' })
  estado?: EstadoCita;
}