export const $keydownPressKey = (
  event: KeyboardEvent,
  keyName: string,
  callback: () => void,
) => {
  if (event.key === keyName) callback();
};

export const $keydownOnlyNumber = (event: KeyboardEvent) => {
  const inputElement = event.target as HTMLInputElement;

  if (!inputElement) {
    return;
  }

  const inputValue = inputElement.value;
  const selectionStart = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;

  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    (event.key === '-' &&
      (selectionStart === 0 ||
        (selectionStart === 0 && selectionEnd === inputValue.length))) ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownOnlyNumberUnsigned = (event: KeyboardEvent) => {
  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownDecimalNumber = (event: KeyboardEvent) => {
  const inputElement = event.target as HTMLInputElement;

  if (!inputElement) {
    return;
  }

  const inputValue = inputElement.value;

  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    (event.key === '.' && !inputValue.includes('.') && inputValue !== '') ||
    (event.key === '-' && !inputValue.includes('-')) ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownOptionalNumber = (event: KeyboardEvent) => {
  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === '/' ||
    event.key === 'Tab' ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownCurrency = (event: KeyboardEvent) => {
  const inputElement = event.target as HTMLInputElement;

  if (!inputElement) {
    return;
  }

  const inputValue = inputElement.value;

  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    [',', '.'].includes(event.key) ||
    (event.key === '-' && !inputValue.includes('-')) ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownPhoneNumber = (event: KeyboardEvent) => {
  const isAllowedKey =
    /^[0-9]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    ['+', '-', '(', ')'].includes(event.key) ||
    ((event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'v' || event.key === 'a'));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $keydownUsername = (event: KeyboardEvent) => {
  const isAllowedKey =
    /^[a-zA-Z0-9_]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab' ||
    ((event.ctrlKey || event.metaKey) &&
      ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

export const $inputUsername = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  value = value.toLowerCase();
  value = value.replaceAll('__', '_');
  value = value.replaceAll('.', '');
  value = value.trim();

  input.value = value;
};
