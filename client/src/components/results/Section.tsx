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
      <CardContent className="p-1 flex gap-2 shrink-0 items-center">
        <div className="bg-card p-2 rounded-full border-border border">
          {logo}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col items-start sm:items-center sm:flex-row sm:gap-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              <a href={url} target="_blank">{title}</a>
            </CardTitle>
          </div>
        </div>
        <div className="flex-1"></div>
        { endBlock }
      </CardContent>
    </Card>
  );
};
