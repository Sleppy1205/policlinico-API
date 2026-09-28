# 🏥 API Policlínico ULEAM — Backend NestJS

API REST para la gestión de historias clínicas del Policlínico de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).
Proyecto Integrador · **Etapa 1** — Definición y configuración inicial.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803)

---

## 👥 Integrantes

| # | Nombre |
|---|--------|
| 1 | Rosanna Annabell Ochoa Carrera |
| 2 | Myckell Hoover Samaniego Arambulo |
| 3 | Ellery Ricardo Delgado Moncayo |
| 4 | Graciela Elizabeth Cagua Campuzano |

**Docente:** Edgardo Panchana Flores · **Asignatura:** Desarrollo Backend Web con NestJS

---

## 📖 Descripción

El Policlínico atiende a estudiantes, docentes y personal administrativo. Esta API centraliza el registro de pacientes, el agendamiento de citas y las historias clínicas, reemplazando el manejo manual (o con LocalStorage en la versión web previa) por una base de datos PostgreSQL compartida.

**Recurso principal:** `pacientes`

**Roles de usuario** (campo `rol` en `usuarios`; el control de acceso llegará en la Etapa 2):
`administrador` · `medico` · `recepcionista` · `paciente`

---

## 🗂️ Estructura del proyecto

```
src/
├── main.ts              ← Punto de entrada: prefijo /api y ValidationPipe global
├── app.module.ts        ← Módulo raíz + conexión a BD (ConfigModule + TypeORM)
├── usuarios/            ← Cuentas del sistema (4 roles)
├── pacientes/           ← RECURSO PRINCIPAL
├── citas/               ← Citas médicas (paciente + médico)
└── historiales/         ← Historiales clínicos (síntomas, diagnóstico, tratamiento)
```

Cada módulo contiene: `*.entity.ts` · `*.service.ts` · `*.controller.ts` · `*.module.ts` · `dto/` (crear y actualizar).

**Relaciones:** un paciente tiene muchas citas y muchos historiales; un usuario con rol médico atiende muchas citas y registra muchos historiales.

---

## ⚙️ Requisitos

- Node.js v18+
- npm v8+
- PostgreSQL v14+
- Cliente HTTP (Insomnia, Postman o Thunder Client)

---

## 🚀 Cómo ejecutar

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/TU_USUARIO/policlinico-api.git
cd policlinico-api
npm install

# 2. Configurar variables de entorno
cp .env.example .env        # en Windows: copy .env.example .env
# Edita .env con tu contraseña de PostgreSQL

# 3. Crear la base de datos (en psql o pgAdmin)
# CREATE DATABASE policlinico_uleam;

# 4. Arrancar en modo desarrollo
npm run start:dev
```

La API queda disponible en **http://localhost:3000/api** y TypeORM crea las tablas automáticamente.

### 🔐 Variables de entorno (`.env`)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=policlinico_uleam
DB_SYNC=true
```

> ⚠️ El archivo `.env` **no se sube** al repositorio (está en `.gitignore`). Usa `.env.example` como plantilla.
> `DB_SYNC=true` solo para desarrollo; en producción debe ser `false`.

---

## 📋 Endpoints

Prefijo global: `/api`

| Recurso | GET todos | GET `:id` | POST | PATCH `:id` | DELETE `:id` |
|---|:---:|:---:|:---:|:---:|:---:|
| `/api/usuarios` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/pacientes` ⭐ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/citas` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/historiales` | ✅ | ✅ | ✅ | ✅ | ✅ |

### Códigos HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| `200 OK` | Éxito | Lectura, actualización y eliminación correctas |
| `201 Created` | Recurso creado | POST exitoso |
| `400 Bad Request` | Datos inválidos | Falla de validación o el usuario asignado no es médico |
| `404 Not Found` | No existe | ID inexistente (o paciente/médico relacionado no existe) |
| `409 Conflict` | Duplicado | Cédula o correo ya registrados |

---

## ✅ Validaciones

- **ValidationPipe global** con `transform`, `whitelist` y `forbidNonWhitelisted` (rechaza propiedades no permitidas).
- **DTOs** con `class-validator`: cédula de 10 dígitos, correo válido, contraseña mínima de 6 caracteres, enums para rol/sexo/estado, formato de fecha `YYYY-MM-DD` y hora `HH:MM`.
- **Servicio (reglas de negocio):** unicidad de cédula/correo, existencia de paciente y médico, y verificación del rol `medico`.

Ejemplo de error de validación:

```json
{
  "statusCode": 400,
  "message": ["La cédula debe tener exactamente 10 dígitos."],
  "error": "Bad Request"
}
```

---

## 🧪 Ejemplos de prueba

> Orden sugerido: usuario médico → paciente → cita → historial.

**POST `/api/usuarios`**
```json
{
  "nombre": "Dra. Ana Torres",
  "cedula": "1300000001",
  "email": "ana@uleam.edu.ec",
  "password": "123456",
  "rol": "medico"
}
```

**POST `/api/pacientes`**
```json
{
  "nombre": "Juan Pérez",
  "cedula": "1300000002",
  "telefono": "0987654321",
  "email": "juan@email.com",
  "fechaNac": "1990-05-15",
  "sexo": "masculino",
  "alergias": "Penicilina"
}
```

**POST `/api/citas`**
```json
{
  "pacienteId": 1,
  "medicoId": 1,
  "fecha": "2026-10-01",
  "hora": "09:00",
  "motivo": "Control general"
}
```

**POST `/api/historiales`**
```json
{
  "pacienteId": 1,
  "medicoId": 1,
  "fecha": "2026-10-01",
  "sintomas": "Dolor de cabeza y fiebre",
  "diagnostico": "Cuadro viral",
  "tratamiento": "Reposo e hidratación"
}
```

---



## 🛠️ Stack

NestJS · TypeScript · TypeORM · PostgreSQL · class-validator · class-transformer · @nestjs/config

