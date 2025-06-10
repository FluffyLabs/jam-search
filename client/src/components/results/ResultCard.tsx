import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";

export const ResultCard = ({
  header,
  footer,
  content,
  noHover = false,
  lightBorder = false,
}: {
  header: ReactNode;
  footer: ReactNode;
  content: ReactNode;
  noHover?: boolean;
  lightBorder?: boolean;
}) => {
  return (
    <Card className={cn(
      "relative bg-card border-border",
      lightBorder ? 'border-0 rounded-none border-b' : '',
      noHover ? '' : 'hover:bg-accent',
      )}>
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs text-white font-normal truncate flex justify-between">
          {header}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-1 text-xs">
        <div className="h-16 overflow-hidden text-ellipsis">
          {content}
        </div>
        <div className="flex justify-end">
          {footer}
        </div>
      </CardContent>
    </Card>
  );
};

ResultCard.Skeleton = () => {
  return (
    <ResultCard
      noHover
      header={
        <Skeleton className="h-3 w-full my-2" />
      }
      footer={
        <Skeleton className="h-3 w-full" />
      }
      content={<>
        <Skeleton className="h-3 w-full my-2" />
        <Skeleton className="h-3 w-full my-2" />
        <Skeleton className="h-3 w-full my-2" />
      </>
      }
    />
  );
};

