import React from 'react';
import { IonButton } from '@ionic/react';

interface PillOption {
  label: string;
  value: string;
}

interface PillGroupProps {
  options: PillOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
}

const PillGroup: React.FC<PillGroupProps> = ({ options, value, onChange, multiSelect = false }) => {
  const selected = Array.isArray(value) ? value : [value];

  const toggle = (optValue: string) => {
    if (multiSelect) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(optValue)) {
        onChange(arr.filter((v) => v !== optValue));
      } else {
        onChange([...arr, optValue]);
      }
    } else {
      // Single-select: clicking the selected pill deselects it
      onChange(selected.includes(optValue) ? '' : optValue);
    }
  };

  return (
    <div className="pill-group">
      {options.map((opt) => (
        <IonButton
          key={opt.value}
          className={`pill-button ${selected.includes(opt.value) ? 'pill-selected' : 'pill-unselected'}`}
          fill="solid"
          size="small"
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </IonButton>
      ))}
    </div>
  );
};

export default PillGroup;
