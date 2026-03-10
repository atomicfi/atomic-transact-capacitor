export interface Screen {
  render(): string;
  init(): void;
  cleanup(): void;
}

type Route = '/' | '/transact' | '/present-action';

let currentScreen: Screen | null = null;
let routes: Record<Route, () => Screen>;

export function registerRoutes(routeMap: Record<Route, () => Screen>): void {
  routes = routeMap;
}

export function navigate(path: Route): void {
  window.location.hash = path;
}

export function initRouter(): void {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute(): void {
  const hash = (window.location.hash.slice(1) || '/') as Route;
  const screenFactory = routes[hash];

  if (!screenFactory) {
    navigate('/');
    return;
  }

  if (currentScreen) {
    currentScreen.cleanup();
  }

  const screen = screenFactory();
  currentScreen = screen;

  const app = document.getElementById('app')!;
  app.innerHTML = screen.render();
  screen.init();
}
