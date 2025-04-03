/**
 * Represents an amount with asset, value, and scale.
 */
export type Amount = {
  asset: string;
  value: number;
  scale: number;
  operation?: string;
};
