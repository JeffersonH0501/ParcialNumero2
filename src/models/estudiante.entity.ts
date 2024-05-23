import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';

@Entity()
export class Estudiante {
    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    numeroCreditosAprovados: number;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Proyecto, proyecto => proyecto.estudiante)
    @JoinColumn({ name: 'proyectoId' })
    proyecto: Proyecto;

    @Column()
    proyectoId: number;
}