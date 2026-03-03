import { WebPlugin } from '@capacitor/core';

import type { TransactPluginPlugin } from './definitions';

export class TransactPluginWeb extends WebPlugin implements TransactPluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
