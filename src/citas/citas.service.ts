// ============================================
// citas.service.ts
// Servicio de Citas Médicas.
// ============================================

import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita, EstadoCita }   from './cita.entity';
import { CrearCitaDto }       from './dto/crear-cita.dto';
import { ActualizarCitaDto }  from './dto/actualizar-cita.dto';
import { PacientesService }   from '../pacientes/pacientes.service';
import { UsuariosService }    from '../usuarios/usuarios.service';
import { RolUsuario }         from '../usuarios/usuario.entity';

@Injectable()
export class CitasService {

  constructor(
    @InjectRepository(Cita)
    private readonly citasRepo: Repository<Cita>,
    private readonly pacientesService: PacientesService,
    private readonly usuariosService:  UsuariosService,
  ) {}

  async obtenerTodos(): Promise<Cita[]> {
    return this.citasRepo.find({ order: { fecha: 'DESC', hora: 'DESC' } });
  }

  async obtenerPorId(id: number): Promise<Cita> {
    const cita = await this.citasRepo.findOneBy({ id });
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada.`);
    return cita;
  }

  async crear(dto: CrearCitaDto): Promise<Cita> {
    const paciente = await this.pacientesService.obtenerPorId(dto.pacienteId);
    const medico   = await this.usuariosService.obtenerPorId(dto.medicoId);

    if (medico.rol !== RolUsuario.MEDICO) {
      throw new BadRequestException('El ID indicado no corresponde a un médico.');
    }

    await this.validarDisponibilidad(dto.medicoId, dto.fecha, dto.hora);

    const nueva = this.citasRepo.create({
      paciente,
      medico,
      fecha:  dto.fecha,
      hora:   dto.hora,
      motivo: dto.motivo,
      estado: EstadoCita.PENDIENTE,
    });
    return this.citasRepo.save(nueva);
  }

  async actualizar(id: number, dto: ActualizarCitaDto): Promise<Cita> {
    const cita = await this.obtenerPorId(id);

    if (dto.pacienteId) cita.paciente = await this.pacientesService.obtenerPorId(dto.pacienteId);

    if (dto.medicoId) {
      const medico = await this.usuariosService.obtenerPorId(dto.medicoId);
      if (medico.rol !== RolUsuario.MEDICO) {
        throw new BadRequestException('El ID indicado no corresponde a un médico.');
      }
      cita.medico = medico;
    }

    // Si cambia médico, fecha u hora, se revalida el choque de horario
    const medicoId = dto.medicoId ?? cita.medico.id;
    const fecha     = dto.fecha    ?? cita.fecha;
    const hora      = dto.hora     ?? cita.hora;
    if (dto.medicoId || dto.fecha || dto.hora) {
      await this.validarDisponibilidad(medicoId, fecha, hora, id);
    }

    if (dto.fecha)  cita.fecha  = dto.fecha;
    if (dto.hora)   cita.hora   = dto.hora;
    if (dto.motivo) cita.motivo = dto.motivo;
    if (dto.estado) cita.estado = dto.estado;

    return this.citasRepo.save(cita);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    await this.obtenerPorId(id);
    await this.citasRepo.delete(id);
    return { mensaje: `Cita con ID ${id} eliminada correctamente.` };
  }

  // Verifica que el médico no tenga ya una cita activa en esa fecha/hora
  private async validarDisponibilidad(
    medicoId: number, fecha: string, hora: string, idAExcluir?: number,
  ): Promise<void> {
    const choque = await this.citasRepo.findOne({
      where: { medico: { id: medicoId }, fecha, hora },
    });
    if (choque && choque.id !== idAExcluir && choque.estado !== EstadoCita.CANCELADA) {
      throw new ConflictException(
        `El médico ya tiene una cita agendada el ${fecha} a las ${hora}.`,
      );
    }
  }
}