import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

/**
 * Decorador para obter a empresa atual do usuário.
 * A empresa já deve ter sido configurada pelo CurrentCompanyGuard
 */
export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const logger = new Logger('CurrentCompanyDecorator');
    const request = ctx.switchToHttp().getRequest();

    // Simplesmente retorna a propriedade currentCompany do usuário
    return request.user?.currentCompany;
  },
);
