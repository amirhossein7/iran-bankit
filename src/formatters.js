'use strict';

/**
 * Formats a raw digit string into a spaced IBAN (Sheba) display string.
 * Strips all non-digits, keeps up to 24 digits, and groups them as:
 * 2 · 4 · 4 · 4 · 4 · 4 · 2  (matching the Iranian Sheba layout).
 *
 * @param {string} value
 * @returns {string}
 */
function formatToIban(value) {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, 24);
  return limited.replace(
    /(\d{2})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,2})/,
    (_, g1, g2, g3, g4, g5, g6, g7) =>
      [g1, g2, g3, g4, g5, g6, g7].filter(Boolean).join(' '),
  );
}

/**
 * Formats a raw digit string into a spaced card number display string.
 * Strips all non-digits, keeps up to 16 digits, and groups them as 4 · 4 · 4 · 4.
 *
 * @param {string} value
 * @returns {string}
 */
function formatToCardNumber(value) {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, 16);
  return limited.replace(
    /(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/,
    (_, g1, g2, g3, g4) => [g1, g2, g3, g4].filter(Boolean).join(' '),
  );
}

/**
 * Prepends a Unicode LTR mark (U+200E) so that a numeric string renders
 * left-to-right inside RTL (Persian/Arabic) layouts.
 *
 * @param {string} value
 * @returns {string}
 */
function formatLTRNumber(value) {
  return value ? '‎' + value : '';
}

const _PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/**
 * Formats a number as a Persian-digit currency string with thousands separators.
 * - Accepts both numeric and string input.
 * - Preserves an optional decimal part.
 * - Returns an empty string for blank or non-numeric input.
 *
 * @param {string|number} num
 * @returns {string}
 */
function currencyFormatter(num) {
  const strNum = num.toString().trim();
  const isNegative = strNum.startsWith('-');
  const cleanNum = strNum.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

  if (!cleanNum || isNaN(Number(cleanNum))) return '';

  const [intPart, decimalPart] = cleanNum.split('.');

  const formattedInt = Number(intPart)
    .toLocaleString('en-US')
    .replace(/\d/g, d => _PERSIAN_DIGITS[+d]);

  const formattedDecimal = decimalPart
    ? decimalPart.replace(/\d/g, d => _PERSIAN_DIGITS[+d])
    : '';

  const result = formattedDecimal
    ? `${formattedInt}.${formattedDecimal}`
    : formattedInt;

  return isNegative ? `-${result}` : result;
}

module.exports = {
  formatToIban,
  formatToCardNumber,
  formatLTRNumber,
  currencyFormatter,
};
