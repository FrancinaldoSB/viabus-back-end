import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const logger = new Logger('CurrentCompanyDecorator');
    const request = ctx.switchToHttp().getRequest();

    // Primeiro tenta obter do user.currentCompany (definido pelo middleware)
    let company = request.user?.currentCompany;

    // Se não encontrou, tenta obter diretamente do header e da lista de companies
    if (
      !company &&
      request.user?.companies &&
      request.headers['x-company-id']
    ) {
      const companyId = request.headers['x-company-id'] as string;

      logger.debug(
        `Trying to find company by header x-company-id: ${companyId}`,
      );

      // Procura a empresa na lista de empresas do usuário
      if (Array.isArray(request.user.companies)) {
        company = request.user.companies.find(
          (c: any) => c && c.id === companyId,
        );
      }

      // Se encontrou, define na requisição para futuras chamadas
      if (company) {
        logger.debug(
          `Company found in user companies list: ${JSON.stringify(company)}`,
        );
        request.user.currentCompany = company;
      }
    }

    // Log detalhado para debug
    logger.debug(`Request user: ${JSON.stringify(request.user)}`);
    logger.debug(`Request headers: ${JSON.stringify(request.headers)}`);
    logger.debug(`Returning company: ${JSON.stringify(company)}`);

    return company;
  },
);
