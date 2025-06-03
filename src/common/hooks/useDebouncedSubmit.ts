import { useRef, useEffect } from 'react';
import type { UseFormHandleSubmit, FieldValues } from 'react-hook-form';
import { debounce } from '../utils/debounce.utils';
import { DEBOUNCE_TIME } from '../constants';

export const useDebouncedSubmit = <T extends FieldValues>(
  handleSubmit: UseFormHandleSubmit<T>,
  onSubmit: (data: T) => Promise<void>,
  wait: number = DEBOUNCE_TIME
) => {
  const debouncedSubmit = useRef(
    debounce(handleSubmit(onSubmit), wait)
  ).current;

  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  return debouncedSubmit;
} 