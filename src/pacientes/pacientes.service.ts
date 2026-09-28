// ============================================
// pacientes.service.ts
// Servicio de Pacientes — lógica de negocio
// para el recurso principal de la API.
// ============================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente }              from './paciente.entity';
import { CrearPacienteDto }      from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';

@Injectable()
export class PacientesService {

  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepo: Repository<Paciente>,
  ) {}

  // ---- OBTENER TODOS ----
  async obtenerTodos(): Promise<Paciente[]> {
    return this.pacientesRepo.find({
      order: { creadoEn: 'DESC' },
    });
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
    // No puede haber dos pacientes con la misma cédula
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

    // Si se cambia la cédula, verificar que no esté en uso
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
    await this.obtenerPorId(id); // Lanza 404 si no existe
    await this.pacientesRepo.delete(id);
    return { mensaje: `Paciente con ID ${id} eliminado correctamente.` };
  }
}
