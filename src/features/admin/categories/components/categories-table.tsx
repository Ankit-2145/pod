"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { columns } from "./columns";
import { DataTable } from "@/components/layouts/data-table";

export function CategoriesDataTable() {
  const trpc = useTRPC();

  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions(),
  );

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={categories}
        searchColumn="name"
        searchPlaceholder="Search categories..."
        createHref="/dashboard/categories/create"
        createLabel="Create category"
      />
    </div>
  );
}
