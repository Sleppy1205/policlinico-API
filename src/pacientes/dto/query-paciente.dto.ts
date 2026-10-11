// ============================================
// DTO para los parámetros de consulta (query params).
// Permite filtrar, ordenar y paginar la lista
// de pacientes desde la URL.
// Ejemplo: GET /api/pacientes?page=1&limit=5&search=Juan&order=nombre
// ============================================

import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPacienteDto {

  // ---- PAGINACIÓN ----

  // Número de página (por defecto: 1)
  @IsOptional()
  @Type(() => Number) // Convierte el string del query param a número
  @IsInt({ message: 'El número de página debe ser un entero.' })
  @Min(1, { message: 'La página mínima es 1.' })
  page?: number = 1;

  // Cantidad de resultados por página (por defecto: 10)
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un entero.' })
  @Min(1, { message: 'El límite mínimo es 1.' })
  limit?: number = 10;

  // ---- BÚSQUEDA ----

  // Texto para buscar en nombre o cédula del paciente
  @IsOptional()
  @IsString()
  search?: string;

  // ---- ORDENAMIENTO ----

  // Campo por el que se ordena (nombre, cedula, fechaNac)
  @IsOptional()
  @IsIn(['nombre', 'cedula', 'fechaNac', 'creadoEn'], {
    message: 'El campo de orden debe ser: nombre, cedula, fechaNac o creadoEn.',
  })
  orderBy?: string = 'creadoEn';

  // Dirección del orden: ASC (ascendente) o DESC (descendente)
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'La dirección debe ser ASC o DESC.' })
  orderDir?: 'ASC' | 'DESC' = 'DESC';
}
