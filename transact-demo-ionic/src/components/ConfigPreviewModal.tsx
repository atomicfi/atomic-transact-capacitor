import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/react';
import { copyOutline, closeOutline } from 'ionicons/icons';

interface ConfigPreviewModalProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  onClose: () => void;
}

const ConfigPreviewModal: React.FC<ConfigPreviewModalProps> = ({ isOpen, config, onClose }) => {
  const json = JSON.stringify(config, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // Fallback for native
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Config Preview</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={copyToClipboard}>
              <IonIcon slot="icon-only" icon={copyOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <pre className="config-json">{json}</pre>
      </IonContent>
    </IonModal>
  );
};

export default ConfigPreviewModal;
