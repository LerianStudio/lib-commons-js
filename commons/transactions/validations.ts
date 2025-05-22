import { Amount } from './transactions';
import { Decimal } from 'decimal.js-light';

/**
 * Function to scale a value based on the difference between two scales
 *
 * @param v - The value to scale
 * @param s0 - The initial scale
 * @param s1 - The target scale
 * @returns The scaled value
 */
export function scale(v: number, s0: number, s1: number): number {
  return Math.round(v * 10 ** (s1 - s0));
}

/**
 * Function to undo the scale calculations.
 * It doesn't guarantee precision due to IEEE 754 floating point representation.
 *
 * Source: https://en.wikipedia.org/wiki/Double-precision_floating-point_format#:~:text=Double%2Dprecision%20binary%20floating%2Dpoint%20is%20a%20commonly%20used%20format,Sign%20bit%3A%201%20bit
 *
 * @param value
 * @param scale
 * @returns
 */
export function undoScale(value: number, scale: number): number {
  return value * 10 ** scale;
}

/**
 * Function to undo the scale calculations using Decimal.js
 *
 * @param value - The numeric value to be scaled.
 * @param scale - The scale factor to apply.
 * @returns The scaled result as a Decimal.
 */
export function undoScaleDecimal(value: number, scale: number): Decimal {
  return new Decimal(value).mul(new Decimal(10).pow(scale));
}

/**
 * Determines the scale and value of an amount, either from an `Amount` object or from individual parameters.
 *
 * Overload 1:
 * - Accepts an `Amount` object and returns a new `Amount` with the calculated scale and value.
 *
 * Overload 2:
 * - Accepts an asset name, a numeric value, and a scale, and returns an `Amount` object with the calculated scale and value.
 *
 * @param assetOrAmount - Either an `Amount` object or the asset name as a string.
 * @param v - (Optional) The numeric value of the asset. Required if `assetOrAmount` is a string.
 * @param s - (Optional) The scale of the asset. Required if `assetOrAmount` is a string.
 * @returns An `Amount` object containing the asset name, scaled value, and scale.
 *
 */
export function findScale(amount: Amount): Amount;
export function findScale(asset: string, v: string): Amount;
export function findScale(asset: string, v: string, s: number): Amount;
export function findScale(asset: string, v: number, s: number): Amount;
export function findScale(asset: string, v: Decimal): Amount;
export function findScale(asset: string, v: Decimal, s: number): Amount;
export function findScale(
  assetOrAmount: string | Amount,
  v?: number | string | Decimal,
  s: number = 0,
): Amount {
  if (typeof assetOrAmount === 'object') {
    return findScale(
      assetOrAmount.asset,
      assetOrAmount.value,
      assetOrAmount.scale,
    );
  }

  if (v instanceof Decimal) {
    return findScale(assetOrAmount, v.toString(), s);
  }

  if (v === undefined) {
    throw new Error('findScale: Value is required');
  }

  const value = typeof v === 'number' ? v : parseFloat(v);
  if (isNaN(value)) {
    throw new Error(`findScale: Invalid value provided: ${v}`);
  }
  const valueString = typeof v === 'number' ? v.toString() : v;
  const parts = valueString.split('.');

  let scale = s;
  let base = Math.floor(value); // Default value as integer

  if (parts.length > 1) {
    scale = parts[1].length;
    base = undoScale(value, scale);

    if (parts[1] !== '0') {
      scale += s;
    }
  }

  const amount: Amount = {
    asset: assetOrAmount,
    value: base,
    scale: scale,
  };

  return amount;
}

/**
 * Function to normalize the scale of all values.
 *
 * @param total - The total Amount object
 * @param amount - The amount to normalize
 * @param remaining - The remaining Amount object
 */
export function normalize(
  total: Amount,
  amount: Amount,
  remaining: Amount,
): void {
  if (total.scale < amount.scale) {
    if (total.value !== 0) {
      const v0 = scale(total.value, total.scale, amount.scale);

      total.value = v0 + amount.value;
    } else {
      total.value += amount.value;
    }

    total.scale = amount.scale;
  } else {
    if (total.value !== 0) {
      const v0 = scale(amount.value, amount.scale, total.scale);

      total.value += v0;

      amount.value = v0;
      amount.scale = total.scale;
    } else {
      total.value += amount.value;
      total.scale = amount.scale;
    }
  }

  if (remaining.scale < amount.scale) {
    const v0 = scale(remaining.value, remaining.scale, amount.scale);

    remaining.value = v0 - amount.value;
    remaining.scale = amount.scale;
  } else {
    const v0 = scale(amount.value, amount.scale, remaining.scale);

    remaining.value -= v0;
  }
}
