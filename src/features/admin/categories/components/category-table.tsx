"use client";

import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { categoryColumns } from "./category-Columns";
import { EditCategory } from "./edit-category-drawer/edit-category";
import { DataTable } from "@/components/layouts/data-table";
import { CreateCategory } from "./create-category";
import { DashboardHeading } from "@/components/shared/dashboard-heading";
import { TagsIcon } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: {
    courses: number;
  };
};

export function CategoryTable() {
  const trpc = useTRPC();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions(),
  );

  return (
    <>
      <section className="space-y-6 p-6">
        <DashboardHeading
          title="Categories"
          description="Manage course categories for the platform."
          icon={TagsIcon}
        />

        <DataTable
          columns={categoryColumns(setSelectedCategory)}
          data={categories}
          searchColumn="name"
          searchPlaceholder="Search categories..."
          action={<CreateCategory />}
        />
      </section>

      <EditCategory
        category={selectedCategory}
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCategory(null);
          }
        }}
      />
    </>
  );
}
