import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../config/typeorm.testing.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { Profesor } from '../models/profesor.entity';
import { Propuesta } from '../models/propuesta.entity';
import { Proyecto } from '../models/proyecto.entity';

import { ProfesorService } from './profesor.service';

describe('ProfesorService', () => {
    let service: ProfesorService;
    let repository: Repository<Profesor>;
    let propuestaRepository: Repository<Propuesta>;
    let proyectoRepository: Repository<Proyecto>;
    let profesoresList: Profesor[];

    const seedDatabase = async () => {
        propuestaRepository.clear();
        proyectoRepository.clear();
        repository.clear();
        
        profesoresList = [];
        const gruposInvestigacion = ["TICSW", "IMAGINE", "COMIT"];
        for(let i = 0; i < 4; i++){
            const profesor: Profesor = await repository.save({
                documento: faker.number.int({ min:1000000000, max:9999999999 }),
                nombre: faker.company.name(),
                grupoInvestigacion: gruposInvestigacion[Math.floor(Math.random() * gruposInvestigacion.length)],
                numeroExtension: faker.number.int({ max: 300 }),
            });
            profesoresList.push(profesor);
        }
        const proyecto: Proyecto = await proyectoRepository.save({
            fechaInicio: faker.date.past(),
            fechaFin: faker.date.future(),
            URL: faker.image.url()
        });
        const propuesta: Propuesta = await propuestaRepository.save({
            titulo: faker.company.name(),
            descripcion: faker.lorem.text(),
            palabraClave: faker.lorem.word(),
            proyectoId: proyecto.id,
            proyecto: proyecto
        });
        const profesor: Profesor = await repository.save({
            documento: faker.number.int({ min:1000000000, max:9999999999 }),
            nombre: faker.company.name(),
            grupoInvestigacion: gruposInvestigacion[Math.floor(Math.random() * gruposInvestigacion.length)],
            numeroExtension: faker.number.int({ max: 300 }),
            propuestas: [propuesta]
        });
        profesoresList.push(profesor);
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ProfesorService]
        }).compile();

        service = module.get<ProfesorService>(ProfesorService);
        repository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
        propuestaRepository = module.get<Repository<Propuesta>>(getRepositoryToken(Propuesta));
        proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));

        await seedDatabase();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    it('deberia crear un profesor con datos validos', async () => {
        const gruposInvestigacion = ["TICSW", "IMAGINE", "COMIT"];
        const profesor: Profesor = {
            id: 1,
            documento: faker.number.int({ min:1000000000, max:9999999999 }),
            nombre: faker.company.name(),
            grupoInvestigacion: gruposInvestigacion[Math.floor(Math.random() * gruposInvestigacion.length)],
            numeroExtension: faker.number.int({ max: 300 }),
            propuestas: null
        }

        const newProfesor: Profesor = await service.crearProfesor(profesor);
        expect(newProfesor).not.toBeNull();

        const storedProfesor: Profesor = await repository.findOne({ where: {id:newProfesor.id} });
        expect(storedProfesor).not.toBeNull();
        expect(storedProfesor.documento).toEqual(newProfesor.documento);
        expect(storedProfesor.nombre).toEqual(newProfesor.nombre);
        expect(storedProfesor.grupoInvestigacion).toEqual(newProfesor.grupoInvestigacion);
        expect(storedProfesor.numeroExtension).toEqual(newProfesor.numeroExtension);
    });

    it('debería lanzar una BadRequestException al intentar crear una propuesta con datos inválidos', async () => {
        const profesor: Profesor = {
            id: 1,
            documento: faker.number.int({ min:1000000000, max:9999999999 }),
            nombre: faker.company.name(),
            grupoInvestigacion: faker.company.name(),
            numeroExtension: faker.number.int({ max: 300 }),
            propuestas: null
        }
        try {
            await service.crearProfesor(profesor);
            fail('se esperaba que lanzara una BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it('deberia encontrar un profesor por su id', async () => {
        const storedProfesor: Profesor = profesoresList[0];
        const profesor: Profesor = await service.findProfesorById(storedProfesor.id);
        expect(profesor).not.toBeNull();
        expect(profesor.documento).toEqual(storedProfesor.documento);
        expect(profesor.nombre).toEqual(storedProfesor.nombre);
        expect(profesor.grupoInvestigacion).toEqual(storedProfesor.grupoInvestigacion);
        expect(profesor.numeroExtension).toEqual(storedProfesor.numeroExtension);
    });

    it('deberia lanzar un NotFoundException al intentar encontrar un profesor con un id inexistente', async () => {
        try {
            await service.findProfesorById(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it('deberia eliminar un profesor por su id', async () => {
        const profesor: Profesor = profesoresList[0];
        await service.eliminarProfesorById(profesor.id);
        const deletedProfesor: Profesor = await repository.findOne({ where: { id:profesor.id } })
        expect(deletedProfesor).toBeNull();
    });

    it('deberia eliminar un profesor por su documento', async () => {
        const profesor: Profesor = profesoresList[0];
        await service.eliminarProfesorByDocumento(profesor.documento);
        const deletedProfesor: Profesor = await repository.findOne({ where: { id:profesor.id } })
        expect(deletedProfesor).toBeNull();
    });

    it('deberia lanzar un NotFoundException al intentar eliminar un profesor por su id que no existe', async () => {
        try {
            await service.eliminarProfesorById(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it('deberia lanzar un NotFoundException al intentar eliminar un profesor por su documento que no existe', async () => {
        try {
            await service.eliminarProfesorByDocumento(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it('deberia lanzar un BadRequestException al intentar eliminar un profesor por su id que tiene asociado una propuesta que tambien tiene asociado un proyecto', async () => {
        const profesor: Profesor = profesoresList[profesoresList.length - 1];
        try {
            await service.eliminarProfesorById(profesor.id);
            fail('se esperaba que lanzara un BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it('deberia lanzar un BadRequestException al intentar eliminar un profesor por su documento que tiene asociado una propuesta que tambien tiene asociado un proyecto', async () => {
        const profesor: Profesor = profesoresList[profesoresList.length - 1];
        try {
            await service.eliminarProfesorByDocumento(profesor.documento);
            fail('se esperaba que lanzara un BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });
});