import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../config/typeorm.testing.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { Estudiante } from '../models/estudiante.entity';
import { EstudianteService } from './estudiante.service';

describe('EstudianteService', () => {
    let service: EstudianteService;
    let repository: Repository<Estudiante>;
    let estudiantesList: Estudiante[];

    const seedDatabase = async () => {
        repository.clear();
        estudiantesList = [];
        for(let i = 0; i < 5; i++){
            const estudiante: Estudiante = await repository.save({
                nombre: faker.company.name(),
                codigo: faker.number.bigInt({ min:1000000000, max:9999999999 }).toString(),
                numeroCreditosAprovados: faker.number.int({ max:140 })
            });
            estudiantesList.push(estudiante);
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [EstudianteService]
        }).compile();

        service = module.get<EstudianteService>(EstudianteService);
        repository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
        await seedDatabase();
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('deberia crear un estudiante con datos validos', async () => {
        const estudiante: Estudiante = {
            id: 1,
            nombre: faker.company.name(),
            codigo: faker.number.bigInt({ min:1000000000, max:9999999999 }).toString(),
            numeroCreditosAprovados: faker.number.int({ max:140 }),
            proyecto: null
        }

        const newEstudiante: Estudiante = await service.crearEstudiante(estudiante);
        expect(newEstudiante).not.toBeNull();

        const storedEstudiante: Estudiante = await repository.findOne({ where: {id:newEstudiante.id} });
        expect(storedEstudiante).not.toBeNull();
        expect(storedEstudiante.nombre).toEqual(newEstudiante.nombre);
        expect(storedEstudiante.codigo).toEqual(newEstudiante.codigo);
        expect(storedEstudiante.numeroCreditosAprovados).toEqual(newEstudiante.numeroCreditosAprovados);
    });

    it('debería lanzar una BadRequestException al intentar crear un estudiante con datos inválidos', async () => {
        const estudiante: Estudiante = {
            id: 1,
            nombre: faker.company.name(),
            codigo: faker.number.int({ max:999999999 }).toString(),
            numeroCreditosAprovados: faker.number.int(),
            proyecto: null
        }

        try {
            await service.crearEstudiante(estudiante);
            fail('se esperaba que lanzara una BadRequestException');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it('deberia encontrar un estudiante por su id', async () => {
        const storedEstudiante: Estudiante = estudiantesList[0];
        const estudiante: Estudiante = await service.findEstudianteById(storedEstudiante.id);
        expect(estudiante).not.toBeNull();
        expect(estudiante.nombre).toEqual(storedEstudiante.nombre);
        expect(estudiante.codigo).toEqual(storedEstudiante.codigo);
        expect(estudiante.numeroCreditosAprovados).toEqual(storedEstudiante.numeroCreditosAprovados);
    });

    it('deberia lanzar un NotFoundException al intentar encontrar un estudiante con un id inexistente', async () => {
        try {
            await service.findEstudianteById(999);
            fail('se esperaba que lanzara un NotFoundException');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });
});