import type { PluginListenerHandle } from '@capacitor/core';

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Task operations available in Transact.
 *
 * **UserLink** (`scope: 'user-link'`): `deposit`, `verify`, `tax`
 *
 * **PayLink** (`scope: 'pay-link'`): `switch`, `present`, `manage`
 */
export const Operation = {
  /** UserLink — Direct Deposit Switching. */
  DEPOSIT: 'deposit',
  /** UserLink — Payroll Data Verification. */
  VERIFY: 'verify',
  /** UserLink — Tax Document Access. */
  TAX: 'tax',
  /** PayLink — Payment Method Switching. */
  SWITCH: 'switch',
  /** PayLink — Bill Presentment. */
  PRESENT: 'present',
  /** PayLink — Manage Paylink experience. */
  MANAGE: 'manage',
} as const;

/** Product scope for a Transact session. */
export const Scope = {
  USER_LINK: 'user-link',
  PAY_LINK: 'pay-link',
} as const;

/** Convenience helpers for creating {@link TransactEnvironment} values. */
export const Environment = {
  production: { environment: 'production' } as TransactEnvironment,
  sandbox: { environment: 'sandbox' } as TransactEnvironment,
  custom: (transactPath: string, apiPath: string): TransactEnvironment => ({
    environment: 'custom',
    transactPath,
    apiPath,
  }),
};

/**
 * Deeplink steps for navigating to a specific point in the Transact flow.
 *
 * Both steps are supported by UserLink and PayLink.
 */
export const Step = {
  /** Both scopes. Deeplinks to a specific company's login screen. */
  LOGIN_COMPANY: 'login-company',
  /** Both scopes. Deeplinks to the company search screen. */
  SEARCH_COMPANY: 'search-company',
} as const;

/**
 * PayLink-only. Apps available for the `manage` operation's deeplink.
 */
export const App = {
  PAY_NOW: 'pay-now',
  EXPENSES: 'expenses',
  ORDERS: 'orders',
  SUGGESTIONS: 'suggestions',
} as const;

/** Native presentation style for the Transact modal (iOS only). */
export const PresentationStyle = {
  FORM_SHEET: 'formSheet',
  FULL_SCREEN: 'fullScreen',
} as const;

/** Display language for the Transact UI. */
export const Language = {
  ENGLISH: 'en',
  SPANISH: 'es',
} as const;

/**
 * UserLink-only. Views that can be handed off to the host app via SDK events
 * instead of being handled inside Transact.
 */
export const Handoff = {
  EXIT_PROMPT: 'exit-prompt',
  AUTHENTICATION_SUCCESS: 'authentication-success',
  HIGH_LATENCY: 'high-latency',
} as const;

/**
 * UserLink-only. Company tags for filtering search results.
 *
 * Used by {@link TransactSearch.tags} and {@link TransactSearch.excludedTags}.
 */
export const Tag = {
  GIG_ECONOMY: 'gig-economy',
  PAYROLL_PROVIDER: 'payroll-provider',
  UNEMPLOYMENT: 'unemployment',
} as const;

/** Status values for the `onTaskStatusUpdate` event. */
export const TaskStatus = {
  PROCESSING: 'processing',
  FAILED: 'failed',
  COMPLETED: 'completed',
} as const;

/**
 * Failure reason codes returned in the `onTaskStatusUpdate` event
 * when `status` is `'failed'`.
 */
export const FailReason = {
  // ── UserLink ────────────────────────────────────────────────────────────────
  /** UserLink. The account is locked. */
  ACCOUNT_LOCKOUT: 'account-lockout',
  /** UserLink. Account setup is incomplete. */
  ACCOUNT_SETUP_INCOMPLETE: 'account-setup-incomplete',
  /** UserLink. Account is unusable for this operation. */
  ACCOUNT_UNUSABLE: 'account-unusable',
  /** UserLink. Automation was blocked by the payroll provider. */
  AUTOMATION_BLOCKED: 'automation-blocked',
  /** UserLink. Invalid login credentials. */
  BAD_CREDENTIALS: 'bad-credentials',
  /** UserLink. Connection error with the payroll provider. */
  CONNECTION_ERROR: 'connection-error',
  /** UserLink. The requested distribution is not supported. */
  DISTRIBUTION_NOT_SUPPORTED: 'distribution-not-supported',
  /** UserLink. Employee is enrolled in a paycard program. */
  ENROLLED_IN_PAYCARD: 'enrolled-in-paycard',
  /** UserLink. Session or token has expired. */
  EXPIRED: 'expired',
  /** UserLink. No data found for the requested operation. */
  NO_DATA_FOUND: 'no-data-found',
  /** UserLink. The operation is not supported by this employer. */
  PRODUCT_NOT_SUPPORTED: 'product-not-supported',
  /** UserLink. The routing number is not supported. */
  ROUTING_NUMBER_NOT_SUPPORTED: 'routing-number-not-supported',
  /** UserLink. The session timed out. */
  SESSION_TIMEOUT: 'session-timeout',
  /** UserLink. The payroll system is unavailable. */
  SYSTEM_UNAVAILABLE: 'system-unavailable',
  /** UserLink. A pending transaction is blocking the operation. */
  TRANSACTION_PENDING: 'transaction-pending',
  /** UserLink. Employee work status is terminated. */
  WORK_STATUS_TERMINATED: 'work-status-terminated',

  // ── PayLink ─────────────────────────────────────────────────────────────────
  /** PayLink. The subscription is inactive. */
  SUBSCRIPTION_INACTIVE: 'subscription-inactive',
  /** PayLink. Subscription is managed by a partner provider. */
  SUBSCRIPTION_MANAGED_BY_PARTNER_PROVIDER: 'subscription-managed-by-partner-provider',
  /** PayLink. The payment method is locked. */
  PAYMENT_METHOD_LOCKED: 'payment-method-locked',
  /** PayLink. The payment method type is not supported. */
  PAYMENT_METHOD_NOT_SUPPORTED: 'payment-method-not-supported',
  /** PayLink. Insufficient funds on the payment method. */
  PAYMENT_METHOD_INSUFFICIENT_FUNDS: 'payment-method-insufficient-funds',
  /** PayLink. Payment method limit has been reached. */
  PAYMENT_METHOD_LIMIT_REACHED: 'payment-method-limit-reached',
  /** PayLink. The payment method was declined. */
  PAYMENT_METHOD_DECLINED: 'payment-method-declined',
  /** PayLink. The payment token has expired. */
  PAYMENT_TOKEN_EXPIRED: 'payment-token-expired',
  /** PayLink. Payment switch was unsuccessful. */
  PAYMENT_SWITCH_UNSUCCESSFUL: 'payment-switch-unsuccessful',

  // ── Shared ──────────────────────────────────────────────────────────────────
  /** Shared. The user's device disconnected. */
  DEVICE_DISCONNECTED: 'device-disconnected',
  /** Shared. The user abandoned the flow. */
  USER_ABANDON: 'user-abandon',
  /** Shared. An unknown failure occurred. */
  UNKNOWN_FAILURE: 'unknown-failure',
} as const;

/**
 * PayLink-only. Strategy for providing deferred payment method data
 * when Transact triggers an `onDataRequest` event.
 *
 * - `SDK` — Respond through the native SDK's `resolveDataRequest` method.
 * - `API` — Send data via the Update User API endpoint.
 */
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
export type AppType = (typeof App)[keyof typeof App];
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type FailReasonType = (typeof FailReason)[keyof typeof FailReason];
export type DeferredPaymentMethodStrategyType =
  (typeof DeferredPaymentMethodStrategy)[keyof typeof DeferredPaymentMethodStrategy];

// ──────────────────────────────────────────────────────────────────────────────
// Configuration types
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Top-level configuration object for a Transact session.
 *
 * Properties are grouped by scope compatibility:
 * - **Shared** — `publicToken`, `scope`, `tasks`, `theme`, `language`, `deeplink`, `metadata`
 * - **UserLink-only** — `linkedAccount`, `search`, `handoff`, `experiments`, `customer`,
 *   `features`, `sessionContext`, `conversionToken`, `inSdk`
 * - **PayLink-only** — `deferredPaymentMethodStrategy`
 */
export interface TransactConfig {
  /** Required. Public token returned from AccessToken creation. */
  publicToken: string;
  /** Required. Product scope — `'user-link'` or `'pay-link'`. */
  scope: ScopeType;
  /** Required. Task operations to execute. Operations differ per scope. */
  tasks: TransactTask[];
  /** Shared. Visual theme customization. */
  theme?: TransactTheme;
  /** Shared. Display language — `'en'` or `'es'`. Defaults to `'en'`. */
  language?: LanguageType;
  /** Shared. Deeplink into a specific step in the Transact flow. */
  deeplink?: TransactDeeplink;
  /** Shared. Custom key-value pairs returned in webhook events. */
  metadata?: Record<string, string>;
  /** UserLink-only. Linked account ID for immediate authentication. */
  linkedAccount?: string;
  /** UserLink-only. Search filtering by company tags. */
  search?: TransactSearch;
  /** UserLink-only. Views to hand off to the host app via SDK events. */
  handoff?: HandoffType[];
  /** UserLink-only. Override feature flags from the Atomic Console. */
  experiments?: TransactExperiments;
  /** UserLink-only. Override the customer name displayed in the UI. */
  customer?: TransactCustomer;
  /** UserLink-only. Feature toggles. */
  features?: TransactFeatures;
  /** UserLink-only. Optional session context string. */
  sessionContext?: string;
  /** UserLink-only. Token for conversion tracking. */
  conversionToken?: string;
  /** UserLink-only. When `false`, removes SDK-dependent UI elements. Defaults to `true`. */
  inSdk?: boolean;
  /**
   * PayLink-only. Strategy for providing deferred payment method data.
   * - `'sdk'` — Respond via the native `resolveDataRequest` method.
   * - `'api'` — Send data via the Update User API endpoint.
   */
  deferredPaymentMethodStrategy?: DeferredPaymentMethodStrategyType;
}

/**
 * A single task in the Transact workflow.
 *
 * - `operation` — Shared (required). Operations differ by scope.
 * - `distribution`, `onComplete`, `onFail` — **UserLink-only.**
 */
export interface TransactTask {
  /** Required. The task operation — see {@link Operation} for scope-specific values. */
  operation: OperationType;
  /** UserLink-only. Deposit distribution settings. Only meaningful with `deposit` operation. */
  distribution?: TransactDistribution;
  /** UserLink-only. Action on task success: `'continue'` or `'finish'`. Defaults to `'continue'`. */
  onComplete?: 'continue' | 'finish';
  /** UserLink-only. Action on task failure: `'continue'` or `'finish'`. Defaults to `'continue'`. */
  onFail?: 'continue' | 'finish';
}

/** Visual theme customization for the Transact UI. */
export interface TransactTheme {
  /** Any valid CSS color value for buttons and accent elements. */
  brandColor?: string;
  /** Any valid CSS background-color value for the modal overlay. */
  overlayColor?: string;
  /** Enable dark mode. */
  dark?: boolean;
  /** Set to `'inline'` to render inside a container element instead of as a modal. */
  display?: string;
  /** Navigation bar element visibility. */
  navigationOptions?: TransactNavigationOptions;
}

/** Controls for navigation bar element visibility. */
export interface TransactNavigationOptions {
  /** Whether the back button is visible. Defaults to `true`. */
  showBackButton?: boolean;
  /** Whether a text label appears next to the back button. Defaults to `false`. */
  showBackButtonText?: boolean;
  /** Whether the close/exit button is displayed. Defaults to `true`. */
  showCloseButton?: boolean;
}

/**
 * UserLink-only. Deposit distribution settings for the `deposit` operation.
 * Enforces deposit configuration and eliminates incompatible search results.
 */
export interface TransactDistribution {
  /** Distribution type: `'total'`, `'fixed'`, or `'percent'`. */
  type: 'total' | 'fixed' | 'percent';
  /** Dollar amount (for `'fixed'`) or percentage of paycheck (for `'percent'`). */
  amount?: number;
  /** If `true`, the user can override the default amount. Defaults to `false`. */
  canUpdate?: boolean;
}

/**
 * Deeplink configuration to navigate directly to a specific step.
 *
 * Both `login-company` and `search-company` are supported by UserLink and PayLink.
 */
export interface TransactDeeplink {
  /** The step to navigate to — `'login-company'` or `'search-company'`. */
  step?: StepType;
  /** Company ID to deeplink into. */
  companyId?: string;
  /** PayLink `manage`-only. App to deeplink into — see {@link App}. */
  app?: AppType;
  /** PayLink `manage`-only. Payment IDs to target. */
  payments?: string[];
  /** PayLink `manage`-only. Account ID to target. */
  accountId?: string;
}

/** UserLink-only. Search filtering by company tags. */
export interface TransactSearch {
  /** Filter companies by tags. */
  tags?: TagType[];
  /** Exclude companies matching these tags. */
  excludedTags?: TagType[];
  /** Identifier for a search experience defined in the Atomic Console. */
  ruleId?: string;
}

/** UserLink-only. Override feature flags from the Atomic Console. */
export interface TransactExperiments {
  /** Override the Fractional Deposit feature flag value. */
  fractionalDeposits?: boolean;
}

/** UserLink-only. Override the customer name displayed in the Transact UI. */
export interface TransactCustomer {
  /** Customer name shown in the UI. */
  name?: string;
}

/** UserLink-only. Feature toggles for the Transact session. */
export interface TransactFeatures {
  /** Enable or disable fractional (decimal) deposit amounts. */
  fractionalDeposits?: boolean;
  /** Enable or disable custom search functionality. */
  customSearch?: boolean;
}

/** Result returned when a Transact flow finishes or is closed. */
export interface TransactResult {
  /** Present when the flow completed successfully. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finished?: Record<string, any>;
  /** Present when the flow was closed by the user. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closed?: Record<string, any>;
  /** Error message if the flow failed to launch. */
  error?: string;
}

/** Environment configuration for connecting to Atomic services. */
export interface TransactEnvironment {
  /** Environment target: `'production'`, `'sandbox'`, or `'custom'`. */
  environment: 'production' | 'sandbox' | 'custom';
  /** Custom Transact URL. Required when `environment` is `'custom'`. */
  transactPath?: string;
  /** Custom API URL. Required when `environment` is `'custom'`. */
  apiPath?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Method option types
// ──────────────────────────────────────────────────────────────────────────────

/** Options for {@link TransactPluginPlugin.presentTransact}. */
export interface PresentTransactOptions {
  /** The Transact configuration. */
  config: TransactConfig;
  /** Environment to connect to. Defaults to production. */
  environment?: TransactEnvironment;
  /** iOS only. Modal presentation style. */
  presentationStyle?: 'formSheet' | 'fullScreen';
  /**
   * Enable debug mode. iOS: forwards debug logs to console.log and makes the
   * WKWebView inspectable. Android: makes the WebView inspectable via
   * chrome://inspect. Logs print automatically — no listener required.
   */
  debug?: boolean;
}

/** Options for {@link TransactPluginPlugin.presentAction}. */
export interface PresentActionOptions {
  /** Required. The action ID to present. */
  id: string;
  /** Environment to connect to. Defaults to production. */
  environment?: TransactEnvironment;
  /** Visual theme customization. */
  theme?: TransactTheme;
  /** Custom key-value pairs returned in webhook events. */
  metadata?: Record<string, string>;
  /** iOS only. Modal presentation style. */
  presentationStyle?: 'formSheet' | 'fullScreen';
  /**
   * Enable debug mode. iOS: forwards debug logs to console.log and makes the
   * WKWebView inspectable. Android: makes the WebView inspectable via
   * chrome://inspect. Logs print automatically — no listener required.
   */
  debug?: boolean;
}

/** Options for {@link TransactPluginPlugin.pauseTransact}. */
export interface PauseTransactOptions {
  /** Whether the pause animation should play. Defaults to `true`. */
  animated?: boolean;
}

/** Options for {@link TransactPluginPlugin.resumeTransact}. */
export interface ResumeTransactOptions {
  /** Whether the resume animation should play. Defaults to `true`. */
  animated?: boolean;
}

/** Response payload for resolving an `onDataRequest` event. */
export interface DataRequestResponse {
  /** Payment card data. */
  card?: CardData;
  /** Identity data. */
  identity?: IdentityData;
}

/** Payment card information for resolving data requests. */
export interface CardData {
  /** Full card number. */
  number: string;
  /** Card expiration date. */
  expiry?: string;
  /** Card verification value. */
  cvv?: string;
}

/** Identity information for resolving data requests. */
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
// Event types
// ──────────────────────────────────────────────────────────────────────────────

/** Payload for the `onInteraction` event. */
export interface InteractionEvent {
  /** Name of the interaction. */
  name: string;
  /** Interaction value. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

/** Payload for the `onDataRequest` event. */
export interface DataRequestEvent {
  /** Requested data fields. */
  fields?: string[];
  taskId?: string;
  userId?: string;
  identifier?: string;
  taskWorkflowId?: string;
  externalId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** Payload for the `onAuthStatusUpdate` event. */
export interface AuthStatusUpdateEvent {
  /** Authentication status. */
  status: string;
  /** Company associated with the authentication. */
  company: TransactCompanyEvent;
}

/** Payload for the `onTaskStatusUpdate` event. */
export interface TaskStatusUpdateEvent {
  taskId: string;
  product: string;
  /** Current task status. */
  status: TaskStatusType;
  /** Reason for failure. Only present when `status` is `'failed'`. */
  failReason?: FailReasonType;
  /** Company associated with the task. */
  company: TransactCompanyEvent;
  /** UserLink — Deposit data returned on successful deposit operations. */
  depositData?: DepositDataEvent;
  /** PayLink — Payment method data returned on successful switch operations. */
  switchData?: SwitchDataEvent;
  /** Present when a task is managed by another company. */
  managedBy?: { company: TransactCompanyEvent };
}

/** Company information included in event payloads. */
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

/** UserLink — Deposit data from a successful deposit operation. */
export interface DepositDataEvent {
  accountType?: string;
  distributionAmount?: number;
  distributionType?: string;
  lastFour?: string;
  routingNumber?: string;
  title?: string;
}

/** PayLink — Payment method data from a successful switch operation. */
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

/** Payload for the `onFinish` event. */
export interface FinishEvent {
  taskId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** Payload for the `onClose` event. */
export interface CloseEvent {
  reason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ──────────────────────────────────────────────────────────────────────────────
// Plugin interface
// ──────────────────────────────────────────────────────────────────────────────

/** The Transact Capacitor plugin interface. */
export interface TransactPluginPlugin {
  /** Launch a Transact flow. Resolves when the flow finishes or is closed. */
  presentTransact(options: PresentTransactOptions): Promise<TransactResult>;

  /** Present a specific action by ID. Resolves when the action completes or is closed. */
  presentAction(options: PresentActionOptions): Promise<TransactResult>;

  /** Programmatically hide the Transact overlay. */
  hideTransact(): Promise<void>;

  /**
   * Pause the active Transact session, dismissing the UI while preserving
   * session state so it can be resumed later with {@link resumeTransact}.
   */
  pauseTransact(options?: PauseTransactOptions): Promise<void>;

  /** Resume a previously paused Transact session. */
  resumeTransact(options?: ResumeTransactOptions): Promise<void>;

  /** Respond to an `onDataRequest` event with card or identity data. */
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
