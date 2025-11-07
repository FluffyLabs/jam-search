import ToolName from "@/assets/tool-name.svg";
import { Header as FluffyHeader } from "@fluffylabs/shared-ui";

export const Header = () => {
  return (
    <FluffyHeader
      toolNameSrc={ToolName}
      ghRepoName="jam-search"
      keepNameWhenSmall
    />
  );
};
