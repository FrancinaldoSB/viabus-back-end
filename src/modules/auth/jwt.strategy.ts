import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

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
      this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);

      // Verificar se o usuário existe no nosso sistema
      const { user, companies } = await this.authService.validateUser({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });

      this.logger.debug(`Validated user: ${JSON.stringify(user)}`);
      this.logger.debug(`User companies: ${JSON.stringify(companies)}`);

      // Verificar se companies é um array válido
      if (!Array.isArray(companies) || companies.length === 0) {
        this.logger.warn(`User ${user.email} has no companies`);
      }

      // Adicionar as empresas ao payload
      const result = {
        userId: user.id,
        email: user.email,
        name: user.name,
        companies: Array.isArray(companies) ? companies : [],
      };

      this.logger.debug(`Returning user object: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error validating JWT: ${error.message}`);
      throw new UnauthorizedException('Usuário não autorizado');
    }
  }
}
