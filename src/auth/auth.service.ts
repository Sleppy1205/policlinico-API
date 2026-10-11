import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario, RolUsuario } from '../usuarios/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.usuariosService.crear({
      nombre: dto.nombre,
      cedula: dto.cedula,
      email: dto.email,
      password: passwordHash,
      rol: dto.rol ?? RolUsuario.PACIENTE,
      activo: dto.activo ?? true,
    });

    return this.buildAuthResponse(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.obtenerPorEmail(dto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario no válido o desactivado.');
    }

    return this.buildAuthResponse(usuario);
  }

  private buildAuthResponse(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const access_token = this.jwtService.sign(payload);
    const { password, ...usuarioSinPassword } = usuario;

    return {
      access_token,
      usuario: usuarioSinPassword,
    };
  }
}
