import { WebPlugin } from '@capacitor/core';

import type { TransactPluginPlugin, TransactResult } from './definitions';

export class TransactPluginWeb extends WebPlugin implements TransactPluginPlugin {
  async presentTransact(): Promise<TransactResult> {
    throw this.unavailable('Transact plugin is not available on web. Use a native iOS or Android device.');
  }

  async presentAction(): Promise<TransactResult> {
    throw this.unavailable('Transact plugin is not available on web. Use a native iOS or Android device.');
  }

  async hideTransact(): Promise<void> {
    throw this.unavailable('Transact plugin is not available on web. Use a native iOS or Android device.');
  }

  async resolveDataRequest(): Promise<void> {
    throw this.unavailable('Transact plugin is not available on web. Use a native iOS or Android device.');
  }
}
