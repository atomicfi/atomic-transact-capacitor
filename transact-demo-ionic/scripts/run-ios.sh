#!/usr/bin/env bash
# Run the app on whatever iOS device is currently running.
# Picks the first booted simulator; if none is booted, falls back to
# Capacitor's interactive target picker (which also lists connected devices).
set -uo pipefail

udid="$(xcrun simctl list devices booted 2>/dev/null | grep -Eo '[0-9A-F-]{36}' | head -1)"

if [ -n "$udid" ]; then
  echo "▶ Running on booted simulator $udid"
  exec npx cap run ios --target "$udid"
else
  echo "▶ No booted simulator found — choose a target:"
  exec npx cap run ios
fi
