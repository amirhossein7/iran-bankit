'use strict';

/**
 * Converts Persian (۰-۹) and Arabic-Indic (٠-٩) numerals to ASCII digits.
 * @param {string} str
 * @returns {string}
 */
function normalizeDigits(str) {
  return String(str)
    .replace(/[۰-۹]/g, d => d.charCodeAt(0) - 0x06f0)
    .replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x0660);
}

/**
 * Validates an Iranian 16-digit card number using the Luhn algorithm.
 * Accepts strings with spaces/dashes and Persian/Arabic numerals.
 * @param {string|number} cardNumber
 * @returns {boolean}
 */
function validateCard(cardNumber) {
  const digits = normalizeDigits(String(cardNumber)).replace(/\D/g, '');
  if (digits.length !== 16) return false;

  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/**
 * Validates an Iranian IBAN (Sheba) checksum using the ISO 7064 mod-97 algorithm.
 * Accepts the number with or without the leading "IR" prefix.
 * @param {string} iban
 * @returns {boolean}
 */
function validateIbanChecksum(iban) {
  iban = normalizeDigits(String(iban)).replace(/\s/g, '').toUpperCase();
  if (!iban.startsWith('IR')) iban = 'IR' + iban;
  if (iban.length !== 26) return false;

  // Move first 4 chars to end, then convert letters to numbers (A=10, B=11, ...)
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged
    .split('')
    .map(c => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : c;
    })
    .join('');

  // Process in 9-digit chunks to stay within safe integer range
  let remainder = numeric;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder =
      (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
  }
  return parseInt(remainder, 10) % 97 === 1;
}

module.exports = { normalizeDigits, validateCard, validateIbanChecksum };
