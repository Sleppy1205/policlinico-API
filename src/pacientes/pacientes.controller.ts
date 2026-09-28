// ============================================
// pacientes.controller.ts
// Controlador de Pacientes — rutas REST para el
// recurso principal de la API.
// ============================================

import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PacientesService }      from './pacientes.service';
import { CrearPacienteDto }      from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';

@Controller('pacientes')
export class PacientesController {

  constructor(private readonly pacientesService: PacientesService) {}

  // GET /api/pacientes — lista todos los pacientes
  @Get()
  obtenerTodos() {
    return this.pacientesService.obtenerTodos();
  }

  // GET /api/pacientes/:id — obtiene un paciente por ID
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.obtenerPorId(id);
  }

  // POST /api/pacientes — registra un nuevo paciente
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearPacienteDto) {
    return this.pacientesService.crear(dto);
  }

  // PATCH /api/pacientes/:id — actualiza datos del paciente
  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarPacienteDto,
  ) {
    return this.pacientesService.actualizar(id, dto);
  }

  // DELETE /api/pacientes/:id — elimina un paciente
  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.eliminar(id);
  }
}
