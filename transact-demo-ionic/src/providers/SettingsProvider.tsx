import React, { createContext, useCallback, useState, type ReactNode } from 'react';
import type { LanguageType } from '@atomicfi/transact-capacitor';
import { loadSetting, saveSetting } from '../utils/storage';

export interface Settings {
  publicToken: string;
  environment: 'production' | 'sandbox' | 'custom';
  customTransactPath: string;
  customApiPath: string;
  presentationStyle: 'formSheet' | 'fullScreen';
  language: LanguageType;
  brandColor: string;
  overlayColor: string;
  darkMode: 'system' | 'dark' | 'light';
  showBackButton: boolean;
  showBackButtonText: boolean;
  showCloseButton: boolean;
}

const defaultSettings: Settings = {
  publicToken: '',
  environment: 'sandbox',
  customTransactPath: '',
  customApiPath: '',
  presentationStyle: 'formSheet',
  language: 'en' as LanguageType,
  brandColor: '#635BFF',
  overlayColor: '',
  darkMode: 'system',
  showBackButton: true,
  showBackButtonText: false,
  showCloseButton: true,
};

export interface SettingsContextValue {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSetting: () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const loaded = {} as Record<string, unknown>;
    for (const key of Object.keys(defaultSettings)) {
      const k = key as keyof Settings;
      loaded[k] = loadSetting(k, defaultSettings[k]);
    }
    return loaded as unknown as Settings;
  });

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    saveSetting(key, value);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
