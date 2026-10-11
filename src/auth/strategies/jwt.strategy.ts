import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../../usuarios/usuarios.service';

// Datos que viajan dentro del token (los firma auth.service.ts)
export interface JwtPayload {
  sub: number;   // id del usuario
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    config: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Se ejecuta solo si la firma y la expiración del token son válidas.
  // Lo que retorna queda disponible como req.user
  async validate(payload: JwtPayload) {
    const usuario = await this.usuariosService.obtenerPorId(payload.sub)
      .catch(() => null);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no válido o desactivado.');
    }
    return { id: usuario.id, email: usuario.email, rol: usuario.rol };
  }
}