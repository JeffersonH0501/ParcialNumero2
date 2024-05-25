import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../config/typeorm.testing.config';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { Proyecto } from '../models/proyecto.entity';
import { ProyectoService } from './proyecto.service';

describe('ProyectoService', () => {
    let service: ProyectoService;
    let repository: Repository<Proyecto>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ProyectoService]
        }).compile();

        service = module.get<ProyectoService>(ProyectoService);
        repository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    });

    it('deberia crear un proyecto con datos validos', async () => {
        const proyecto: Proyecto = {
            id: 1,
            fechaInicio: faker.date.past(),
            fechaFin: faker.date.future(),
            URL: faker.image.url(),
            estudianteId: null,
            estudiante: null,
            propuesta: null
        }

        const newProyecto: Proyecto = await service.crearProyecto(proyecto);
        expect(newProyecto).not.toBeNull();

        const storedProyecto: Proyecto = await repository.findOne({ where: {id:newProyecto.id} });
        expect(storedProyecto).not.toBeNull();
        expect(storedProyecto.fechaInicio).toEqual(newProyecto.fechaInicio);
        expect(storedProyecto.fechaFin).toEqual(newProyecto.fechaFin);
        expect(storedProyecto.URL).toEqual(newProyecto.URL);
    });

    it('debería lanzar una BadRequestException al intentar crear un proyecto con datos inválidos', async () => {
        const proyectoInvalido: Proyecto = {
            id: 1,
            fechaInicio: faker.date.future(),
            fechaFin: faker.date.past(),
            URL: faker.image.url(),
            estudianteId: null,
            estudiante: null,
            propuesta: null
        }
        try {
            await service.crearProyecto(proyectoInvalido);
            fail('se esperaba que lanzara una BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });
});