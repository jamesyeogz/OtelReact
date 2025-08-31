import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
    expect(result.current.isAtMin).toBe(false);
    expect(result.current.isAtMax).toBe(false);
  });

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }));

    expect(result.current.count).toBe(5);
  });

  it('should increment and decrement correctly', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5, step: 2 }));

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(7);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(5);
  });

  it('should respect min and max bounds', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 5, 
      min: 0, 
      max: 10,
      step: 3
    }));

    // Test max bound
    act(() => {
      result.current.increment(); // 8
      result.current.increment(); // should be 10 (max)
    });
    expect(result.current.count).toBe(10);
    expect(result.current.isAtMax).toBe(true);

    // Test min bound
    act(() => {
      result.current.setValue(2);
      result.current.decrement(); // should be 0 (min)
    });
    expect(result.current.count).toBe(0);
    expect(result.current.isAtMin).toBe(true);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }));

    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(5);
  });

  it('should set specific values with bounds', () => {
    const { result } = renderHook(() => useCounter({ 
      min: 0, 
      max: 10 
    }));

    act(() => {
      result.current.setValue(5);
    });
    expect(result.current.count).toBe(5);

    // Test setting value above max
    act(() => {
      result.current.setValue(15);
    });
    expect(result.current.count).toBe(10);

    // Test setting value below min
    act(() => {
      result.current.setValue(-5);
    });
    expect(result.current.count).toBe(0);
  });

  it('should correctly compute isAtMin and isAtMax', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 5,
      min: 0, 
      max: 10 
    }));

    expect(result.current.isAtMin).toBe(false);
    expect(result.current.isAtMax).toBe(false);

    act(() => {
      result.current.setValue(0);
    });
    expect(result.current.isAtMin).toBe(true);

    act(() => {
      result.current.setValue(10);
    });
    expect(result.current.isAtMax).toBe(true);
  });
});
