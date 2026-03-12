import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonFooter,
  IonList,
  IonListHeader,
} from '@ionic/react';
import type { OperationType, StepType } from '@atomicfi/transact-capacitor';
import LaunchButton from '../components/LaunchButton';
import ConfigPreviewModal from '../components/ConfigPreviewModal';
import TokenWarningBanner from '../components/TokenWarningBanner';
import { useEventLog } from '../hooks/useEventLog';
import { useSettings } from '../hooks/useSettings';
import { useTransact } from '../hooks/useTransact';
import { buildUserLinkConfig, type UserLinkFormState } from '../utils/config-builder';
import { USERLINK_COMPANIES } from '../data/companies';

const UserLinkTab: React.FC = () => {
  const { settings } = useSettings();
  const { launch } = useTransact();
  const { entries } = useEventLog();

  const [operation, setOperation] = useState<OperationType>('deposit' as OperationType);
  const [deeplinkStep, setDeeplinkStep] = useState<StepType | null>(null);
  const [deeplinkCompanyId, setDeeplinkCompanyId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const formState: UserLinkFormState = {
    operations: operation ? [operation] : [],
    deeplinkStep,
    deeplinkCompanyId,
  };

  const config = buildUserLinkConfig(formState, settings);

  // Reset loading when the Transact webview fires onClose (covers Android back button)
  useEffect(() => {
    if (loading && entries.length > 0 && entries[entries.length - 1].type === 'onClose') {
      setLoading(false);
    }
  }, [entries, loading]);

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await launch(config);
    } catch (e) {
      console.error('Launch failed:', e);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>UserLink</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TokenWarningBanner />

        {/* Operation */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Operation</IonLabel>
          </IonListHeader>
          <IonItem lines="none">
            <IonSegment value={operation} onIonChange={(e) => setOperation(e.detail.value as OperationType)}>
              <IonSegmentButton value="deposit">Deposit</IonSegmentButton>
              <IonSegmentButton value="verify">Verify</IonSegmentButton>
              <IonSegmentButton value="tax">Tax</IonSegmentButton>
            </IonSegment>
          </IonItem>
        </IonList>

        {/* Deeplink */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Deeplink</IonLabel>
          </IonListHeader>
          <IonItem lines={'none'}>
            <IonSegment
              value={deeplinkStep ?? ''}
              onIonChange={(e) => {
                const val = e.detail.value;
                setDeeplinkStep(val ? (val as StepType) : null);
              }}
            >
              <IonSegmentButton value="">Welcome</IonSegmentButton>
              <IonSegmentButton value="search-company">Search</IonSegmentButton>
              <IonSegmentButton value="login-company">Login</IonSegmentButton>
            </IonSegment>
          </IonItem>
          {deeplinkStep === 'login-company' && (
            <IonItem lines="none">
              <IonSelect
                label="Company"
                value={deeplinkCompanyId}
                onIonChange={(e) => setDeeplinkCompanyId(e.detail.value ?? '')}
                placeholder="Select a company"
              >
                {USERLINK_COMPANIES.map((c) => (
                  <IonSelectOption key={c.id} value={c.id}>
                    {c.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}
        </IonList>

        <ConfigPreviewModal isOpen={showPreview} config={config} onClose={() => setShowPreview(false)} />
      </IonContent>
      <IonFooter className="form-footer">
        <IonButton expand="block" fill="outline" onClick={() => setShowPreview(true)}>
          Preview Config
        </IonButton>
        <LaunchButton
          label="Launch UserLink"
          disabled={!settings.publicToken || !operation}
          loading={loading}
          onClick={handleLaunch}
        />
      </IonFooter>
    </IonPage>
  );
};

export default UserLinkTab;
