import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {ReactNode} from "react";

export const ResultCard = ({
  header,
  content,
}: {
  header: ReactNode;
  content: ReactNode;
}) => {
  return (
    <Card className="relative bg-card border-border">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs text-white font-normal truncate">
          {header}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        {content}
      </CardContent>
    </Card>
  );
};

ResultCard.Skeleton = () => {
  return (
    <ResultCard
      header={
        <Skeleton className="h-3 w-full" />
      }
      content={<>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </>
      }
    />
  );
};

