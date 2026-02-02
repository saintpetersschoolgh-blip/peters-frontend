'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Next.js Navigation Context Simulation
const NavigationContext = createContext<{
  pathname: string;
  searchParams: URLSearchParams;
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
}>({
  pathname: '/',
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
});

// Added optional flag to children to resolve TS2322 in index.tsx
export const PathProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash;
    const pathPart = hash.split('?')[0].replace(/^#\/?/, '/') || '/';
    return pathPart;
  });

  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    const hash = window.location.hash;
    const searchPart = hash.split('?')[1] || '';
    return new URLSearchParams(searchPart);
  });

  const updateLocation = useCallback(() => {
    const hash = window.location.hash;
    const pathPart = hash.split('?')[0].replace(/^#\/?/, '/') || '/';
    const searchPart = hash.split('?')[1] || '';
    setPathname(pathPart);
    setSearchParams(new URLSearchParams(searchPart));
  }, []);

  const push = useCallback((path: string) => {
    window.location.hash = path.startsWith('/') ? `#${path}` : `#/${path}`;
  }, []);

  const replace = useCallback((path: string) => {
    const newHash = path.startsWith('/') ? `#${path}` : `#/${path}`;
    window.location.replace(newHash);
  }, []);

  const back = useCallback(() => window.history.back(), []);

  useEffect(() => {
    // Set initial hash if none exists
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#/';
    }
    
    updateLocation();
    window.addEventListener('hashchange', updateLocation);
    return () => window.removeEventListener('hashchange', updateLocation);
  }, [updateLocation]);

  return React.createElement(NavigationContext.Provider, { 
    value: { pathname, searchParams, push, replace, back } 
  }, children);
};

export const usePathname = () => useContext(NavigationContext).pathname;
export const useSearchParams = () => useContext(NavigationContext).searchParams;

export const useRouter = () => {
  const context = useContext(NavigationContext);
  return {
    push: context.push,
    replace: context.replace,
    back: context.back,
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: () => {}, 
  };
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ href, children, replace, onClick, ...props }) => {
  const contextValue = useContext(NavigationContext);
  const { push, replace: routerReplace } = contextValue;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    
    if (href.startsWith('/') || href.startsWith('#')) {
      e.preventDefault();
      const cleanPath = href.replace(/^#\/?/, '/');
      if (replace) {
        routerReplace(cleanPath);
      } else {
        push(cleanPath);
      }
    }
  };

  const hashHref = href.startsWith('#') ? href : `#${href.startsWith('/') ? href : '/' + href}`;

  return React.createElement('a', { ...props, href: hashHref, onClick: handleClick }, children);
};