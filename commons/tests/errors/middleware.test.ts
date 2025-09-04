/**
 * Tests for error middleware functions
 */

import {
  createExpressErrorHandler,
  createExpressNotFoundHandler,
  processValidationErrors,
  asyncHandler,
  BaseError,
  HTTP_STATUS_CODES
} from '../../errors';

describe('Error Middleware', () => {
  describe('createExpressErrorHandler', () => {
    let req: any;
    let res: any;
    let next: any;
    let logger: jest.Mock;

    beforeEach(() => {
      req = {
        path: '/test',
        method: 'POST',
        body: { test: 'data' },
        params: { id: '123' },
        query: { filter: 'active' },
        headers: { 'X-Request-Id': 'req-123' }
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        setHeader: jest.fn()
      };
      
      next = jest.fn();
      logger = jest.fn();
    });

    it('should handle BaseError instances', () => {
      const errorHandler = createExpressErrorHandler({ logger });
      const baseError = new BaseError('Test error', 'TEST_CODE', 400);

      errorHandler(baseError, req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'TEST_CODE',
        title: 'BaseError',
        message: 'Test error',
        requestId: 'req-123',
        timestamp: expect.any(String)
      });
    });

    it('should handle regular Error instances', () => {
      const errorHandler = createExpressErrorHandler({ logger });
      const regularError = new Error('Regular error');

      errorHandler(regularError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        code: 'INTERNAL_SERVER_ERROR',
        title: 'Internal Server Error',
        message: 'Regular error',
        requestId: 'req-123',
        timestamp: expect.any(String)
      });
    });

    it('should include stack trace in development mode', () => {
      process.env.NODE_ENV = 'development';
      const errorHandler = createExpressErrorHandler({ includeStack: true, logger });
      const error = new Error('Test error');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String)
        })
      );

      process.env.NODE_ENV = 'test';
    });

    it('should not include requestId when header is missing', () => {
      req.headers = {};
      const errorHandler = createExpressErrorHandler({ logger });
      const error = new Error('Test error');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          requestId: expect.anything()
        })
      );
    });

    it('should call logger when provided', () => {
      const errorHandler = createExpressErrorHandler({ logger });
      const error = new Error('Test error');

      errorHandler(error, req, res, next);

      expect(logger).toHaveBeenCalledWith(error, {
        path: '/test',
        method: 'POST',
        body: { test: 'data' },
        params: { id: '123' },
        query: { filter: 'active' },
        requestId: 'req-123',
        statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('createExpressNotFoundHandler', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = {
        method: 'GET',
        path: '/nonexistent',
        headers: { 'X-Request-Id': 'req-456' }
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        setHeader: jest.fn()
      };
    });

    it('should create 404 response', () => {
      const notFoundHandler = createExpressNotFoundHandler();

      notFoundHandler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        code: 'NOT_FOUND',
        title: 'Not Found',
        message: 'Route GET /nonexistent not found',
        requestId: 'req-456'
      });
    });

    it('should use custom code when provided', () => {
      const notFoundHandler = createExpressNotFoundHandler({ code: 'CUSTOM_NOT_FOUND' });

      notFoundHandler(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 'CUSTOM_NOT_FOUND',
        title: 'Not Found',
        message: 'Route GET /nonexistent not found',
        requestId: 'req-456'
      });
    });
  });

  describe('processValidationErrors', () => {
    it('should handle Joi validation errors', () => {
      const joiError = {
        details: [
          { path: ['email'], message: 'Email is required', context: { key: 'email' } },
          { path: ['password'], message: 'Password too short', context: { key: 'password' } }
        ]
      };

      const result = processValidationErrors(joiError);

      expect(result).toEqual({
        email: 'Email is required',
        password: 'Password too short'
      });
    });

    it('should handle Zod validation errors', () => {
      const zodError = {
        issues: [
          { path: ['name'], message: 'Name is required' },
          { path: ['age'], message: 'Age must be a number' }
        ]
      };

      const result = processValidationErrors(zodError);

      expect(result).toEqual({
        name: 'Name is required',
        age: 'Age must be a number'
      });
    });

    it('should handle class-validator errors', () => {
      const classValidatorErrors = [
        {
          property: 'username',
          constraints: {
            isNotEmpty: 'Username should not be empty',
            minLength: 'Username must be at least 3 characters'
          }
        }
      ];

      const result = processValidationErrors(classValidatorErrors);

      expect(result).toEqual({
        username: 'Username should not be empty'
      });
    });

    it('should return empty object for unknown validation format', () => {
      const unknownError = { someProperty: 'someValue' };

      const result = processValidationErrors(unknownError);

      expect(result).toEqual({});
    });
  });

  describe('asyncHandler', () => {
    it('should call next with error when promise rejects', async () => {
      const next = jest.fn();
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);

      const handler = asyncHandler(asyncFn);
      await handler({}, {}, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should not call next when promise resolves', async () => {
      const next = jest.fn();
      const asyncFn = jest.fn().mockResolvedValue('success');

      const handler = asyncHandler(asyncFn);
      await handler({}, {}, next);

      expect(next).not.toHaveBeenCalled();
    });
  });
});