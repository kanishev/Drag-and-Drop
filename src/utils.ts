import { Validatable } from "./interfaces";

export function validate({ value, required, minLength, maxLength, min, max }: Validatable): boolean {
  let isValid = true;

  if (required) {
    isValid = isValid && value.trim().length > 0;
  }

  if (minLength) {
    isValid = isValid && value.length >= minLength;
  }

  if (maxLength) {
    isValid = isValid && validate.length <= maxLength;
  }

  if (min != null) {
    isValid = isValid && +value >= min;
  }

  if (max != null) {
    isValid = isValid && +value <= max;
  }

  return isValid;
}
