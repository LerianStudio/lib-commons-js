/**
 * Generic Error Factory Functions
 * Project-agnostic error creation utilities
 */

import { ErrorResponse, ErrorOptions, HTTP_STATUS_CODES, BaseError } from './interfaces';

/**
 * Generic error creator - accepts any error structure
 */

export function error(options: ErrorOptions): ErrorResponse {
  return {
    code: options.code,
    title: options.title,
    message: options.message,
    ...(options.fields && { fields: options.fields })
  };
}

/**
 * Bad Request (400) error response
 */
export function badRequest(
  code: string = 'BAD_REQUEST',
  message: string = 'The request could not be understood by the server due to malformed syntax',
  fields?: Record<string, string>
): ErrorResponse {
  return error({
    code,
    title: 'Bad Request',
    message,
    fields,
    httpStatus: HTTP_STATUS_CODES.BAD_REQUEST
  });
}

/**
 * Unauthorized (401) error response
 */
export function unauthorized(
  code: string = 'UNAUTHORIZED',
  message: string = 'Authentication credentials were missing or incorrect'
): ErrorResponse {
  return error({
    code,
    title: 'Unauthorized',
    message,
    httpStatus: HTTP_STATUS_CODES.UNAUTHORIZED
  });
}

/**
 * Forbidden (403) error response
 */
export function forbidden(
  code: string = 'FORBIDDEN',
  message: string = 'The server understood the request but refuses to authorize it'
): ErrorResponse {
  return error({
    code,
    title: 'Forbidden',
    message,
    httpStatus: HTTP_STATUS_CODES.FORBIDDEN
  });
}

/**
 * Not Found (404) error response
 */
export function notFound(
  code: string = 'NOT_FOUND',
  message: string = 'The requested resource could not be found'
): ErrorResponse {
  return error({
    code,
    title: 'Not Found',
    message,
    httpStatus: HTTP_STATUS_CODES.NOT_FOUND
  });
}

/**
 * Conflict (409) error response
 */
export function conflict(
  code: string = 'CONFLICT',
  message: string = 'The request could not be completed due to a conflict with the current state of the resource'
): ErrorResponse {
  return error({
    code,
    title: 'Conflict',
    message,
    httpStatus: HTTP_STATUS_CODES.CONFLICT
  });
}

/**
 * Unprocessable Entity (422) error response
 */
export function unprocessableEntity(
  code: string = 'UNPROCESSABLE_ENTITY',
  message: string = 'The request was well-formed but was unable to be followed due to semantic errors',
  fields?: Record<string, string>
): ErrorResponse {
  return error({
    code,
    title: 'Unprocessable Entity',
    message,
    fields,
    httpStatus: HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
  });
}

/**
 * Too Many Requests (429) error response
 */
export function tooManyRequests(
  code: string = 'TOO_MANY_REQUESTS',
  message: string = 'Too many requests have been sent in a given amount of time'
): ErrorResponse {
  return error({
    code,
    title: 'Too Many Requests',
    message,
    httpStatus: HTTP_STATUS_CODES.TOO_MANY_REQUESTS
  });
}

/**
 * Internal Server Error (500) error response
 */
export function internalServerError(
  code: string = 'INTERNAL_SERVER_ERROR',
  message: string = 'The server encountered an unexpected condition that prevented it from fulfilling the request'
): ErrorResponse {
  return error({
    code,
    title: 'Internal Server Error',
    message,
    httpStatus: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  });
}

/**
 * Validation error with field-specific messages
 */
export function validationError(
  code: string = 'VALIDATION_ERROR',
  message: string = 'One or more fields contain validation errors. Please check the fields object for details.',
  fields: Record<string, string>
): ErrorResponse {
  return error({
    code,
    title: 'Field Validation Error',
    message,
    fields,
    httpStatus: HTTP_STATUS_CODES.BAD_REQUEST
  });
}

/**
 * Error for unexpected fields in request body
 */
export function unexpectedFieldsError(
  code: string = 'UNEXPECTED_FIELDS',
  message: string = 'The request body contains more fields than expected. Please send only the allowed fields as per the documentation.',
  fields: Record<string, string>
): ErrorResponse {
  return error({
    code,
    title: 'Unexpected Fields in the Request',
    message,
    fields,
    httpStatus: HTTP_STATUS_CODES.BAD_REQUEST
  });
}

/**
 * Error response from thrown Error
 */
export function errorFromException(
  error: Error,
  code: string = 'INTERNAL_SERVER_ERROR',
  defaultMessage?: string
): ErrorResponse {
  if (error instanceof BaseError) {
    return error.toErrorResponse();
  }

  return internalServerError(
    code,
    defaultMessage || error.message || 'An unexpected error occurred'
  );
}

/**
 * Helper to extract HTTP status code from error response
 */
export function getHttpStatusFromError(error: ErrorResponse): number {
  // Map common error codes to HTTP status codes
  const codeToStatusMap: Record<string, number> = {
    'BAD_REQUEST': HTTP_STATUS_CODES.BAD_REQUEST,
    'VALIDATION_ERROR': HTTP_STATUS_CODES.BAD_REQUEST,
    'UNEXPECTED_FIELDS': HTTP_STATUS_CODES.BAD_REQUEST,
    'UNAUTHORIZED': HTTP_STATUS_CODES.UNAUTHORIZED,
    'FORBIDDEN': HTTP_STATUS_CODES.FORBIDDEN,
    'NOT_FOUND': HTTP_STATUS_CODES.NOT_FOUND,
    'CONFLICT': HTTP_STATUS_CODES.CONFLICT,
    'UNPROCESSABLE_ENTITY': HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
    'TOO_MANY_REQUESTS': HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    'INTERNAL_SERVER_ERROR': HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  };

  return codeToStatusMap[error.code] || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
}