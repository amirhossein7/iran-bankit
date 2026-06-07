'use strict';

const { getBankByIban } = require('../src/index');

const ibans = [
  // Full 26-char form (with IR prefix)
  'IR240170000000000000000000', // Bank Meli  — code 017 (was broken: showed Bank Dey)
  'IR240660000000000000000000', // Bank Dey   — code 066 (was broken: showed Bank Meli)
  'IR240560000000000000000000', // Bank Saman — Blu Bank also uses this IBAN code
  'IR240620000000000000000000', // Bank Ayandeh
  'IR240120000000000000000000', // Bank Mellat
  'IR820540102680020817909002', // Bank Parsian (real-world example)

  // 24-digit form (without IR prefix) — also accepted
  '240170000000000000000000',

  // Whitespace is stripped automatically (groups of 4 after the check digits)
  'IR24 0170 0000 0000 0000 0000 00',

  // Wrong length — returns null
  'IR2401700000',
];

console.log('=== Bank detection from IBAN (Sheba) ===\n');

for (const iban of ibans) {
  const bank = getBankByIban(iban);
  const display = iban.padEnd(34);
  if (bank) {
    console.log(`${display}  →  ${bank.nameFa} (${bank.nameEn})  [code: ${bank.ibanCode}]`);
  } else {
    console.log(`${display}  →  (unknown or invalid length)`);
  }
}
