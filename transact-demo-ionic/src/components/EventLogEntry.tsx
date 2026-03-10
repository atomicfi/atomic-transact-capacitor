import React, { useState } from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import EventBadge from './EventBadge';
import type { LogEntry } from '../providers/EventLogProvider';

interface EventLogEntryProps {
  entry: LogEntry;
}

function getSummary(entry: LogEntry): string | null {
  const p = entry.payload;
  if (!p) return null;

  if (entry.type === 'onAuthStatusUpdate' && p.status) {
    return p.status;
  }

  if (entry.type === 'onTaskStatusUpdate' && p.status) {
    const parts = [p.status];
    if (p.failReason) parts.push(p.failReason);
    return parts.join(' · ');
  }

  return null;
}

const EventLogEntry: React.FC<EventLogEntryProps> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const hasPayload = entry.payload && Object.keys(entry.payload).length > 0;
  const summary = getSummary(entry);
  const time = entry.timestamp.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div>
      <IonItem
        button={hasPayload}
        onClick={() => hasPayload && setExpanded(!expanded)}
        detail={false}
        lines="full"
      >
        {hasPayload && (
          <IonIcon
            slot="start"
            icon={expanded ? chevronDown : chevronForward}
            style={{ fontSize: 14, color: 'var(--ion-color-medium)', marginRight: 4 }}
          />
        )}
        <IonLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EventBadge type={entry.type} />
            {summary && (
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ion-text-color)' }}>
                {summary}
              </span>
            )}
            <span className="event-timestamp" style={{ marginLeft: 'auto' }}>{time}</span>
          </div>
        </IonLabel>
      </IonItem>
      {expanded && hasPayload && (
        <div className="event-json">{JSON.stringify(entry.payload, null, 2)}</div>
      )}
    </div>
  );
};

export default EventLogEntry;
