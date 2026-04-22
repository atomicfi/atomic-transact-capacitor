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
  App,
  PresentationStyle,
} from '@atomicfi/transact-capacitor';
import type {
  TransactConfig,
  PresentTransactOptions,
  TransactEnvironment,
  OperationType,
  ScopeType,
  StepType,
  AppType,
} from '@atomicfi/transact-capacitor';

interface State {
  publicToken: string;
  environment: 'sandbox' | 'production' | 'custom';
  customTransactPath: string;
  customApiPath: string;
  selectedOperation: OperationType;
  darkMode: boolean;
  debug: boolean;
  presentationStyle: 'formSheet' | 'fullScreen';
  useDeeplink: boolean;
  deeplinkStep: StepType;
  deeplinkCompanyId: string;
  deeplinkApp: AppType;
  deeplinkPayments: string;
  deeplinkAccountId: string;
  autoHide: boolean;
  autoHideSeconds: number;
  autoPause: boolean;
  autoPauseSeconds: number;
  autoResumeSeconds: number;
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
    debug: false,
    presentationStyle: PresentationStyle.FORM_SHEET,
    useDeeplink: false,
    deeplinkStep: Step.LOGIN_COMPANY,
    deeplinkCompanyId: '',
    deeplinkApp: App.PAY_NOW,
    deeplinkPayments: '',
    deeplinkAccountId: '',
    autoHide: false,
    autoHideSeconds: 5,
    autoPause: false,
    autoPauseSeconds: 5,
    autoResumeSeconds: 3,
    isLoading: false,
  };

  let autoHideTimer: ReturnType<typeof setTimeout> | null = null;
  let autoPauseTimer: ReturnType<typeof setTimeout> | null = null;
  let autoResumeTimer: ReturnType<typeof setTimeout> | null = null;

  function clearAutoHideTimer() {
    if (autoHideTimer !== null) {
      clearTimeout(autoHideTimer);
      autoHideTimer = null;
    }
  }

  function clearPauseResumeTimers() {
    if (autoPauseTimer !== null) {
      clearTimeout(autoPauseTimer);
      autoPauseTimer = null;
    }
    if (autoResumeTimer !== null) {
      clearTimeout(autoResumeTimer);
      autoResumeTimer = null;
    }
  }

  function getScope(): ScopeType {
    const payLinkOps: OperationType[] = [Operation.SWITCH, Operation.PRESENT, Operation.MANAGE];
    return payLinkOps.includes(state.selectedOperation) ? Scope.PAY_LINK : Scope.USER_LINK;
  }

  function isManage(): boolean {
    return state.selectedOperation === Operation.MANAGE;
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

    if (state.useDeeplink && !isManage()) {
      const requiresCompanyId = state.deeplinkStep !== Step.SEARCH_COMPANY;
      if (requiresCompanyId && !state.deeplinkCompanyId.trim()) {
        showAlert('Error', 'Please enter a Company ID when using deeplink');
        return;
      }
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
        clearAutoHideTimer();
        clearPauseResumeTimers();
        state.isLoading = false;
        updateLaunchButton();
        console.log('Transact Finished:', event);
        showAlert('Success', 'Transact flow completed successfully!');
      });

      await TransactPlugin.addListener('onClose', (event) => {
        clearAutoHideTimer();
        clearPauseResumeTimers();
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
        if (isManage()) {
          const payments = state.deeplinkPayments
            .split(',')
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
          config.deeplink = {
            app: state.deeplinkApp,
            ...(payments.length > 0 && { payments }),
            ...(state.deeplinkAccountId.trim() && { accountId: state.deeplinkAccountId.trim() }),
          };
        } else {
          config.deeplink = {
            step: state.deeplinkStep,
            ...(state.deeplinkCompanyId.trim() && { companyId: state.deeplinkCompanyId.trim() }),
          };
        }
      }

      const options: PresentTransactOptions = {
        config,
        environment: getEnvironment(),
        presentationStyle: state.presentationStyle,
        debug: state.debug,
      };

      if (state.autoHide) {
        const delayMs = Math.max(0, state.autoHideSeconds) * 1000;
        autoHideTimer = setTimeout(async () => {
          console.log(`Auto-hide timer fired after ${state.autoHideSeconds}s — calling hideTransact()`);
          try {
            await TransactPlugin.hideTransact();
            console.log('hideTransact() resolved');
          } catch (err) {
            console.error('hideTransact error:', err);
            showAlert('Error', `hideTransact failed: ${err}`);
          } finally {
            // hideTransact does not fire onClose, so reset the loading state here.
            state.isLoading = false;
            updateLaunchButton();
          }
        }, delayMs);
      }

      if (state.autoPause) {
        const pauseDelayMs = Math.max(0, state.autoPauseSeconds) * 1000;
        const resumeDelayMs = Math.max(0, state.autoResumeSeconds) * 1000;
        autoPauseTimer = setTimeout(async () => {
          console.log(`Auto-pause timer fired after ${state.autoPauseSeconds}s — calling pauseTransact()`);
          try {
            await TransactPlugin.pauseTransact();
            console.log('pauseTransact() resolved');

            autoResumeTimer = setTimeout(async () => {
              console.log(`Auto-resume timer fired after ${state.autoResumeSeconds}s — calling resumeTransact()`);
              try {
                await TransactPlugin.resumeTransact();
                console.log('resumeTransact() resolved');
              } catch (err) {
                console.error('resumeTransact error:', err);
                showAlert('Error', `resumeTransact failed: ${err}`);
              }
            }, resumeDelayMs);
          } catch (err) {
            console.error('pauseTransact error:', err);
            showAlert('Error', `pauseTransact failed: ${err}`);
          }
        }, pauseDelayMs);
      }

      await TransactPlugin.presentTransact(options);
    } catch (err) {
      clearAutoHideTimer();
      clearPauseResumeTimers();
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
    updateDeeplinkVisibility();
  }

  function setDeeplinkApp(app: AppType) {
    state.deeplinkApp = app;
    document.querySelectorAll('#deeplink-app-pills .pill').forEach((el) => {
      el.classList.toggle('selected', el.getAttribute('data-app') === app);
    });
  }

  function updateDeeplinkVisibility() {
    const manageSection = document.getElementById('deeplink-manage-options');
    const defaultSection = document.getElementById('deeplink-default-options');
    if (!manageSection || !defaultSection) return;
    manageSection.classList.toggle('hidden', !isManage());
    defaultSection.classList.toggle('hidden', isManage());
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

            <div class="switch-row">
              <label class="label" style="margin-bottom: 0">Debug Mode</label>
              <div class="switch-right">
                <span class="switch-label">Off</span>
                <label class="toggle">
                  <input type="checkbox" id="debug-toggle" />
                  <span class="toggle-track"></span>
                </label>
                <span class="switch-label">On</span>
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
              <button class="pill" data-product="${Operation.MANAGE}">Manage</button>
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
              <div id="deeplink-default-options">
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

              <div id="deeplink-manage-options" class="hidden">
                <div class="input-group">
                  <label class="label">App</label>
                  <div class="pill-group" id="deeplink-app-pills">
                    <button class="pill selected" data-app="${App.PAY_NOW}">Pay Now</button>
                    <button class="pill" data-app="${App.EXPENSES}">Expenses</button>
                    <button class="pill" data-app="${App.ORDERS}">Orders</button>
                    <button class="pill" data-app="${App.SUGGESTIONS}">Suggestions</button>
                  </div>
                </div>

                <div class="input-group">
                  <label class="label">Payments (comma-separated IDs)</label>
                  <input type="text" class="text-input" id="deeplink-payments" placeholder="e.g. pay_1,pay_2" />
                </div>

                <div class="input-group">
                  <label class="label">Account ID</label>
                  <input type="text" class="text-input" id="deeplink-account-id" placeholder="Enter account ID" />
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">Hide Transact Test</div>

            <div class="switch-row">
              <label class="label" style="margin-bottom: 0">Auto-hide after launch</label>
              <div class="switch-right">
                <span class="switch-label">Off</span>
                <label class="toggle">
                  <input type="checkbox" id="auto-hide-toggle" />
                  <span class="toggle-track"></span>
                </label>
                <span class="switch-label">On</span>
              </div>
            </div>

            <div id="auto-hide-options" class="hidden">
              <div class="input-group">
                <label class="label">Seconds until hideTransact()</label>
                <input type="number" class="text-input" id="auto-hide-seconds" min="0" step="1" value="5" />
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">Pause / Resume Test</div>

            <div class="switch-row">
              <label class="label" style="margin-bottom: 0">Auto-pause and resume after launch</label>
              <div class="switch-right">
                <span class="switch-label">Off</span>
                <label class="toggle">
                  <input type="checkbox" id="auto-pause-toggle" />
                  <span class="toggle-track"></span>
                </label>
                <span class="switch-label">On</span>
              </div>
            </div>

            <div id="auto-pause-options" class="hidden">
              <div class="input-group">
                <label class="label">Seconds until pauseTransact()</label>
                <input type="number" class="text-input" id="auto-pause-seconds" min="0" step="1" value="5" />
              </div>
              <div class="input-group">
                <label class="label">Seconds until resumeTransact()</label>
                <input type="number" class="text-input" id="auto-resume-seconds" min="0" step="1" value="3" />
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

      document.getElementById('deeplink-payments')?.addEventListener('input', (e) => {
        state.deeplinkPayments = (e.target as HTMLInputElement).value;
      });

      document.getElementById('deeplink-account-id')?.addEventListener('input', (e) => {
        state.deeplinkAccountId = (e.target as HTMLInputElement).value;
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

      // Debug mode toggle
      document.getElementById('debug-toggle')!.addEventListener('change', (e) => {
        state.debug = (e.target as HTMLInputElement).checked;
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

      // Deeplink app pills (manage)
      document.querySelectorAll('#deeplink-app-pills .pill').forEach((el) => {
        el.addEventListener('click', () => {
          setDeeplinkApp(el.getAttribute('data-app')! as AppType);
        });
      });

      // Auto-hide toggle
      document.getElementById('auto-hide-toggle')!.addEventListener('change', (e) => {
        state.autoHide = (e.target as HTMLInputElement).checked;
        document.getElementById('auto-hide-options')!.classList.toggle('hidden', !state.autoHide);
      });

      // Auto-hide seconds input
      document.getElementById('auto-hide-seconds')!.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        state.autoHideSeconds = Number.isFinite(value) ? value : 0;
      });

      // Auto-pause toggle
      document.getElementById('auto-pause-toggle')!.addEventListener('change', (e) => {
        state.autoPause = (e.target as HTMLInputElement).checked;
        document.getElementById('auto-pause-options')!.classList.toggle('hidden', !state.autoPause);
      });

      // Auto-pause seconds
      document.getElementById('auto-pause-seconds')!.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        state.autoPauseSeconds = Number.isFinite(value) ? value : 0;
      });

      // Auto-resume seconds
      document.getElementById('auto-resume-seconds')!.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        state.autoResumeSeconds = Number.isFinite(value) ? value : 0;
      });

      // Launch
      document.getElementById('launch-transact-btn')!.addEventListener('click', () => launch());
    },

    cleanup() {
      clearAutoHideTimer();
      clearPauseResumeTimers();
      TransactPlugin.removeAllListeners();
    },
  };
}
