import { useMemo } from 'react';
import { Capacitor } from '@capacitor/core';

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
