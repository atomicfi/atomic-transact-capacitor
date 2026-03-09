import { registerRoutes, initRouter } from './router';
import { createHomeScreen } from './screens/home';
import { createTransactScreen } from './screens/transact';
import { createPresentActionScreen } from './screens/present-action';

registerRoutes({
  '/': () => createHomeScreen(),
  '/transact': () => createTransactScreen(),
  '/present-action': () => createPresentActionScreen(),
});

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
