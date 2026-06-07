'use strict';

/**
 * Example: Identify a bank from a card number.
 *
 * Key fix: Blu Bank cards start with 62198618* or 62198619*, which share
 * the same 6-digit prefix as Bank Saman (621986). iran-bankit checks
 * longer prefixes first so Blu Bank is never mis-reported as Saman.
 */

const { getBankByCard } = require('../src/index');

const cards = [
  // Blu Bank (8-digit prefix — previously broken, returned Bank Saman)
  '6219861800001234',
  '6219861912345678',

  // Bank Saman (6-digit prefix — same first 6 digits as Blu Bank)
  '6219860012345678',

  // Other banks
  '6037990000000006', // Bank Meli
  '6104330000000000', // Bank Mellat
  '5029380000000000', // Bank Dey
  '6362140000000000', // Bank Ayandeh
  '6037531234567890', // Bank Tejarat

  // Persian numerals — handled automatically
  '۶۱۰۴۳۳۰۰۰۰۰۰۰۰۰۰',

  // Card with dashes
  '6037-9900-0000-0006',

  // Unknown prefix
  '1234560000000000',
];

console.log('=== Bank detection from card number ===\n');

for (const card of cards) {
  const bank = getBankByCard(card);
  const display = card.length > 20 ? card : card.padEnd(20);
  if (bank) {
    console.log(`${display}  →  ${bank.nameFa} (${bank.nameEn})  [id: ${bank.id}]`);
  } else {
    console.log(`${display}  →  (unknown)`);
  }
}
