import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type RenderFunction = (el: React.ReactElement, isVisible?: boolean) => void;

const EmbeddedViewer = createContext<{
  render: RenderFunction,
  close: () => void,
  portalContent: React.ReactElement | null,
  isVisible: boolean
}>({
  render: () => {},
  close: () => {},
  portalContent: null,
  isVisible: false,
});

export function EmbeddedViewerProvider({ children }: { children: React.ReactElement }) {
  const [portalContent, setPortalContent] = useState<React.ReactElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const render = useCallback((content: React.ReactElement, isVisible = true) => {
    setPortalContent(content);
    setIsVisible(isVisible);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const listener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    }
  }, [close]);

  useEffect(() => {
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [listener]);

  return (
    <EmbeddedViewer.Provider value={{ render, close, portalContent, isVisible }}>
      {children}
    </EmbeddedViewer.Provider>
  );
}

export function useEmbeddedViewer() {
  return useContext(EmbeddedViewer);
}
