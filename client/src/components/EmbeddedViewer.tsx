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
          'z-100': isDisplayed,
          'invisible -z-1': !isDisplayed,
        }
      )}>
      {data.portalContent}
    </div>
  );
};
