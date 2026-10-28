import { useState } from 'react';
import { FormErrors } from '../types';

export function useValidatedForm<T extends object>(
  initialValues: T,
  validate: (input: T) => FormErrors<T>,
) {
  const [input, setInput] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(input);

  function change<K extends keyof T>(key: K, value: T[K]) {
    setInput(previous => ({ ...previous, [key]: value }));
  }
  function blur(key: keyof T) {
    setTouched(previous => ({ ...previous, [key]: true }));
  }
  function errorFor(key: keyof T) {
    return submitted || touched[key] ? errors[key] : undefined;
  }
  function validateForSubmit() {
    setSubmitted(true);
    return Object.keys(errors).length === 0;
  }
  return { input, change, blur, errorFor, validateForSubmit };
}
