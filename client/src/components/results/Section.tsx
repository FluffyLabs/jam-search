import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

export const Section = ({
  title,
  url,
  logo,
  endBlock,
}: {
  title: string;
  url: string;
  logo: ReactNode;
  endBlock?: ReactNode;
}) => {
  return (
    <Card className="relative bg-accent border-border">
      <CardContent className="p-1 flex gap-2 items-center">
        <div className="bg-card p-2 rounded-full border-border border shrink-0">
          {logo}
        </div>
        <div className="flex gap-1 shrink-1 overflow-hidden text-ellipsis">
          <CardTitle className="text-xs sm:text-sm text-muted-foreground font-medium">
            <a href={url} target="_blank">{title}</a>
          </CardTitle>
        </div>
        <div className="flex-1"></div>
        <div className="overflow-hidden shrink-0">
          { endBlock }
        </div>
      </CardContent>
    </Card>
  );
};
