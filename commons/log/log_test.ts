import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConsoleLogger } from './log';
import { NoneLogger } from './none';
import { LogLevel, parseLevel } from './types';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info logging', () => {
    it('should log info messages', () => {
      logger.info('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO]', 'test message');
    });

    it('should log formatted info messages', () => {
      logger.infof('test %s', 'message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] test message');
    });

    it('should log info messages with newline', () => {
      logger.infoln('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO]', 'test message');
    });
  });

  describe('error logging', () => {
    it('should log error messages', () => {
      logger.error('test error');
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR]', 'test error');
    });

    it('should log formatted error messages', () => {
      logger.errorf('error %s', 'message');
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] error message');
    });
  });

  describe('warn logging', () => {
    it('should log warn messages', () => {
      logger.warn('test warning');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN]', 'test warning');
    });
  });

  describe('debug logging', () => {
    it('should log debug messages', () => {
      logger.debug('test debug');
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG]', 'test debug');
    });
  });

  describe('fatal logging', () => {
    let exitSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit');
      });
    });

    it('should log fatal messages and exit', () => {
      expect(() => logger.fatal('fatal error')).toThrow('process.exit');
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR]', 'fatal error');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('withFields', () => {
    it('should include fields in log output', () => {
      const loggerWithFields = logger.withFields('key', 'value');
      loggerWithFields.info('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] ["key","value"]', 'test message');
    });
  });

  describe('withDefaultMessageTemplate', () => {
    it('should use default message template', () => {
      const loggerWithTemplate = logger.withDefaultMessageTemplate('Default: %s');
      loggerWithTemplate.info('test');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO]', 'Default: %s', 'test');
    });
  });

  describe('sync', () => {
    it('should resolve immediately', async () => {
      await expect(logger.sync()).resolves.toBeUndefined();
    });
  });
});

describe('NoneLogger', () => {
  let logger: NoneLogger;
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    logger = new NoneLogger();
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not log any messages', () => {
    logger.info('test');
    logger.error('test');
    logger.warn('test');
    logger.debug('test');
    
    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
    expect(consoleSpy.warn).not.toHaveBeenCalled();
    expect(consoleSpy.debug).not.toHaveBeenCalled();
  });

  it('should exit on fatal calls', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    expect(() => logger.fatal('fatal')).toThrow('process.exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should return self for withFields and withDefaultMessageTemplate', () => {
    expect(logger.withFields('key', 'value')).toBe(logger);
    expect(logger.withDefaultMessageTemplate('template')).toBe(logger);
  });
});

describe('parseLevel', () => {
  it('should parse valid log levels', () => {
    expect(parseLevel('panic')).toBe(LogLevel.PANIC);
    expect(parseLevel('fatal')).toBe(LogLevel.FATAL);
    expect(parseLevel('error')).toBe(LogLevel.ERROR);
    expect(parseLevel('warn')).toBe(LogLevel.WARN);
    expect(parseLevel('warning')).toBe(LogLevel.WARN);
    expect(parseLevel('info')).toBe(LogLevel.INFO);
    expect(parseLevel('debug')).toBe(LogLevel.DEBUG);
  });

  it('should be case insensitive', () => {
    expect(parseLevel('INFO')).toBe(LogLevel.INFO);
    expect(parseLevel('Error')).toBe(LogLevel.ERROR);
    expect(parseLevel('WARN')).toBe(LogLevel.WARN);
  });

  it('should throw error for invalid levels', () => {
    expect(() => parseLevel('invalid')).toThrow('not a valid LogLevel: "invalid"');
  });
});