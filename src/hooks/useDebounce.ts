import { useEffect, useState } from 'react';

export const useDebounce = <T = any>(value: T, delay = 600) => {
  const [debounced, setDebounced] = useState<T>(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
};
