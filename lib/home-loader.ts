export const HOME_LOADER_SESSION_KEY = 'appLoaded';

/** Fired once the splash overlay has fully exited (hero animation should start). */
export const HOME_LOADER_DONE_EVENT = 'lti-home-loader-done';

/** Inline script: hide page chrome before React hydrates on first home visit. */
export const HOME_LOADER_INIT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/$/,'')||'/';var home=p==='/'||p==='/en'||p==='/ar';if(home&&!sessionStorage.getItem('appLoaded')){document.documentElement.classList.add('home-loader-active');}}catch(e){}})();`;

export function dispatchHomeLoaderDone(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(HOME_LOADER_DONE_EVENT));
}

/** Browser pathname (may include /en, /ar). */
export function isHomeUrlPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return p === '/' || p === '/en' || p === '/ar';
}

/** next-intl pathname on the home route (locale stripped). */
export function isHomeAppPath(pathname: string): boolean {
  return pathname === '/';
}

export function shouldShowHomeLoader(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return isHomeUrlPath(window.location.pathname) && !sessionStorage.getItem(HOME_LOADER_SESSION_KEY);
  } catch {
    return false;
  }
}

export function setHomeLoaderActive(active: boolean): void {
  document.documentElement.classList.toggle('home-loader-active', active);
  document.body.style.overflow = active ? 'hidden' : '';
}
