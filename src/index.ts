// Main exports
export { ReactOpenTelemetryHook } from './instrumentation/ReactOpenTelemetry';
export type { ReactOpenTelemetryHookConfig } from './instrumentation/ReactOpenTelemetry';

// Convenient helper functions for trace management
export {
  initializeTracing,
  startNewPageTrace,
  resetAllTraces,
  resetForApiCall,
  resetForRouteChange,
  getCurrentPageSpan,
  startNewPageTraceWithRouteChange
} from './instrumentation/traceHelpers';
