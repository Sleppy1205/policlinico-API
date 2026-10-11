// ============================================
// Controlador de Pacientes actualizado.
// GET / ahora acepta query params de paginación.
// POST, PATCH y DELETE están protegidos con JWT.
// ============================================

import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { PacientesService }      from './pacientes.service';
import { CrearPacienteDto }      from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { QueryPacienteDto }      from './dto/query-paciente.dto';
import { JwtAuthGuard }          from '../auth/guards/jwt-auth.guard';

@Controller('pacientes')
export class PacientesController {

  constructor(private readonly pacientesService: PacientesService) {}

  // GET /api/pacientes?page=1&limit=5&search=Juan&orderBy=nombre&orderDir=ASC
  // Ruta PÚBLICA — cualquiera puede consultar pacientes
  @Get()
  obtenerTodos(@Query() query: QueryPacienteDto) {
    return this.pacientesService.obtenerTodos(query);
  }

  // GET /api/pacientes/:id — PÚBLICA
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.obtenerPorId(id);
  }

  // POST /api/pacientes — PROTEGIDA con JWT
  // Requiere header: Authorization: Bearer <token>
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearPacienteDto) {
    return this.pacientesService.crear(dto);
  }

  // PATCH /api/pacientes/:id — PROTEGIDA con JWT
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarPacienteDto,
  ) {
    return this.pacientesService.actualizar(id, dto);
  }

  // DELETE /api/pacientes/:id — PROTEGIDA con JWT
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.eliminar(id);
  }
}
