import { ShareUrl } from "@/components/ShareUrl";
import {ReactNode} from "react";
import {SearchForm} from "../SearchForm";
import {Container} from "../Container";

interface ResultHeaderProps {
  left?: ReactNode;
  showSearchOptions?: boolean;
}

export const ResultHeader = ({ 
  left,
  showSearchOptions = false,
}: ResultHeaderProps) => {

  return (
    <div className="w-full bg-card border-b border-border mb-6 py-1">
      <Container
        left={left}
        right={<ShareUrl />}
        isCollapsible={false}
      >
        <SearchForm
          size = "sm"
          showSearchOptions={showSearchOptions}
        />
      </Container>
    </div>
  );
};
