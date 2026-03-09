import { WebPlugin } from '@capacitor/core';

import type {
  TransactPluginPlugin,
  PresentTransactOptions,
  PresentActionOptions,
  DataRequestResponse,
  TransactResult,
} from './definitions';

export class TransactPluginWeb
  extends WebPlugin
  implements TransactPluginPlugin
{
  async presentTransact(
    _options: PresentTransactOptions,
  ): Promise<TransactResult> {
    throw this.unavailable(
      'Transact plugin is not available on web. Use a native iOS or Android device.',
    );
  }

  async presentAction(_options: PresentActionOptions): Promise<TransactResult> {
    throw this.unavailable(
      'Transact plugin is not available on web. Use a native iOS or Android device.',
    );
  }

  async hideTransact(): Promise<void> {
    throw this.unavailable(
      'Transact plugin is not available on web. Use a native iOS or Android device.',
    );
  }

  async resolveDataRequest(_options: DataRequestResponse): Promise<void> {
    throw this.unavailable(
      'Transact plugin is not available on web. Use a native iOS or Android device.',
    );
  }
}
