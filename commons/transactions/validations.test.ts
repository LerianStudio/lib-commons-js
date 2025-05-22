import Decimal from 'decimal.js-light';
import {
  scale,
  undoScale,
  findScale,
  undoScaleDecimal,
  normalize,
} from './validations';

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
    expect(undoScale(1015, -2)).toBe(10.15);
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

describe('undoScaleDecimal', () => {
  it('should undo scaling by multiplying the value by 10 raised to the scale using Decimal', () => {
    expect(undoScaleDecimal(123, 2).toNumber()).toBe(12300);
    expect(undoScaleDecimal(1015, -2).toNumber()).toBe(10.15);
  });

  it('should return the original value when scale is 0', () => {
    expect(undoScaleDecimal(123, 0).toNumber()).toBe(123);
  });

  it('should handle negative scales correctly', () => {
    expect(undoScaleDecimal(12300, -2).toNumber()).toBe(123);
  });

  it('should handle negative values correctly', () => {
    expect(undoScaleDecimal(-123, 2).toNumber()).toBe(-12300);
  });

  it('should handle zero value correctly regardless of scale', () => {
    expect(undoScaleDecimal(0, 5).toNumber()).toBe(0);
    expect(undoScaleDecimal(0, -5).toNumber()).toBe(0);
  });

  it('should handle the 0.0000017 case correctly', () => {
    expect(undoScaleDecimal(17, -7).toNumber()).toBe(0.0000017);
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

  it('should handle amount as a string', () => {
    expect(findScale('USD', '123.45')).toEqual({
      asset: 'USD',
      value: 12345,
      scale: 2,
    });
  });

  it('should handle amount as a Decimal', () => {
    expect(findScale('USD', new Decimal(123.45), 0)).toEqual({
      asset: 'USD',
      value: 12345,
      scale: 2,
    });
  });

  it('should handle the 0.0000017 case correctly', () => {
    const value = '0.0000017';

    expect(findScale('USD', Number(value), 0)).toEqual({
      asset: 'USD',
      value: 17,
      scale: 7,
    });
    expect(findScale('USD', value)).toEqual({
      asset: 'USD',
      value: 17,
      scale: 7,
    });
    expect(findScale('USD', new Decimal(value))).toEqual({
      asset: 'USD',
      value: 17,
      scale: 7,
    });
  });

  it('should handle negative numbers correctly', () => {
    expect(findScale('USD', -123.45, 2)).toEqual({
      asset: 'USD',
      value: -12345,
      scale: 4,
    });
  });

  it('should throw an error if value is not provided', () => {
    expect(() => findScale('USD', undefined as any, 2)).toThrow(
      'findScale: Value is required',
    );
  });
});

describe('findScale and undoScale integration', () => {
  it('should correctly scale and then undo the scaling', () => {
    const asset = 'USD';
    const value = 123.456;

    const scaledAmount = findScale(asset, value, 0);
    const originalValue = undoScale(scaledAmount.value, -scaledAmount.scale);

    expect(originalValue).toBe(value);
  });

  it('should handle the 0.0000017 case corretly', () => {
    const asset = 'USD';
    const value = 0.0000017;

    const scaledAmount = findScale(asset, value, 0);
    const originalValue = undoScale(scaledAmount.value, -scaledAmount.scale);

    expect(originalValue).toBeCloseTo(value);
  });

  it('should handle the 0.0000017 case correctly as String', () => {
    const asset = 'USD';
    const value = '0.0000017';

    const scaledAmount = findScale(asset, value, 0);
    const originalValue = undoScaleDecimal(
      scaledAmount.value,
      -scaledAmount.scale,
    );

    expect(originalValue.toString()).toBe(value);
  });
});

describe('normalize', () => {
  it('should normalize when total scale is less than amount scale and total value is not zero', () => {
    const total = { asset: 'USD', value: 100, scale: 2 };
    const amount = { asset: 'USD', value: 3456, scale: 4 };
    const remaining = { asset: 'USD', value: 500, scale: 2 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 10000 + 3456, scale: 4 });
    expect(amount).toEqual({ asset: 'USD', value: 3456, scale: 4 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3456, scale: 4 });
  });

  it('should normalize when total scale is less than amount scale and total value is zero', () => {
    const total = { asset: 'USD', value: 0, scale: 2 };
    const amount = { asset: 'USD', value: 3456, scale: 4 };
    const remaining = { asset: 'USD', value: 500, scale: 2 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 3456, scale: 4 });
    expect(amount).toEqual({ asset: 'USD', value: 3456, scale: 4 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3456, scale: 4 });
  });

  it('should normalize when total scale is greater than amount scale and total value is not zero', () => {
    const total = { asset: 'USD', value: 10000, scale: 4 };
    const amount = { asset: 'USD', value: 35, scale: 2 };
    const remaining = { asset: 'USD', value: 50000, scale: 4 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 10000 + 3500, scale: 4 });
    expect(amount).toEqual({ asset: 'USD', value: 3500, scale: 4 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3500, scale: 4 });
  });

  it('should normalize when total scale is greater than amount scale and total value is zero', () => {
    const total = { asset: 'USD', value: 0, scale: 4 };
    const amount = { asset: 'USD', value: 35, scale: 2 };
    const remaining = { asset: 'USD', value: 50000, scale: 4 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 35, scale: 2 });
    expect(amount).toEqual({ asset: 'USD', value: 35, scale: 2 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3500, scale: 4 });
  });

  it('should normalize when remaining scale is less than amount scale', () => {
    const total = { asset: 'USD', value: 100, scale: 2 };
    const amount = { asset: 'USD', value: 3456, scale: 4 };
    const remaining = { asset: 'USD', value: 5, scale: 0 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 10000 + 3456, scale: 4 });
    expect(amount).toEqual({ asset: 'USD', value: 3456, scale: 4 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3456, scale: 4 });
  });

  it('should normalize when remaining scale is greater than amount scale', () => {
    const total = { asset: 'USD', value: 100, scale: 2 };
    const amount = { asset: 'USD', value: 35, scale: 2 };
    const remaining = { asset: 'USD', value: 50000, scale: 4 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 100 + 35, scale: 2 });
    expect(amount).toEqual({ asset: 'USD', value: 35, scale: 2 });
    expect(remaining).toEqual({ asset: 'USD', value: 50000 - 3500, scale: 4 });
  });

  it('should handle different assets correctly', () => {
    const total = { asset: 'USD', value: 100, scale: 2 };
    const amount = { asset: 'EUR', value: 35, scale: 2 };
    const remaining = { asset: 'USD', value: 500, scale: 2 };

    normalize(total, amount, remaining);

    expect(total).toEqual({ asset: 'USD', value: 135, scale: 2 });
    expect(amount).toEqual({ asset: 'EUR', value: 35, scale: 2 });
    expect(remaining).toEqual({ asset: 'USD', value: 465, scale: 2 });
  });
});
