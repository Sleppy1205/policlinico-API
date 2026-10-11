import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

import { RolUsuario } from '../../usuarios/usuario.entity';

export class RegisterDto {
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

  @IsString({ message: 'La contraseña debe ser texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsEnum(RolUsuario, {
    message: 'El rol debe ser: administrador, medico, recepcionista o paciente.',
  })
  rol?: RolUsuario;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser true o false.' })
  activo?: boolean;
}
