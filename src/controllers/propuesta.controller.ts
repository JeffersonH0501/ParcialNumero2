import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { PropuestaService } from '../services/propuesta.service';
import { CreatePropuestaDto } from '../dtos/propuesta.dto';

@Controller('propuestas')
export class PropuestaController {
    constructor(private readonly propuestaService: PropuestaService) {}

    @Post()
    async crearPropuesta(@Body() createPropuestaDto: CreatePropuestaDto) {
        return this.propuestaService.crearPropuesta(createPropuestaDto);
    }

    @Get(':id')
    async findPropuestaById(@Param('id') id: number) {
        return this.propuestaService.findPropuestaById(id);
    }

    @Get()
    async findAllPropuestas() {
        return this.propuestaService.findAllPropuestas();
    }

    @Delete(':id')
    async deletePropuestaById(@Param('id') id: number) {
        return this.propuestaService.deletePropuestaById(id);
    }
}