import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

type CheckState = 'idle' | 'checking' | 'ok' | 'taken';

interface UseCheckPhoneOptions {
  /** Debounce delay in ms. Default: 600 */
  delay?: number;
  /** Minimum phone length to trigger check. Default: 5 */
  minLength?: number;
}

export const useCheckPhone = (
  phone: string,
  countryCode: string,
  options: UseCheckPhoneOptions = {}
) => {
  const { delay = 600, minLength = 5 } = options;
  const [state, setState] = useState<CheckState>('idle');

  const check = useCallback(async (num: string, cc: string) => {
    const full = `${cc}${num}`;
    setState('checking');
    try {
      const result = await authService.checkPhone(full);
      setState(result.exists ? 'taken' : 'ok');
    } catch {
      setState('idle');
    }
  }, []);

  useEffect(() => {
    if (!phone || phone.length < minLength) {
      setState('idle');
      return;
    }
    const timer = setTimeout(() => check(phone, countryCode), delay);
    return () => clearTimeout(timer);
  }, [phone, countryCode, delay, minLength, check]);

  return {
    checkState: state,
    isChecking: state === 'checking',
    isAvailable: state === 'ok',
    isTaken: state === 'taken',
  };
};
