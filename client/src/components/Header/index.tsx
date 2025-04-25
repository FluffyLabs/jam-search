import { Header as FluffyHeader } from "@krystian5011/shared-ui";
import ToolName from "@/assets/tool-name.svg";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenu } from "../ui/dropdown-menu";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";

const EndSlot = () => {
  return (
    <div className="w-full flex items-center justify-end">
      <div className="sm:hidden">
        <MobileMenu />
      </div>
    </div>
  );
};

const MobileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-brand">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[315px] bg-[#242424] border-none text-white">
        <DropdownMenuItem
          onSelect={() =>
            window.open(
              "https://github.com/FluffyLabs/jam-search/issues/new",
              "_blank"
            )
          }
          className="pl-3 pt-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none pb-1 pt-2">
              Report an issue or suggestion
            </span>
            <span className="text-xs text-muted-foreground">
              Go to the issue creation page
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() =>
            window.open("https://github.com/FluffyLabs/jam-search", "_blank")
          }
          className="pl-3 pt-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none pb-1 pt-3">
              Star us on Github to show support
            </span>
            <span className="text-xs text-muted-foreground">
              Visit our Github
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() =>
            window.open(
              "https://github.com/FluffyLabs/jam-search/fork",
              "_blank"
            )
          }
          className="pl-3 py-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none pb-1 pt-3">
              Fork & contribute
            </span>
            <span className="text-xs text-muted-foreground pt-1">
              Opens the fork creation page
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = () => {
  return <FluffyHeader endSlot={<EndSlot />} toolNameSrc={ToolName} />;
};
