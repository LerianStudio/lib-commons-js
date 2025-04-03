import { scale, undoScale, findScale } from './validations';

describe('scale', () => {
  it('should scale a value up when target scale is greater than initial scale', () => {
    expect(scale(1.23, 2, 4)).toBe(123);
  });

  it('should scale a value down when target scale is less than initial scale', () => {
    expect(scale(12300, 4, 2)).toBe(123);
  });

  it('should return the same value when scales are equal', () => {
    expect(scale(123, 2, 2)).toBe(123);
  });
});

describe('undoScale', () => {
  it('should undo scaling by multiplying the value by 10 raised to the scale', () => {
    expect(undoScale(123, 2)).toBe(12300);
  });

  it('should return the original value when scale is 0', () => {
    expect(undoScale(123, 0)).toBe(123);
  });

  it('should handle negative scales correctly', () => {
    expect(undoScale(12300, -2)).toBe(123);
  });

  it('should handle negative values correctly', () => {
    expect(undoScale(-123, 2)).toBe(-12300);
  });

  it('should handle zero value correctly regardless of scale', () => {
    expect(undoScale(0, 5)).toBe(0);
    expect(undoScale(0, -5)).toBe(0);
  });
});

describe('findScale', () => {
  it('should return an Amount object with correct scale and value for a number with decimals', () => {
    expect(findScale('USD', 123.45, 2)).toEqual({
      asset: 'USD',
      value: 12345,
      scale: 4,
    });
  });

  it('should return an Amount object with correct scale and value for an integer', () => {
    expect(findScale('USD', 123, 2)).toEqual({
      asset: 'USD',
      value: 123,
      scale: 2,
    });
  });

  it('should handle amount as an object', () => {
    expect(findScale({ asset: 'USD', value: 123.45, scale: 2 })).toEqual({
      asset: 'USD',
      value: 12345,
      scale: 4,
    });
  });

  it('should handle negative numbers correctly', () => {
    expect(findScale('USD', -123.45, 2)).toEqual({
      asset: 'USD',
      value: -12345,
      scale: 4,
    });
  });

  it('should throw an error if value is not a number', () => {
    expect(() => findScale('USD', '123' as any, 2)).toThrow(
      'findScale: Value must be a number.',
    );
  });

  it('should throw an error if scale is not a number', () => {
    expect(() => findScale('USD', 123, '2' as any)).toThrow(
      'findScale: Scale must be a number.',
    );
  });
});
