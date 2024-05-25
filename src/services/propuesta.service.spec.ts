import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../config/typeorm.testing.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { Propuesta } from '../models/propuesta.entity';
import { Proyecto } from '../models/proyecto.entity';
import { PropuestaService } from './propuesta.service';

describe('PropuestaService', () => {
    let service: PropuestaService;
    let repository: Repository<Propuesta>;
    let proyectoRepository: Repository<Proyecto>;
    let propuestasList: Propuesta[];

    const seedDatabase = async () => {
        proyectoRepository.clear();
        repository.clear();
        
        propuestasList = [];
        for(let i = 0; i < 4; i++){
            const propuesta: Propuesta = await repository.save({
                titulo: faker.company.name(),
                descripcion: faker.lorem.text(),
                palabraClave: faker.lorem.word()
            });
            propuestasList.push(propuesta);
        }
        const proyecto: Proyecto = await proyectoRepository.save({
            fechaInicio: faker.date.past(),
            fechaFin: faker.date.future(),
            URL: faker.image.url()
        });
        const propuesta: Propuesta = await repository.save({
            titulo: faker.company.name(),
            descripcion: faker.lorem.text(),
            palabraClave: faker.lorem.word(),
            proyectoId: proyecto.id,
            proyecto: proyecto
        });
        propuestasList.push(propuesta);
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [PropuestaService]
        }).compile();

        service = module.get<PropuestaService>(PropuestaService);
        repository = module.get<Repository<Propuesta>>(getRepositoryToken(Propuesta));
        proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
        await seedDatabase();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('deberia crear una propuesta con datos validos', async () => {
        const propuesta: Propuesta = {
            id: 1,
            titulo: faker.company.name(),
            descripcion: faker.lorem.text(),
            palabraClave: faker.lorem.word(),
            proyecto: null,
            proyectoId: null,
            profesor: null,
            profesorId: null
        }

        const newPropuesta: Propuesta = await service.crearPropuesta(propuesta);
        expect(newPropuesta).not.toBeNull();

        const storedPropuesta: Propuesta = await repository.findOne({ where: {id:newPropuesta.id} });
        expect(storedPropuesta).not.toBeNull();
        expect(storedPropuesta.titulo).toEqual(newPropuesta.titulo);
        expect(storedPropuesta.descripcion).toEqual(newPropuesta.descripcion);
        expect(storedPropuesta.palabraClave).toEqual(newPropuesta.palabraClave);
    });

    it('debería lanzar una BadRequestException al intentar crear una propuesta con datos inválidos', async () => {
        const propuesta: Propuesta = {
            id: 1,
            titulo: null,
            descripcion: faker.lorem.text(),
            palabraClave: faker.lorem.word(),
            proyecto: null,
            proyectoId: null,
            profesor: null,
            profesorId: null
        }
        try {
            await service.crearPropuesta(propuesta);
            fail('se esperaba que lanzara una BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it('deberia encontrar una propuesta por su id', async () => {
        const storedPropuesta: Propuesta = propuestasList[0];
        const propuesta: Propuesta = await service.findPropuestaById(storedPropuesta.id);
        expect(propuesta).not.toBeNull();
        expect(propuesta.titulo).toEqual(storedPropuesta.titulo);
        expect(propuesta.descripcion).toEqual(storedPropuesta.descripcion);
        expect(propuesta.palabraClave).toEqual(storedPropuesta.palabraClave);
    });

    it('deberia lanzar un NotFoundException al intentar encontrar una propuesta con un id inexistente', async () => {
        try {
            await service.findPropuestaById(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it('deberia encontrar todos las propuestas', async () => {
        const propuestas: Propuesta[] = await service.findAllPropuestas();
        expect(propuestas).not.toBeNull();
        expect(propuestas).toHaveLength(propuestasList.length);
    });

    it('deberia eliminar una propuesta por su id', async () => {
        const propuesta: Propuesta = propuestasList[0];
        await service.deletePropuestaById(propuesta.id);
        const deletedPropuesta: Propuesta = await repository.findOne({ where: { id:propuesta.id } })
        expect(deletedPropuesta).toBeNull();
    });

    it('deberia lanzar un NotFoundException al intentar eliminar una propuesta que no existe', async () => {
        try {
            await service.deletePropuestaById(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it('deberia lanzar un BadRequestException al intentar eliminar una propuesta que tiene asociado un proyecto', async () => {
        const propuesta: Propuesta = propuestasList[propuestasList.length - 1];
        try {
            await service.deletePropuestaById(propuesta.id);
            fail('se esperaba que lanzara un BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });
});