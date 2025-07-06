/**
 * Interface base para todas as respostas da API
 */
export interface BaseApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path?: string;
}

/**
 * Resposta de sucesso com dados
 */
export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  meta?: ResponseMeta;
}

/**
 * Resposta de erro
 */
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    details?: any;
    validation?: ValidationError[];
    stack?: string;
  };
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T = any> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Metadados da resposta
 */
export interface ResponseMeta {
  version?: string;
  requestId?: string;
  executionTime?: number;
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta extends ResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Erro de validação
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Union type para todas as possíveis respostas
 */
export type ApiResponse<T = any> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse
  | PaginatedResponse<T>;

/**
 * Códigos de erro padrão
 */
export enum ApiErrorCode {
  // Autenticação/Autorização
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validação
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Recursos
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Empresa/Multi-tenancy
  COMPANY_NOT_SELECTED = 'COMPANY_NOT_SELECTED',
  COMPANY_ACCESS_DENIED = 'COMPANY_ACCESS_DENIED',

  // Sistema
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Helper class para criar respostas padronizadas
 */
export class ApiResponseBuilder {
  /**
   * Cria uma resposta de sucesso
   */
  static success<T>(
    data: T,
    message: string = 'Operação realizada com sucesso',
    meta?: ResponseMeta,
  ): ApiSuccessResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      meta,
    };
  }

  /**
   * Cria uma resposta de erro
   */
  static error(
    code: ApiErrorCode | string,
    message: string,
    details?: any,
    validation?: ValidationError[],
    path?: string,
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path,
      error: {
        code,
        details,
        validation,
      },
    };
  }

  /**
   * Cria uma resposta paginada
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message: string = 'Dados recuperados com sucesso',
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      meta: pagination,
    };
  }

  /**
   * Cria metadados de paginação
   */
  static createPaginationMeta(
    page: number,
    limit: number,
    total: number,
    meta?: Partial<ResponseMeta>,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      ...meta,
    };
  }
}
