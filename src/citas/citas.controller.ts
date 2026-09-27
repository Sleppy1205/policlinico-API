import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CitasService }       from './citas.service';
import { CrearCitaDto }       from './dto/crear-cita.dto';
import { ActualizarCitaDto }  from './dto/actualizar-cita.dto';
import { Cita } from './cita.entity';

@Controller('citas')
export class CitasController {

  constructor(private readonly citasService: CitasService) {}

  @Get()
  async obtenerTodos(): Promise<Cita[]> {
    return this.citasService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Cita> {
    return this.citasService.obtenerPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearCitaDto): Promise<Cita> {
    return this.citasService.crear(dto);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarCitaDto,
  ): Promise<Cita> {
    return this.citasService.actualizar(id, dto);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return this.citasService.eliminar(id);
  }
}