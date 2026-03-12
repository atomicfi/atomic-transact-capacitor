import { useContext } from 'react';
import { EventLogContext, type EventLogContextValue } from '../providers/EventLogProvider';

export function useEventLog(): EventLogContextValue {
  return useContext(EventLogContext);
}
