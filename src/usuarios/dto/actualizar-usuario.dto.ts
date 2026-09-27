// ============================================
// actualizar-usuario.dto.ts
// DTO para actualizar un usuario (PATCH).
// Todos los campos son opcionales — solo se actualizan los que se envíen en el body.
// PartialType hace que todos los campos de CrearUsuarioDto sean opcionales automáticamente.
// ============================================

import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';

// PartialType convierte todos los campos de CrearUsuarioDto en opcionales
// Así no se necesita enviar todos los campos al hacer PATCH
export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}
