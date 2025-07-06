import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const COMPANY_FILTER_KEY = 'companyFilter';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
    companyId: string | null;
  };
  companyId?: string;
}

// Decorador para marcar métodos que devem usar filtro de empresa
export const UseCompanyFilter = () => {
  return (
    target: object,
    propertyName: string | symbol | undefined,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(COMPANY_FILTER_KEY, true, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class CompanyFilterInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const useCompanyFilter = this.reflector.get<boolean>(
      COMPANY_FILTER_KEY,
      context.getHandler(),
    );

    if (useCompanyFilter) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (user?.companyId) {
        // Injeta o companyId do usuário no request para ser usado pelos services
        request.companyId = user.companyId;
      }
    }

    return next.handle();
  }
}
