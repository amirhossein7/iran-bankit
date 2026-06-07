export interface Bank {
  /** Unique machine-readable identifier (e.g. "meli", "blu", "saman") */
  id: string;
  /** English name */
  nameEn: string;
  /** Persian/Farsi name */
  nameFa: string;
  /**
   * 3-digit IBAN bank code used in Iranian Sheba numbers (positions 4–6).
   * null when the bank shares another bank's IBAN code (e.g. Blu Bank → Saman).
   */
  ibanCode: string | null;
  /** Card number prefixes (6 or 8 digits) that belong to this bank. */
  cardPrefixes: string[];
  /**
   * The bank's ID key for looking up its SVG in `iran-bankit/logos`.
   * null when no logo is available for this bank.
   * @example
   * import { logos } from 'iran-bankit/logos';
   * const svg = bank.logo ? logos[bank.logo] : null;
   */
  logo: string | null;
}

/**
 * Returns all known Iranian bank entries.
 */
export function getAllBanks(): Bank[];

/**
 * Identifies a bank from a card number by matching its prefix.
 * Longer prefixes are matched first, so Blu Bank cards (62198618*, 62198619*)
 * are correctly identified instead of being mis-reported as Bank Saman.
 *
 * @param cardNumber Full 16-digit card number. Accepts Persian/Arabic numerals,
 *                   spaces, and dashes.
 * @returns The matched Bank, or null if no match is found.
 */
export function getBankByCard(cardNumber: string | number): Bank | null;

/**
 * Identifies a bank from an Iranian IBAN (Sheba) number.
 * Extracts the 3-digit bank code from positions 4–6 of the normalised IBAN.
 *
 * @param iban IBAN with or without the leading "IR" prefix (24 or 26 characters).
 *             Accepts Persian/Arabic numerals and whitespace.
 * @returns The matched Bank, or null if the code is unknown or the length is wrong.
 */
export function getBankByIban(iban: string): Bank | null;

/**
 * Validates a 16-digit Iranian card number using the Luhn algorithm.
 * @param cardNumber Accepts Persian/Arabic numerals, spaces, and dashes.
 * @returns true if the number passes the Luhn check.
 */
export function validateCard(cardNumber: string | number): boolean;

/**
 * Validates an Iranian IBAN (Sheba) checksum using ISO 7064 mod-97.
 * @param iban IBAN with or without the leading "IR" prefix.
 * @returns true if the checksum is valid.
 */
export function validateIbanChecksum(iban: string): boolean;

/**
 * Formats a raw digit string into a display-ready IBAN (Sheba) string.
 * Strips non-digits, limits to 24 digits, and groups as: 2 · 4 · 4 · 4 · 4 · 4 · 2.
 *
 * @example formatToIban('240170012345678901234567') → '24 0170 0123 4567 8901 2345 67'
 */
export function formatToIban(value: string): string;

/**
 * Formats a raw digit string into a display-ready card number string.
 * Strips non-digits, limits to 16 digits, and groups as: 4 · 4 · 4 · 4.
 *
 * @example formatToCardNumber('6037990000000006') → '6037 9900 0000 0006'
 */
export function formatToCardNumber(value: string): string;

/**
 * Prepends a Unicode LTR mark (U+200E) to force left-to-right rendering of
 * numeric strings inside RTL (Persian/Arabic) layouts.
 * Returns an empty string when value is falsy.
 */
export function formatLTRNumber(value: string): string;

/**
 * Formats a number as a Persian-digit currency string with thousands separators.
 * Accepts string or number input. Preserves an optional decimal part.
 * Returns an empty string for blank or non-numeric input.
 *
 * @example currencyFormatter(1234567.89) → '۱,۲۳۴,۵۶۷.۸۹'
 */
export function currencyFormatter(num: string | number): string;
