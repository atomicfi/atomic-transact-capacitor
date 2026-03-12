import React, { useEffect, useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { trashOutline, arrowDown } from 'ionicons/icons';
import { useEventLog } from '../hooks/useEventLog';
import EventLogEntry from '../components/EventLogEntry';
import type { EventType } from '../providers/EventLogProvider';

const ALL_EVENT_TYPES: EventType[] = [
  'onLaunch',
  'onInteraction',
  'onDataRequest',
  'onAuthStatusUpdate',
  'onTaskStatusUpdate',
  'onFinish',
  'onClose',
];

const chipColorMap: Record<EventType, string> = {
  onLaunch: 'success',
  onFinish: 'success',
  onClose: 'medium',
  onInteraction: 'tertiary',
  onDataRequest: 'warning',
  onAuthStatusUpdate: 'primary',
  onTaskStatusUpdate: 'secondary',
};

const EventLogTab: React.FC = () => {
  const { entries, clear } = useEventLog();
  const [enabledTypes, setEnabledTypes] = useState<Set<EventType>>(new Set(ALL_EVENT_TYPES));
  const [autoScroll, setAutoScroll] = useState(true);
  const contentRef = useRef<HTMLIonContentElement>(null);

  const toggleType = (type: EventType) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const filtered = entries.filter((e) => enabledTypes.has(e.type));

  // Auto-scroll on new entries
  useEffect(() => {
    if (autoScroll && contentRef.current) {
      contentRef.current.scrollToBottom(200);
    }
  }, [filtered.length, autoScroll]);

  const scrollToBottom = () => {
    contentRef.current?.scrollToBottom(300);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Event Log</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={clear} disabled={entries.length === 0}>
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        {/* Filter chips */}
        <div style={{ padding: '8px 4px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {ALL_EVENT_TYPES.map((type) => (
            <IonChip
              key={type}
              color={enabledTypes.has(type) ? chipColorMap[type] : 'medium'}
              outline={!enabledTypes.has(type)}
              onClick={() => toggleType(type)}
              style={{ fontSize: 12 }}
            >
              <IonLabel>{type.replace('on', '')}</IonLabel>
            </IonChip>
          ))}
        </div>

        {/* Event list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--ion-color-medium)' }}>
            <p>No events yet.</p>
            <p style={{ fontSize: 13 }}>Launch a Transact flow to see events here.</p>
          </div>
        ) : (
          filtered.map((entry) => <EventLogEntry key={entry.id} entry={entry} />)
        )}

        {/* Auto-scroll FAB */}
        {entries.length > 0 && (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              size="small"
              color={autoScroll ? 'primary' : 'medium'}
              onClick={() => {
                setAutoScroll(!autoScroll);
                if (!autoScroll) scrollToBottom();
              }}
            >
              <IonIcon icon={arrowDown} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EventLogTab;
