// ============================================
// Configuración del DataSource de TypeORM para
// ejecutar migraciones desde la línea de comandos.
// Es independiente del app.module.ts para que
// el CLI de TypeORM pueda usarlo sin levantar NestJS.
// ============================================

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Carga las variables del archivo .env antes de usarlas
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT)   || 5432,
  username: process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'policlinico_uleam',

  // Entidades: TypeORM las necesita para generar las migraciones
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // Carpeta donde se guardan los archivos de migración
  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  // synchronize: SIEMPRE false aquí — las migraciones lo manejan
  synchronize: false,

  // logging: true muestra el SQL que ejecuta TypeORM (útil para debug)
  logging: true,
});
