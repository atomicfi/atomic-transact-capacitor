import React from 'react';
import { IonButton, IonSpinner } from '@ionic/react';

interface LaunchButtonProps {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

const LaunchButton: React.FC<LaunchButtonProps> = ({ label, disabled = false, loading = false, onClick }) => (
  <IonButton
    className="launch-button"
    expand="block"
    color="success"
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? <IonSpinner name="crescent" /> : label}
  </IonButton>
);

export default LaunchButton;
