// ============================================
// app.module.ts
// Módulo raíz de la aplicación.
// Aquí se importan todos los módulos y se
// configura la conexión a la base de datos PostgreSQL.
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importación de todos los módulos de negocio
import { UsuariosModule }    from './usuarios/usuarios.module';
import { PacientesModule }   from './pacientes/pacientes.module';
import { CitasModule }       from './citas/citas.module';
import { HistorialesModule } from './historiales/historiales.module';

@Module({
  imports: [
    // ---- Módulo de configuración ----
    // Lee el archivo .env automáticamente
    // isGlobal: true → disponible en toda la app sin reimportar
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ---- Configuración de PostgreSQL con TypeORM ----
    // useFactory inyecta ConfigService para leer las variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get<string>('DB_HOST', 'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'policlinico_uleam'),
        // autoLoadEntities: carga automáticamente las entidades registradas en cada módulo
        autoLoadEntities: true,
        // synchronize: crea/actualiza las tablas automáticamente según las entidades
        // SOLO usar en desarrollo — en producción usar migraciones
        synchronize: config.get<boolean>('DB_SYNC', true),
      }),
    }),

    // ---- Módulos de negocio ----
    UsuariosModule,
    PacientesModule,
    CitasModule,
    HistorialesModule,
  ],
})
export class AppModule {}
