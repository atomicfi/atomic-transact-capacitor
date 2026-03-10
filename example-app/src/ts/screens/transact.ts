import type { Screen } from '../router';
import { navigate } from '../router';
import { showAlert } from '../utils/alert';
import { isIOS } from '../utils/platform';
import {
  TransactPlugin,
  Operation,
  Scope,
  Environment,
  Step,
  PresentationStyle,
} from '@atomicfi/transact-capacitor';
import type {
  TransactConfig,
  PresentTransactOptions,
  TransactEnvironment,
  OperationType,
  ScopeType,
  StepType,
} from '@atomicfi/transact-capacitor';

interface State {
  publicToken: string;
  environment: 'sandbox' | 'production' | 'custom';
  customTransactPath: string;
  customApiPath: string;
  selectedOperation: OperationType;
  darkMode: boolean;
  presentationStyle: 'formSheet' | 'fullScreen';
  useDeeplink: boolean;
  deeplinkStep: StepType;
  deeplinkCompanyId: string;
  isLoading: boolean;
}

export function createTransactScreen(): Screen {
  const state: State = {
    publicToken: '',
    environment: 'sandbox',
    customTransactPath: '',
    customApiPath: '',
    selectedOperation: Operation.DEPOSIT,
    darkMode: false,
    presentationStyle: PresentationStyle.FORM_SHEET,
    useDeeplink: false,
    deeplinkStep: Step.LOGIN_COMPANY,
    deeplinkCompanyId: '',
    isLoading: false,
  };

  function getScope(): ScopeType {
    return state.selectedOperation === Operation.SWITCH ? Scope.PAY_LINK : Scope.USER_LINK;
  }

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
    if (!state.publicToken.trim()) {
      showAlert('Error', 'Please enter a valid public token');
      return;
    }

    if (state.environment === 'custom' && (!state.customTransactPath.trim() || !state.customApiPath.trim())) {
      showAlert('Error', 'Please enter both transact path and API path for custom environment');
      return;
    }

    const requiresCompanyId = state.deeplinkStep !== Step.SEARCH_COMPANY;
    if (state.useDeeplink && requiresCompanyId && !state.deeplinkCompanyId.trim()) {
      showAlert('Error', 'Please enter a Company ID when using deeplink');
      return;
    }

    state.isLoading = true;
    updateLaunchButton();

    try {
      await TransactPlugin.removeAllListeners();

      await TransactPlugin.addListener('onInteraction', (event) => {
        console.log('Interaction:', event);
      });

      await TransactPlugin.addListener('onDataRequest', (event) => {
        console.log('Data Request:', event);
      });

      await TransactPlugin.addListener('onAuthStatusUpdate', (event) => {
        console.log('Auth Status Update:', event);
      });

      await TransactPlugin.addListener('onTaskStatusUpdate', (event) => {
        console.log('Task Status Update:', event);
      });

      await TransactPlugin.addListener('onFinish', (event) => {
        state.isLoading = false;
        updateLaunchButton();
        console.log('Transact Finished:', event);
        showAlert('Success', 'Transact flow completed successfully!');
      });

      await TransactPlugin.addListener('onClose', (event) => {
        state.isLoading = false;
        updateLaunchButton();
        console.log('Transact Closed:', event);
        showAlert('Info', 'Transact flow was closed by user');
      });

      const config: TransactConfig = {
        publicToken: state.publicToken.trim(),
        scope: getScope(),
        tasks: [{ operation: state.selectedOperation }],
      };

      if (state.darkMode) {
        config.theme = { dark: true };
      }

      if (state.useDeeplink) {
        config.deeplink = {
          step: state.deeplinkStep,
          ...(state.deeplinkCompanyId.trim() && { companyId: state.deeplinkCompanyId.trim() }),
        };
      }

      const options: PresentTransactOptions = {
        config,
        environment: getEnvironment(),
        presentationStyle: state.presentationStyle,
      };

      await TransactPlugin.presentTransact(options);
    } catch (err) {
      state.isLoading = false;
      updateLaunchButton();
      console.error('presentTransact error:', err);
      showAlert('Error', `Failed to launch Transact: ${err}`);
    }
  }

  function updateLaunchButton() {
    const btn = document.getElementById('launch-transact-btn') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = state.isLoading;
      btn.textContent = state.isLoading ? 'Launching...' : 'Launch Transact';
    }
  }

  function setEnvironment(env: State['environment']) {
    state.environment = env;
    document.querySelectorAll('#env-radio-group .radio-option').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-env') === env);
    });
    document.getElementById('custom-env-inputs')!.classList.toggle('hidden', env !== 'custom');
  }

  function setOperation(product: OperationType) {
    state.selectedOperation = product;
    document.querySelectorAll('#product-pills .pill').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-product') === product);
    });
  }

  function setPresentationStyle(style: 'formSheet' | 'fullScreen') {
    state.presentationStyle = style;
    document.querySelectorAll('#presentation-pills .pill').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-style') === style);
    });
  }

  function setDeeplinkStep(step: StepType) {
    state.deeplinkStep = step;
    document.querySelectorAll('#deeplink-step-pills .pill').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-step') === step);
    });
  }

  function toggleDeeplink(enabled: boolean) {
    state.useDeeplink = enabled;
    document.getElementById('deeplink-options')!.classList.toggle('hidden', !enabled);
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
          <div class="header-title">Transact Demo</div>
        </div>

        <div class="scrollable">
          <div class="section-card">
            <div class="section-title">Configuration</div>

            <div class="input-group">
              <label class="label">Public Token *</label>
              <input type="text" class="text-input" id="public-token-input" placeholder="Enter your Atomic public token" />
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

            <div class="switch-row">
              <label class="label" style="margin-bottom: 0">Theme</label>
              <div class="switch-right">
                <span class="switch-label" id="theme-label">Light Mode</span>
                <label class="toggle">
                  <input type="checkbox" id="dark-mode-toggle" />
                  <span class="toggle-track"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">Operation</div>
            <div class="pill-group" id="product-pills">
              <button class="pill selected" data-product="${Operation.DEPOSIT}">Deposit</button>
              <button class="pill" data-product="${Operation.VERIFY}">Verify</button>
              <button class="pill" data-product="${Operation.TAX}">Tax</button>
              <button class="pill" data-product="${Operation.SWITCH}">Switch</button>
            </div>
          </div>

          ${iosSection}

          <div class="section-card">
            <div class="section-title">Deeplink Options (Optional)</div>

            <div class="switch-row">
              <label class="label" style="margin-bottom: 0">Use Deeplink</label>
              <div class="switch-right">
                <span class="switch-label">Off</span>
                <label class="toggle">
                  <input type="checkbox" id="deeplink-toggle" />
                  <span class="toggle-track"></span>
                </label>
                <span class="switch-label">On</span>
              </div>
            </div>

            <div id="deeplink-options" class="hidden">
              <div class="input-group">
                <label class="label">Step</label>
                <div class="pill-group" id="deeplink-step-pills">
                  <button class="pill selected" data-step="${Step.LOGIN_COMPANY}">Login Company</button>
                  <button class="pill" data-step="${Step.SEARCH_COMPANY}">Search Company</button>
                </div>
              </div>

              <div class="input-group">
                <label class="label">Company ID</label>
                <input type="text" class="text-input" id="deeplink-company-id" placeholder="Enter company ID for deeplink" />
              </div>
            </div>
          </div>

          <button class="launch-btn launch-btn--green" id="launch-transact-btn">Launch Transact</button>
        </div>
      `;
    },

    init() {
      document.getElementById('back-btn')!.addEventListener('click', () => navigate('/'));

      // Text inputs
      document.getElementById('public-token-input')!.addEventListener('input', (e) => {
        state.publicToken = (e.target as HTMLInputElement).value;
      });

      document.getElementById('custom-transact-path')?.addEventListener('input', (e) => {
        state.customTransactPath = (e.target as HTMLInputElement).value;
      });

      document.getElementById('custom-api-path')?.addEventListener('input', (e) => {
        state.customApiPath = (e.target as HTMLInputElement).value;
      });

      document.getElementById('deeplink-company-id')?.addEventListener('input', (e) => {
        state.deeplinkCompanyId = (e.target as HTMLInputElement).value;
      });

      // Environment radio
      document.querySelectorAll('#env-radio-group .radio-option').forEach((el) => {
        el.addEventListener('click', () => {
          setEnvironment(el.getAttribute('data-env') as State['environment']);
        });
      });

      // Dark mode toggle
      document.getElementById('dark-mode-toggle')!.addEventListener('change', (e) => {
        state.darkMode = (e.target as HTMLInputElement).checked;
        document.getElementById('theme-label')!.textContent = state.darkMode ? 'Dark Mode' : 'Light Mode';
      });

      // Operation pills
      document.querySelectorAll('#product-pills .pill').forEach((el) => {
        el.addEventListener('click', () => {
          setOperation(el.getAttribute('data-product')! as OperationType);
        });
      });

      // Presentation style pills
      document.querySelectorAll('#presentation-pills .pill').forEach((el) => {
        el.addEventListener('click', () => {
          setPresentationStyle(el.getAttribute('data-style')! as 'formSheet' | 'fullScreen');
        });
      });

      // Deeplink toggle
      document.getElementById('deeplink-toggle')!.addEventListener('change', (e) => {
        toggleDeeplink((e.target as HTMLInputElement).checked);
      });

      // Deeplink step pills
      document.querySelectorAll('#deeplink-step-pills .pill').forEach((el) => {
        el.addEventListener('click', () => {
          setDeeplinkStep(el.getAttribute('data-step')! as StepType);
        });
      });

      // Launch
      document.getElementById('launch-transact-btn')!.addEventListener('click', () => launch());
    },

    cleanup() {
      TransactPlugin.removeAllListeners();
    },
  };
}
