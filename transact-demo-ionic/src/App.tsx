import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cardOutline, personOutline, listOutline, settingsOutline } from 'ionicons/icons';
import { SettingsProvider } from './providers/SettingsProvider';
import { EventLogProvider } from './providers/EventLogProvider';
import PayLinkTab from './pages/PayLinkTab';
import UserLinkTab from './pages/UserLinkTab';
import EventLogTab from './pages/EventLogTab';
import SettingsTab from './pages/SettingsTab';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode — follow system preference */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme */
import './theme/variables.css';
import './theme/global.css';

setupIonicReact({
  // Disable Ionic's hardware back button handler so the native Transact
  // webview receives Android back-button events instead of Ionic closing it.
  // This tab-based app has no navigation stack, so nothing else needs it.
  hardwareBackButton: false,
});

const App: React.FC = () => (
  <IonApp>
    <SettingsProvider>
      <EventLogProvider>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/paylink">
                <PayLinkTab />
              </Route>
              <Route exact path="/userlink">
                <UserLinkTab />
              </Route>
              <Route exact path="/events">
                <EventLogTab />
              </Route>
              <Route exact path="/settings">
                <SettingsTab />
              </Route>
              <Route exact path="/">
                <Redirect to="/paylink" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="paylink" href="/paylink">
                <IonIcon aria-hidden="true" icon={cardOutline} />
                <IonLabel>PayLink</IonLabel>
              </IonTabButton>
              <IonTabButton tab="userlink" href="/userlink">
                <IonIcon aria-hidden="true" icon={personOutline} />
                <IonLabel>UserLink</IonLabel>
              </IonTabButton>
              <IonTabButton tab="events" href="/events">
                <IonIcon aria-hidden="true" icon={listOutline} />
                <IonLabel>Events</IonLabel>
              </IonTabButton>
              <IonTabButton tab="settings" href="/settings">
                <IonIcon aria-hidden="true" icon={settingsOutline} />
                <IonLabel>Settings</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </EventLogProvider>
    </SettingsProvider>
  </IonApp>
);

export default App;
