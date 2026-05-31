export const HOME_LOADER_SESSION_KEY = 'appLoaded';

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
