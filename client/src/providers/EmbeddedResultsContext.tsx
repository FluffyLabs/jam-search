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

const VIEWER_STATE_ENTRY = 'embeddedViewerOpen';

export function EmbeddedViewerProvider({ children }: { children: React.ReactElement }) {
  const [portalContent, setPortalContent] = useState<React.ReactElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const render = useCallback((content: React.ReactElement, isVisible = true) => {
    setPortalContent(content);
    setIsVisible(isVisible);
    if (isVisible) {
      window.history.pushState({ [VIEWER_STATE_ENTRY]: true }, '');
    }
  }, []);

  const close = useCallback(() => {
    window.history.replaceState({ [VIEWER_STATE_ENTRY]: false }, '');
    setIsVisible(false);
  }, []);

  const closeUsingEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    }
  }, [close]);

  const openCloseOnHistory = useCallback((e: PopStateEvent) => {
    if (e.state && VIEWER_STATE_ENTRY in e.state && e.state[VIEWER_STATE_ENTRY]) {
      // in case we press "forward" we will display the dialog again.
      setIsVisible(true);
    } else {
      // and this is just handling "back"
      setIsVisible(false);
    }
  }, [setIsVisible]);

  useEffect(() => {
    window.addEventListener('keydown', closeUsingEsc);
    window.addEventListener('popstate', openCloseOnHistory);

    return () => {
      window.removeEventListener('keydown', closeUsingEsc);
      window.removeEventListener('popstate', openCloseOnHistory);
    };
  }, [closeUsingEsc, openCloseOnHistory]);

  return (
    <EmbeddedViewer.Provider value={{ render, close, portalContent, isVisible }}>
      {children}
    </EmbeddedViewer.Provider>
  );
}

export function useEmbeddedViewer() {
  return useContext(EmbeddedViewer);
}
