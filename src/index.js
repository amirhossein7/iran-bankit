'use strict';

const banks = require('./banks');
const { normalizeDigits, validateCard, validateIbanChecksum } = require('./validators');
const {
  formatToIban,
  formatToCardNumber,
  formatLTRNumber,
  currencyFormatter,
} = require('./formatters');

// --- Card prefix index ---
// Build map keyed by prefix string, then sort by prefix length descending so that
// longer prefixes (e.g. Blu Bank's 8-digit "62198618") are matched before shorter
// ones (e.g. Bank Saman's 6-digit "621986"). This is the core fix for the Blu Bank
// mis-identification bug present in smohamadabedy/shaba.
const _cardPrefixMap = new Map();
for (const bank of banks) {
  for (const prefix of bank.cardPrefixes) {
    _cardPrefixMap.set(prefix, bank);
  }
}
const _sortedPrefixes = [..._cardPrefixMap.keys()].sort(
  (a, b) => b.length - a.length
);

// --- IBAN code index ---
// Each bank can have multiple ibanCodes. First entry per code wins when codes overlap.
const _ibanCodeMap = new Map();
for (const bank of banks) {
  for (const code of bank.ibanCode) {
    if (!_ibanCodeMap.has(code)) {
      _ibanCodeMap.set(code, bank);
    }
  }
}

// ---------------------------------------------------------------------------

/**
 * Returns all bank entries.
 * @returns {import('../index').Bank[]}
 */
function getAllBanks() {
  return banks;
}

/**
 * Identifies a bank from a card number using its prefix.
 * Handles Persian/Arabic numerals and cards with spaces or dashes.
 * Longer prefixes are matched first, correctly identifying Blu Bank cards
 * (62198618*, 62198619*) instead of mis-returning Bank Saman.
 *
 * @param {string|number} cardNumber - Full 16-digit card number.
 * @returns {import('../index').Bank|null} The matched bank or null.
 */
function getBankByCard(cardNumber) {
  const digits = normalizeDigits(String(cardNumber)).replace(/\D/g, '');
  if (digits.length < 6) return null;

  for (const prefix of _sortedPrefixes) {
    if (digits.startsWith(prefix)) {
      return _cardPrefixMap.get(prefix);
    }
  }
  return null;
}

/**
 * Identifies a bank from an Iranian IBAN (Sheba) number.
 * Accepts the 24-digit form (without "IR") or the full 26-char form.
 * Handles Persian/Arabic numerals and whitespace.
 *
 * The IBAN bank code occupies positions 4–6 (0-indexed) after the "IR" prefix:
 *   IR + 2 check digits + 3-digit bank code + 19-digit account = 26 chars.
 *
 * @param {string} iban - IBAN with or without leading "IR".
 * @returns {import('../index').Bank|null} The matched bank or null.
 */
function getBankByIban(iban) {
  iban = normalizeDigits(String(iban)).replace(/\s/g, '').toUpperCase();
  if (!iban.startsWith('IR')) iban = 'IR' + iban;
  if (iban.length < 8) return null;

  const code = iban.slice(4, 7);
  return _ibanCodeMap.get(code) || null;
}

module.exports = {
  getAllBanks,
  getBankByCard,
  getBankByIban,
  validateCard,
  validateIbanChecksum,
  formatToIban,
  formatToCardNumber,
  formatLTRNumber,
  currencyFormatter,
};
