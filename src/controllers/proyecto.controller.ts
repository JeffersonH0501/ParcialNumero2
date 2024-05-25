import { Controller, Post, Body } from '@nestjs/common';
import { ProyectoService } from '../services/proyecto.service';
import { CreateProyectoDto } from '../dtos/proyecto.dto';

@Controller('proyectos')
export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService) {}

    @Post()
    async crearProyecto(@Body() createProyectoDto: CreateProyectoDto) {
        return this.proyectoService.crearProyecto(createProyectoDto);
    }
}