import { ShareUrl } from "@/components/ShareUrl";
import {ReactNode} from "react";
import {SearchForm} from "../SearchForm";

interface ResultHeaderProps {
  left?: ReactNode;
  showSearchOptions?: boolean;
}

export const ResultHeader = ({ 
  left,
  showSearchOptions = false,
}: ResultHeaderProps) => {

  return (
    <div className="w-full bg-card border-b border-border mb-6">
      <div className="md:grid md:grid-cols-8 gap-4 p-3 items-center flex flex-row">
        <div className="md:col-span-1 min-w-[70px]">
          {left}
        </div>
        <div className="md:col-span-6 flex-1">
          <SearchForm
            size = "sm"
            showSearchOptions={showSearchOptions}
          />
        </div>
        <div className="md:col-span-1">
          <ShareUrl />
        </div>
      </div>
    </div>
  );
};
