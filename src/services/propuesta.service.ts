import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Propuesta } from 'src/models/propuesta.entity';

import { CreatePropuestaDto } from 'src/dtos/propuesta.dto';

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
        const propuesta = await this.propuestaRepository.findOne({ where: {id} });
        if (!propuesta) {
            throw new NotFoundException(`Propuesta con id ${id} no encontrada`);
        }
        return propuesta;
    }

    async findAllPropuestas(): Promise<Propuesta[]> {
        return await this.propuestaRepository.find();
    }

    async eliminarPropuestaById(id: number) {
        const propuesta: Propuesta = await this.propuestaRepository.findOne({ where: {id}, relations: ['proyecto'] });
        if (!propuesta) {
            throw new NotFoundException(`Propuesta con id ${id} no encontrado`);
        }
        if (propuesta.proyecto) {
            throw new BadRequestException('No se puede eliminar la propuesta porque tiene asociado un proyecto');
        }
        await this.propuestaRepository.delete(id);
        return { message: 'Propuesta eliminada exitosamente' };
    }
}