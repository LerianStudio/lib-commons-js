/**
 * Tests for error interfaces and BaseError class
 */

import { BaseError, HTTP_STATUS_CODES, ErrorType } from '../../errors';

describe('Error Interfaces and Classes', () => {
  describe('BaseError', () => {
    it('should create BaseError with required parameters', () => {
      const error = new BaseError('Test message', 'TEST_CODE', 400);

      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.httpStatus).toBe(400);
      expect(error.name).toBe('BaseError');
      expect(error.timestamp).toBeDefined();
      expect(typeof error.timestamp).toBe('string');
    });

    it('should use default http status when not provided', () => {
      const error = new BaseError('Test message', 'TEST_CODE');

      expect(error.httpStatus).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('should include fields when provided', () => {
      const fields = { field1: 'error1', field2: 'error2' };
      const error = new BaseError('Test message', 'TEST_CODE', 400, fields);

      expect(error.fields).toEqual(fields);
    });

    it('should convert to ErrorResponse format', () => {
      const fields = { email: 'Invalid email format' };
      const error = new BaseError('Validation failed', 'VALIDATION_ERROR', 400, fields);

      const response = error.toErrorResponse();

      expect(response).toEqual({
        code: 'VALIDATION_ERROR',
        title: 'BaseError',
        message: 'Validation failed',
        fields
      });
    });

    it('should convert to ErrorResponse without fields when not provided', () => {
      const error = new BaseError('Simple error', 'SIMPLE_ERROR', 500);

      const response = error.toErrorResponse();

      expect(response).toEqual({
        code: 'SIMPLE_ERROR',
        title: 'BaseError',
        message: 'Simple error'
      });
    });

    it('should maintain proper prototype chain for instanceof checks', () => {
      const error = new BaseError('Test', 'TEST_CODE');

      expect(error instanceof BaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should have correct stack trace', () => {
      const error = new BaseError('Test', 'TEST_CODE');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('BaseError');
    });
  });

  describe('HTTP_STATUS_CODES', () => {
    it('should contain standard HTTP status codes', () => {
      expect(HTTP_STATUS_CODES.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS_CODES.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS_CODES.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS_CODES.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS_CODES.CONFLICT).toBe(409);
      expect(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS_CODES.BAD_GATEWAY).toBe(502);
      expect(HTTP_STATUS_CODES.SERVICE_UNAVAILABLE).toBe(503);
      expect(HTTP_STATUS_CODES.GATEWAY_TIMEOUT).toBe(504);
    });
  });

  describe('ErrorType', () => {
    it('should contain standard error types', () => {
      expect(ErrorType.VALIDATION).toBe('VALIDATION');
      expect(ErrorType.AUTHENTICATION).toBe('AUTHENTICATION');
      expect(ErrorType.AUTHORIZATION).toBe('AUTHORIZATION');
      expect(ErrorType.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorType.CONFLICT).toBe('CONFLICT');
      expect(ErrorType.BUSINESS_RULE).toBe('BUSINESS_RULE');
      expect(ErrorType.EXTERNAL_SERVICE).toBe('EXTERNAL_SERVICE');
      expect(ErrorType.INTERNAL).toBe('INTERNAL');
    });
  });
});