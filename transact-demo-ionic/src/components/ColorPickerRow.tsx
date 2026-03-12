import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';

interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPickerRow: React.FC<ColorPickerRowProps> = ({ label, value, onChange }) => (
  <IonItem>
    <IonLabel>{label}</IonLabel>
    <input
      type="color"
      value={value || '#000000'}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '2px solid var(--ion-border-color, #E2E8F0)',
        padding: 0,
        cursor: 'pointer',
        background: 'none',
      }}
    />
  </IonItem>
);

export default ColorPickerRow;
