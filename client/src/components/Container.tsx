import {cn} from "@/lib/utils";
import {ReactNode} from "react";

export const Container = ({ 
  children,
  left,
  right,
  isCollapsible = true,
}: {
  children: ReactNode,
  left?: ReactNode,
  right?: ReactNode,
  isCollapsible?: boolean,
}) => {
  const sideClasses = cn(
    "flex-none shrink-0 max-w-[130px] my-2",
    {
      "basis-32 md:basis-64": isCollapsible,
      "sm:basis-32 md:basis-64": !isCollapsible,
    }
  );
  return (
    <div className={cn("px-3 justify-center items-center w-full", {
      "sm:flex sm:flex-row": isCollapsible,
      "flex flex-row": !isCollapsible
    })}>
      <div className={sideClasses}>{left}</div>
      <div className="flex-1 basis-full max-w-4xl px-7 my-2">
        {children}
      </div>
      <div className={sideClasses}>{right}</div>
    </div>
  );
};
