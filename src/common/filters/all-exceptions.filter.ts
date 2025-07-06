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
} from '../../core/interfaces/api-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar status e mensagem
    let status: number;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      // Se é uma HttpException, usar seus dados
      status = exception.getStatus();
      message = exception.message;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      // Se é um Error comum (TypeError, etc.)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Erro interno do servidor';
      details = {
        name: exception.name,
        stack:
          process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      };
    } else {
      // Erro desconhecido
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
      details = { error: String(exception) };
    }

    // Log completo do erro
    this.logger.error(
      `Unhandled Exception: ${status} - ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
      {
        url: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
        query: request.query,
      },
    );

    // Mapear para código de erro
    const errorCode = this.mapStatusToErrorCode(status);

    // Criar resposta padronizada
    const errorResponse = ApiResponseBuilder.error(
      errorCode,
      message,
      details,
      undefined,
      request.url,
    );

    // Adicionar stack trace em desenvolvimento
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse.error.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

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
      default:
        return ApiErrorCode.INTERNAL_ERROR;
    }
  }
}
