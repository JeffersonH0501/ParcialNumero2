import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ProfesorService } from '../services/profesor.service';
import { CreateProfesorDto } from '../dtos/profesor.dto';

@Controller('profesores')
export class ProfesorController {
    constructor(private readonly profesorService: ProfesorService) {}

    @Post()
    async crearProfesor(@Body() createProfesorDto: CreateProfesorDto) {
        return this.profesorService.crearProfesor(createProfesorDto);
    }

    @Get(':id')
    async findProfesorById(@Param('id') id: number) {
        return this.profesorService.findProfesorById(id);
    }

    @Delete(':id')
    async eliminarProfesorPorId(@Param('id') id: number) {
        return this.profesorService.eliminarProfesorById(id);
    }

    @Delete('/documento/:documento')
    async eliminarProfesorPorDocumento(@Param('documento') documento: number) {
        return this.profesorService.eliminarProfesorByDocumento(documento);
    }
}