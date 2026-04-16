import { Header as FluffyHeader } from "@fluffylabs/shared-ui";
import { UserMenu } from "@fluffylabs/shared-ui/supabase";
import ToolName from "@/assets/tool-name.svg";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <FluffyHeader
      toolNameSrc={ToolName}
      ghRepoName="jam-search"
      keepNameWhenSmall
      endSlot={
        <>
          <UserMenu
            onLoginClick={() => navigate("/login")}
            onSettingsClick={() => navigate("/settings")}
          />
          <FluffyHeader.GithubDropdownMenu />
        </>
      }
    />
  );
};
