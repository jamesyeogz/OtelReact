# jyeogz-opentelemetry-react-hook

A React hook library for integrating OpenTelemetry tracing into React applications with TypeScript support.

## Features

- 🚀 Easy integration with React 18+
- 📊 OpenTelemetry tracing support
- 🔧 TypeScript support with full type definitions
- 🎯 Automatic component lifecycle tracing
- 🛡️ Error handling and exception recording
- 📦 Lightweight and tree-shakeable
- ✅ Comprehensive test coverage

## Installation

```bash
npm install jyeogz-opentelemetry-react-hook
```

or

```bash
yarn add jyeogz-react-hooks
```

## Prerequisites

This library requires React 18 or above. No additional dependencies required.

## Hooks

### `useCounter`

A simple but powerful counter hook with optional min/max bounds and custom step sizes.

## Usage

### Basic Usage

```tsx
import React from 'react';
import { useCounter } from 'jyeogz-react-hooks';

function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Advanced Usage with Bounds

```tsx
import React from 'react';
import { useCounter } from 'jyeogz-react-hooks';

function BoundedCounterComponent() {
  const { 
    count, 
    increment, 
    decrement, 
    reset, 
    setValue,
    isAtMin,
    isAtMax
  } = useCounter({
    initialValue: 5,
    min: 0,
    max: 10,
    step: 2
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} disabled={isAtMax}>
        +2
      </button>
      <button onClick={decrement} disabled={isAtMin}>
        -2
      </button>
      <button onClick={() => setValue(7)}>
        Set to 7
      </button>
      <button onClick={reset}>
        Reset to 5
      </button>
      {isAtMin && <p>At minimum value!</p>}
      {isAtMax && <p>At maximum value!</p>}
    </div>
  );
}
```

## API Reference

### `useCounter(options?)`

#### Parameters

- `options` (UseCounterOptions, optional): Configuration options for the counter

#### Options

```typescript
interface UseCounterOptions {
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
```

#### Returns

The hook returns an object with the following properties and methods:

```typescript
interface CounterHookReturn {
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
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Building

The library uses Rollup for building and supports both CommonJS and ES modules:

```bash
npm run build
```

This will generate:
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES modules build
- `dist/index.d.ts` - TypeScript declarations

### Testing

The library includes comprehensive tests using Jest and React Testing Library:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- `useCounter` hook with min/max bounds and custom step sizes
- Full TypeScript support
- Comprehensive test coverage
- Modern React 18+ compatibility
