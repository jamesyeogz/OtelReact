import { InstrumentationBase, InstrumentationConfig } from '@opentelemetry/instrumentation';
import {
    context,
    trace,
    Span,
    Tracer,
    Context,
  } from '@opentelemetry/api';

// Global declaration for HTTP interceptor
declare global {
  var reactOpenTelemetryInstance: ReactOpenTelemetryHook | undefined;
}

export interface ReactOpenTelemetryHookConfig extends InstrumentationConfig {
  // No additional config needed for basic implementation
}

/**
 * Simple React OpenTelemetry Hook Instrumentation
 * This creates a basic instrumentation that can be registered with registerInstrumentations
 */
export class ReactOpenTelemetryHook extends InstrumentationBase<ReactOpenTelemetryHookConfig> {
    readonly version = "0.0.1";
    private _activeSpan: Span | undefined = undefined;
    private _httpInterceptorEnabled: boolean = false;

  constructor(config: ReactOpenTelemetryHookConfig = {}) {
    super('@jyeogz/opentelemetry-react-hook', '1.0.0', config);
    // Set global instance for HTTP interceptor
    global.reactOpenTelemetryInstance = this;
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

  private _startParentSpan(
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
      this._activeSpan = span;
      return span;
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
  }

  private _endSpan(span: Span, success?: boolean, errorMessage?: string) {
    span.end();
  }
  /**
   * Reset the current active span
   */
  public resetSpan(): void {
    if (this._activeSpan) {
      try {
        this._activeSpan.end();
      } catch (error) {
        this._diag.warn('Error ending span during reset:', error);
      }
    }
    this._activeSpan = undefined;
  }


  /**
   * Get the current active span
   */
  public getActiveSpan(): Span | undefined {
    return this._activeSpan;
  }

  /**
   * Run a trace using the saved active span as parent
   */
  public RunTrace({action, attributes}: {
    action: string;
    attributes?: Record<string, string | number | boolean>;
  }): Span | undefined {
    // Use saved active span as parent, fallback to context if not available
    let parentSpan = this._activeSpan || trace.getSpan(context.active());
    
    if (!parentSpan) {
      const span = this._startParentSpan(action, parentSpan, attributes);
      this._activeSpan = span;
      parentSpan = span;
    }

    const span = this._startSpan(action, parentSpan, attributes);
    return span;
    this._diag.warn('No parent span available for RunTrace');
    return undefined;
  }

  /**
   * Start a new page span and set it as active
   */
  public startPageSpan(
    pageName: string, 
    attributes?: Record<string, string | number | boolean>
  ): Span {
    const pageSpan = this.tracer.startSpan(`page.${pageName}`, {
      attributes: {
        'page.name': pageName,
        'page.type': 'navigation',
        'span.kind': 'client',
        ...attributes
      }
    });

    this.setActiveSpan(pageSpan);
    this._diag.debug(`Started new page span for: ${pageName}`);
    return pageSpan;
  }

  /**
   * Get the tracer instance for this instrumentation
   */
  getTracer(): Tracer {
    return this.tracer;
  }

  // /**
  //  * Setup Axios interceptor if Axios is available
  //  */
  // private _setupAxiosInterceptor(): void {
  //   try {
  //     // Check if axios is available in global scope
  //     const axios = (global as any).axios || (typeof window !== 'undefined' && (window as any).axios);
      
  //     if (axios && axios.interceptors) {
  //       // Request interceptor
  //       axios.interceptors.request.use((config: any) => {
  //         this._diag.debug('Axios request detected, resetting span');
  //         this.resetSpan();
  //         return config;
  //       });

  //       // Response interceptor
  //       axios.interceptors.response.use(
  //         (response: any) => {
  //           this.resetSpan();
  //           return response;
  //         },
  //         (error: any) => {
  //           this.resetSpan();
  //           return Promise.reject(error);
  //         }
  //       );

  //       this._diag.debug('Axios interceptors configured');
  //     }
  //   } catch (error) {
  //     // Axios not available or error setting up interceptors
  //     this._diag.debug('Axios not available for interception');
  //   }
  // }

  /**
   * Disable HTTP interceptor
   */
  public disableHttpInterceptor(): void {
    // Note: This is a simplified disable - in production you'd want to restore original methods
    this._httpInterceptorEnabled = false;
    this._diag.debug('HTTP interceptor disabled');
  }

  /**
   * Check if HTTP interceptor is enabled
   */
  public isHttpInterceptorEnabled(): boolean {
    return this._httpInterceptorEnabled;
  }

}
