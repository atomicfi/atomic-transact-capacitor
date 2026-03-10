import { Capacitor } from '@capacitor/core';

export function isIOS(): boolean {
  return Capacitor.getPlatform() === 'ios';
}
