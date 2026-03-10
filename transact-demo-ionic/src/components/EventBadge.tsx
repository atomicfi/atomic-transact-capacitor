import React from 'react';
import type { EventType } from '../providers/EventLogProvider';

const colorMap: Record<EventType, { bg: string; text: string }> = {
  onLaunch: { bg: 'var(--ion-color-success)', text: '#fff' },
  onFinish: { bg: 'var(--ion-color-success)', text: '#fff' },
  onClose: { bg: 'var(--ion-color-medium)', text: '#fff' },
  onInteraction: { bg: 'var(--ion-color-tertiary)', text: '#fff' },
  onDataRequest: { bg: 'var(--ion-color-warning)', text: '#000' },
  onAuthStatusUpdate: { bg: 'var(--ion-color-primary)', text: '#fff' },
  onTaskStatusUpdate: { bg: 'var(--ion-color-secondary)', text: '#fff' },
};

interface EventBadgeProps {
  type: EventType;
}

const EventBadge: React.FC<EventBadgeProps> = ({ type }) => {
  const colors = colorMap[type] ?? { bg: '#888', text: '#fff' };

  return (
    <span
      className="event-badge"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {type.replace('on', '')}
    </span>
  );
};

export default EventBadge;
