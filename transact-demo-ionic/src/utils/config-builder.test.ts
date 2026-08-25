import { Step, type OperationType, type StepType } from '@atomicfi/transact-capacitor';
import { describe, expect, it } from 'vitest';

import type { Settings } from '../providers/SettingsProvider';

import { buildPayLinkConfig, buildUserLinkConfig, type PayLinkFormState } from './config-builder';

const settings: Settings = {
  publicToken: 'pt-abc-123',
  environment: 'sandbox',
  customTransactPath: '',
  customApiPath: '',
  presentationStyle: 'formSheet',
  language: 'en',
  brandColor: '#635BFF',
  overlayColor: '',
  darkMode: 'system',
  showBackButton: true,
  showBackButtonText: false,
  showCloseButton: true,
  debug: false,
};

function basePayLinkForm(overrides: Partial<PayLinkFormState> = {}): PayLinkFormState {
  return {
    operations: ['switch' as OperationType],
    deeplinkStep: null,
    deeplinkCompanyId: '',
    deeplinkApp: null,
    deeplinkPayments: '',
    deeplinkAccountId: '',
    ...overrides,
  };
}

describe('Step enum', () => {
  it('exposes account as a valid deeplink step', () => {
    expect(Step.ACCOUNT).toBe('account');
  });
});

describe('buildPayLinkConfig — account deeplink', () => {
  it('serializes the account step and accountId to JSON', () => {
    const config = buildPayLinkConfig(
      basePayLinkForm({
        deeplinkStep: Step.ACCOUNT as StepType,
        deeplinkAccountId: 'abc123',
      }),
      settings,
    );

    // Round-trip via JSON.stringify — this is how Capacitor serializes the
    // config across the native bridge.
    const serialized = JSON.parse(JSON.stringify(config));

    expect(serialized.deeplink).toEqual({
      step: 'account',
      accountId: 'abc123',
    });
  });

  it('omits accountId when the account step is used without one', () => {
    const config = buildPayLinkConfig(
      basePayLinkForm({
        deeplinkStep: Step.ACCOUNT as StepType,
      }),
      settings,
    );

    const serialized = JSON.parse(JSON.stringify(config));

    expect(serialized.deeplink).toEqual({ step: 'account' });
  });

  it('leaves other deeplink steps unchanged', () => {
    const config = buildPayLinkConfig(
      basePayLinkForm({
        deeplinkStep: Step.SEARCH_COMPANY as StepType,
        deeplinkCompanyId: 'co-1',
      }),
      settings,
    );

    const serialized = JSON.parse(JSON.stringify(config));

    expect(serialized.deeplink).toEqual({
      step: 'search-company',
      companyId: 'co-1',
    });
    expect(serialized.deeplink.accountId).toBeUndefined();
  });
});

describe('buildUserLinkConfig — deeplink passthrough', () => {
  it('serializes existing deeplink steps unchanged', () => {
    const config = buildUserLinkConfig(
      {
        operations: ['deposit' as OperationType],
        deeplinkStep: Step.LOGIN_COMPANY as StepType,
        deeplinkCompanyId: 'co-42',
      },
      settings,
    );

    const serialized = JSON.parse(JSON.stringify(config));

    expect(serialized.deeplink).toEqual({
      step: 'login-company',
      companyId: 'co-42',
    });
  });
});
