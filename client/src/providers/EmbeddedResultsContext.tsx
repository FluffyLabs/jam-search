import React, { createContext, useContext, useState } from 'react';

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

  function render(content: React.ReactElement, isVisible = true) {
    setPortalContent(content);
    setIsVisible(isVisible);
  }

  function close() {
    setIsVisible(false);
  }

  return (
    <EmbeddedViewer.Provider value={{ render, close, portalContent, isVisible }}>
      {children}
    </EmbeddedViewer.Provider>
  );
}

export function useEmbeddedViewer() {
  return useContext(EmbeddedViewer);
}
