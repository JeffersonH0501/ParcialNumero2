import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from '../models/profesor.entity';
import { Propuesta } from '../models/propuesta.entity';
import { Estudiante } from '../models/estudiante.entity';
import { Proyecto } from '../models/proyecto.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Profesor, Propuesta, Estudiante, Proyecto],
      synchronize: true,
      keepConnectionAlive: true 
    }),
    TypeOrmModule.forFeature([Profesor, Propuesta, Estudiante, Proyecto]),
  ];