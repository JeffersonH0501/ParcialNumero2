import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Profesor } from './profesor.entity';

@Entity()
export class Propuesta {
    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @Column()
    palabraClave: string;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Proyecto, proyecto => proyecto.propuesta)
    @JoinColumn({ name: 'proyectoId' })
    proyecto: Proyecto;

    @Column({ nullable: true })
    proyectoId: number;

    @ManyToOne(() => Profesor, profesor => profesor.propuestas)
    @JoinColumn({ name: 'profesorId' })
    profesor: Profesor;

    @Column({ nullable: true })
    profesorId: number;
}