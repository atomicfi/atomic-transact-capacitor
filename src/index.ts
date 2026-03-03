import { registerPlugin } from '@capacitor/core';

import type { TransactPluginPlugin } from './definitions';

const TransactPlugin = registerPlugin<TransactPluginPlugin>('TransactPlugin', {
  web: () => import('./web').then((m) => new m.TransactPluginWeb()),
});

export * from './definitions';
export { TransactPlugin };
