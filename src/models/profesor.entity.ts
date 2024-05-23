import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Propuesta } from './propuesta.entity';

@Entity()
export class Profesor {
    @Column()
    documento: number;

    @Column()
    nombre: string;

    @Column()
    grupoInvestigacion: string;

    @Column()
    numeroExtension: number;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Propuesta, propuesta => propuesta.profesor)
    propuestas: Propuesta[];
}