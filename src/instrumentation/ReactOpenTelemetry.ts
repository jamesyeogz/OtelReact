import { InstrumentationBase, InstrumentationConfig } from '@opentelemetry/instrumentation';
import * as api from '@opentelemetry/api';
import { SpanData } from './internal-types';
import { WindowWithZone, ZoneTypeWithPrototype } from './internal-types';
export interface ReactOpenTelemetryHookConfig extends InstrumentationConfig {
  // No additional config needed for basic implementation
}

/**
 * Simple React OpenTelemetry Hook Instrumentation
 * This creates a basic instrumentation that can be registered with registerInstrumentations
 */
export class ReactOpenTelemetryHook extends InstrumentationBase<ReactOpenTelemetryHookConfig> {
    readonly version = "0.0.1";
    readonly moduleName: string = 'user-interaction';
    private _spansData = new WeakMap<api.Span, SpanData>();
  constructor(config: ReactOpenTelemetryHookConfig = {}) {
    super('@jyeogz/opentelemetry-react-hook', '1.0.0', config);
  }

  init() {
    // Basic initialization - this instrumentation is primarily for the hook to work
    // The actual span creation will be handled by the React hook
  }

  enable() {
    // Enable the instrumentation
    this._diag.debug('ReactOpenTelemetryHook enabled');
  }

  disable() {
    // Disable the instrumentation
    this._diag.debug('ReactOpenTelemetryHook disabled');
  }

  /**
   * Get the tracer instance for this instrumentation
   */
  getTracer(): api.Tracer {
    return this.tracer;
  }

  private _getZoneWithPrototype(): ZoneTypeWithPrototype | undefined {
    const _window: WindowWithZone = window as unknown as WindowWithZone;
    return _window.Zone;
  }
}
