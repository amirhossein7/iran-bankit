'use strict';

/**
 * Example: Validate card numbers (Luhn) and IBAN checksums (ISO 7064 mod-97).
 */

const { validateCard, validateIbanChecksum } = require('../src/index');

// --- Card validation (Luhn algorithm) ---
console.log('=== Card validation (Luhn) ===\n');

const cardCases = [
  // [input, description]
  ['6037990000000006', 'valid card'],
  ['6037990000000007', 'invalid — wrong check digit'],
  ['123456789012345',  'only 15 digits — too short'],
  ['60379900000000060', '17 digits — too long'],
  ['۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۶', 'valid — Persian numerals'],
  ['6037-9900-0000-0006', 'valid — with dashes'],
  ['6037 9900 0000 0006', 'valid — with spaces'],
  ['0000000000000000', 'invalid — all zeros'],
];

for (const [card, desc] of cardCases) {
  const valid = validateCard(card);
  console.log(`  ${valid ? 'VALID  ' : 'INVALID'}  ${String(card).padEnd(24)}  (${desc})`);
}

// --- IBAN checksum validation (ISO 7064 mod-97) ---
console.log('\n=== IBAN checksum validation (mod-97) ===\n');

const ibanCases = [
  ['IR820540102680020817909002', 'valid — Bank Parsian (real)'],
  ['IR820540102680020817909001', 'invalid — last digit changed'],
  ['820540102680020817909002',   'valid — without IR prefix'],
  ['IR24017000000000000000000',  'invalid — 25 chars (too short)'],
  ['IR000000000000000000000000', 'invalid — zero checksum'],
];

for (const [iban, desc] of ibanCases) {
  const valid = validateIbanChecksum(iban);
  console.log(`  ${valid ? 'VALID  ' : 'INVALID'}  ${iban.padEnd(28)}  (${desc})`);
}
