// ============================================
// usuarios.service.ts
// Servicio de Usuarios — contiene toda la lógica
// de negocio: crear, leer, actualizar y eliminar.
// El controlador llama a este servicio y no
// accede directamente a la base de datos.
// ============================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CrearUsuarioDto }      from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {

  // InjectRepository inyecta el repositorio de TypeORM para la entidad Usuario
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  // ---- OBTENER TODOS ----
  // GET /api/usuarios
  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuariosRepo.find({
      order: { creadoEn: 'DESC' }, // Los más recientes primero
    });
  }

  // ---- OBTENER UNO POR ID ----
  // GET /api/usuarios/:id
  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOneBy({ id });

    // Si no existe, lanzar error 404
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

  // ---- CREAR ----
  // POST /api/usuarios
  async crear(dto: CrearUsuarioDto): Promise<Usuario> {
    // Verificar que el correo no esté en uso
    const existeEmail = await this.usuariosRepo.findOneBy({ email: dto.email });
    if (existeEmail) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico.');
    }

    // Verificar que la cédula no esté en uso
    const existeCedula = await this.usuariosRepo.findOneBy({ cedula: dto.cedula });
    if (existeCedula) {
      throw new ConflictException('Ya existe un usuario con esta cédula.');
    }

    // Crear la instancia y guardarla en la BD
    const nuevoUsuario = this.usuariosRepo.create(dto);
    return this.usuariosRepo.save(nuevoUsuario);
  }

  // ---- ACTUALIZAR ----
  // PATCH /api/usuarios/:id
  async actualizar(id: number, dto: ActualizarUsuarioDto): Promise<Usuario> {
    // Verificar que el usuario existe antes de actualizar
    const usuario = await this.obtenerPorId(id);

    // Si se cambia el email, verificar que no esté en uso por otro usuario
    if (dto.email && dto.email !== usuario.email) {
      const existeEmail = await this.usuariosRepo.findOneBy({ email: dto.email });
      if (existeEmail) {
        throw new ConflictException('El correo electrónico ya está en uso por otro usuario.');
      }
    }

    // Mezcla los datos nuevos con el registro existente
    Object.assign(usuario, dto);
    return this.usuariosRepo.save(usuario);
  }

  // ---- ELIMINAR ----
  // DELETE /api/usuarios/:id
  async eliminar(id: number): Promise<{ mensaje: string }> {
    // Verificar que existe antes de eliminar
    await this.obtenerPorId(id);
    await this.usuariosRepo.delete(id);
    return { mensaje: `Usuario con ID ${id} eliminado correctamente.` };
  }
}
