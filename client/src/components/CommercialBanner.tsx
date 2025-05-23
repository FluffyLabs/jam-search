import { Card, CardContent, CardTitle } from "./ui/card";
import { ReactNode } from "react";

export const CommercialBanner = ({
  title,
  url,
  logo,
  description,
}: {
  title: string;
  logo: ReactNode;
  url: {
    display: string;
    href: string;
  };
  description?: string;
}) => {
  return (
    <Card className="relative bg-secondary border-border">
      <CardContent className="p-1.5 flex gap-2 shrink-0 items-center">
        <div className="bg-muted p-2 rounded-full border-border border">
          {logo}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col items-start sm:items-center sm:flex-row sm:gap-3">
            <CardTitle className="text-sm text-primary">{title}</CardTitle>
            <a
              href={url.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground after:absolute after:inset-0"
            >
              {url.display}
            </a>
          </div>
          {description && (
            <p className="text-xs text-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
