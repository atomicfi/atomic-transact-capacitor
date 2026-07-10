#!/usr/bin/env bash
# Run the app on whatever Android target is currently attached.
# Picks the first connected device / running emulator (via adb); if none is
# found, falls back to Capacitor's interactive target picker.
set -uo pipefail

serial="$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')"

if [ -n "$serial" ]; then
  echo "▶ Running on device/emulator $serial"
  exec npx cap run android --target "$serial"
else
  echo "▶ No connected device or running emulator found — choose a target:"
  exec npx cap run android
fi
