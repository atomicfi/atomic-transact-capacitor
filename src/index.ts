import { registerPlugin } from '@capacitor/core';

import type { PresentActionOptions, PresentTransactOptions, TransactPluginPlugin, TransactResult } from './definitions';

const rawPlugin = registerPlugin<TransactPluginPlugin>('TransactPlugin', {
  web: () => import('./web').then((m) => new m.TransactPluginWeb()),
});

async function withDebugLogging<T>(debug: boolean | undefined, fn: () => Promise<T>): Promise<T> {
  if (!debug) return fn();

  // Attach a listener that forwards debug logs to console.log.
  // `onDebugLog` is emitted by the native plugin when `debug: true`.
  // Cast to `any` because this event is an internal implementation detail
  // and not part of the public TransactPluginPlugin interface.
  const handle = await (rawPlugin as any).addListener('onDebugLog', ({ message }: { message: string }) =>
    // eslint-disable-next-line no-console
    console.log('[AtomicTransact]', message),
  );

  try {
    return await fn();
  } finally {
    try {
      await handle?.remove?.();
    } catch {
      // Ignore cleanup failures — don't mask the underlying result.
    }
  }
}

const TransactPlugin: TransactPluginPlugin = new Proxy(rawPlugin, {
  get(target, prop, receiver) {
    if (prop === 'presentTransact') {
      return (options: PresentTransactOptions): Promise<TransactResult> =>
        withDebugLogging(options?.debug, () => target.presentTransact(options));
    }
    if (prop === 'presentAction') {
      return (options: PresentActionOptions): Promise<TransactResult> =>
        withDebugLogging(options?.debug, () => target.presentAction(options));
    }
    return Reflect.get(target, prop, receiver);
  },
}) as TransactPluginPlugin;

export * from './definitions';
export { TransactPlugin };
