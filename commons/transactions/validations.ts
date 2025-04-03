import { Amount } from './transactions';

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
 * Function to undo the scale calculations
 *
 * @param value
 * @param scale
 * @returns
 */
export function undoScale(value: number, scale: number): number {
  return value * 10 ** scale;
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
 * @throws {Error} If `v` is not a number when `assetOrAmount` is a string.
 * @throws {Error} If `s` is not a number when `assetOrAmount` is a string.
 */
export function findScale(amount: Amount): Amount;
export function findScale(asset: string, v: number, s: number): Amount;
export function findScale(
  assetOrAmount: string | Amount,
  v?: number,
  s?: number,
): Amount {
  if (typeof assetOrAmount === 'object') {
    return findScale(
      assetOrAmount.asset,
      assetOrAmount.value,
      assetOrAmount.scale,
    );
  }

  if (typeof v !== 'number') {
    throw new Error('findScale: Value must be a number.');
  }

  if (typeof s !== 'number') {
    throw new Error('findScale: Scale must be a number.');
  }

  const valueString = v.toString();
  const parts = valueString.split('.');

  let scale = s;
  let value = Math.floor(v); // Default value as integer

  if (parts.length > 1) {
    scale = parts[1].length;
    value = undoScale(v, scale);

    if (parts[1] !== '0') {
      scale += s;
    }
  }

  const amount: Amount = {
    asset: assetOrAmount,
    value: value,
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
