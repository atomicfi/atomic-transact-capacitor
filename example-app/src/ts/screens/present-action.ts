import type { Screen } from '../router';
import { navigate } from '../router';
import { showAlert } from '../utils/alert';
import { isIOS } from '../utils/platform';
import {
  TransactPlugin,
  Environment,
  PresentationStyle,
} from '@atomicfi/transact-capacitor';
import type {
  PresentActionOptions,
  TransactEnvironment,
} from '@atomicfi/transact-capacitor';

interface State {
  actionId: string;
  environment: 'sandbox' | 'production' | 'custom';
  customTransactPath: string;
  customApiPath: string;
  presentationStyle: string;
  isLoading: boolean;
}

export function createPresentActionScreen(): Screen {
  const state: State = {
    actionId: '',
    environment: 'sandbox',
    customTransactPath: '',
    customApiPath: '',
    presentationStyle: PresentationStyle.FORM_SHEET,
    isLoading: false,
  };

  function getEnvironment(): TransactEnvironment {
    switch (state.environment) {
      case 'production':
        return Environment.production;
      case 'custom':
        return Environment.custom(state.customTransactPath.trim(), state.customApiPath.trim());
      default:
        return Environment.sandbox;
    }
  }

  async function launch() {
    if (!state.actionId.trim()) {
      showAlert('Error', 'Please enter a valid action ID');
      return;
    }

    if (state.environment === 'custom' && (!state.customTransactPath.trim() || !state.customApiPath.trim())) {
      showAlert('Error', 'Please enter both transact path and API path for custom environment');
      return;
    }

    state.isLoading = true;
    updateLaunchButton();

    try {
      await TransactPlugin.removeAllListeners();

      await TransactPlugin.addListener('onLaunch', () => {
        console.log('Action launched');
      });

      await TransactPlugin.addListener('onFinish', (event) => {
        state.isLoading = false;
        updateLaunchButton();
        console.log('Action finished:', event);
        showAlert('Success', 'Action completed successfully!');
      });

      await TransactPlugin.addListener('onClose', (event) => {
        state.isLoading = false;
        updateLaunchButton();
        console.log('Action closed:', event);
        showAlert('Info', 'Action was closed by user');
      });

      await TransactPlugin.addListener('onAuthStatusUpdate', (event) => {
        console.log('Auth Status Update:', event);
      });

      await TransactPlugin.addListener('onTaskStatusUpdate', (event) => {
        console.log('Task Status Update:', event);
      });

      const options: PresentActionOptions = {
        id: state.actionId.trim(),
        environment: getEnvironment(),
        presentationStyle: state.presentationStyle as 'formSheet' | 'fullScreen',
      };

      await TransactPlugin.presentAction(options);
    } catch (err) {
      state.isLoading = false;
      updateLaunchButton();
      console.error('presentAction error:', err);
      showAlert('Error', `Failed to present action: ${err}`);
    }
  }

  function updateLaunchButton() {
    const btn = document.getElementById('launch-action-btn') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = state.isLoading;
      btn.textContent = state.isLoading ? 'Launching...' : 'Present Action';
    }
  }

  function setEnvironment(env: State['environment']) {
    state.environment = env;
    document.querySelectorAll('#env-radio-group .radio-option').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-env') === env);
    });
    const customInputs = document.getElementById('custom-env-inputs')!;
    customInputs.classList.toggle('hidden', env !== 'custom');
  }

  function setPresentationStyle(style: string) {
    state.presentationStyle = style;
    document.querySelectorAll('#presentation-pills .pill').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-style') === style);
    });
  }

  return {
    render() {
      const iosSection = isIOS()
        ? `
        <div class="section-card">
          <div class="section-title">iOS Presentation Style</div>
          <div class="pill-group" id="presentation-pills">
            <button class="pill selected" data-style="${PresentationStyle.FORM_SHEET}">Form Sheet</button>
            <button class="pill" data-style="${PresentationStyle.FULL_SCREEN}">Full Screen</button>
          </div>
        </div>`
        : '';

      return `
        <div class="header-bar">
          <button class="header-back" id="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <div class="header-title">Present Action Demo</div>
        </div>

        <div class="hero hero--blue">
          <div class="hero-title">Present Action</div>
          <div class="hero-subtitle">Launch specific Atomic actions by ID</div>
        </div>

        <div class="scrollable">
          <div class="section-card">
            <div class="section-title">Configuration</div>

            <div class="input-group">
              <label class="label">Action ID *</label>
              <input type="text" class="text-input" id="action-id-input" placeholder="Enter action ID (e.g., action-123)" />
            </div>

            <div class="input-group">
              <label class="label">Environment</label>
              <div class="radio-group" id="env-radio-group">
                <div class="radio-option selected" data-env="sandbox">
                  <div class="radio-button"><div class="radio-button-inner"></div></div>
                  <span class="radio-label">Sandbox</span>
                </div>
                <div class="radio-option" data-env="production">
                  <div class="radio-button"><div class="radio-button-inner"></div></div>
                  <span class="radio-label">Production</span>
                </div>
                <div class="radio-option" data-env="custom">
                  <div class="radio-button"><div class="radio-button-inner"></div></div>
                  <span class="radio-label">Custom URL</span>
                </div>
              </div>
              <div id="custom-env-inputs" class="hidden">
                <input type="text" class="text-input text-input--mt" id="custom-transact-path" placeholder="Enter custom transact path" />
                <input type="text" class="text-input text-input--mt" id="custom-api-path" placeholder="Enter custom API path" />
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">How it works</div>
            <div class="info-card">
              <div class="info-card-text">Present Action allows you to launch specific Atomic actions by their ID. This is useful for:</div>
              <div class="info-card-bullet">\u2022 Launching pre-configured flows</div>
              <div class="info-card-bullet">\u2022 Deep linking to specific actions</div>
              <div class="info-card-bullet">\u2022 Custom user experiences</div>
              <div class="info-card-bullet">\u2022 Streamlined workflows</div>
            </div>
          </div>

          ${iosSection}

          <button class="launch-btn launch-btn--blue" id="launch-action-btn">Present Action</button>
        </div>
      `;
    },

    init() {
      document.getElementById('back-btn')!.addEventListener('click', () => navigate('/'));

      document.getElementById('action-id-input')!.addEventListener('input', (e) => {
        state.actionId = (e.target as HTMLInputElement).value;
      });

      document.querySelectorAll('#env-radio-group .radio-option').forEach((el) => {
        el.addEventListener('click', () => {
          setEnvironment(el.getAttribute('data-env') as State['environment']);
        });
      });

      document.getElementById('custom-transact-path')?.addEventListener('input', (e) => {
        state.customTransactPath = (e.target as HTMLInputElement).value;
      });

      document.getElementById('custom-api-path')?.addEventListener('input', (e) => {
        state.customApiPath = (e.target as HTMLInputElement).value;
      });

      document.querySelectorAll('#presentation-pills .pill').forEach((el) => {
        el.addEventListener('click', () => {
          setPresentationStyle(el.getAttribute('data-style')!);
        });
      });

      document.getElementById('launch-action-btn')!.addEventListener('click', () => launch());
    },

    cleanup() {
      TransactPlugin.removeAllListeners();
    },
  };
}
