# iran-bankit

شناسایی بانک ایرانی از روی شماره کارت و شماره شبا، همراه با اعتبارسنجی و فرمت‌دهی.

> نسخه انگلیسی: [README.en.md](README.en.md)

---

## نصب

```bash
npm i iran-bankit
```

---

## استفاده

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

## شناسایی بانک از شماره کارت

```js
// بلوبانک — به‌درستی شناسایی می‌شود (نه بانک سامان)
getBankByCard('6219861800001234');
// { id: 'blu', nameFa: 'بلوبانک', nameEn: 'Blu Bank', ... }

// بانک سامان
getBankByCard('6219860012345678');
// { id: 'saman', nameFa: 'بانک سامان', ... }

// پذیرش اعداد فارسی/عربی و جداکننده
getBankByCard('۶۱۰۴-۳۳۰۰-۰۰۰۰-۰۰۰۰');
// { id: 'mellat', nameFa: 'بانک ملت', ... }
```

## شناسایی بانک از شماره شبا

```js
// بانک ملی — به‌درستی شناسایی می‌شود (نه بانک دی)
getBankByIban('IR240170000000000000000000');
// { id: 'meli', nameFa: 'بانک ملی ایران', ibanCode: '017', ... }

// بانک دی — به‌درستی شناسایی می‌شود (نه بانک ملی)
getBankByIban('IR240660000000000000000000');
// { id: 'dey', nameFa: 'بانک دی', ibanCode: '066', ... }

// بدون پیشوند IR (۲۴ رقم)
getBankByIban('240170000000000000000000');
// { id: 'meli', ... }
```

## اعتبارسنجی شماره کارت (الگوریتم لوهن)

```js
validateCard('6037990000000006'); // true
validateCard('6037990000000007'); // false
validateCard('۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۶'); // true — اعداد فارسی
validateCard('6037-9900-0000-0006'); // true — جداکننده
```

## اعتبارسنجی شبا (ISO 7064 mod-97)

```js
validateIbanChecksum('IR820540102680020817909002'); // true
validateIbanChecksum('820540102680020817909002');   // true — بدون IR
validateIbanChecksum('IR820540102680020817909001'); // false
```

## فرمت‌دهی شماره کارت

```js
formatToCardNumber('6037990000000006');
// '6037 9900 0000 0006'

formatToCardNumber('60379900');
// '6037 9900'
```

## فرمت‌دهی شبا

```js
formatToIban('240170012345678901234567');
// '24 0170 0123 4567 8901 2345 67'

formatToIban('2401');
// '24 01'
```

## نمایش عدد چپ‌به‌راست در محیط راست‌به‌چپ

```js
formatLTRNumber('6037990000000006');
// '‎6037990000000006'  (با کاراکتر U+200E در ابتدا)

formatLTRNumber('');
// ''
```

## فرمت‌دهی ارز به فارسی

```js
currencyFormatter(1234567);
// '۱,۲۳۴,۵۶۷'

currencyFormatter('1234567.89');
// '۱,۲۳۴,۵۶۷.۸۹'

currencyFormatter(-5000);
// '-۵,۰۰۰'

currencyFormatter('abc');
// ''
```

## دریافت همه بانک‌ها

```js
const banks = getAllBanks();
// آرایه‌ای از { id, nameEn, nameFa, ibanCode, cardPrefixes }
```

---

## ساختار شیء بانک

```ts
interface Bank {
  id: string;              // شناسه یکتا، مثلاً "meli"، "blu"، "saman"
  nameEn: string;          // نام انگلیسی
  nameFa: string;          // نام فارسی
  ibanCode: string | null; // کد ۳ رقمی شبا؛ null برای بانک‌هایی با مجوز مشترک
  cardPrefixes: string[];  // پیشوندهای ۶ یا ۸ رقمی کارت
}
```


## لایسنس

MIT
