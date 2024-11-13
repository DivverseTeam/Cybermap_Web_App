import type React from "react";

import { cn } from "~/lib/utils";

export interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageTitle: React.FunctionComponent<PageTitleProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="font-semibold text-lg [@media(min-width:1400px)]:text-xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm [@media(min-width:1400px)]:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? action : null}
    </div>
  );
};

export default PageTitle;
