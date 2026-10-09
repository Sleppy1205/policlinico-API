// ============================================
// Primera migración del sistema.
// Crea las cuatro tablas principales con sus
// columnas, tipos, restricciones y claves foráneas.
// Las migraciones reemplazan al synchronize: true
// y permiten versionar los cambios de la BD.
// ============================================

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrearTablasIniciales1727000000000 implements MigrationInterface {

  // ---- UP: se ejecuta al aplicar la migración ----
  public async up(queryRunner: QueryRunner): Promise<void> {

    // Crear el tipo ENUM para roles de usuario
    await queryRunner.query(`
      CREATE TYPE "rol_usuario_enum" AS ENUM (
        'administrador', 'medico', 'recepcionista', 'paciente'
      )
    `);

    // Crear el tipo ENUM para sexo
    await queryRunner.query(`
      CREATE TYPE "sexo_enum" AS ENUM ('masculino', 'femenino')
    `);

    // Crear el tipo ENUM para estado de cita
    await queryRunner.query(`
      CREATE TYPE "estado_cita_enum" AS ENUM ('pendiente', 'atendida', 'cancelada')
    `);

    // Tabla: usuarios
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id"           SERIAL PRIMARY KEY,
        "nombre"       VARCHAR(100) NOT NULL,
        "cedula"       VARCHAR(10)  NOT NULL UNIQUE,
        "email"        VARCHAR      NOT NULL UNIQUE,
        "password"     VARCHAR      NOT NULL,
        "rol"          "rol_usuario_enum" NOT NULL DEFAULT 'paciente',
        "activo"       BOOLEAN NOT NULL DEFAULT true,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Tabla: pacientes
    await queryRunner.query(`
      CREATE TABLE "pacientes" (
        "id"           SERIAL PRIMARY KEY,
        "nombre"       VARCHAR(100) NOT NULL,
        "cedula"       VARCHAR(10)  NOT NULL UNIQUE,
        "telefono"     VARCHAR(20)  NOT NULL,
        "email"        VARCHAR      NOT NULL,
        "fecha_nac"    DATE         NOT NULL,
        "sexo"         "sexo_enum"  NOT NULL,
        "alergias"     TEXT,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Tabla: citas
    // ON DELETE RESTRICT → no permite borrar un paciente/médico con citas activas
    await queryRunner.query(`
      CREATE TABLE "citas" (
        "id"           SERIAL PRIMARY KEY,
        "paciente_id"  INTEGER NOT NULL,
        "medico_id"    INTEGER NOT NULL,
        "fecha"        DATE         NOT NULL,
        "hora"         VARCHAR(5)   NOT NULL,
        "motivo"       VARCHAR(255) NOT NULL,
        "estado"       "estado_cita_enum" NOT NULL DEFAULT 'pendiente',
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_citas_paciente"
          FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_citas_medico"
          FOREIGN KEY ("medico_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT
      )
    `);

    // Tabla: historiales
    // ON DELETE CASCADE → si se borra el paciente, se borran sus historiales
    await queryRunner.query(`
      CREATE TABLE "historiales" (
        "id"           SERIAL PRIMARY KEY,
        "paciente_id"  INTEGER NOT NULL,
        "medico_id"    INTEGER NOT NULL,
        "fecha"        DATE NOT NULL,
        "sintomas"     TEXT NOT NULL,
        "diagnostico"  TEXT NOT NULL,
        "tratamiento"  TEXT NOT NULL,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_historiales_paciente"
          FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_historiales_medico"
          FOREIGN KEY ("medico_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT
      )
    `);
  }

  // ---- DOWN: se ejecuta al revertir la migración ----
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "historiales"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "citas"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pacientes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "estado_cita_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "sexo_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "rol_usuario_enum"`);
  }
}
