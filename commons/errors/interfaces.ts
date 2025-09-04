/**
 * Generic Error Handling Interfaces
 * Provides standardized error response types for any TypeScript project
 */

/**
 * Standard error response interface
 * Can be extended by domain-specific implementations
 */
export interface ErrorResponse {
  code: string;
  title: string;
  message: string;
  fields?: Record<string, string>;
}

/**
 * Options for creating error responses
 */
export interface ErrorOptions {
  code: string;
  title: string;
  message: string;
  fields?: Record<string, string>;
  httpStatus?: number;
}

/**
 * Field validation error structure
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Extended error response for API errors
 */
export interface ApiErrorResponse extends ErrorResponse {
  timestamp?: string;
  path?: string;
  method?: string;
  requestId?: string;
}

/**
 * HTTP status code mappings for common error types
 */
export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

/**
 * Generic error type enumeration
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  BUSINESS_RULE = 'BUSINESS_RULE',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  INTERNAL = 'INTERNAL'
}

/**
 * Base error class for custom errors
 */
export class BaseError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly fields?: Record<string, string>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: string,
    httpStatus: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    this.fields = fields;
    this.timestamp = new Date().toISOString();
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  /**
   * Convert error to standard ErrorResponse format
   */
  toErrorResponse(): ErrorResponse {
    return {
      code: this.code,
      title: this.name,
      message: this.message,
      ...(this.fields && { fields: this.fields })
    };
  }
}