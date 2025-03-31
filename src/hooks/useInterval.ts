import { useEffect, useRef } from 'react';

type UseInterval = <T, U>(
  callback: (vars?: U) => T,
  delay: number | null,
) => void;

export const useInterval: UseInterval = (callback, delay) => {
  const callbackRef = useRef<typeof callback | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
