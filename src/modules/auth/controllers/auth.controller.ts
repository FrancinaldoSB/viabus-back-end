import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { token: string }) {
    if (!body.token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      // Validar o token com o Auth0
      const userData = await this.authService.validateToken(body.token);

      // Validar o usuário no nosso sistema
      const { user, companies } = await this.authService.validateUser(userData);

      // Retornar os dados do usuário e suas empresas
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
        },
        companies,
      };
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação');
    }
  }

  @Get('me')
  async getProfile(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const token = authorization.replace('Bearer ', '');

      // Validar o token com o Auth0
      const userData = await this.authService.validateToken(token);

      // Validar o usuário no nosso sistema
      const { user, companies } = await this.authService.validateUser(userData);

      // Retornar os dados do usuário e suas empresas
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
        },
        companies,
      };
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação');
    }
  }
}
