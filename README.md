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

### presentTransact(...)

```typescript
presentTransact(options: PresentTransactOptions) => Promise<TransactResult>
```

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#presenttransactoptions">PresentTransactOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#transactresult">TransactResult</a>&gt;</code>

--------------------


### presentAction(...)

```typescript
presentAction(options: PresentActionOptions) => Promise<TransactResult>
```

| Param         | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`options`** | <code><a href="#presentactionoptions">PresentActionOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#transactresult">TransactResult</a>&gt;</code>

--------------------


### hideTransact()

```typescript
hideTransact() => Promise<void>
```

--------------------


### resolveDataRequest(...)

```typescript
resolveDataRequest(options: DataRequestResponse) => Promise<void>
```

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

| Prop           | Type                                                         |
| -------------- | ------------------------------------------------------------ |
| **`finished`** | <code><a href="#record">Record</a>&lt;string, any&gt;</code> |
| **`closed`**   | <code><a href="#record">Record</a>&lt;string, any&gt;</code> |
| **`error`**    | <code>string</code>                                          |


#### PresentTransactOptions

| Prop                    | Type                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| **`config`**            | <code><a href="#transactconfig">TransactConfig</a></code>           |
| **`environment`**       | <code><a href="#transactenvironment">TransactEnvironment</a></code> |
| **`presentationStyle`** | <code>'formSheet' \| 'fullScreen'</code>                            |


#### TransactConfig

| Prop                                | Type                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| **`publicToken`**                   | <code>string</code>                                                                             |
| **`scope`**                         | <code><a href="#scopetype">ScopeType</a></code>                                                 |
| **`tasks`**                         | <code>TransactTask[]</code>                                                                     |
| **`linkedAccount`**                 | <code>string</code>                                                                             |
| **`theme`**                         | <code><a href="#transacttheme">TransactTheme</a></code>                                         |
| **`language`**                      | <code><a href="#languagetype">LanguageType</a></code>                                           |
| **`deeplink`**                      | <code><a href="#transactdeeplink">TransactDeeplink</a></code>                                   |
| **`metadata`**                      | <code><a href="#record">Record</a>&lt;string, string&gt;</code>                                 |
| **`search`**                        | <code><a href="#transactsearch">TransactSearch</a></code>                                       |
| **`handoff`**                       | <code>HandoffType[]</code>                                                                      |
| **`experiments`**                   | <code><a href="#transactexperiments">TransactExperiments</a></code>                             |
| **`customer`**                      | <code><a href="#transactcustomer">TransactCustomer</a></code>                                   |
| **`features`**                      | <code><a href="#transactfeatures">TransactFeatures</a></code>                                   |
| **`sessionContext`**                | <code>string</code>                                                                             |
| **`conversionToken`**               | <code>string</code>                                                                             |
| **`inSdk`**                         | <code>boolean</code>                                                                            |
| **`deferredPaymentMethodStrategy`** | <code><a href="#deferredpaymentmethodstrategytype">DeferredPaymentMethodStrategyType</a></code> |


#### TransactTask

| Prop               | Type                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| **`operation`**    | <code><a href="#operationtype">OperationType</a></code>               |
| **`distribution`** | <code><a href="#transactdistribution">TransactDistribution</a></code> |
| **`onComplete`**   | <code>'continue' \| 'finish'</code>                                   |
| **`onFail`**       | <code>'continue' \| 'finish'</code>                                   |


#### TransactDistribution

| Prop            | Type                                         |
| --------------- | -------------------------------------------- |
| **`type`**      | <code>'total' \| 'fixed' \| 'percent'</code> |
| **`amount`**    | <code>number</code>                          |
| **`canUpdate`** | <code>boolean</code>                         |


#### TransactTheme

| Prop                    | Type                                                                            |
| ----------------------- | ------------------------------------------------------------------------------- |
| **`brandColor`**        | <code>string</code>                                                             |
| **`overlayColor`**      | <code>string</code>                                                             |
| **`dark`**              | <code>boolean</code>                                                            |
| **`display`**           | <code>string</code>                                                             |
| **`navigationOptions`** | <code><a href="#transactnavigationoptions">TransactNavigationOptions</a></code> |


#### TransactNavigationOptions

| Prop                     | Type                 |
| ------------------------ | -------------------- |
| **`showBackButton`**     | <code>boolean</code> |
| **`showBackButtonText`** | <code>boolean</code> |
| **`showCloseButton`**    | <code>boolean</code> |


#### TransactDeeplink

| Prop            | Type                                          |
| --------------- | --------------------------------------------- |
| **`step`**      | <code><a href="#steptype">StepType</a></code> |
| **`companyId`** | <code>string</code>                           |


#### TransactSearch

| Prop               | Type                   |
| ------------------ | ---------------------- |
| **`tags`**         | <code>TagType[]</code> |
| **`excludedTags`** | <code>TagType[]</code> |
| **`ruleId`**       | <code>string</code>    |


#### TransactExperiments

| Prop                     | Type                 |
| ------------------------ | -------------------- |
| **`fractionalDeposits`** | <code>boolean</code> |


#### TransactCustomer

| Prop       | Type                |
| ---------- | ------------------- |
| **`name`** | <code>string</code> |


#### TransactFeatures

| Prop                     | Type                 |
| ------------------------ | -------------------- |
| **`fractionalDeposits`** | <code>boolean</code> |
| **`customSearch`**       | <code>boolean</code> |


#### TransactEnvironment

| Prop               | Type                                               |
| ------------------ | -------------------------------------------------- |
| **`environment`**  | <code>'production' \| 'sandbox' \| 'custom'</code> |
| **`transactPath`** | <code>string</code>                                |
| **`apiPath`**      | <code>string</code>                                |


#### PresentActionOptions

| Prop                    | Type                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| **`id`**                | <code>string</code>                                                 |
| **`environment`**       | <code><a href="#transactenvironment">TransactEnvironment</a></code> |
| **`theme`**             | <code><a href="#transacttheme">TransactTheme</a></code>             |
| **`metadata`**          | <code><a href="#record">Record</a>&lt;string, string&gt;</code>     |
| **`presentationStyle`** | <code>'formSheet' \| 'fullScreen'</code>                            |


#### DataRequestResponse

| Prop           | Type                                                  |
| -------------- | ----------------------------------------------------- |
| **`card`**     | <code><a href="#carddata">CardData</a></code>         |
| **`identity`** | <code><a href="#identitydata">IdentityData</a></code> |


#### CardData

| Prop         | Type                |
| ------------ | ------------------- |
| **`number`** | <code>string</code> |
| **`expiry`** | <code>string</code> |
| **`cvv`**    | <code>string</code> |


#### IdentityData

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

| Prop        | Type                |
| ----------- | ------------------- |
| **`name`**  | <code>string</code> |
| **`value`** | <code>any</code>    |


#### DataRequestEvent

| Prop                 | Type                  |
| -------------------- | --------------------- |
| **`fields`**         | <code>string[]</code> |
| **`taskId`**         | <code>string</code>   |
| **`userId`**         | <code>string</code>   |
| **`identifier`**     | <code>string</code>   |
| **`taskWorkflowId`** | <code>string</code>   |
| **`externalId`**     | <code>string</code>   |


#### AuthStatusUpdateEvent

| Prop          | Type                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **`status`**  | <code>string</code>                                                   |
| **`company`** | <code><a href="#transactcompanyevent">TransactCompanyEvent</a></code> |


#### TransactCompanyEvent

| Prop           | Type                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| **`_id`**      | <code>string</code>                                                               |
| **`name`**     | <code>string</code>                                                               |
| **`branding`** | <code>{ color: string; logo: { url: string; backgroundColor?: string; }; }</code> |


#### TaskStatusUpdateEvent

| Prop              | Type                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| **`taskId`**      | <code>string</code>                                                                 |
| **`product`**     | <code>string</code>                                                                 |
| **`status`**      | <code><a href="#taskstatustype">TaskStatusType</a></code>                           |
| **`failReason`**  | <code><a href="#failreasontype">FailReasonType</a></code>                           |
| **`company`**     | <code><a href="#transactcompanyevent">TransactCompanyEvent</a></code>               |
| **`depositData`** | <code><a href="#depositdataevent">DepositDataEvent</a></code>                       |
| **`switchData`**  | <code><a href="#switchdataevent">SwitchDataEvent</a></code>                         |
| **`managedBy`**   | <code>{ company: <a href="#transactcompanyevent">TransactCompanyEvent</a>; }</code> |


#### DepositDataEvent

| Prop                     | Type                |
| ------------------------ | ------------------- |
| **`accountType`**        | <code>string</code> |
| **`distributionAmount`** | <code>number</code> |
| **`distributionType`**   | <code>string</code> |
| **`lastFour`**           | <code>string</code> |
| **`routingNumber`**      | <code>string</code> |
| **`title`**              | <code>string</code> |


#### SwitchDataEvent

| Prop                | Type                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`paymentMethod`** | <code>{ type: string; brand?: string; expiry?: string; lastFour?: string; accountType?: string; routingNumber?: string; accountNumberLastFour?: string; }</code> |


#### FinishEvent

| Prop         | Type                |
| ------------ | ------------------- |
| **`taskId`** | <code>string</code> |


#### CloseEvent

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
