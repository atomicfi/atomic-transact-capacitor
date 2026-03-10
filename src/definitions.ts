import type { PluginListenerHandle } from '@capacitor/core';

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────

export const Operation = {
  DEPOSIT: 'deposit',
  VERIFY: 'verify',
  TAX: 'tax',
  SWITCH: 'switch',
  PRESENT: 'present',
} as const;

export const Scope = {
  USER_LINK: 'user-link',
  PAY_LINK: 'pay-link',
} as const;

export const Environment = {
  production: { environment: 'production' } as TransactEnvironment,
  sandbox: { environment: 'sandbox' } as TransactEnvironment,
  custom: (transactPath: string, apiPath: string): TransactEnvironment => ({
    environment: 'custom',
    transactPath,
    apiPath,
  }),
};

export const Step = {
  LOGIN_COMPANY: 'login-company',
  SEARCH_COMPANY: 'search-company',
} as const;

export const PresentationStyle = {
  FORM_SHEET: 'formSheet',
  FULL_SCREEN: 'fullScreen',
} as const;

export const Language = {
  ENGLISH: 'en',
  SPANISH: 'es',
} as const;

export const Handoff = {
  EXIT_PROMPT: 'exit-prompt',
  AUTHENTICATION_SUCCESS: 'authentication-success',
  HIGH_LATENCY: 'high-latency',
} as const;

export const Tag = {
  GIG_ECONOMY: 'gig-economy',
  PAYROLL_PROVIDER: 'payroll-provider',
  UNEMPLOYMENT: 'unemployment',
} as const;

export const TaskStatus = {
  PROCESSING: 'processing',
  FAILED: 'failed',
  COMPLETED: 'completed',
} as const;

export const FailReason = {
  // UserLink
  ACCOUNT_LOCKOUT: 'account-lockout',
  ACCOUNT_SETUP_INCOMPLETE: 'account-setup-incomplete',
  ACCOUNT_UNUSABLE: 'account-unusable',
  AUTOMATION_BLOCKED: 'automation-blocked',
  BAD_CREDENTIALS: 'bad-credentials',
  CONNECTION_ERROR: 'connection-error',
  DISTRIBUTION_NOT_SUPPORTED: 'distribution-not-supported',
  ENROLLED_IN_PAYCARD: 'enrolled-in-paycard',
  EXPIRED: 'expired',
  NO_DATA_FOUND: 'no-data-found',
  PRODUCT_NOT_SUPPORTED: 'product-not-supported',
  ROUTING_NUMBER_NOT_SUPPORTED: 'routing-number-not-supported',
  SESSION_TIMEOUT: 'session-timeout',
  SYSTEM_UNAVAILABLE: 'system-unavailable',
  TRANSACTION_PENDING: 'transaction-pending',
  WORK_STATUS_TERMINATED: 'work-status-terminated',
  // PayLink
  SUBSCRIPTION_INACTIVE: 'subscription-inactive',
  SUBSCRIPTION_MANAGED_BY_PARTNER_PROVIDER: 'subscription-managed-by-partner-provider',
  PAYMENT_METHOD_LOCKED: 'payment-method-locked',
  PAYMENT_METHOD_NOT_SUPPORTED: 'payment-method-not-supported',
  PAYMENT_METHOD_INSUFFICIENT_FUNDS: 'payment-method-insufficient-funds',
  PAYMENT_METHOD_LIMIT_REACHED: 'payment-method-limit-reached',
  PAYMENT_METHOD_DECLINED: 'payment-method-declined',
  PAYMENT_TOKEN_EXPIRED: 'payment-token-expired',
  PAYMENT_SWITCH_UNSUCCESSFUL: 'payment-switch-unsuccessful',
  // Shared
  DEVICE_DISCONNECTED: 'device-disconnected',
  USER_ABANDON: 'user-abandon',
  UNKNOWN_FAILURE: 'unknown-failure',
} as const;

export const DeferredPaymentMethodStrategy = {
  SDK: 'sdk',
  API: 'api',
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Derived types
// ──────────────────────────────────────────────────────────────────────────────

export type OperationType = (typeof Operation)[keyof typeof Operation];
export type ScopeType = (typeof Scope)[keyof typeof Scope];
export type LanguageType = (typeof Language)[keyof typeof Language];
export type HandoffType = (typeof Handoff)[keyof typeof Handoff];
export type TagType = (typeof Tag)[keyof typeof Tag];
export type StepType = (typeof Step)[keyof typeof Step];
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type FailReasonType = (typeof FailReason)[keyof typeof FailReason];
export type DeferredPaymentMethodStrategyType =
  (typeof DeferredPaymentMethodStrategy)[keyof typeof DeferredPaymentMethodStrategy];

// ──────────────────────────────────────────────────────────────────────────────
// Configuration types
// ──────────────────────────────────────────────────────────────────────────────

export interface TransactConfig {
  publicToken: string;
  scope: ScopeType;
  tasks: TransactTask[];
  linkedAccount?: string;
  theme?: TransactTheme;
  language?: LanguageType;
  deeplink?: TransactDeeplink;
  metadata?: Record<string, string>;
  search?: TransactSearch;
  handoff?: HandoffType[];
  experiments?: TransactExperiments;
  customer?: TransactCustomer;
  features?: TransactFeatures;
  sessionContext?: string;
  conversionToken?: string;
  inSdk?: boolean;
  deferredPaymentMethodStrategy?: DeferredPaymentMethodStrategyType;
}

export interface TransactTask {
  operation: OperationType;
  distribution?: TransactDistribution;
  onComplete?: 'continue' | 'finish';
  onFail?: 'continue' | 'finish';
}

export interface TransactTheme {
  brandColor?: string;
  overlayColor?: string;
  dark?: boolean;
  display?: string;
  navigationOptions?: TransactNavigationOptions;
}

export interface TransactNavigationOptions {
  showBackButton?: boolean;
  showBackButtonText?: boolean;
  showCloseButton?: boolean;
}

export interface TransactDistribution {
  type: 'total' | 'fixed' | 'percent';
  amount?: number;
  canUpdate?: boolean;
}

export interface TransactDeeplink {
  step?: StepType;
  companyId?: string;
}

export interface TransactSearch {
  tags?: TagType[];
  excludedTags?: TagType[];
  ruleId?: string;
}

export interface TransactExperiments {
  fractionalDeposits?: boolean;
}

export interface TransactCustomer {
  name?: string;
}

export interface TransactFeatures {
  fractionalDeposits?: boolean;
  customSearch?: boolean;
}

export interface TransactEnvironment {
  environment: 'production' | 'sandbox' | 'custom';
  transactPath?: string;
  apiPath?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Method option types
// ──────────────────────────────────────────────────────────────────────────────

export interface PresentTransactOptions {
  config: TransactConfig;
  environment?: TransactEnvironment;
  presentationStyle?: 'formSheet' | 'fullScreen';
}

export interface PresentActionOptions {
  id: string;
  environment?: TransactEnvironment;
  theme?: TransactTheme;
  metadata?: Record<string, string>;
  presentationStyle?: 'formSheet' | 'fullScreen';
}

export interface DataRequestResponse {
  card?: CardData;
  identity?: IdentityData;
}

export interface CardData {
  number: string;
  expiry?: string;
  cvv?: string;
}

export interface IdentityData {
  firstName?: string;
  lastName?: string;
  postalCode?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Result types
// ──────────────────────────────────────────────────────────────────────────────

export interface TransactResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finished?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closed?: Record<string, any>;
  error?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Event types
// ──────────────────────────────────────────────────────────────────────────────

export interface InteractionEvent {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface DataRequestEvent {
  fields?: string[];
  taskId?: string;
  userId?: string;
  identifier?: string;
  taskWorkflowId?: string;
  externalId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AuthStatusUpdateEvent {
  status: string;
  company: TransactCompanyEvent;
}

export interface TaskStatusUpdateEvent {
  taskId: string;
  product: string;
  status: TaskStatusType;
  failReason?: FailReasonType;
  company: TransactCompanyEvent;
  depositData?: DepositDataEvent;
  switchData?: SwitchDataEvent;
  managedBy?: { company: TransactCompanyEvent };
}

export interface TransactCompanyEvent {
  _id: string;
  name: string;
  branding?: {
    color: string;
    logo: {
      url: string;
      backgroundColor?: string;
    };
  };
}

export interface DepositDataEvent {
  accountType?: string;
  distributionAmount?: number;
  distributionType?: string;
  lastFour?: string;
  routingNumber?: string;
  title?: string;
}

export interface SwitchDataEvent {
  paymentMethod: {
    type: string;
    brand?: string;
    expiry?: string;
    lastFour?: string;
    accountType?: string;
    routingNumber?: string;
    accountNumberLastFour?: string;
  };
}

export interface FinishEvent {
  taskId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CloseEvent {
  reason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ──────────────────────────────────────────────────────────────────────────────
// Plugin interface
// ──────────────────────────────────────────────────────────────────────────────

export interface TransactPluginPlugin {
  presentTransact(options: PresentTransactOptions): Promise<TransactResult>;

  presentAction(options: PresentActionOptions): Promise<TransactResult>;

  hideTransact(): Promise<void>;

  resolveDataRequest(options: DataRequestResponse): Promise<void>;

  addListener(
    eventName: 'onInteraction',
    listenerFunc: (event: InteractionEvent) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'onDataRequest',
    listenerFunc: (event: DataRequestEvent) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'onAuthStatusUpdate',
    listenerFunc: (event: AuthStatusUpdateEvent) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'onTaskStatusUpdate',
    listenerFunc: (event: TaskStatusUpdateEvent) => void,
  ): Promise<PluginListenerHandle>;

  addListener(eventName: 'onFinish', listenerFunc: (event: FinishEvent) => void): Promise<PluginListenerHandle>;

  addListener(eventName: 'onClose', listenerFunc: (event: CloseEvent) => void): Promise<PluginListenerHandle>;

  addListener(eventName: 'onLaunch', listenerFunc: () => void): Promise<PluginListenerHandle>;

  removeAllListeners(): Promise<void>;
}
