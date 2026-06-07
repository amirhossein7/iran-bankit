'use strict';

/**
 * Example: Format card numbers, IBANs, and currency values for display.
 */

const {
  formatToCardNumber,
  formatToIban,
  formatLTRNumber,
  currencyFormatter,
} = require('../src/index');

// --- formatToCardNumber ---
console.log('=== formatToCardNumber ===\n');

const cardInputs = [
  '6037990000000006',   // full 16 digits
  '60379900',           // partial
  '6037-9900-0000-0006', // with dashes (stripped first)
  '60379900000000060000', // over 16 digits (truncated to 16)
  '',                   // empty
];

for (const input of cardInputs) {
  console.log(`  input:  '${input}'`);
  console.log(`  output: '${formatToCardNumber(input)}'`);
  console.log();
}

// --- formatToIban ---
console.log('=== formatToIban ===\n');

const ibanInputs = [
  '240170012345678901234567',  // full 24 digits
  '2401',                      // partial
  '24-0170 0123',              // with separators (stripped first)
  '240170012345678901234567890', // over 24 digits (truncated)
  '',                           // empty
];

for (const input of ibanInputs) {
  console.log(`  input:  '${input}'`);
  console.log(`  output: '${formatToIban(input)}'`);
  console.log();
}

// --- formatLTRNumber ---
console.log('=== formatLTRNumber (U+200E LTR mark for RTL layouts) ===\n');

const ltrInputs = [
  '6037990000000006',
  '1234567',
  '',
];

for (const input of ltrInputs) {
  const formatted = formatLTRNumber(input);
  // Show the invisible LTR mark as [LTR] for clarity in this log
  const visible = formatted.replace('‎', '[LTR]');
  console.log(`  input:  '${input}'`);
  console.log(`  output: '${visible}'`);
  console.log();
}

// --- currencyFormatter ---
console.log('=== currencyFormatter (Persian digits + thousands separator) ===\n');

const currencyInputs = [
  1234567,
  '1234567.89',
  -5000,
  0,
  '500',
  'not a number',
  '',
  '1,234,567',   // already-formatted string — stripped and re-formatted
  '-9876543.21',
];

for (const input of currencyInputs) {
  console.log(`  input:  ${JSON.stringify(input).padEnd(20)}  →  '${currencyFormatter(input)}'`);
}
