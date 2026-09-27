# 🏥 API Policlínico ULEAM — Backend NestJS

Sistema de gestión de historias clínicas del Policlínico de la ULEAM.
Desarrollado con **NestJS + PostgreSQL + TypeORM**.

## 👥 Integrantes del grupo

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________
4. ___________________________________________

## 🗂️ Estructura del proyecto

```
src/
├── main.ts                    ← Punto de entrada, ValidationPipe global
├── app.module.ts              ← Módulo raíz + configuración BD
├── usuarios/                  ← Módulo de usuarios (4 roles)
├── pacientes/                 ← RECURSO PRINCIPAL
├── citas/                     ← Módulo de citas médicas
└── historiales/               ← Módulo de historiales clínicos
```

## ⚙️ Requisitos

- Node.js v18+  |  PostgreSQL v14+  |  npm

## 🚀 Cómo ejecutar

```bash
# 1. Clonar e instalar
git clone https://github.com/TU_USUARIO/policlinico-api.git
cd policlinico-api
npm install

# 2. Configurar entorno
cp .env.example .env
# Edita .env con tus datos de PostgreSQL

# 3. Crear la base de datos
# En psql: CREATE DATABASE policlinico_uleam;

# 4. Arrancar en desarrollo
npm run start:dev
# API disponible en http://localhost:3000/api
# TypeORM crea las tablas automáticamente
```

## 📋 Endpoints

| Recurso      | GET todos | GET :id | POST | PATCH :id | DELETE :id |
|--------------|-----------|---------|------|-----------|------------|
| /api/usuarios   | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/pacientes  | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/citas      | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/historiales| ✅ | ✅ | ✅ | ✅ | ✅ |

## 🧪 Ejemplo de prueba

```json
POST /api/pacientes
{
  "nombre": "Juan Pérez",
  "cedula": "1300000002",
  "telefono": "0987654321",
  "email": "juan@email.com",
  "fechaNac": "1990-05-15",
  "sexo": "masculino",
  "alergias": "Penicilina"
}

POST /api/citas
{
  "pacienteId": 1,
  "medicoId": 1,
  "fecha": "2026-10-01",
  "hora": "09:00",
  "motivo": "Control general"
}
```

## ✅ Códigos HTTP

| 200 OK | 201 Created | 400 Bad Request | 404 Not Found | 409 Conflict |

## 🛠️ Stack

NestJS · TypeORM · PostgreSQL · class-validator · @nestjs/config
