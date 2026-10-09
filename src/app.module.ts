// ============================================
// Cambios principales:
//   - synchronize: FALSE (ahora se usan migraciones)
//   - Se importa AuthModule para JWT
//   - Se agregan las migraciones al DataSource
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos de negocio
import { UsuariosModule }    from './usuarios/usuarios.module';
import { PacientesModule }   from './pacientes/pacientes.module';
import { CitasModule }       from './citas/citas.module';
import { HistorialesModule } from './historiales/historiales.module';
import { AuthModule }        from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule — lee el archivo .env globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM con PostgreSQL — configurado de forma asíncrona
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:     'postgres',
        host:     config.get<string>('DB_HOST', 'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'policlinico_uleam'),
        autoLoadEntities: true,

        // synchronize: FALSE — obligatorio en Etapa 2
        // Las tablas se manejan con migraciones, no automáticamente
        synchronize: false,

        // Apunta a la carpeta de migraciones
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),

    // Módulos de negocio
    UsuariosModule,
    PacientesModule,
    CitasModule,
    HistorialesModule,

    // NUEVO Etapa 2 — Autenticación JWT
    AuthModule,
  ],
})
export class AppModule {}
