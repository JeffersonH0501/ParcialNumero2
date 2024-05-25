import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
    @JoinColumn({ name: 'estudianteId' })
    estudiante: Estudiante;

    @Column({ nullable: true })
    estudianteId: number;

    @OneToOne(() => Propuesta, propuesta => propuesta.proyecto)
    propuesta: Propuesta;
}