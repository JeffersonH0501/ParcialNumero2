import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ProfesorService } from './profesor/profesor.service';
import { PropuestaService } from './services/propuesta.service';
import { EstudianteService } from './services/estudiante.service';
import { ProyectoService } from './services/proyecto.service';
import { PropuestaController } from './controllers/propuesta.controller';

@Module({
  imports: [
      TypeOrmModule.forRoot(databaseConfig),
      /*TypeOrmModule.forFeature([AlbumEntity])*/
  ],
  controllers: [
    AppController,
    PropuestaController
  ],
  providers: [
    AppService,
    ProfesorService,
    PropuestaService,
    EstudianteService,
    ProyectoService
  ]
})

export class AppModule {}