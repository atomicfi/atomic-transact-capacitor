import type {
  TransactConfig,
  TransactTask,
  TransactTheme,
  TransactDeeplink,
  OperationType,
  ScopeType,
  StepType,
  AppType,
} from '@atomicfi/transact-capacitor';

import type { Settings } from '../providers/SettingsProvider';

// ── PayLink config ───────────────────────────────────────────────────────────

export interface PayLinkFormState {
  operations: OperationType[];
  deeplinkStep: StepType | null;
  deeplinkCompanyId: string;
  deeplinkApp: AppType | null;
  deeplinkPayments: string;
  deeplinkAccountId: string;
}

export function buildPayLinkConfig(form: PayLinkFormState, settings: Settings): TransactConfig {
  const tasks: TransactTask[] = form.operations.map((op) => ({ operation: op }));

  const config: TransactConfig = {
    publicToken: settings.publicToken,
    scope: 'pay-link' as ScopeType,
    tasks,
  };

  const isManage = form.operations.includes('manage' as OperationType);
  if (isManage) {
    if (form.deeplinkApp) {
      const deeplink: TransactDeeplink = { app: form.deeplinkApp };
      const payments = form.deeplinkPayments
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (payments.length > 0) deeplink.payments = payments;
      if (form.deeplinkAccountId) deeplink.accountId = form.deeplinkAccountId;
      config.deeplink = deeplink;
    }
  } else if (form.deeplinkStep) {
    const deeplink: TransactDeeplink = { step: form.deeplinkStep };
    if (form.deeplinkCompanyId) deeplink.companyId = form.deeplinkCompanyId;
    config.deeplink = deeplink;
  }

  applyLanguage(config, settings);
  applyTheme(config, settings);

  return config;
}

// ── UserLink config ──────────────────────────────────────────────────────────

export interface UserLinkFormState {
  operations: OperationType[];
  deeplinkStep: StepType | null;
  deeplinkCompanyId: string;
}

export function buildUserLinkConfig(form: UserLinkFormState, settings: Settings): TransactConfig {
  const tasks: TransactTask[] = form.operations.map((op) => {
    const task: TransactTask = {
      operation: op,
    };

    return task;
  });

  const config: TransactConfig = {
    publicToken: settings.publicToken,
    scope: 'user-link' as ScopeType,
    tasks,
  };

  if (form.deeplinkStep) {
    const deeplink: TransactDeeplink = { step: form.deeplinkStep };
    if (form.deeplinkCompanyId) deeplink.companyId = form.deeplinkCompanyId;
    config.deeplink = deeplink;
  }

  applyLanguage(config, settings);
  applyTheme(config, settings);

  return config;
}

// ── Shared ────────────────────────────────────────────────────────────────────

function applyLanguage(config: TransactConfig, settings: Settings): void {
  if (settings.language && settings.language !== 'en') {
    config.language = settings.language;
  }
}

function applyTheme(config: TransactConfig, settings: Settings): void {
  const theme: TransactTheme = {};
  if (settings.brandColor && settings.brandColor !== '#635BFF') {
    theme.brandColor = settings.brandColor;
  }
  if (settings.overlayColor) theme.overlayColor = settings.overlayColor;
  if (settings.darkMode === 'dark') theme.dark = true;
  if (settings.darkMode === 'light') theme.dark = false;

  const nav = {
    showBackButton: settings.showBackButton,
    showBackButtonText: settings.showBackButtonText,
    showCloseButton: settings.showCloseButton,
  };
  if (!nav.showBackButton || nav.showBackButtonText || !nav.showCloseButton) {
    theme.navigationOptions = nav;
  }

  if (Object.keys(theme).length > 0) config.theme = theme;
}
