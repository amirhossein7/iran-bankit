'use strict';

/**
 * Example: List all known Iranian banks with their details.
 */

const { getAllBanks } = require('../src/index');

const banks = getAllBanks();

console.log(`=== All Iranian banks (${banks.length} entries) ===\n`);
console.log(
  'id'.padEnd(18) +
  'nameEn'.padEnd(36) +
  'nameFa'.padEnd(30) +
  'ibanCode'.padEnd(10) +
  'cardPrefixes'
);
console.log('─'.repeat(110));

for (const bank of banks) {
  console.log(
    bank.id.padEnd(18) +
    bank.nameEn.padEnd(36) +
    bank.nameFa.padEnd(30) +
    (bank.ibanCode ?? '—').padEnd(10) +
    bank.cardPrefixes.join(', ')
  );
}
