import { InstrumentationBase, InstrumentationConfig } from '@opentelemetry/instrumentation';
import {
    context,
    propagation,
    trace,
    Span,
    ROOT_CONTEXT,
    Tracer,
  } from '@opentelemetry/api';

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
  private _startSpan(
    spanName: string,
    parentSpan?: Span,
    attributes?: Record<string, string | number | boolean>
  ): Span | undefined {
      const span = this.tracer.startSpan(
        spanName,
        {
            ...attributes
        },
        parentSpan ? trace.setSpan(context.active(), parentSpan) : undefined
      );
      return span;
    
    return undefined;
  }

  private _endSpan(span: Span, success?: boolean, errorMessage?: string) {
    span.end();
  }

  /**
   * Get the tracer instance for this instrumentation
   */
  getTracer(): Tracer {
    return this.tracer;
  }

}
