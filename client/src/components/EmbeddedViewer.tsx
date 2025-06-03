import {cn} from "@/lib/utils";
import {useEmbeddedViewer} from "@/providers/EmbeddedResultsContext";

export const EmbeddedViewer = () => {
  const data = useEmbeddedViewer();
  const isDisplayed = data.isVisible;

  return (
    <div className={
      cn(
        "absolute inset-0 bg-background",
        {
          'animate-in fade-in-0 z-100': isDisplayed,
          'animate-out fade-out-0 invisible': !isDisplayed,
        }
      )}>
      {data.portalContent}
    </div>
  );
};
