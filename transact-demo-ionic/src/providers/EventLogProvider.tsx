import React, { createContext, useCallback, useRef, useState, type ReactNode } from 'react';
import { TransactPlugin } from '@atomicfi/transact-capacitor';

export type EventType =
  | 'onLaunch'
  | 'onInteraction'
  | 'onDataRequest'
  | 'onAuthStatusUpdate'
  | 'onTaskStatusUpdate'
  | 'onFinish'
  | 'onClose';

export interface LogEntry {
  id: number;
  type: EventType;
  timestamp: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export interface EventLogContextValue {
  entries: LogEntry[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  push: (type: EventType, payload?: any) => void;
  clear: () => void;
}

export const EventLogContext = createContext<EventLogContextValue>({
  entries: [],
  push: () => {},
  clear: () => {},
});

const EVENT_NAMES: EventType[] = [
  'onLaunch',
  'onInteraction',
  'onDataRequest',
  'onAuthStatusUpdate',
  'onTaskStatusUpdate',
  'onFinish',
  'onClose',
];

// ── Module-level singleton listener registration ──────────────────────
// Capacitor's addListener *stacks* — every call adds another callback.
// Ionic React can remount providers many times (tab switches, router
// transitions, etc.), so tying registration to useEffect is unreliable.
//
// Instead we register listeners exactly once at module scope and forward
// events through a module-level callback that the active provider keeps
// in sync on every render.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modulePush: ((type: EventType, payload?: any) => void) | null = null;
let listenersRegistered = false;

async function ensureListenersRegistered() {
  if (listenersRegistered) return;
  listenersRegistered = true;

  await TransactPlugin.removeAllListeners();

  for (const name of EVENT_NAMES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await TransactPlugin.addListener(name as any, (data: any) => {
      modulePush?.(name, data);
    });
  }
}

// Kick off registration immediately when this module is first imported.
ensureListenersRegistered();

// ── React provider ────────────────────────────────────────────────────

export const EventLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const nextId = useRef(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const push = useCallback((type: EventType, payload?: any) => {
    setEntries((prev) => [
      ...prev,
      { id: nextId.current++, type, timestamp: new Date(), payload },
    ]);
  }, []);

  // Keep the module-level callback wired to the current provider instance.
  // This runs on every render so remounts seamlessly reconnect.
  modulePush = push;

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <EventLogContext.Provider value={{ entries, push, clear }}>
      {children}
    </EventLogContext.Provider>
  );
};
