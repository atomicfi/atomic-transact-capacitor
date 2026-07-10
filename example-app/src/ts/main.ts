import { registerRoutes, initRouter } from './router';
import { createHomeScreen } from './screens/home';
import { createTransactScreen } from './screens/transact';

registerRoutes({
  '/': () => createHomeScreen(),
  '/transact': () => createTransactScreen(),
});

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
