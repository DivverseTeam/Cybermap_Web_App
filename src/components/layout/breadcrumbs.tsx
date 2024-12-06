"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ElementType, FunctionComponent } from "react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";
import { cn, unslugify } from "~/lib/utils";
import {
  AccountSetting02Icon,
  Analytics01Icon,
  Audit02Icon,
  CurvyRightDirectionIcon,
  FileValidationIcon,
  FrameworksIcon,
  LibraryIcon,
  Logout02Icon,
  OnlineLearning01Icon,
  PolicyIcon,
  UserMultipleIcon,
} from "hugeicons-react";

interface BreadCrumbsProps {}

const BreadCrumbs: FunctionComponent<BreadCrumbsProps> = () => {
  const paths = usePathname();
  const pathNames = paths
    .replace(/%20/g, " ")
    .split("/")
    .filter((path) => path);

  const pageHeadings = [
    {
      pathName: "dashboard",
      icon: Analytics01Icon,
    },
    {
      pathName: "compliance-guide",
      icon: CurvyRightDirectionIcon,
    },
    {
      icon: FileValidationIcon,
      pathName: "controls",
    },
    {
      icon: FrameworksIcon,
      pathName: "frameworks",
    },
    {
      icon: LibraryIcon,
      pathName: "evidence-library",
    },
    {
      icon: PolicyIcon,
      pathName: "policies",
    },
    {
      icon: UserMultipleIcon,
      pathName: "employees",
    },
    {
      icon: CurvyRightDirectionIcon,
      pathName: "integrations",
    },
    {
      icon: AccountSetting02Icon,
      pathName: "settings",
    },
  ];
  function getIconForPath(pathName: string | undefined): ElementType | null {
    const heading = pageHeadings.find(
      (heading) => heading.pathName === pathName
    );
    return heading?.icon || null; // Return null if no match is found
  }

  const Icon = getIconForPath(pathNames?.[0]);

  if (pathNames?.length < 2) {
    return (
      <div className="flex font-semibold text-black items-center">
        {Icon && <Icon className="mr-2" />}
        <p>
          {pathNames?.[0]
            ? pathNames[0].charAt(0).toUpperCase() + pathNames[0].slice(1)
            : ""}
        </p>
      </div>
    );
  }

  return (
    <Breadcrumb className="">
      <BreadcrumbList>
        {pathNames.map((path, index) => {
          const fullPath = pathNames.slice(0, index + 1).join("/");
          return (
            <React.Fragment key={index}>
              <div className="flex items-center">
                {index === 0 && Icon && <Icon className="mr-2" />}
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild={true}
                    href={`/${fullPath}`}
                    className={cn(
                      index === pathNames.length - 1
                        ? "text-black uppercase"
                        : "text-muted-foreground"
                    )}
                  >
                    <Link href={`/${fullPath}`}>{unslugify(path)}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < pathNames.length - 1 && (
                  <div className="flex items-center">
                    <span className="mr-2"> </span>

                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  </div>
                )}
                {/* Add separator unless it's the last item */}
              </div>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
