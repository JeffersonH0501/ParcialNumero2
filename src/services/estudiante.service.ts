import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Estudiante } from 'src/models/estudiante.entity';

import { CreateEstudianteDto } from 'src/dtos/estudiante.dto';

@Injectable()
export class EstudianteService {

    constructor(
        @InjectRepository(Estudiante)
        private readonly estudianteRepository: Repository<Estudiante>
    ) {}

    async crearEstudiante(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
        if (createEstudianteDto.codigo.length == 10) {
            throw new BadRequestException('El estudiante no se pudo crear porque su codigo no tiene 10 caracteres');
        }
        const estudiante = this.estudianteRepository.create(createEstudianteDto);
        return await this.estudianteRepository.save(estudiante);
    }

    async findEstudianteById(id: number): Promise<Estudiante> {
        const estudiante = await this.estudianteRepository.findOne({ where: {id} });
        if (!estudiante) {
            throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
        }
        return estudiante;
    }
}