import { useCallback } from 'react';
import { TransactPlugin } from '@atomicfi/transact-capacitor';
import type {
  TransactConfig,
  TransactEnvironment,
  PresentTransactOptions,
} from '@atomicfi/transact-capacitor';
import { useSettings } from './useSettings';

interface UseTransactReturn {
  launch: (config: TransactConfig) => Promise<void>;
}

export function useTransact(): UseTransactReturn {
  const { settings } = useSettings();

  const buildEnvironment = useCallback((): TransactEnvironment | undefined => {
    switch (settings.environment) {
      case 'production':
        return { environment: 'production' };
      case 'sandbox':
        return { environment: 'sandbox' };
      case 'custom':
        return {
          environment: 'custom',
          transactPath: settings.customTransactPath,
          apiPath: settings.customApiPath,
        };
      default:
        return undefined;
    }
  }, [settings.environment, settings.customTransactPath, settings.customApiPath]);

  const launch = useCallback(
    async (config: TransactConfig) => {
      const options: PresentTransactOptions = {
        config,
        environment: buildEnvironment(),
        presentationStyle: settings.presentationStyle,
      };

      await TransactPlugin.presentTransact(options);
    },
    [buildEnvironment, settings.presentationStyle],
  );

  return { launch };
}
