export const $convertToCurrency = (
  value: any,
  code: string = 'IDR',
): string => {
  return new Intl.NumberFormat('id', {
    style: 'currency',
    currency: code,
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(
    value !== null && value !== undefined && value !== '' && !isNaN(value)
      ? value
      : 0,
  );
};

export const $convertToCurrencyShorthand = (
  value: any,
  code: string = 'IDR',
): string => {
  const isNegative = value < 0;
  value = Math.abs(value);

  let shortSuffix;
  let shortValue;

  if (value >= 1000000000) {
    shortValue = value / 1000000000;
    shortSuffix = 'M';
  } else if (value >= 1000000) {
    shortValue = value / 1000000;
    shortSuffix = 'jt';
  } else if (value >= 1000) {
    shortValue = value / 1000;
    shortSuffix = 'rb';
  } else {
    shortValue = value;
    shortSuffix = '';
  }

  const valueFormatted = $convertToCurrency(shortValue, code);
  if (isNegative) {
    return `-${valueFormatted}${shortSuffix}`;
  } else {
    return `${valueFormatted}${shortSuffix}`;
  }
};

export const $convertParseCurrency = (
  value: any,
  code: string = 'IDR',
): number => {
  if (!value) {
    return 0;
  }

  const currencySymbol = new Intl.NumberFormat('id', {
    style: 'currency',
    currency: code,
  })
    .format(0)
    .replace(/\d|,|\.|\s/g, '');

  const sampleNumber = new Intl.NumberFormat('id', {
    style: 'currency',
    currency: code,
  }).format(1234567.89);

  const decimalSeparator = sampleNumber.includes(',') ? ',' : '.';
  const thousandSeparator = decimalSeparator === ',' ? '.' : ',';

  const currencyValue = value
    .replaceAll(thousandSeparator, '')
    .replaceAll(decimalSeparator, '.')
    .replaceAll(currencySymbol, '')
    .replaceAll(code, '')
    .replaceAll('-', '')
    .trim();

  const parsedValue = parseFloat(currencyValue);
  return value.includes('-') ? -parsedValue : parsedValue;
};

export const $convertToByteSize = (value: string) => {
  if (!value) return 0;

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitMatch = value.match(/[a-zA-Z]+/g);
  const numberMatch = value.match(/[\d.]+/g);

  if (!unitMatch || !numberMatch) return 0;

  const unit = unitMatch[0].toUpperCase();
  const number = parseFloat(numberMatch[0]);

  if (isNaN(number)) return 0;

  const unitIndex = units.indexOf(unit);
  if (unitIndex === -1) return 0;

  return number * Math.pow(1024, unitIndex);
};

export const $convertParseByteSize = (bytes: number) => {
  if (bytes === 0) return '0B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)}${units[i]}`;
};

export const $convertToSlug = (value: any) => {
  if (!value) return null;
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
