import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';
import { useSettings } from '../hooks/useSettings';

const TokenWarningBanner: React.FC = () => {
  const { settings } = useSettings();

  if (settings.publicToken) return null;

  return (
    <IonCard className="token-warning">
      <IonCardContent>
        <IonIcon icon={warningOutline} style={{ fontSize: 20 }} />
        <span>Public token is missing. Set it in the Settings tab.</span>
      </IonCardContent>
    </IonCard>
  );
};

export default TokenWarningBanner;
