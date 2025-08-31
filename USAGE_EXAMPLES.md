# OpenTelemetry React Hook - Usage Examples

This document provides examples of how to use the new trace management functionality.

## Setup

First, initialize the tracing in your app:

```typescript
import { ReactOpenTelemetryHook, initializeTracing } from 'jyeogz-react-hooks';

// Create and initialize the instrumentation
const instrumentation = new ReactOpenTelemetryHook({
  enabled: true
});

// Initialize global tracing
initializeTracing(instrumentation);

// Register with OpenTelemetry (if using registerInstrumentations)
import { registerInstrumentations } from '@opentelemetry/instrumentation';
registerInstrumentations({
  instrumentations: [instrumentation],
});
```

## Starting New Page Traces

### Basic Page Navigation

```typescript
import { startNewPageTrace } from 'jyeogz-react-hooks';

// When navigating to a new page
function navigateToHome() {
  startNewPageTrace('home');
  // Navigate to home page...
}

// With additional attributes
function navigateToDashboard(userId: string) {
  startNewPageTrace('dashboard', {
    'user.id': userId,
    'page.category': 'admin',
    'page.load_time': Date.now()
  });
  // Navigate to dashboard...
}
```

### React Router Integration

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { startNewPageTrace } from 'jyeogz-react-hooks';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Start new trace for each route change
    const pageName = location.pathname.slice(1) || 'home';
    startNewPageTrace(pageName, {
      'route.path': location.pathname,
      'route.search': location.search
    });
  }, [location]);

  return (
    // Your app components...
  );
}
```

### Next.js Integration

```typescript
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { startNewPageTrace } from 'jyeogz-react-hooks';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const pageName = url.split('/')[1] || 'home';
      startNewPageTrace(pageName, {
        'route.url': url,
        'route.query': JSON.stringify(router.query)
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Start trace for initial page
    handleRouteChange(router.asPath);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}
```

## Resetting Traces for API Calls

### Basic API Reset

```typescript
import { resetForApiCall } from 'jyeogz-react-hooks';

async function fetchUserData(userId: string) {
  // Reset traces before API call
  resetForApiCall('/api/users');
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### Custom Hook for API Calls

```typescript
import { useCallback } from 'react';
import { resetForApiCall } from 'jyeogz-react-hooks';

function useApiCall() {
  const callApi = useCallback(async (endpoint: string, options?: RequestInit) => {
    // Reset traces before each API call
    resetForApiCall(endpoint);
    
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    return response.json();
  }, []);

  return { callApi };
}

// Usage in component
function UserProfile({ userId }: { userId: string }) {
  const { callApi } = useApiCall();

  const fetchUser = async () => {
    const userData = await callApi(`/api/users/${userId}`);
    // Handle user data...
  };

  return (
    // Component JSX...
  );
}
```

### Axios Interceptor Integration

```typescript
import axios from 'axios';
import { resetForApiCall } from 'jyeogz-react-hooks';

// Add request interceptor to reset traces
axios.interceptors.request.use(
  (config) => {
    // Reset traces before each request
    resetForApiCall(config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

## Route Change Resets

### Manual Route Reset

```typescript
import { resetForRouteChange, startNewPageTrace } from 'jyeogz-react-hooks';

function navigateToPage(fromPage: string, toPage: string) {
  // Reset for route change
  resetForRouteChange(fromPage, toPage);
  
  // Start new page trace
  startNewPageTrace(toPage);
  
  // Perform navigation...
}
```

### Combined Route Change and Page Trace

```typescript
import { startNewPageTraceWithRouteChange } from 'jyeogz-react-hooks';

function handleNavigation(newPage: string, currentPage?: string) {
  // This combines resetForRouteChange and startNewPageTrace
  startNewPageTraceWithRouteChange(newPage, currentPage, {
    'navigation.type': 'programmatic',
    'timestamp': Date.now()
  });
}
```

## Advanced Usage

### Manual Trace Management

```typescript
import { getCurrentPageSpan, resetAllTraces } from 'jyeogz-react-hooks';
import { trace, context } from '@opentelemetry/api';

function performComplexOperation() {
  const pageSpan = getCurrentPageSpan();
  
  if (pageSpan) {
    // Create a child span for this operation
    const tracer = trace.getTracer('my-app');
    const operationSpan = tracer.startSpan('complex-operation', {
      attributes: {
        'operation.type': 'user-action',
        'operation.complexity': 'high'
      }
    }, trace.setSpan(context.active(), pageSpan));

    try {
      // Perform operation...
      operationSpan.setStatus({ code: trace.SpanStatusCode.OK });
    } catch (error) {
      operationSpan.setStatus({ 
        code: trace.SpanStatusCode.ERROR, 
        message: error.message 
      });
      throw error;
    } finally {
      operationSpan.end();
    }
  }
}

// Reset all traces manually when needed
function handleLogout() {
  resetAllTraces();
  // Perform logout...
}
```

### Error Boundary Integration

```typescript
import React from 'react';
import { resetAllTraces } from 'jyeogz-react-hooks';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Reset traces when an error occurs
    resetAllTraces();
    
    // Log error...
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state?.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Best Practices

1. **Initialize Early**: Call `initializeTracing()` as early as possible in your app lifecycle.

2. **Page Traces**: Start new page traces on route changes to get clean telemetry data for each page.

3. **API Resets**: Reset traces before API calls to avoid mixing page interaction traces with API call traces.

4. **Error Handling**: Reset traces in error boundaries or error handlers to prevent corrupted trace data.

5. **Cleanup**: The library automatically cleans up spans, but you can manually reset if needed.

6. **Attributes**: Use meaningful attributes to make your traces more searchable and useful for debugging.
