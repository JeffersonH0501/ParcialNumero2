import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'jefferson',
    password: '123',
    database: 'parcial',
    synchronize: true,
    autoLoadEntities: true
};