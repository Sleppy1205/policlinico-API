// ============================================
// usuarios.controller.ts
// Controlador de Usuarios — define las rutas HTTP
// y delega la lógica al servicio.
// El controlador NO accede a la BD directamente.
// ============================================

import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { UsuariosService }      from './usuarios.service';
import { CrearUsuarioDto }      from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

// @Controller('usuarios') → todas las rutas de este controlador
// empiezan con /api/usuarios (el /api viene del prefijo global en main.ts)
@Controller('usuarios')
export class UsuariosController {

  // Inyección de dependencias — NestJS provee el servicio automáticamente
  constructor(private readonly usuariosService: UsuariosService) {}

  // ---- GET /api/usuarios ----
  // Retorna todos los usuarios
  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  // ---- GET /api/usuarios/:id ----
  // Retorna un usuario por ID
  // ParseIntPipe convierte el parámetro :id de string a number automáticamente
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerPorId(id);
  }

  // ---- POST /api/usuarios ----
  // Crea un nuevo usuario
  // @Body() extrae el cuerpo del request y lo valida con CrearUsuarioDto
  @Post()
  @HttpCode(HttpStatus.CREATED) // Responde con 201 Created
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  // ---- PATCH /api/usuarios/:id ----
  // Actualiza parcialmente un usuario
  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(id, dto);
  }

  // ---- DELETE /api/usuarios/:id ----
  // Elimina un usuario
  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.eliminar(id);
  }
}
