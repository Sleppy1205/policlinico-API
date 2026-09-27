// ============================================
// historiales.service.ts
// Servicio de Historiales Clínicos.
// ============================================

import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial }             from './historial.entity';
import { CrearHistorialDto }     from './dto/crear-historial.dto';
import { ActualizarHistorialDto } from './dto/actualizar-historial.dto';
import { PacientesService }      from '../pacientes/pacientes.service';
import { UsuariosService }       from '../usuarios/usuarios.service';
import { RolUsuario }            from '../usuarios/usuario.entity';

@Injectable()
export class HistorialesService {

  constructor(
    @InjectRepository(Historial)
    private readonly historialesRepo: Repository<Historial>,
    private readonly pacientesService: PacientesService,
    private readonly usuariosService:  UsuariosService,
  ) {}

  async obtenerTodos(): Promise<Historial[]> {
    return this.historialesRepo.find({ order: { creadoEn: 'DESC' } });
  }

  async obtenerPorId(id: number): Promise<Historial> {
    const h = await this.historialesRepo.findOneBy({ id });
    if (!h) throw new NotFoundException(`Historial con ID ${id} no encontrado.`);
    return h;
  }

  async crear(dto: CrearHistorialDto): Promise<Historial> {
    const paciente = await this.pacientesService.obtenerPorId(dto.pacienteId);
    const medico   = await this.usuariosService.obtenerPorId(dto.medicoId);

    if (medico.rol !== RolUsuario.MEDICO) {
      throw new BadRequestException('Solo un médico puede registrar historiales clínicos.');
    }

    const nuevo = this.historialesRepo.create({
      paciente,
      medico,
      fecha:       dto.fecha,
      sintomas:    dto.sintomas,
      diagnostico: dto.diagnostico,
      tratamiento: dto.tratamiento,
    });
    return this.historialesRepo.save(nuevo);
  }

  async actualizar(id: number, dto: ActualizarHistorialDto): Promise<Historial> {
    const historial = await this.obtenerPorId(id);
    if (dto.pacienteId) historial.paciente = await this.pacientesService.obtenerPorId(dto.pacienteId);
    if (dto.medicoId)   historial.medico   = await this.usuariosService.obtenerPorId(dto.medicoId);
    if (dto.fecha)       historial.fecha       = dto.fecha;
    if (dto.sintomas)    historial.sintomas    = dto.sintomas;
    if (dto.diagnostico) historial.diagnostico = dto.diagnostico;
    if (dto.tratamiento) historial.tratamiento = dto.tratamiento;
    return this.historialesRepo.save(historial);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    await this.obtenerPorId(id);
    await this.historialesRepo.delete(id);
    return { mensaje: `Historial con ID ${id} eliminado correctamente.` };
  }
}
