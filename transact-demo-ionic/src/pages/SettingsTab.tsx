import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonBadge,
  IonNote,
  IonList,
  IonListHeader,
} from '@ionic/react';
import type { LanguageType } from '@atomicfi/transact-capacitor';
import ColorPickerRow from '../components/ColorPickerRow';
import { useSettings } from '../hooks/useSettings';
import { usePlatform } from '../hooks/usePlatform';

const SettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const { isIOS, platform } = usePlatform();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Public Token */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Public Token</IonLabel>
          </IonListHeader>
          <IonItem lines="none">
            <IonInput
              value={settings.publicToken}
              placeholder="Enter your public token"
              onIonInput={(e) => updateSetting('publicToken', e.detail.value ?? '')}
              clearInput
            />
            <IonBadge
              slot="end"
              color={settings.publicToken ? 'success' : 'warning'}
            >
              {settings.publicToken ? 'Set' : 'Missing'}
            </IonBadge>
          </IonItem>
        </IonList>

        {/* Environment */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Environment</IonLabel>
          </IonListHeader>
          <IonRadioGroup
            value={settings.environment}
            onIonChange={(e) => updateSetting('environment', e.detail.value)}
          >
            <IonItem>
              <IonRadio value="production">Production</IonRadio>
            </IonItem>
            <IonItem>
              <IonRadio value="sandbox">Sandbox</IonRadio>
            </IonItem>
            <IonItem lines={settings.environment === 'custom' ? undefined : 'none'}>
              <IonRadio value="custom">Custom</IonRadio>
            </IonItem>
          </IonRadioGroup>
          {settings.environment === 'custom' && (
            <>
              <IonItem>
                <IonInput
                  label="Transact URL"
                  labelPlacement="stacked"
                  value={settings.customTransactPath}
                  placeholder="https://transact.example.com"
                  onIonInput={(e) => updateSetting('customTransactPath', e.detail.value ?? '')}
                />
              </IonItem>
              <IonItem lines="none">
                <IonInput
                  label="API URL"
                  labelPlacement="stacked"
                  value={settings.customApiPath}
                  placeholder="https://api.example.com"
                  onIonInput={(e) => updateSetting('customApiPath', e.detail.value ?? '')}
                />
              </IonItem>
            </>
          )}
        </IonList>

        {/* Presentation Style — iOS only */}
        {isIOS && (
          <IonList inset>
            <IonListHeader>
              <IonLabel>Presentation Style</IonLabel>
            </IonListHeader>
            <IonItem lines="none">
              <IonSegment
                value={settings.presentationStyle}
                onIonChange={(e) => updateSetting('presentationStyle', e.detail.value as 'formSheet' | 'fullScreen')}
              >
                <IonSegmentButton value="formSheet">Form Sheet</IonSegmentButton>
                <IonSegmentButton value="fullScreen">Full Screen</IonSegmentButton>
              </IonSegment>
            </IonItem>
          </IonList>
        )}

        {/* Language */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Language</IonLabel>
          </IonListHeader>
          <IonItem lines="none">
            <IonSegment
              value={settings.language}
              onIonChange={(e) => updateSetting('language', e.detail.value as LanguageType)}
            >
              <IonSegmentButton value="en">English</IonSegmentButton>
              <IonSegmentButton value="es">Spanish</IonSegmentButton>
            </IonSegment>
          </IonItem>
        </IonList>

        {/* Theme */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Theme</IonLabel>
          </IonListHeader>
          <ColorPickerRow
            label="Brand Color"
            value={settings.brandColor}
            onChange={(v) => updateSetting('brandColor', v)}
          />
          <ColorPickerRow
            label="Overlay Color"
            value={settings.overlayColor}
            onChange={(v) => updateSetting('overlayColor', v)}
          />
          <IonItem lines="none">
            <IonSelect
              label="Appearance"
              value={settings.darkMode}
              onIonChange={(e) => updateSetting('darkMode', e.detail.value as 'system' | 'dark' | 'light')}
            >
              <IonSelectOption value="system">System</IonSelectOption>
              <IonSelectOption value="dark">Dark</IonSelectOption>
              <IonSelectOption value="light">Light</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        {/* Navigation Options */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>Navigation Options</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonToggle
              checked={settings.showBackButton}
              onIonChange={(e) => updateSetting('showBackButton', e.detail.checked)}
            >
              Show Back Button
            </IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle
              checked={settings.showBackButtonText}
              onIonChange={(e) => updateSetting('showBackButtonText', e.detail.checked)}
            >
              Show Back Button Text
            </IonToggle>
          </IonItem>
          <IonItem lines="none">
            <IonToggle
              checked={settings.showCloseButton}
              onIonChange={(e) => updateSetting('showCloseButton', e.detail.checked)}
            >
              Show Close Button
            </IonToggle>
          </IonItem>
        </IonList>

        {/* About */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>About</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Platform</IonLabel>
            <IonNote slot="end">{platform}</IonNote>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Plugin</IonLabel>
            <IonNote slot="end">@atomicfi/transact-capacitor</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsTab;
