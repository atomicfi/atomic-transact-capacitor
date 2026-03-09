# Atomic Transact Capacitor Example App

This is an example app demonstrating the integration of the `@atomicfi/transact-capacitor` plugin. It provides a simple UI for configuring and launching Transact and Present Action flows.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Xcode](https://developer.apple.com/xcode/) (for iOS)
- [Android Studio](https://developer.android.com/studio) (for Android)
- [CocoaPods](https://cocoapods.org/) (for iOS dependencies)

## Quick Start

From the `example-app/` directory:

```bash
npm install

# Build everything and run on iOS
npm run run:ios

# Build everything and run on Android
npm run run:android
```

These commands will build the plugin, build the web assets, sync to native, and launch on a device or simulator — all in one step.

## Scripts

| Script | Description |
|---|---|
| `npm start` | Start Vite dev server (browser preview only) |
| `npm run build` | Build the web assets |
| `npm run build:plugin` | Build the parent plugin package |
| `npm run sync` | Sync web assets to native projects |
| `npm run build:ios` | Build web assets + sync to iOS |
| `npm run build:android` | Build web assets + sync to Android |
| `npm run open:ios` | Open the iOS project in Xcode |
| `npm run open:android` | Open the Android project in Android Studio |
| `npm run run:ios` | Full build (plugin + web + sync) and run on iOS |
| `npm run run:android` | Full build (plugin + web + sync) and run on Android |

## Setup (Manual)

If you prefer to run the steps individually:

### 1. Build the Plugin

From the repository root:

```bash
npm install
npm run build
```

### 2. Install Example App Dependencies

```bash
cd example-app
npm install
```

### 3. Build and Sync

```bash
npm run build:ios    # or build:android
```

### 4. Open in IDE

```bash
npm run open:ios     # or open:android
```

Select a simulator or device and run from Xcode / Android Studio.

## Development Workflow

When making changes to the plugin or the example app:

1. Make your changes
2. Run `npm run run:ios` (or `run:android`) to rebuild everything and launch

For web-only iteration, you can use the Vite dev server:

```bash
npm start
```

This starts a local dev server for previewing the UI in a browser, but native plugin functionality will only work on a device or simulator.

## Using the Example App

### Home Screen

- **Launch Transact Flow** - Navigate to the Transact configuration screen
- **Present Action** - Navigate to the Present Action configuration screen
- **About This Example** - View SDK information

### Transact Screen

- **Public Token** - Enter your Atomic public token (required)
- **Environment** - Choose Sandbox, Production, or Custom URL
- **Theme** - Toggle between Dark and Light mode
- **Operation** - Select an operation (Deposit, Verify, Tax, Switch)
  - Scope is automatically derived: Switch uses Pay Link, all others use User Link
- **Deeplink Options** - Optionally configure a deeplink step and company ID
- **Launch Transact** - Start the Transact flow with your configuration

### Present Action Screen

- **Action ID** - Enter a specific action ID to launch (required)
- **Environment** - Choose Sandbox, Production, or Custom URL
- **Launch Action** - Present the specified action

## Configuration

### Getting Atomic Credentials

To test the actual flows, you'll need:

1. **Public Token** - Obtain from the Atomic Financial dashboard
2. **Environment** - Use Sandbox for testing
3. **Action IDs** - Get specific action IDs from your Atomic integration

## Troubleshooting

### Common Issues

1. **Plugin not found** - Make sure you ran `npm run build:plugin` or `npm run build` from the repository root, then `npm run sync`
2. **Config error on launch** - Check Xcode/Android Studio console for detailed decoding errors
3. **Web assets not updating** - Run `npm run build:ios` (or `build:android`) to rebuild and sync in one step
4. **CocoaPods issues** - Try `cd ios/App && pod install --repo-update`
