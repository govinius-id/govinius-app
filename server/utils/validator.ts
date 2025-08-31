import type { H3Event } from 'h3';
import {
  isEmail,
  isEmpty,
  isNotEmpty,
  isNotEmptyObject,
  isNumber,
  isNumberString,
  isPhoneNumber,
  isObject,
  isArray,
  isBoolean,
  isBooleanString,
  isDateString,
  min,
  minLength,
  minDate,
  max,
  maxLength,
  maxDate,
} from 'class-validator';

export type ValidatorRules =
  | 'is_not_empty'
  | 'is_email'
  | 'is_number'
  | 'is_phone_number';

export const $isEmail = isEmail;
export const $isEmpty = isEmpty;
export const $isNotEmpty = isNotEmpty;
export const $isNotEmptyObject = isNotEmptyObject;
export const $isNumber = isNumber;
export const $isNumberString = isNumberString;
export const $isPhoneNumber = isPhoneNumber;
export const $isObject = isObject;
export const $isArray = isArray;
export const $isBoolean = isBoolean;
export const $isBooleanString = isBooleanString;
export const $isDateString = isDateString;
export const $min = min;
export const $minLength = minLength;
export const $minDate = minDate;
export const $max = max;
export const $maxLength = maxLength;
export const $maxDate = maxDate;

export const $validateInput = <T>(
  event: H3Event,
  input: T,
  rules: Record<string, ValidatorRules[]>,
) => {
  const errorMessage = {} as Record<string, string | null>;

  Object.keys(rules).forEach((key) => {
    const inputAsObject = input as Record<string, any>;

    const ruleValues = rules[key];
    const inputValue = inputAsObject[key];

    for (const validatorRule of ruleValues) {
      if (validatorRule.includes('is_not_empty')) {
        if (!isNotEmpty(inputValue)) {
          errorMessage[key] = $i18n(event).t('validator.is_not_empty');
          break;
        }
      }

      if (validatorRule.includes('is_email')) {
        if (!isEmail(inputValue)) {
          errorMessage[key] = $i18n(event).t('validator.is_email');
          break;
        }
      }

      if (validatorRule.includes('is_number')) {
        if (!isNumber(inputValue) && !isNumberString(inputValue)) {
          errorMessage[key] = $i18n(event).t('validator.is_number');
          break;
        }
      }

      if (validatorRule.includes('is_phone_number')) {
        if (!isPhoneNumber(inputValue, 'ID')) {
          errorMessage[key] = $i18n(event).t('validator.is_phone_number');
          break;
        }
      }
    }
  });

  return errorMessage;
};

export const $validateInputArray = (
  event: H3Event,
  arrayInput: any[],
  objRule: (obj: any) => Record<string, ValidatorRules[]>,
) => {
  let arrayError = undefined;

  for (const objInput of arrayInput) {
    const errorFormPassenger = $validateInput(
      event,
      objInput,
      objRule(objInput),
    );
    if (!arrayError) {
      arrayError = [];
    }
    arrayError.push(errorFormPassenger);
  }

  return arrayError;
};

export const $validateErrorMessage = (
  event: H3Event,
  error: Record<string, string | null>,
) => {
  const valuesMessage = Object.values(error).flatMap((v) =>
    Array.isArray(v) ? v : [v],
  );

  const isValid =
    valuesMessage.filter((obj) => {
      return (
        $isNotEmpty(obj) && ($isObject(obj) ? $isNotEmptyObject(obj) : true)
      );
    }).length === 0;

  if (!isValid) {
    throw createError({
      statusCode: 422,
      message: $i18n(event).t('message.error_input_validation'),
      data: error,
    });
  }

  return isValid;
};
