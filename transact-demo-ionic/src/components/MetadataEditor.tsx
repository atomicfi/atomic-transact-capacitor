import React from 'react';
import { IonButton, IonIcon, IonInput } from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';

interface MetadataEditorProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ value, onChange }) => {
  const entries = Object.entries(value);

  const updateKey = (oldKey: string, newKey: string) => {
    const updated: Record<string, string> = {};
    for (const [k, v] of Object.entries(value)) {
      updated[k === oldKey ? newKey : k] = v;
    }
    onChange(updated);
  };

  const updateValue = (key: string, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  const addRow = () => {
    const key = `key${entries.length + 1}`;
    onChange({ ...value, [key]: '' });
  };

  const removeRow = (key: string) => {
    const { [key]: _, ...rest } = value;
    onChange(rest);
  };

  return (
    <div>
      {entries.map(([k, v]) => (
        <div className="metadata-row" key={k}>
          <IonInput
            value={k}
            placeholder="Key"
            onIonInput={(e) => updateKey(k, e.detail.value ?? '')}
            labelPlacement="stacked"
            style={{ flex: 1 }}
          />
          <IonInput
            value={v}
            placeholder="Value"
            onIonInput={(e) => updateValue(k, e.detail.value ?? '')}
            labelPlacement="stacked"
            style={{ flex: 1 }}
          />
          <IonButton fill="clear" color="danger" size="small" onClick={() => removeRow(k)}>
            <IonIcon slot="icon-only" icon={trashOutline} />
          </IonButton>
        </div>
      ))}
      <IonButton fill="clear" size="small" onClick={addRow}>
        <IonIcon slot="start" icon={addOutline} />
        Add
      </IonButton>
    </div>
  );
};

export default MetadataEditor;
