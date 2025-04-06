import { Header as FluffyHeader } from "@krystian5011/shared-ui";
import ToolName from "@/assets/tool-name.svg";

const EndSlot = () => {
  return <div className="w-full"></div>;
};

export const Header = () => {
  return <FluffyHeader endSlot={<EndSlot />} toolNameSrc={ToolName} />;
};
