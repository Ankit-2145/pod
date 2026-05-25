"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { CreateCategoryForm } from "./create-category-form";

export function CategoriesTable() {
  const trpc = useTRPC();

  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions(),
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>

        <p className="text-muted-foreground">Manage LMS categories</p>
      </div>

      <CreateCategoryForm />

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Slug</th>

              <th className="p-4 text-left">Courses</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="p-4">{category.name}</td>

                <td className="p-4">{category.slug}</td>

                <td className="p-4">{category._count.courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
