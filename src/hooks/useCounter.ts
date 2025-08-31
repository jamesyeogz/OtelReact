import { useState, useCallback, useEffect } from 'react';

export interface UseCounterOptions {
  /**
   * Initial value for the counter
   * @default 0
   */
  initialValue?: number;
  /**
   * Minimum value for the counter
   */
  min?: number;
  /**
   * Maximum value for the counter
   */
  max?: number;
  /**
   * Step size for increment/decrement operations
   * @default 1
   */
  step?: number;
}

export interface CounterHookReturn {
  /**
   * Current counter value
   */
  count: number;
  /**
   * Increment the counter by the step amount
   */
  increment: () => void;
  /**
   * Decrement the counter by the step amount
   */
  decrement: () => void;
  /**
   * Reset the counter to its initial value
   */
  reset: () => void;
  /**
   * Set the counter to a specific value
   */
  setValue: (value: number) => void;
  /**
   * Whether the counter is at its minimum value
   */
  isAtMin: boolean;
  /**
   * Whether the counter is at its maximum value
   */
  isAtMax: boolean;
}

/**
 * A simple React hook for managing counter state with optional min/max bounds
 * 
 * @param options - Configuration options for the counter
 * @returns Object with counter value and control methods
 * 
 * @example
 * ```tsx
 * import { useCounter } from 'jyeogz-opentelemetry-react-hook';
 * 
 * function CounterComponent() {
 *   const { count, increment, decrement, reset, isAtMin, isAtMax } = useCounter({
 *     initialValue: 5,
 *     min: 0,
 *     max: 10,
 *     step: 2
 *   });
 * 
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment} disabled={isAtMax}>+</button>
 *       <button onClick={decrement} disabled={isAtMin}>-</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCounter(options: UseCounterOptions = {}): CounterHookReturn {
  const {
    initialValue = 0,
    min,
    max,
    step = 1
  } = options;

  const [count, setCount] = useState(initialValue);

  const setValue = useCallback((value: number) => {
    setCount(prevCount => {
      let newValue = value;
      
      // Apply min/max constraints
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      
      return newValue;
    });
  }, [min, max]);

  const increment = useCallback(() => {
    setCount(prevCount => {
      const newValue = prevCount + step;
      if (max !== undefined && newValue > max) {
        return max;
      }
      return newValue;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount(prevCount => {
      const newValue = prevCount - step;
      if (min !== undefined && newValue < min) {
        return min;
      }
      return newValue;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  // Compute derived state
  const isAtMin = min !== undefined && count <= min;
  const isAtMax = max !== undefined && count >= max;

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    isAtMin,
    isAtMax
  };
}
