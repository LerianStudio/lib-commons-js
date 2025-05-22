import { transactions } from './index';

describe('transactions/index.ts', () => {
  it('should export all functions from validations and transactions', () => {
    const expectedExports = [
      'scale',
      'undoScale',
      'undoScaleDecimal',
      'findScale',
    ];

    const actualExports = Object.keys(transactions);
    expect(actualExports).toEqual(expect.arrayContaining(expectedExports));
  });
});
