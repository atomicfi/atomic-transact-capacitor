import { WebPlugin } from '@capacitor/core';

import type {
  DataRequestEvent,
  InteractionEvent,
  PresentTransactOptions,
  TransactPluginPlugin,
  TransactResult,
} from './definitions';

// Minimal shape of the browser SDK we rely on.
interface AtomicTransactSdk {
  Atomic: {
    transact(options: {
      config: Record<string, unknown>;
      container?: string;
      environmentOverride?: string;
      onInteraction?: (payload: InteractionEvent) => void;
      onDataRequest?: (payload: DataRequestEvent) => void;
      onFinish?: (payload: Record<string, unknown>) => void;
      onClose?: (payload: Record<string, unknown>) => void;
    }): { close: () => void };
  };
}

const DEFAULT_TRANSACT_ORIGIN = 'https://transact.atomicfi.com';

export class TransactPluginWeb extends WebPlugin implements TransactPluginPlugin {
  private activeHandle: { close: () => void } | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  async presentTransact(options: PresentTransactOptions): Promise<TransactResult> {
    const { config, environment } = options;

    if (config?.scope === 'pay-link') {
      throw this.unavailable('PayLink is not supported on web. Use a native iOS or Android device for PayLink flows.');
    }

    const { Atomic } = (await import('@atomicfi/transact-javascript')) as unknown as AtomicTransactSdk;
    const container = config?.theme?.display === 'inline' ? '#atomic-transact-container' : undefined;
    const environmentOverride = environment?.environment === 'custom' ? environment.transactPath : undefined;
    const expectedOrigin = environmentOverride || DEFAULT_TRANSACT_ORIGIN;

    // The browser SDK only exposes onInteraction/onDataRequest/onFinish/onClose
    // callbacks. The Transact iframe also posts task-status, auth-status, and
    // lifecycle events that the SDK drops. Attach a parallel listener so those
    // events reach plugin listeners — matching the native event surface.
    this.messageListener = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin) return;
      const data = event.data as { event?: string; payload?: unknown } | undefined;
      if (!data?.event) return;

      switch (data.event) {
        case 'atomic-transact-initialized':
          this.notifyListeners('onLaunch', {});
          break;
        case 'atomic-transact-task-status-update':
          this.notifyListeners('onTaskStatusUpdate', data.payload ?? {});
          break;
        case 'atomic-transact-auth-status-update':
          this.notifyListeners('onAuthStatusUpdate', data.payload ?? {});
          break;
      }
    };
    window.addEventListener('message', this.messageListener);

    return new Promise<TransactResult>((resolve) => {
      let settled = false;
      const settle = (result: TransactResult) => {
        if (settled) return;
        settled = true;
        if (this.messageListener) {
          window.removeEventListener('message', this.messageListener);
          this.messageListener = null;
        }
        this.activeHandle = null;
        resolve(result);
      };

      this.activeHandle = Atomic.transact({
        config: config as unknown as Record<string, unknown>,
        container,
        environmentOverride,
        onInteraction: (payload) => this.notifyListeners('onInteraction', payload),
        onDataRequest: (payload) => this.notifyListeners('onDataRequest', payload),
        onFinish: (payload) => {
          this.notifyListeners('onFinish', payload);
          settle({ finished: payload });
        },
        onClose: (payload) => {
          this.notifyListeners('onClose', payload);
          settle({ closed: payload });
        },
      });
    });
  }

  async presentAction(): Promise<TransactResult> {
    throw this.unavailable('presentAction is not supported by the Atomic JavaScript SDK on web.');
  }

  async hideTransact(): Promise<void> {
    this.activeHandle?.close();
    this.activeHandle = null;
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
      this.messageListener = null;
    }
  }

  async resolveDataRequest(): Promise<void> {
    throw this.unavailable(
      'resolveDataRequest is not supported on web. Use deferredPaymentMethodStrategy: "api" to provide data via the Update User API.',
    );
  }
}
