// ============================================
// crear-usuario.dto.ts
// DTO (Data Transfer Object) para crear usuarios.
// Define qué campos se esperan y sus validaciones.
// class-validator valida automáticamente gracias al
// ValidationPipe global configurado en main.ts
// ============================================

import {
  IsString, IsEmail, IsEnum, IsBoolean,
  IsNotEmpty, Length, MinLength, IsOptional,
} from 'class-validator';
import { RolUsuario } from '../usuario.entity';

export class CrearUsuarioDto {

  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres.' })
  nombre: string;

  @IsString({ message: 'La cédula debe ser texto.' })
  @IsNotEmpty({ message: 'La cédula es obligatoria.' })
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 caracteres.' })
  cedula: string;

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  // IsEnum verifica que el valor sea uno de los definidos en RolUsuario
  @IsEnum(RolUsuario, {
    message: 'El rol debe ser: administrador, medico, recepcionista o paciente.',
  })
  rol: RolUsuario;

  // IsOptional → si no se envía, no se valida (usa el default de la entidad)
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser true o false.' })
  activo?: boolean;
}
