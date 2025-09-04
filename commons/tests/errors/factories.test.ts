/**
 * Tests for error factory functions
 */

import {
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
  getHttpStatusFromError,
  BaseError,
  HTTP_STATUS_CODES
} from '../../errors';

describe('Error Factory Functions', () => {
  describe('error', () => {
    it('should create basic error response', () => {
      const result = error({
        code: 'TEST_ERROR',
        title: 'Test Error',
        message: 'This is a test error'
      });

      expect(result).toEqual({
        code: 'TEST_ERROR',
        title: 'Test Error',
        message: 'This is a test error'
      });
    });

    it('should include fields when provided', () => {
      const fields = { field1: 'error1', field2: 'error2' };
      const result = error({
        code: 'TEST_ERROR',
        title: 'Test Error',
        message: 'This is a test error',
        fields
      });

      expect(result).toEqual({
        code: 'TEST_ERROR',
        title: 'Test Error',
        message: 'This is a test error',
        fields
      });
    });
  });

  describe('badRequest', () => {
    it('should create bad request error with defaults', () => {
      const result = badRequest();
      
      expect(result).toEqual({
        code: 'BAD_REQUEST',
        title: 'Bad Request',
        message: 'The request could not be understood by the server due to malformed syntax'
      });
    });

    it('should create bad request error with custom parameters', () => {
      const fields = { name: 'Name is required' };
      const result = badRequest('CUSTOM_BAD_REQUEST', 'Custom message', fields);
      
      expect(result).toEqual({
        code: 'CUSTOM_BAD_REQUEST',
        title: 'Bad Request',
        message: 'Custom message',
        fields
      });
    });
  });

  describe('unauthorized', () => {
    it('should create unauthorized error with defaults', () => {
      const result = unauthorized();
      
      expect(result).toEqual({
        code: 'UNAUTHORIZED',
        title: 'Unauthorized',
        message: 'Authentication credentials were missing or incorrect'
      });
    });

    it('should create unauthorized error with custom parameters', () => {
      const result = unauthorized('CUSTOM_UNAUTHORIZED', 'Custom message');
      
      expect(result).toEqual({
        code: 'CUSTOM_UNAUTHORIZED',
        title: 'Unauthorized',
        message: 'Custom message'
      });
    });
  });

  describe('validationError', () => {
    it('should create validation error with fields', () => {
      const fields = { 
        email: 'Email is required',
        password: 'Password must be at least 8 characters'
      };
      const result = validationError('VALIDATION_FAILED', 'Form validation failed', fields);
      
      expect(result).toEqual({
        code: 'VALIDATION_FAILED',
        title: 'Field Validation Error',
        message: 'Form validation failed',
        fields
      });
    });
  });

  describe('errorFromException', () => {
    it('should handle BaseError instances', () => {
      const baseError = new BaseError('Test message', 'TEST_CODE', 400);
      const result = errorFromException(baseError);
      
      expect(result.code).toBe('TEST_CODE');
      expect(result.message).toBe('Test message');
      expect(result.title).toBe('BaseError');
    });

    it('should handle regular Error instances', () => {
      const regularError = new Error('Regular error message');
      const result = errorFromException(regularError);
      
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
      expect(result.message).toBe('Regular error message');
    });

    it('should use default message when error message is empty', () => {
      const emptyError = new Error('');
      const result = errorFromException(emptyError, 'CUSTOM_CODE', 'Default message');
      
      expect(result.code).toBe('CUSTOM_CODE');
      expect(result.message).toBe('Default message');
    });
  });

  describe('getHttpStatusFromError', () => {
    it('should return correct status for known error codes', () => {
      expect(getHttpStatusFromError({ code: 'BAD_REQUEST', title: 'Bad Request', message: 'Test' }))
        .toBe(HTTP_STATUS_CODES.BAD_REQUEST);
      
      expect(getHttpStatusFromError({ code: 'UNAUTHORIZED', title: 'Unauthorized', message: 'Test' }))
        .toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      
      expect(getHttpStatusFromError({ code: 'NOT_FOUND', title: 'Not Found', message: 'Test' }))
        .toBe(HTTP_STATUS_CODES.NOT_FOUND);
    });

    it('should return 500 for unknown error codes', () => {
      expect(getHttpStatusFromError({ code: 'UNKNOWN_CODE', title: 'Unknown', message: 'Test' }))
        .toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
  });
});