import * as main from './main';
import { transactions } from './transactions';

describe('main module', () => {
  test('should export content from transactions', () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe('object');
  });

  test('should re-export all items from transactions module', () => {
    // Check that all exports from transactions are available in main
    Object.keys(transactions).forEach((key) => {
      expect(main.transactions).toHaveProperty(key);
    });
  });
});
