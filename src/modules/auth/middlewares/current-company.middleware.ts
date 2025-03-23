import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CurrentCompanyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CurrentCompanyMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`Middleware executed for path: ${req.path}`);
    this.logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);

    // Verificação básica para evitar logs excessivos ou processamento desnecessário
    if (req.path.startsWith('/auth') || req.method === 'OPTIONS') {
      return next();
    }

    if (!req.user) {
      this.logger.debug('No user in request');
      return next();
    }

    this.logger.debug(`Request user: ${JSON.stringify(req.user)}`);

    const companyId = req.headers['x-company-id'] as string;
    this.logger.debug(`x-company-id header: ${companyId}`);

    if (!companyId) {
      this.logger.debug('No companyId in headers');
      return next();
    }

    // Verificamos se o companyId é válido (não vazio e string)
    if (typeof companyId !== 'string' || !companyId.trim()) {
      this.logger.debug('Invalid companyId format');
      return next();
    }

    // Verifica se o usuário tem acesso à companhia informada
    const userCompanies = req.user.companies || [];
    this.logger.debug(`User companies: ${JSON.stringify(userCompanies)}`);

    // Usando uma abordagem mais robusta para encontrar a empresa
    const company = Array.isArray(userCompanies)
      ? userCompanies.find((c: any) => c && c.id === companyId)
      : null;

    this.logger.debug(`Found company: ${JSON.stringify(company)}`);

    if (!company) {
      this.logger.warn(
        `User doesn't have access to company ${companyId} or company not found`,
      );
      if (req.path.startsWith('/stops') || req.path.startsWith('/routes')) {
        // Apenas rotas críticas lançam erro, outras simplesmente continuam sem definir currentCompany
        throw new UnauthorizedException(
          'Usuário não tem acesso a esta companhia',
        );
      }
      return next();
    }

    // Define a companhia atual na requisição
    req.user.currentCompany = company;
    this.logger.debug(`Set currentCompany: ${JSON.stringify(company)}`);

    next();
  }
}
