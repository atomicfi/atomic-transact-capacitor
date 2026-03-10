import { useContext } from 'react';
import { SettingsContext, type SettingsContextValue } from '../providers/SettingsProvider';

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
