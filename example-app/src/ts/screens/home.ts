import type { Screen } from '../router';
import { navigate } from '../router';
import { showAlert } from '../utils/alert';

export function createHomeScreen(): Screen {
  return {
    render() {
      return `
        <div class="hero hero--indigo">
          <div class="hero-title">Atomic Transact SDK</div>
          <div class="hero-subtitle">Capacitor Integration Example</div>
        </div>

        <div class="content">
          <button class="nav-card nav-card--green" id="btn-transact">
            <div class="nav-card-title">Launch Transact Flow</div>
            <div class="nav-card-subtitle">Test the complete financial connection experience</div>
          </button>

          <button class="nav-card nav-card--blue" id="btn-action">
            <div class="nav-card-title">Present Action</div>
            <div class="nav-card-subtitle">Launch specific actions by ID</div>
          </button>

          <button class="nav-card nav-card--gray" id="btn-about">
            <div class="nav-card-title">About This Example</div>
            <div class="nav-card-subtitle">Learn more about the SDK features</div>
          </button>
        </div>

        <div class="footer">
          <div class="footer-text">Powered by Atomic Financial \u2022 Built with Capacitor</div>
        </div>
      `;
    },

    init() {
      document.getElementById('btn-transact')!.addEventListener('click', () => {
        navigate('/transact');
      });

      document.getElementById('btn-action')!.addEventListener('click', () => {
        navigate('/present-action');
      });

      document.getElementById('btn-about')!.addEventListener('click', () => {
        showAlert(
          'Atomic Transact SDK',
          'This example app demonstrates the integration of the @atomicfi/transact-capacitor package.\n\nFeatures:\n\u2022 Transact Flow - Complete financial connection flow\n\u2022 Present Action - Launch specific actions\n\u2022 Environment switching (Sandbox/Production)\n\u2022 Custom theming and configuration\n\nNote: You need valid Atomic credentials to test the actual flows.'
        );
      });
    },

    cleanup() {},
  };
}
