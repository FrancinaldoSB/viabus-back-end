import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiErrorCode,
  ApiResponseBuilder,
  ValidationError,
} from '../../core/interfaces/api-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log do erro para debugging
    this.logger.error(
      `HTTP Exception: ${status} - ${exception.message}`,
      exception.stack,
    );

    // Mapear status HTTP para código de erro
    const errorCode = this.mapStatusToErrorCode(status);

    // Extrair detalhes da validação se existir
    const validation = this.extractValidationErrors(exceptionResponse);

    // Criar resposta padronizada
    const errorResponse = ApiResponseBuilder.error(
      errorCode,
      exception.message,
      typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
      validation,
      request.url,
    );

    // Adicionar informações de debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Mapeia status HTTP para códigos de erro padronizados
   */
  private mapStatusToErrorCode(status: number): ApiErrorCode {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ApiErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ApiErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ApiErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ApiErrorCode.CONFLICT;
      case HttpStatus.BAD_REQUEST:
        return ApiErrorCode.VALIDATION_FAILED;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ApiErrorCode.INVALID_INPUT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ApiErrorCode.RATE_LIMIT_EXCEEDED;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return ApiErrorCode.SERVICE_UNAVAILABLE;
      default:
        return ApiErrorCode.INTERNAL_ERROR;
    }
  }

  /**
   * Extrai erros de validação do class-validator
   */
  private extractValidationErrors(
    exceptionResponse: any,
  ): ValidationError[] | undefined {
    if (
      typeof exceptionResponse === 'object' &&
      Array.isArray(exceptionResponse.message)
    ) {
      return exceptionResponse.message.map((error: any) => {
        if (typeof error === 'object' && error.property) {
          return {
            field: error.property,
            message: Object.values(error.constraints || {}).join(', '),
            value: error.value,
          };
        }
        return {
          field: 'unknown',
          message: error.toString(),
          value: undefined,
        };
      });
    }

    return undefined;
  }
}
