import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Propuesta } from '../models/propuesta.entity';

import { CreatePropuestaDto } from '../dtos/propuesta.dto';

@Injectable()
export class PropuestaService {

    constructor(
        @InjectRepository(Propuesta)
        private readonly propuestaRepository: Repository<Propuesta>
    ) {}

    async crearPropuesta(createPropuestaDto: CreatePropuestaDto): Promise<Propuesta> {
        if (!createPropuestaDto.titulo) {
            throw new BadRequestException('La propuesta no se pudo crear porque no tiene titulo')
        }
        const propuesta = this.propuestaRepository.create(createPropuestaDto);
        return await this.propuestaRepository.save(propuesta);
    }

    async findPropuestaById(id: number): Promise<Propuesta> {
        const propuesta = await this.propuestaRepository.findOne({ where: {id}, relations: ['proyecto', 'profesor'] });
        if (!propuesta) {
            throw new NotFoundException(`Propuesta con id ${id} no encontrada`);
        }
        return propuesta;
    }

    async findAllPropuestas(): Promise<Propuesta[]> {
        return await this.propuestaRepository.find({ relations: ['proyecto', 'profesor'] });
    }

    async deletePropuestaById(id: number): Promise<String> {
        const propuesta: Propuesta = await this.propuestaRepository.findOne({ where: {id}, relations: ['proyecto'] });
        if (!propuesta) {
            throw new NotFoundException(`Propuesta con id ${id} no encontrado`);
        }
        if (propuesta.proyecto) {
            throw new BadRequestException('No se puede eliminar la propuesta porque tiene asociado un proyecto');
        }
        await this.propuestaRepository.delete(id);
        return 'Propuesta eliminada exitosamente';
    }
}