/**
 * Generic Error Middleware
 * Express-compatible error handling middleware
 */

import { ErrorResponse, BaseError, HTTP_STATUS_CODES } from './interfaces';
import { errorFromException, getHttpStatusFromError } from './factories';

/**
 * Express-compatible error handler
 */
export function createExpressErrorHandler(options: {
  includeRequestId?: boolean;
  includeTimestamp?: boolean;
  includeStack?: boolean;
  logger?: (error: any, context?: any) => void;
} = {}) {
  return (error: any, req: any, res: any, next: any): void => {
    const {
      includeRequestId = true,
      includeTimestamp = true,
      includeStack = false,
      logger
    } = options;

    let errorResponse: ErrorResponse;
    let httpStatus: number;

    // Handle BaseError instances
    if (error instanceof BaseError) {
      errorResponse = error.toErrorResponse();
      httpStatus = error.httpStatus;
    } else {
      // Convert unknown errors to standardized format
      errorResponse = errorFromException(error);
      httpStatus = getHttpStatusFromError(errorResponse);
    }

    // Add optional metadata
    const responseBody: any = { ...errorResponse };
    
    if (includeRequestId && req.headers?.['X-Request-Id']) {
      responseBody.requestId = req.headers['X-Request-Id'];
    }
    
    if (includeTimestamp) {
      responseBody.timestamp = new Date().toISOString();
    }

    if (includeStack && error.stack && process.env.NODE_ENV === 'development') {
      responseBody.stack = error.stack;
    }

    // Log error if logger provided
    if (logger) {
      logger(error, {
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        requestId: req.headers?.['X-Request-Id'],
        statusCode: httpStatus
      });
    }

    // Set content type and send response
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(httpStatus).json(responseBody);
  };
}

/**
 * Generic 404 Not Found handler for Express
 */
export function createExpressNotFoundHandler(options: {
  code?: string;
  includeRequestId?: boolean;
} = {}) {
  return (req: any, res: any): void => {
    const { code = 'NOT_FOUND', includeRequestId = true } = options;

    const errorResponse: any = {
      code,
      title: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`
    };

    if (includeRequestId && req.headers?.['X-Request-Id']) {
      errorResponse.requestId = req.headers['X-Request-Id'];
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json(errorResponse);
  };
}

/**
 * Validation error processor for common validation libraries
 */
export function processValidationErrors(validationResult: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  // Handle Joi validation errors
  if (validationResult?.details) {
    validationResult.details.forEach((detail: any) => {
      const field = detail.path?.join?.('.') || detail.context?.key || 'unknown';
      fieldErrors[field] = detail.message;
    });
    return fieldErrors;
  }

  // Handle Zod validation errors
  if (validationResult?.issues) {
    validationResult.issues.forEach((issue: any) => {
      const field = issue.path?.join?.('.') || 'unknown';
      fieldErrors[field] = issue.message;
    });
    return fieldErrors;
  }

  // Handle class-validator errors
  if (Array.isArray(validationResult)) {
    validationResult.forEach((error: any) => {
      if (error.property && error.constraints) {
        const messages = Object.values(error.constraints);
        fieldErrors[error.property] = messages[0] as string;
      }
    });
    return fieldErrors;
  }

  return fieldErrors;
}

/**
 * Async error wrapper for Express route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}