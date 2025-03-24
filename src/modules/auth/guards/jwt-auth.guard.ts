import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`JwtAuthGuard checking route: ${request.url}`);

    // Verificar se a rota está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug(`Public route: ${request.url}`);
      return true;
    }

    return super.canActivate(context);
  }

  // Sobrescrever o método handleRequest para termos mais controle
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`HandleRequest for ${request.url}`);

    if (err || !user) {
      this.logger.error(`Authentication error: ${err?.message || 'No user'}`);
      // Continua com o comportamento padrão (vai lançar erro)
      return super.handleRequest(err, user, info, context);
    }

    // Log do usuário autenticado
    this.logger.debug(`Authenticated user: ${JSON.stringify(user)}`);

    // Retorna o usuário normalizado
    return user;
  }
}
