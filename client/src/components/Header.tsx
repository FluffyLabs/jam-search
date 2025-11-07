import { Header as FluffyHeader } from "@fluffylabs/shared-ui";
import ToolName from "@/assets/tool-name.svg";

export const Header = () => {
  return (
    <FluffyHeader
      toolNameSrc={ToolName}
      ghRepoName="jam-search"
      keepNameWhenSmall
    />
  );
};
