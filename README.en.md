# iran-bankit

Iranian bank detection from card numbers and IBANs (Sheba), with validation and formatting utilities.

> Persian README (default): [README.md](README.md)

---

## Installation

```bash
npm i iran-bankit
```

---

## Usage

```js
const {
  getBankByCard,
  getBankByIban,
  validateCard,
  validateIbanChecksum,
  formatToCardNumber,
  formatToIban,
  formatLTRNumber,
  currencyFormatter,
  getAllBanks,
} = require('iran-bankit');
```

---

## API

### `getBankByCard(cardNumber)`

Identifies a bank from a card number by matching its prefix.
Longer prefixes are matched first — Blu Bank cards (`62198618*`, `62198619*`) are correctly identified instead of being mis-reported as Bank Saman.

**Accepts:** full 16-digit card number; Persian/Arabic numerals, spaces, and dashes are handled automatically.

```js
getBankByCard('6219861800001234');
// { id: 'blu', nameFa: 'بلوبانک', nameEn: 'Blu Bank', ibanCode: null, cardPrefixes: ['62198618','62198619'] }

getBankByCard('6219860012345678');
// { id: 'saman', nameFa: 'بانک سامان', nameEn: 'Bank Saman', ibanCode: '056', ... }

getBankByCard('6104330000000000');
// { id: 'mellat', nameFa: 'بانک ملت', nameEn: 'Bank Mellat', ibanCode: '012', ... }

getBankByCard('unknown');
// null
```

---

### `getBankByIban(iban)`

Identifies a bank from an Iranian IBAN (Sheba) number by extracting the 3-digit bank code at positions 4–6.

**Accepts:** 24-digit form (without `IR`) or full 26-char form; Persian/Arabic numerals and whitespace are stripped automatically.

```js
getBankByIban('IR240170000000000000000000');
// { id: 'meli', nameFa: 'بانک ملی ایران', ibanCode: '017', ... }

getBankByIban('IR240660000000000000000000');
// { id: 'dey', nameFa: 'بانک دی', ibanCode: '066', ... }

// Without IR prefix
getBankByIban('240560000000000000000000');
// { id: 'saman', ibanCode: '056', ... }

getBankByIban('wronglength');
// null
```

---

### `validateCard(cardNumber)`

Validates a 16-digit Iranian card number using the **Luhn algorithm**.

```js
validateCard('6037990000000006'); // true
validateCard('6037990000000007'); // false
validateCard('۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۶'); // true  — Persian numerals
validateCard('6037-9900-0000-0006'); // true  — with dashes
```

---

### `validateIbanChecksum(iban)`

Validates an Iranian IBAN (Sheba) checksum using **ISO 7064 mod-97**.

```js
validateIbanChecksum('IR820540102680020817909002'); // true
validateIbanChecksum('820540102680020817909002');   // true — without IR
validateIbanChecksum('IR820540102680020817909001'); // false
```

---

### `formatToCardNumber(value)`

Strips non-digits, limits to 16 digits, and groups them as `4 · 4 · 4 · 4` with spaces.

```js
formatToCardNumber('6037990000000006');  // '6037 9900 0000 0006'
formatToCardNumber('60379900');          // '6037 9900'
formatToCardNumber('');                  // ''
```

---

### `formatToIban(value)`

Strips non-digits, limits to 24 digits, and groups them as `2 · 4 · 4 · 4 · 4 · 4 · 2` with spaces (matching the Iranian Sheba layout).

```js
formatToIban('240170012345678901234567');  // '24 0170 0123 4567 8901 2345 67'
formatToIban('2401');                      // '24 01'
formatToIban('');                          // ''
```

---

### `formatLTRNumber(value)`

Prepends a Unicode LTR mark (`U+200E`) so that numeric strings render left-to-right inside RTL (Persian/Arabic) layouts. Returns an empty string when `value` is falsy.

```js
formatLTRNumber('6037990000000006');  // '‎6037990000000006'
formatLTRNumber('');                  // ''
```

---

### `currencyFormatter(num)`

Formats a number as a Persian-digit currency string with thousands separators. Handles negatives and an optional decimal part. Returns `''` for blank or non-numeric input.

```js
currencyFormatter(1234567);       // '۱,۲۳۴,۵۶۷'
currencyFormatter('1234567.89');  // '۱,۲۳۴,۵۶۷.۸۹'
currencyFormatter(-5000);         // '-۵,۰۰۰'
currencyFormatter(0);             // '۰'
currencyFormatter('abc');         // ''
```

---

### `getAllBanks()`

Returns the full array of bank entries.

```js
const banks = getAllBanks();
// [{ id, nameEn, nameFa, ibanCode, cardPrefixes }, ...]
```

---

## Bank object shape

```ts
interface Bank {
  id: string;              // e.g. "meli", "blu", "saman"
  nameEn: string;          // English name
  nameFa: string;          // Persian name
  ibanCode: string | null; // 3-digit IBAN bank code; null for shared-license banks
  cardPrefixes: string[];  // 6- or 8-digit card prefixes
}
```

---

## License

MIT
