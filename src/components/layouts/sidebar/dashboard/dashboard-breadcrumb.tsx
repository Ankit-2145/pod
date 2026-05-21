"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${paths[0]}`}>
              {paths[0].charAt(0).toUpperCase() + paths[0].slice(1)}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.slice(1).map((path, index) => {
          const href = `/${paths.slice(0, index + 2).join("/")}`;

          const isLast = index === paths.slice(1).length - 1;

          const formattedName =
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

          return (
            <div key={path} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formattedName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formattedName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
