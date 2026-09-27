import { PartialType } from '@nestjs/mapped-types';
import { CrearHistorialDto } from './crear-historial.dto';
export class ActualizarHistorialDto extends PartialType(CrearHistorialDto) {}
