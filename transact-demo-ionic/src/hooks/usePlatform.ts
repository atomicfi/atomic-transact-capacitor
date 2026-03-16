import { Capacitor } from '@capacitor/core';
import { useMemo } from 'react';

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  platform: string;
}

export function usePlatform(): PlatformInfo {
  return useMemo(() => {
    const platform = Capacitor.getPlatform();
    return {
      isIOS: platform === 'ios',
      isAndroid: platform === 'android',
      isWeb: platform === 'web',
      platform,
    };
  }, []);
}
