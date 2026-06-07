'use strict';

const {
  getBankByCard,
  getBankByIban,
  validateCard,
  validateIbanChecksum,
  getAllBanks,
  formatToIban,
  formatToCardNumber,
  formatLTRNumber,
  currencyFormatter,
} = require('../src/index');

let passed = 0;
let failed = 0;

function assert(label, actual, expected) {
  const ok =
    typeof expected === 'boolean'
      ? actual === expected
      : JSON.stringify(actual) === JSON.stringify(expected);

  if (ok) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}`);
    console.error(`        expected: ${JSON.stringify(expected)}`);
    console.error(`        received: ${JSON.stringify(actual)}`);
    failed++;
  }
}

function assertId(label, bank, expectedId) {
  assert(label, bank ? bank.id : null, expectedId);
}

console.log('\n=== Card detection ===');

// FIX: Blu Bank must NOT return saman
assertId('Blu Bank card (62198618*)  → blu',   getBankByCard('6219861800001234'), 'blu');
assertId('Blu Bank card (62198619*)  → blu',   getBankByCard('6219861912345678'), 'blu');

// Saman cards not starting with 62198618/19 still return saman
assertId('Bank Saman card (621986*)  → saman', getBankByCard('6219860012345678'), 'saman');

assertId('Bank Mellat (610433*)      → mellat', getBankByCard('6104330000000000'), 'mellat');
assertId('Bank Meli  (603799*)       → meli',   getBankByCard('6037990000000000'), 'meli');
assertId('Bank Dey   (502938*)       → dey',    getBankByCard('5029380000000000'), 'dey');
assertId('Bank Ayandeh (636214*)     → ayandeh',getBankByCard('6362140000000000'), 'ayandeh');
assertId('Unknown prefix             → null',   getBankByCard('1234560000000000'), null);

console.log('\n=== IBAN / Sheba detection ===');

// FIX: 017 must be Bank Meli, not Bank Dey
assertId('IBAN 017 → meli (not dey)', getBankByIban('IR240170000000000000000000'), 'meli');

// FIX: 066 must be Bank Dey, not Bank Meli
assertId('IBAN 066 → dey (not meli)', getBankByIban('IR240660000000000000000000'), 'dey');

assertId('IBAN 056 → saman (Blu Bank uses Saman IBAN)', getBankByIban('IR240560000000000000000000'), 'saman');
assertId('IBAN 062 → ayandeh', getBankByIban('IR240620000000000000000000'), 'ayandeh');
assertId('IBAN 012 → mellat',  getBankByIban('IR240120000000000000000000'), 'mellat');

// Without IR prefix (24 digits)
assertId('IBAN without IR prefix', getBankByIban('240170000000000000000000'), 'meli');

// Persian digits
assertId('IBAN with Persian digits', getBankByIban('IR۲۴017000000000000000000000'.slice(0, 26)), 'meli');

// Wrong length
assertId('IBAN wrong length → null', getBankByIban('IR240170000'), null);

console.log('\n=== Card validation (Luhn) ===');
// 6037990000000006 → sum=40, valid Luhn
assert('Valid card returns true',    validateCard('6037990000000006'), true);
assert('Invalid card returns false', validateCard('6037990000000007'), false);
assert('16 digit check required',    validateCard('123456'), false);
// Persian ۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۶
assert('Persian digits accepted',    validateCard('۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۶'), true);
assert('With dashes',                validateCard('6037-9900-0000-0006'), true);

console.log('\n=== IBAN checksum validation ===');
// Known valid Iranian IBAN
assert('Valid IBAN checksum', validateIbanChecksum('IR820540102680020817909002'), true);
assert('Invalid IBAN checksum', validateIbanChecksum('IR820540102680020817909001'), false);
assert('Without IR prefix', validateIbanChecksum('820540102680020817909002'), true);

console.log('\n=== getAllBanks ===');
assert('Returns array', Array.isArray(getAllBanks()), true);
assert('Contains meli', getAllBanks().some(b => b.id === 'meli'), true);
assert('Contains blu',  getAllBanks().some(b => b.id === 'blu'), true);

console.log('\n=== formatToIban ===');
assert('Full 24 digits', formatToIban('240170012345678901234567'), '24 0170 0123 4567 8901 2345 67');
assert('Partial input',  formatToIban('2401'),                     '24 01');
assert('Empty string',   formatToIban(''),                         '');
assert('Strips non-digits', formatToIban('24-0170 0123'),          '24 0170 0123');
assert('Limits to 24',   formatToIban('1'.repeat(30)).length <= 30, true); // max "xx xxxx xxxx xxxx xxxx xxxx xx" = 30 chars

console.log('\n=== formatToCardNumber ===');
assert('Full 16 digits', formatToCardNumber('6037990000000006'), '6037 9900 0000 0006');
assert('Partial input',  formatToCardNumber('60379'),             '6037 9');
assert('Empty string',   formatToCardNumber(''),                  '');
assert('Strips non-digits', formatToCardNumber('6037-9900'),      '6037 9900');
assert('Limits to 16',   formatToCardNumber('1'.repeat(20)), '1111 1111 1111 1111');

console.log('\n=== formatLTRNumber ===');
assert('Adds LTR mark',  formatLTRNumber('12345'), '‎12345');
assert('Empty → empty',  formatLTRNumber(''), '');
assert('Falsy → empty',  formatLTRNumber(/** @type {any} */(null) || ''), '');

console.log('\n=== currencyFormatter ===');
assert('Integer',         currencyFormatter(1234567),      '۱,۲۳۴,۵۶۷');
assert('With decimal',    currencyFormatter('1234567.89'), '۱,۲۳۴,۵۶۷.۸۹');
assert('Negative number', currencyFormatter(-1000),        '-۱,۰۰۰');
assert('Zero',            currencyFormatter(0),            '۰');
assert('String input',    currencyFormatter('5000'),       '۵,۰۰۰');
assert('Invalid → empty', currencyFormatter('abc'),        '');
assert('Empty → empty',   currencyFormatter(''),           '');

console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
