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
        if (createProfesorDto.grupoInvestigacion != "TICSW" && createProfesorDto.grupoInvestigacion != "IMAGINE" && createProfesorDto.grupoInvestigacion != "COMIT"){
            throw new BadRequestException('El profesor no pertenece a un grupo de investigación valido')
        }
        const profesor = this.profesorRepository.create(createProfesorDto);
        return await this.profesorRepository.save(profesor);
    }
}
