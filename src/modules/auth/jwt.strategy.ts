import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.getOrThrow<string>('AUTH0_AUDIENCE'),
      issuer: configService.getOrThrow<string>('AUTH0_ISSUER'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.getOrThrow<string>('AUTH0_JWKS_URI'),
      }),
    });
  }

  async validate(payload: any) {
    try {
      // Verificar se o usuário existe no nosso sistema
      const { user, companies } = await this.authService.validateUser({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });

      // Adicionar as empresas ao payload
      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        companies,
      };
    } catch (error) {
      throw new UnauthorizedException('Usuário não autorizado');
    }
  }
}
