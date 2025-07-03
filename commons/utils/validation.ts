/**
 * Validation utilities
 * Based on   validation functions
 */

import { ValidationError, ValidationResult } from '../errors/types';
import { ValidationErrorHandler } from '../errors/validation-error';
import { 
  VALIDATION_PATTERNS, 
  ACCOUNT_TYPES, 
  ASSET_TYPES, 
  METADATA_LIMITS 
} from '../errors/constants';

export class ValidationUtils {
  /**
   * Check if array contains value (type-safe)
   */
  static contains<T>(array: T[], value: T): boolean {
    return array.includes(value);
  }

  /**
   * Validate UUID format
   */
  static isUUID(value: string): boolean {
    return VALIDATION_PATTERNS.UUID.test(value);
  }

  /**
   * Validate UUID and return validation result
   */
  static validateUUID(field: string, value: string): ValidationResult {
    if (!this.isUUID(value)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.invalidFormatError(field, value, 'UUID')
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate metadata key and value length
   * Based on lib-commons CheckMetadataKeyAndValueLength
   */
  static validateMetadataKeyAndValue(
    key: string, 
    value: string
  ): ValidationResult {
    const errors: ValidationError[] = [];

    if (key.length > METADATA_LIMITS.MAX_KEY_LENGTH) {
      errors.push(
        ValidationErrorHandler.lengthExceededError(
          'key', 
          key, 
          METADATA_LIMITS.MAX_KEY_LENGTH, 
          true
        )
      );
    }

    if (value.length > METADATA_LIMITS.MAX_VALUE_LENGTH) {
      errors.push(
        ValidationErrorHandler.lengthExceededError(
          'value', 
          value, 
          METADATA_LIMITS.MAX_VALUE_LENGTH, 
          false
        )
      );
    }

    return ValidationErrorHandler.createValidationResult(errors);
  }

  /**
   * Validate country code (ISO 3166-1 alpha-2)
   * Based on lib-commons ValidateCountryAddress
   */
  static validateCountryCode(country: string): ValidationResult {
    if (!VALIDATION_PATTERNS.COUNTRY_CODE.test(country)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'country',
          country,
          '0032',
          'Country code must be ISO 3166-1 alpha-2 format (e.g., US, BR, CA)'
        )
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate account type
   * Based on lib-commons ValidateAccountType
   */
  static validateAccountType(accountType: string): ValidationResult {
    const validAccountTypes = Object.values(ACCOUNT_TYPES);
    if (!validAccountTypes.includes(accountType as any)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'accountType',
          accountType,
          '0066',
          `Account type must be one of: ${validAccountTypes.join(', ')}`
        )
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate asset type
   * Based on lib-commons ValidateType
   */
  static validateAssetType(assetType: string): ValidationResult {
    const validAssetTypes = Object.values(ASSET_TYPES);
    if (!validAssetTypes.includes(assetType as any)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'assetType',
          assetType,
          '0040',
          `Asset type must be one of: ${validAssetTypes.join(', ')}`
        )
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate code format (uppercase letters only)
   * Based on lib-commons ValidateCode
   */
  static validateCode(code: string): ValidationResult {
    if (!VALIDATION_PATTERNS.UPPERCASE_CODE.test(code)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'code',
          code,
          '0004',
          'Code must contain only uppercase letters'
        )
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate currency code (ISO 4217)
   * Based on lib-commons ValidateCurrency
   */
  static validateCurrencyCode(currency: string): ValidationResult {
    if (!VALIDATION_PATTERNS.CURRENCY_CODE.test(currency)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'currency',
          currency,
          '0005',
          'Currency code must be ISO 4217 format (e.g., USD, BRL, EUR)'
        )
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDateFormat(date: string): ValidationResult {
    if (!VALIDATION_PATTERNS.DATE_YYYY_MM_DD.test(date)) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.invalidFormatError(
          'date',
          date,
          'YYYY-MM-DD'
        )
      ]);
    }

    // Additional date validation
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime()) || dateObj.toISOString().split('T')[0] !== date) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.createValidationError(
          'date',
          date,
          '0033',
          'Invalid date value'
        )
      ]);
    }

    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate: string, endDate: string): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate individual dates
    const startValidation = this.validateDateFormat(startDate);
    const endValidation = this.validateDateFormat(endDate);

    if (!startValidation.isValid) {
      errors.push(...startValidation.errors);
    }
    
    if (!endValidation.isValid) {
      errors.push(...endValidation.errors);
    }

    // If both dates are valid, check range
    if (startValidation.isValid && endValidation.isValid) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        errors.push(
          ValidationErrorHandler.createValidationError(
            'dateRange',
            { startDate, endDate },
            '0033',
            'Start date must be before end date'
          )
        );
      }
    }

    return ValidationErrorHandler.createValidationResult(errors);
  }

  /**
   * Check if string is null or empty
   */
  static isNilOrEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  /**
   * Validate required field
   */
  static validateRequired(field: string, value: any): ValidationResult {
    if (value === null || value === undefined || 
        (typeof value === 'string' && value.trim() === '')) {
      return ValidationErrorHandler.createValidationResult([
        ValidationErrorHandler.requiredFieldError(field)
      ]);
    }
    return ValidationErrorHandler.createValidationResult();
  }

  /**
   * Combine multiple validation results
   */
  static combineValidations(...validations: ValidationResult[]): ValidationResult {
    return ValidationErrorHandler.combineResults(...validations);
  }
}