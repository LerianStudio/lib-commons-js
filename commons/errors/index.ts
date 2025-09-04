/**
 * Generic Error Handling Module
 * Entry point for all error handling utilities
 */

// Export interfaces and types
export {
  ErrorResponse,
  ErrorOptions,
  FieldError,
  ApiErrorResponse,
  HTTP_STATUS_CODES,
  ErrorType,
  BaseError
} from './interfaces';

// Export factory functions
export {
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  tooManyRequests,
  internalServerError,
  validationError,
  unexpectedFieldsError,
  errorFromException,
  getHttpStatusFromError
} from './factories';

// Export middleware functions
export {
  createExpressErrorHandler,
  createExpressNotFoundHandler,
  processValidationErrors,
  asyncHandler
} from './middleware';