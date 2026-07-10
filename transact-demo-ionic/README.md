# Transact Demo — Ionic

A small [Ionic React](https://ionicframework.com/) + [Vite](https://vitejs.dev/) app
that demonstrates the [`@atomicfi/transact-capacitor`](../) plugin on web, iOS, and
Android.

It depends on the plugin in this repo directly (`"@atomicfi/transact-capacitor": "file:.."`),
so the plugin must be built before the demo can resolve it. The `ios` and `android`
scripts below rebuild the plugin automatically; for web you build it once (see
[Setup](#setup)).

## Prerequisites

- **Node.js 20+** and **npm**
- **iOS:** macOS with **Xcode** (and an iOS Simulator). No CocoaPods needed — the iOS
  project uses Swift Package Manager.
- **Android:** **Android Studio** with an SDK and an emulator (or a connected device).

## Setup

From this directory:

```bash
npm install
npm run build:plugin   # builds ../ (the plugin) so its dist/ is available
```

`build:plugin` runs `npm run build` in the repo root. Re-run it whenever you change the
plugin source. (The `ios` / `android` scripts do this for you.)

## Run

### Web

```bash
npm run dev
```

Starts the Vite dev server at http://localhost:5173 with hot reload. To preview a
production build instead:

```bash
npm run build && npm run preview
```

> Note: PayLink flows are not supported on web — use a native platform for those.

### iOS

```bash
npm run ios
```

Rebuilds the plugin, builds the web assets, runs `npx cap sync ios`, and launches the app
on your **currently booted simulator**. If no simulator is booted, Capacitor prompts you
to pick a target (the list includes connected devices). Boot a simulator first with, e.g.,
`open -a Simulator`, or open the project in Xcode:

```bash
npm run build:ios      # build + sync only
npx cap open ios       # then run from Xcode
```

### Android

```bash
npm run android
```

Rebuilds the plugin, builds the web assets, runs `npx cap sync android`, and launches the
app on the **first connected device or running emulator** (detected via `adb`). If none is
running, Capacitor prompts you to pick a target:

```bash
npm run build:android  # build + sync only
npx cap open android   # then run from Android Studio
```

## Notes

- After changing plugin source, rebuild it (`npm run build:plugin`) and re-sync the
  native projects (`npm run sync`) so the change is picked up.
- You need valid Atomic credentials (a public token) to run an actual Transact flow.
  Configure the environment and token in the app's **Settings** tab.
