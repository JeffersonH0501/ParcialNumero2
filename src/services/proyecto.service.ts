import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proyecto } from '../models/proyecto.entity';

import { CreateProyectoDto } from '../dtos/proyecto.dto';

@Injectable()
export class ProyectoService {

    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectoRepository: Repository<Proyecto>
    ) {}

    async crearProyecto(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
        if (createProyectoDto.fechaInicio > createProyectoDto.fechaFin) {
            throw new BadRequestException('No se puedo crear el proyecto porque La fecha de inicio es posterior a la fecha de fin');
        }
        const proyecto = this.proyectoRepository.create(createProyectoDto);
        return await this.proyectoRepository.save(proyecto);
    }
}