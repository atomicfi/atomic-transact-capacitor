# @atomicfi/transact-capacitor

Capactior plugin to use native sdks from Atomic

## Install

```bash
npm install @atomicfi/transact-capacitor
npx cap sync
```

## API

<docgen-index>

* [`presentTransact(...)`](#presenttransact)
* [`presentAction(...)`](#presentaction)
* [`hideTransact()`](#hidetransact)
* [`resolveDataRequest(...)`](#resolvedatarequest)
* [`addListener('onInteraction', ...)`](#addlisteneroninteraction-)
* [`addListener('onDataRequest', ...)`](#addlistenerondatarequest-)
* [`addListener('onAuthStatusUpdate', ...)`](#addlisteneronauthstatusupdate-)
* [`addListener('onTaskStatusUpdate', ...)`](#addlistenerontaskstatusupdate-)
* [`addListener('onFinish', ...)`](#addlisteneronfinish-)
* [`addListener('onClose', ...)`](#addlisteneronclose-)
* [`addListener('onLaunch', ...)`](#addlisteneronlaunch-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

The Transact Capacitor plugin interface.

### presentTransact(...)

```typescript
presentTransact(options: PresentTransactOptions) => Promise<TransactResult>
```

Launch a Transact flow. Resolves when the flow finishes or is closed.

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#presenttransactoptions">PresentTransactOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#transactresult">TransactResult</a>&gt;</code>

--------------------


### presentAction(...)

```typescript
presentAction(options: PresentActionOptions) => Promise<TransactResult>
```

Present a specific action by ID. Resolves when the action completes or is closed.

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#presentactionoptions">PresentActionOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#transactresult">TransactResult</a>&gt;</code>

--------------------


### hideTransact()

```typescript
hideTransact() => Promise<void>
```

Programmatically hide the Transact overlay.

--------------------


### resolveDataRequest(...)

```typescript
resolveDataRequest(options: DataRequestResponse) => Promise<void>
```

Respond to an `onDataRequest` event with card or identity data.

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#datarequestresponse">DataRequestResponse</a></code> |

--------------------


### addListener('onInteraction', ...)

```typescript
addListener(eventName: 'onInteraction', listenerFunc: (event: InteractionEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onInteraction'</code>                                                      |
| **`listenerFunc`** | <code>(event: <a href="#interactionevent">InteractionEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onDataRequest', ...)

```typescript
addListener(eventName: 'onDataRequest', listenerFunc: (event: DataRequestEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onDataRequest'</code>                                                      |
| **`listenerFunc`** | <code>(event: <a href="#datarequestevent">DataRequestEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onAuthStatusUpdate', ...)

```typescript
addListener(eventName: 'onAuthStatusUpdate', listenerFunc: (event: AuthStatusUpdateEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onAuthStatusUpdate'</code>                                                           |
| **`listenerFunc`** | <code>(event: <a href="#authstatusupdateevent">AuthStatusUpdateEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onTaskStatusUpdate', ...)

```typescript
addListener(eventName: 'onTaskStatusUpdate', listenerFunc: (event: TaskStatusUpdateEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onTaskStatusUpdate'</code>                                                           |
| **`listenerFunc`** | <code>(event: <a href="#taskstatusupdateevent">TaskStatusUpdateEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onFinish', ...)

```typescript
addListener(eventName: 'onFinish', listenerFunc: (event: FinishEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| **`eventName`**    | <code>'onFinish'</code>                                                 |
| **`listenerFunc`** | <code>(event: <a href="#finishevent">FinishEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onClose', ...)

```typescript
addListener(eventName: 'onClose', listenerFunc: (event: CloseEvent) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| **`eventName`**    | <code>'onClose'</code>                                                |
| **`listenerFunc`** | <code>(event: <a href="#closeevent">CloseEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onLaunch', ...)

```typescript
addListener(eventName: 'onLaunch', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

| Param              | Type                       |
| ------------------ | -------------------------- |
| **`eventName`**    | <code>'onLaunch'</code>    |
| **`listenerFunc`** | <code>() =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

--------------------


### Interfaces


#### TransactResult

Result returned when a Transact flow finishes or is closed.

| Prop           | Type                                                         | Description                                   |
| -------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **`finished`** | <code><a href="#record">Record</a>&lt;string, any&gt;</code> | Present when the flow completed successfully. |
| **`closed`**   | <code><a href="#record">Record</a>&lt;string, any&gt;</code> | Present when the flow was closed by the user. |
| **`error`**    | <code>string</code>                                          | Error message if the flow failed to launch.   |


#### PresentTransactOptions

Options for {@link TransactPluginPlugin.presentTransact}.

| Prop                    | Type                                                                | Description                                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`config`**            | <code><a href="#transactconfig">TransactConfig</a></code>           | The Transact configuration.                                                                                                                                                                                   |
| **`environment`**       | <code><a href="#transactenvironment">TransactEnvironment</a></code> | Environment to connect to. Defaults to production.                                                                                                                                                            |
| **`presentationStyle`** | <code>'formSheet' \| 'fullScreen'</code>                            | iOS only. Modal presentation style.                                                                                                                                                                           |
| **`debug`**             | <code>boolean</code>                                                | Enable debug mode. iOS: forwards debug logs to console.log and makes the WKWebView inspectable. Android: makes the WebView inspectable via chrome://inspect. Logs print automatically — no listener required. |


#### TransactConfig

Top-level configuration object for a Transact session.

Properties are grouped by scope compatibility:
- **Shared** — `publicToken`, `scope`, `tasks`, `theme`, `language`, `deeplink`, `metadata`
- **UserLink-only** — `linkedAccount`, `search`, `handoff`, `experiments`, `customer`,
  `features`, `sessionContext`, `conversionToken`, `inSdk`
- **PayLink-only** — `deferredPaymentMethodStrategy`

| Prop                                | Type                                                                                            | Description                                                                                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`publicToken`**                   | <code>string</code>                                                                             | Required. Public token returned from AccessToken creation.                                                                                                                                 |
| **`scope`**                         | <code><a href="#scopetype">ScopeType</a></code>                                                 | Required. Product scope — `'user-link'` or `'pay-link'`.                                                                                                                                   |
| **`tasks`**                         | <code>TransactTask[]</code>                                                                     | Required. Task operations to execute. Operations differ per scope.                                                                                                                         |
| **`theme`**                         | <code><a href="#transacttheme">TransactTheme</a></code>                                         | Shared. Visual theme customization.                                                                                                                                                        |
| **`language`**                      | <code><a href="#languagetype">LanguageType</a></code>                                           | Shared. Display language — `'en'` or `'es'`. Defaults to `'en'`.                                                                                                                           |
| **`deeplink`**                      | <code><a href="#transactdeeplink">TransactDeeplink</a></code>                                   | Shared. Deeplink into a specific step in the Transact flow.                                                                                                                                |
| **`metadata`**                      | <code><a href="#record">Record</a>&lt;string, string&gt;</code>                                 | Shared. Custom key-value pairs returned in webhook events.                                                                                                                                 |
| **`linkedAccount`**                 | <code>string</code>                                                                             | UserLink-only. Linked account ID for immediate authentication.                                                                                                                             |
| **`search`**                        | <code><a href="#transactsearch">TransactSearch</a></code>                                       | UserLink-only. Search filtering by company tags.                                                                                                                                           |
| **`handoff`**                       | <code>HandoffType[]</code>                                                                      | UserLink-only. Views to hand off to the host app via SDK events.                                                                                                                           |
| **`experiments`**                   | <code><a href="#transactexperiments">TransactExperiments</a></code>                             | UserLink-only. Override feature flags from the Atomic Console.                                                                                                                             |
| **`customer`**                      | <code><a href="#transactcustomer">TransactCustomer</a></code>                                   | UserLink-only. Override the customer name displayed in the UI.                                                                                                                             |
| **`features`**                      | <code><a href="#transactfeatures">TransactFeatures</a></code>                                   | UserLink-only. Feature toggles.                                                                                                                                                            |
| **`sessionContext`**                | <code>string</code>                                                                             | UserLink-only. Optional session context string.                                                                                                                                            |
| **`conversionToken`**               | <code>string</code>                                                                             | UserLink-only. Token for conversion tracking.                                                                                                                                              |
| **`inSdk`**                         | <code>boolean</code>                                                                            | UserLink-only. When `false`, removes SDK-dependent UI elements. Defaults to `true`.                                                                                                        |
| **`deferredPaymentMethodStrategy`** | <code><a href="#deferredpaymentmethodstrategytype">DeferredPaymentMethodStrategyType</a></code> | PayLink-only. Strategy for providing deferred payment method data. - `'sdk'` — Respond via the native `resolveDataRequest` method. - `'api'` — Send data via the Update User API endpoint. |


#### TransactTask

A single task in the Transact workflow.

- `operation` — Shared (required). Operations differ by scope.
- `distribution`, `onComplete`, `onFail` — **UserLink-only.**

| Prop               | Type                                                                  | Description                                                                                  |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **`operation`**    | <code><a href="#operationtype">OperationType</a></code>               | Required. The task operation — see {@link Operation} for scope-specific values.              |
| **`distribution`** | <code><a href="#transactdistribution">TransactDistribution</a></code> | UserLink-only. Deposit distribution settings. Only meaningful with `deposit` operation.      |
| **`onComplete`**   | <code>'continue' \| 'finish'</code>                                   | UserLink-only. Action on task success: `'continue'` or `'finish'`. Defaults to `'continue'`. |
| **`onFail`**       | <code>'continue' \| 'finish'</code>                                   | UserLink-only. Action on task failure: `'continue'` or `'finish'`. Defaults to `'continue'`. |


#### TransactDistribution

UserLink-only. Deposit distribution settings for the `deposit` operation.
Enforces deposit configuration and eliminates incompatible search results.

| Prop            | Type                                         | Description                                                                |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------- |
| **`type`**      | <code>'total' \| 'fixed' \| 'percent'</code> | Distribution type: `'total'`, `'fixed'`, or `'percent'`.                   |
| **`amount`**    | <code>number</code>                          | Dollar amount (for `'fixed'`) or percentage of paycheck (for `'percent'`). |
| **`canUpdate`** | <code>boolean</code>                         | If `true`, the user can override the default amount. Defaults to `false`.  |


#### TransactTheme

Visual theme customization for the Transact UI.

| Prop                    | Type                                                                            | Description                                                                   |
| ----------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **`brandColor`**        | <code>string</code>                                                             | Any valid CSS color value for buttons and accent elements.                    |
| **`overlayColor`**      | <code>string</code>                                                             | Any valid CSS background-color value for the modal overlay.                   |
| **`dark`**              | <code>boolean</code>                                                            | Enable dark mode.                                                             |
| **`display`**           | <code>string</code>                                                             | Set to `'inline'` to render inside a container element instead of as a modal. |
| **`navigationOptions`** | <code><a href="#transactnavigationoptions">TransactNavigationOptions</a></code> | Navigation bar element visibility.                                            |


#### TransactNavigationOptions

Controls for navigation bar element visibility.

| Prop                     | Type                 | Description                                                                |
| ------------------------ | -------------------- | -------------------------------------------------------------------------- |
| **`showBackButton`**     | <code>boolean</code> | Whether the back button is visible. Defaults to `true`.                    |
| **`showBackButtonText`** | <code>boolean</code> | Whether a text label appears next to the back button. Defaults to `false`. |
| **`showCloseButton`**    | <code>boolean</code> | Whether the close/exit button is displayed. Defaults to `true`.            |


#### TransactDeeplink

Deeplink configuration to navigate directly to a specific step.

Both `login-company` and `search-company` are supported by UserLink and PayLink.

| Prop            | Type                                          | Description                                                        |
| --------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| **`step`**      | <code><a href="#steptype">StepType</a></code> | The step to navigate to — `'login-company'` or `'search-company'`. |
| **`companyId`** | <code>string</code>                           | Company ID to deeplink into.                                       |


#### TransactSearch

UserLink-only. Search filtering by company tags.

| Prop               | Type                   | Description                                                       |
| ------------------ | ---------------------- | ----------------------------------------------------------------- |
| **`tags`**         | <code>TagType[]</code> | Filter companies by tags.                                         |
| **`excludedTags`** | <code>TagType[]</code> | Exclude companies matching these tags.                            |
| **`ruleId`**       | <code>string</code>    | Identifier for a search experience defined in the Atomic Console. |


#### TransactExperiments

UserLink-only. Override feature flags from the Atomic Console.

| Prop                     | Type                 | Description                                         |
| ------------------------ | -------------------- | --------------------------------------------------- |
| **`fractionalDeposits`** | <code>boolean</code> | Override the Fractional Deposit feature flag value. |


#### TransactCustomer

UserLink-only. Override the customer name displayed in the Transact UI.

| Prop       | Type                | Description                    |
| ---------- | ------------------- | ------------------------------ |
| **`name`** | <code>string</code> | Customer name shown in the UI. |


#### TransactFeatures

UserLink-only. Feature toggles for the Transact session.

| Prop                     | Type                 | Description                                             |
| ------------------------ | -------------------- | ------------------------------------------------------- |
| **`fractionalDeposits`** | <code>boolean</code> | Enable or disable fractional (decimal) deposit amounts. |
| **`customSearch`**       | <code>boolean</code> | Enable or disable custom search functionality.          |


#### TransactEnvironment

Environment configuration for connecting to Atomic services.

| Prop               | Type                                               | Description                                                     |
| ------------------ | -------------------------------------------------- | --------------------------------------------------------------- |
| **`environment`**  | <code>'production' \| 'sandbox' \| 'custom'</code> | Environment target: `'production'`, `'sandbox'`, or `'custom'`. |
| **`transactPath`** | <code>string</code>                                | Custom Transact URL. Required when `environment` is `'custom'`. |
| **`apiPath`**      | <code>string</code>                                | Custom API URL. Required when `environment` is `'custom'`.      |


#### PresentActionOptions

Options for {@link TransactPluginPlugin.presentAction}.

| Prop                    | Type                                                                | Description                                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`id`**                | <code>string</code>                                                 | Required. The action ID to present.                                                                                                                                                                           |
| **`environment`**       | <code><a href="#transactenvironment">TransactEnvironment</a></code> | Environment to connect to. Defaults to production.                                                                                                                                                            |
| **`theme`**             | <code><a href="#transacttheme">TransactTheme</a></code>             | Visual theme customization.                                                                                                                                                                                   |
| **`metadata`**          | <code><a href="#record">Record</a>&lt;string, string&gt;</code>     | Custom key-value pairs returned in webhook events.                                                                                                                                                            |
| **`presentationStyle`** | <code>'formSheet' \| 'fullScreen'</code>                            | iOS only. Modal presentation style.                                                                                                                                                                           |
| **`debug`**             | <code>boolean</code>                                                | Enable debug mode. iOS: forwards debug logs to console.log and makes the WKWebView inspectable. Android: makes the WebView inspectable via chrome://inspect. Logs print automatically — no listener required. |


#### DataRequestResponse

Response payload for resolving an `onDataRequest` event.

| Prop           | Type                                                  | Description        |
| -------------- | ----------------------------------------------------- | ------------------ |
| **`card`**     | <code><a href="#carddata">CardData</a></code>         | Payment card data. |
| **`identity`** | <code><a href="#identitydata">IdentityData</a></code> | Identity data.     |


#### CardData

Payment card information for resolving data requests.

| Prop         | Type                | Description              |
| ------------ | ------------------- | ------------------------ |
| **`number`** | <code>string</code> | Full card number.        |
| **`expiry`** | <code>string</code> | Card expiration date.    |
| **`cvv`**    | <code>string</code> | Card verification value. |


#### IdentityData

Identity information for resolving data requests.

| Prop             | Type                |
| ---------------- | ------------------- |
| **`firstName`**  | <code>string</code> |
| **`lastName`**   | <code>string</code> |
| **`postalCode`** | <code>string</code> |
| **`address`**    | <code>string</code> |
| **`address2`**   | <code>string</code> |
| **`city`**       | <code>string</code> |
| **`state`**      | <code>string</code> |
| **`phone`**      | <code>string</code> |
| **`email`**      | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### InteractionEvent

Payload for the `onInteraction` event.

| Prop        | Type                | Description              |
| ----------- | ------------------- | ------------------------ |
| **`name`**  | <code>string</code> | Name of the interaction. |
| **`value`** | <code>any</code>    | Interaction value.       |


#### DataRequestEvent

Payload for the `onDataRequest` event.

| Prop                 | Type                  | Description            |
| -------------------- | --------------------- | ---------------------- |
| **`fields`**         | <code>string[]</code> | Requested data fields. |
| **`taskId`**         | <code>string</code>   |                        |
| **`userId`**         | <code>string</code>   |                        |
| **`identifier`**     | <code>string</code>   |                        |
| **`taskWorkflowId`** | <code>string</code>   |                        |
| **`externalId`**     | <code>string</code>   |                        |


#### AuthStatusUpdateEvent

Payload for the `onAuthStatusUpdate` event.

| Prop          | Type                                                                  | Description                                 |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| **`status`**  | <code>string</code>                                                   | Authentication status.                      |
| **`company`** | <code><a href="#transactcompanyevent">TransactCompanyEvent</a></code> | Company associated with the authentication. |


#### TransactCompanyEvent

Company information included in event payloads.

| Prop           | Type                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| **`_id`**      | <code>string</code>                                                               |
| **`name`**     | <code>string</code>                                                               |
| **`branding`** | <code>{ color: string; logo: { url: string; backgroundColor?: string; }; }</code> |


#### TaskStatusUpdateEvent

Payload for the `onTaskStatusUpdate` event.

| Prop              | Type                                                                                | Description                                                             |
| ----------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **`taskId`**      | <code>string</code>                                                                 |                                                                         |
| **`product`**     | <code>string</code>                                                                 |                                                                         |
| **`status`**      | <code><a href="#taskstatustype">TaskStatusType</a></code>                           | Current task status.                                                    |
| **`failReason`**  | <code><a href="#failreasontype">FailReasonType</a></code>                           | Reason for failure. Only present when `status` is `'failed'`.           |
| **`company`**     | <code><a href="#transactcompanyevent">TransactCompanyEvent</a></code>               | Company associated with the task.                                       |
| **`depositData`** | <code><a href="#depositdataevent">DepositDataEvent</a></code>                       | UserLink — Deposit data returned on successful deposit operations.      |
| **`switchData`**  | <code><a href="#switchdataevent">SwitchDataEvent</a></code>                         | PayLink — Payment method data returned on successful switch operations. |
| **`managedBy`**   | <code>{ company: <a href="#transactcompanyevent">TransactCompanyEvent</a>; }</code> | Present when a task is managed by another company.                      |


#### DepositDataEvent

UserLink — Deposit data from a successful deposit operation.

| Prop                     | Type                |
| ------------------------ | ------------------- |
| **`accountType`**        | <code>string</code> |
| **`distributionAmount`** | <code>number</code> |
| **`distributionType`**   | <code>string</code> |
| **`lastFour`**           | <code>string</code> |
| **`routingNumber`**      | <code>string</code> |
| **`title`**              | <code>string</code> |


#### SwitchDataEvent

PayLink — Payment method data from a successful switch operation.

| Prop                | Type                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`paymentMethod`** | <code>{ type: string; brand?: string; expiry?: string; lastFour?: string; accountType?: string; routingNumber?: string; accountNumberLastFour?: string; }</code> |


#### FinishEvent

Payload for the `onFinish` event.

| Prop         | Type                |
| ------------ | ------------------- |
| **`taskId`** | <code>string</code> |


#### CloseEvent

Payload for the `onClose` event.

| Prop         | Type                |
| ------------ | ------------------- |
| **`reason`** | <code>string</code> |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


#### ScopeType

<code>(typeof Scope)[keyof typeof Scope]</code>


#### OperationType

<code>(typeof Operation)[keyof typeof Operation]</code>


#### LanguageType

<code>(typeof Language)[keyof typeof Language]</code>


#### StepType

<code>(typeof Step)[keyof typeof Step]</code>


#### TagType

<code>(typeof Tag)[keyof typeof Tag]</code>


#### HandoffType

<code>(typeof Handoff)[keyof typeof Handoff]</code>


#### DeferredPaymentMethodStrategyType

<code>(typeof DeferredPaymentMethodStrategy)[keyof typeof DeferredPaymentMethodStrategy]</code>


#### TaskStatusType

<code>(typeof TaskStatus)[keyof typeof TaskStatus]</code>


#### FailReasonType

<code>(typeof FailReason)[keyof typeof FailReason]</code>

</docgen-api>
