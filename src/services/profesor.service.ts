import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profesor } from 'src/models/profesor.entity';
import { Propuesta } from 'src/models/propuesta.entity';

import { CreateProfesorDto } from 'src/dtos/profesor.dto';

@Injectable()
export class ProfesorService {

    constructor(
        @InjectRepository(Profesor)
        private readonly profesorRepository: Repository<Profesor>
    ) {}

    async crearProfesor(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
        if (createProfesorDto.grupoInvestigacion != "TICSW" && createProfesorDto.grupoInvestigacion != "IMAGINE" && createProfesorDto.grupoInvestigacion != "COMIT"){
            throw new BadRequestException('El profesor no pertenece a un grupo de investigación valido');
        }
        const profesor = this.profesorRepository.create(createProfesorDto);
        return await this.profesorRepository.save(profesor);
    }

    async findProfesorById(id: number): Promise<Profesor> {
        const profesor = await this.profesorRepository.findOne({ where: {id} });
        if (!profesor) {
            throw new NotFoundException(`Profesor con id ${id} no encontrado`);
        }
        return profesor;
    }

    async eliminarProfesorById(id: number) {
        const profesor: Profesor = await this.profesorRepository.findOne({ where: {id}, relations: ['propuestas'] });
        if (!profesor) {
            throw new NotFoundException(`Profesor con id ${id} no encontrado`);
        }
        for (var i = 0; i < profesor.propuestas.length; i++) {
            const propuesta: Propuesta = profesor.propuestas[i];
            if (propuesta.proyecto) {
                throw new BadRequestException('No se puede eliminar un profesor que tiene una propuesta con un proyecto asociado');
            }
        } 
        await this.profesorRepository.delete(id);
        return { message: 'Profesor eliminado exitosamente' };
    }

    async eliminarProfesorByDocumento(documento: number) {
        const profesor: Profesor = await this.profesorRepository.findOne({ where: {documento} });
        if (!profesor) {
            throw new NotFoundException(`Profesor con documento ${documento} no encontrado`);
        }
        for (var i = 0; i < profesor.propuestas.length; i++) {
            const propuesta: Propuesta = profesor.propuestas[i];
            if (propuesta.proyecto) {
                throw new BadRequestException('No se puede eliminar un profesor que tiene una propuesta con un proyecto asociado');
            }
        } 
        await this.profesorRepository.delete(documento);
        return { message: 'Profesor eliminado exitosamente' };
    }
}