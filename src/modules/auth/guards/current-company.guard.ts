import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRE_COMPANY_KEY = 'requireCompany';

/**
 * Decorator para marcar controllers e métodos que requerem uma company
 */
export const RequireCompany = (require = true) => {
  return (target: any, key?: string, descriptor?: any) => {
    if (key) {
      // Método de um controller
      Reflect.defineMetadata(REQUIRE_COMPANY_KEY, require, descriptor.value);
      return descriptor;
    }
    // Classe do controller
    Reflect.defineMetadata(REQUIRE_COMPANY_KEY, require, target);
    return target;
  };
};

@Injectable()
export class CurrentCompanyGuard implements CanActivate {
  private readonly logger = new Logger(CurrentCompanyGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireCompany = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_COMPANY_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se o endpoint não requer company, permite acesso
    if (requireCompany === false) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Verifica se o usuário está autenticado
    if (!request.user) {
      this.logger.debug('No user in request');
      return true; // Deixa passar para o JwtAuthGuard lidar
    }

    this.logger.debug(`Request user: ${JSON.stringify(request.user)}`);

    const companyId = request.headers['x-company-id'] as string;
    this.logger.debug(`x-company-id header: ${companyId}`);

    if (!companyId) {
      this.logger.debug('No companyId in headers');
      if (requireCompany) {
        throw new UnauthorizedException('ID da empresa não informado');
      }
      return true;
    }

    // Verifica se o usuário tem acesso à companhia informada
    const userCompanies = request.user.companies || [];
    this.logger.debug(`User companies: ${JSON.stringify(userCompanies)}`);

    // Procura a empresa na lista de empresas do usuário
    const company = Array.isArray(userCompanies)
      ? userCompanies.find((c: any) => c && c.id === companyId)
      : null;

    this.logger.debug(`Found company: ${JSON.stringify(company)}`);

    if (!company) {
      this.logger.error(`User doesn't have access to company ${companyId}`);
      if (requireCompany) {
        throw new UnauthorizedException(
          'Usuário não tem acesso a esta companhia',
        );
      }
      return true;
    }

    // Define a companhia atual na requisição
    request.user.currentCompany = company;
    this.logger.debug(`Set currentCompany: ${JSON.stringify(company)}`);

    return true;
  }
}
