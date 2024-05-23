import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Propuesta } from './propuesta.entity';

@Entity()
export class Proyecto {
    @Column()
    fechaInicio: Date;

    @Column()
    fechaFin: Date;

    @Column()
    URL: string;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Estudiante, estudiante => estudiante.proyecto)
    estudiante: Estudiante;

    @OneToOne(() => Propuesta, propuesta => propuesta.proyecto)
    propuesta: Propuesta;
}