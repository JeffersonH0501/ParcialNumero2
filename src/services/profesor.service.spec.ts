import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../config/typeorm.testing.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { Profesor } from '../models/profesor.entity';
import { ProfesorService } from './profesor.service';

describe('ProfesorService', () => {
    let service: ProfesorService;
    let repository: Repository<Profesor>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ProfesorService]
        }).compile();

        service = module.get<ProfesorService>(ProfesorService);
        repository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })


});