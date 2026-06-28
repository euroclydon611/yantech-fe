// src/hooks/usePersistentReducer.tsx
import { useReducer, useEffect, Dispatch } from 'react';

function usePersistentReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  storageKey: string
): [S, Dispatch<A>] {

  const [state, dispatch] = useReducer(reducer, initialState, (initial: S) => {
    try {
      const storedState = localStorage.getItem(storageKey);
      return storedState ? JSON.parse(storedState) : initial;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initial;
    }
  });

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [state, storageKey]);

  return [state, dispatch];
}

export default usePersistentReducer;