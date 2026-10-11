import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
<<<<<<< HEAD

import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
=======
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
>>>>>>> origin/main
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
<<<<<<< HEAD
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'policlinico-secret'),
        signOptions: {
          expiresIn: config.get<number>('JWT_EXPIRES_IN', 3600),
        },
=======
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') as any },
>>>>>>> origin/main
      }),
    }),
  ],
  controllers: [AuthController],
<<<<<<< HEAD
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
=======
  providers:   [AuthService, JwtStrategy],
  exports:     [JwtModule, PassportModule],
})
export class AuthModule {}
>>>>>>> origin/main
