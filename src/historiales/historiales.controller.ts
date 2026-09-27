// ============================================
// historiales.controller.ts
// Controlador de Historiales Clínicos.
// ============================================

import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { HistorialesService }    from './historiales.service';
import { CrearHistorialDto }     from './dto/crear-historial.dto';
import { ActualizarHistorialDto } from './dto/actualizar-historial.dto';

@Controller('historiales')
export class HistorialesController {

  constructor(private readonly historialesService: HistorialesService) {}

  // GET /api/historiales
  @Get()
  obtenerTodos() {
    return this.historialesService.obtenerTodos();
  }

  // GET /api/historiales/:id
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.historialesService.obtenerPorId(id);
  }

  // POST /api/historiales
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearHistorialDto) {
    return this.historialesService.crear(dto);
  }

  // PATCH /api/historiales/:id
  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarHistorialDto,
  ) {
    return this.historialesService.actualizar(id, dto);
  }

  // DELETE /api/historiales/:id
  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.historialesService.eliminar(id);
  }
}
