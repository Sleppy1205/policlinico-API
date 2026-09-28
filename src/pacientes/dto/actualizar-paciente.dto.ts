// ============================================
// actualizar-paciente.dto.ts
// DTO para actualizar un paciente (PATCH).
// Todos los campos son opcionales.
// ============================================

import { PartialType } from '@nestjs/mapped-types';
import { CrearPacienteDto } from './crear-paciente.dto';

export class ActualizarPacienteDto extends PartialType(CrearPacienteDto) {}
