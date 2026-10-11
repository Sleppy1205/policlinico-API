// ============================================
// Servicio de Pacientes actualizado para la Etapa 2.
// Agrega búsqueda por nombre/cédula, paginación
// y ordenamiento dinámico a la lista de pacientes.
// ============================================

import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Paciente }              from './paciente.entity';
import { CrearPacienteDto }      from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { QueryPacienteDto }      from './dto/query-paciente.dto';

// Interfaz para la respuesta paginada — incluye metadatos
export interface PaginatedResponse<T> {
  data:       T[];     // Los registros de la página actual
  total:      number;  // Total de registros en la BD
  page:       number;  // Página actual
  limit:      number;  // Registros por página
  totalPages: number;  // Total de páginas
}

@Injectable()
export class PacientesService {

  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepo: Repository<Paciente>,
  ) {}

  // ---- OBTENER TODOS CON PAGINACIÓN, FILTROS Y ORDEN ----
  // GET /api/pacientes?page=1&limit=5&search=Juan&orderBy=nombre&orderDir=ASC
  async obtenerTodos(query: QueryPacienteDto): Promise<PaginatedResponse<Paciente>> {
    const { page = 1, limit = 10, search, orderBy = 'creadoEn', orderDir = 'DESC' } = query;

    // Construir condiciones de búsqueda
    // ILike hace búsqueda insensible a mayúsculas/minúsculas
    const where = search
      ? [
          { nombre: ILike(`%${search}%`) }, // Busca en nombre
          { cedula: ILike(`%${search}%`) }, // O en cédula
        ]
      : {};

    // findAndCount retorna [registros, total] en una sola consulta
    const [data, total] = await this.pacientesRepo.findAndCount({
      where,
      order: { [orderBy]: orderDir },  // Orden dinámico según query params
      skip:  (page - 1) * limit,       // Cuántos registros saltar
      take:  limit,                     // Cuántos traer
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ---- OBTENER UNO POR ID ----
  async obtenerPorId(id: number): Promise<Paciente> {
    const paciente = await this.pacientesRepo.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado.`);
    }
    return paciente;
  }

  // ---- CREAR ----
  async crear(dto: CrearPacienteDto): Promise<Paciente> {
    const existe = await this.pacientesRepo.findOneBy({ cedula: dto.cedula });
    if (existe) {
      throw new ConflictException('Ya existe un paciente registrado con esta cédula.');
    }
    const nuevoPaciente = this.pacientesRepo.create(dto);
    return this.pacientesRepo.save(nuevoPaciente);
  }

  // ---- ACTUALIZAR ----
  async actualizar(id: number, dto: ActualizarPacienteDto): Promise<Paciente> {
    const paciente = await this.obtenerPorId(id);
    if (dto.cedula && dto.cedula !== paciente.cedula) {
      const existe = await this.pacientesRepo.findOneBy({ cedula: dto.cedula });
      if (existe) {
        throw new ConflictException('La cédula ya pertenece a otro paciente.');
      }
    }
    Object.assign(paciente, dto);
    return this.pacientesRepo.save(paciente);
  }

  // ---- ELIMINAR ----
  async eliminar(id: number): Promise<{ mensaje: string }> {
    await this.obtenerPorId(id);
    await this.pacientesRepo.delete(id);
    return { mensaje: `Paciente con ID ${id} eliminado correctamente.` };
  }
}
