import { useEffect, useState } from "react";

export function useDebounce<T = string>(initialValue: T, delay: number = 500) {
  const [inputValue, setInputValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return [inputValue, debouncedValue, setInputValue] as const;
}
