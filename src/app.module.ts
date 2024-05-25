import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

import { ProfesorController } from './controllers/profesor.controller';
import { PropuestaController } from './controllers/propuesta.controller';
import { EstudianteController } from './controllers/estudiante.controller';
import { ProyectoController } from './controllers/proyecto.controller';

import { ProfesorService } from './services/profesor.service';
import { PropuestaService } from './services/propuesta.service';
import { EstudianteService } from './services/estudiante.service';
import { ProyectoService } from './services/proyecto.service';

import { Profesor } from './models/profesor.entity';
import { Propuesta } from './models/propuesta.entity';
import { Estudiante } from './models/estudiante.entity';
import { Proyecto } from './models/proyecto.entity';

@Module({
  imports: [
      TypeOrmModule.forRoot(databaseConfig),
      TypeOrmModule.forFeature([Profesor]),
      TypeOrmModule.forFeature([Propuesta]),
      TypeOrmModule.forFeature([Estudiante]),
      TypeOrmModule.forFeature([Proyecto]),
  ],
  controllers: [
    ProfesorController,
    PropuestaController,
    EstudianteController,
    ProyectoController
  ],
  providers: [
    ProfesorService,
    PropuestaService,
    EstudianteService,
    ProyectoService
  ]
})

export class AppModule {}