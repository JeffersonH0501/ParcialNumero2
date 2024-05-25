import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { CreateEstudianteDto } from '../dtos/estudiante.dto';

@Controller('estudiantes')
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Post()
    async crearEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
        return this.estudianteService.crearEstudiante(createEstudianteDto);
    }

    @Get(':id')
    async findEstudianteById(@Param('id') id: number) {
        return this.estudianteService.findEstudianteById(id);
    }
}