"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { FunctionComponent } from "react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";
import { cn, unslugify } from "~/lib/utils";

interface BreadCrumbsProps {}

const BreadCrumbs: FunctionComponent<BreadCrumbsProps> = () => {
  const paths = usePathname();
  const pathNames = paths
    .replace(/%20/g, " ")
    .split("/")
    .filter((path) => path);

  if (pathNames.length < 2) {
    return null;
  }

  return (
    <Breadcrumb className="-mt-4 [@media(min-width:1400px)]:-mt-6">
      <BreadcrumbList>
        {pathNames.map((path, index) => {
          const fullPath = pathNames.slice(0, index + 1).join("/");
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild={true}
                  href={`/${fullPath}`}
                  className={cn(
                    index === pathNames.length - 1
                      ? "text-black uppercase"
                      : "text-muted-foreground",
                  )}
                >
                  <Link href={`/${fullPath}`}>{unslugify(path)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < pathNames.length - 1 && (
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              )}
              {/* Add separator unless it's the last item */}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
