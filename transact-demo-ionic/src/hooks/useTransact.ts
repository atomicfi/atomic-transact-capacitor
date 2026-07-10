import { TransactPlugin, Environment } from '@atomicfi/transact-capacitor';
import type { TransactConfig, PresentTransactOptions } from '@atomicfi/transact-capacitor';
import { useCallback } from 'react';

import { useSettings } from './useSettings';

interface UseTransactReturn {
  launch: (config: TransactConfig) => Promise<void>;
}

export function useTransact(): UseTransactReturn {
  const { settings } = useSettings();

  const buildEnvironment = useCallback((): PresentTransactOptions['environment'] => {
    switch (settings.environment) {
      case 'production':
        return Environment.PRODUCTION;
      case 'sandbox':
        return Environment.SANDBOX;
      case 'custom':
        return {
          environment: Environment.CUSTOM,
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
