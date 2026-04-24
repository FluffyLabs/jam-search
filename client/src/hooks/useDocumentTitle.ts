import { useEffect } from "react";

const DEFAULT_TITLE = "JAM Search";

/**
 * Set `document.title` to `<topic> - JAM Search` while this component is
 * mounted. Pass `null` or an empty string to fall back to the default
 * `JAM Search`. Restores the default on unmount.
 */
export function useDocumentTitle(topic: string | null): void {
  useEffect(() => {
    document.title = topic ? `${topic} - ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [topic]);
}
