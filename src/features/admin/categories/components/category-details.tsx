"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface CategoryDetailsProps {
  categoryId: string;
}

export function CategoryDetails({ categoryId }: CategoryDetailsProps) {
  const trpc = useTRPC();

  const { data: category } = useSuspenseQuery(
    trpc.category.getBySlug.queryOptions({
      slug: categoryId,
    }),
  );

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Category name</h2>

        <p className="text-muted-foreground">{category.name}</p>
      </div>

      <div>
        <h2 className="font-semibold">Slug</h2>

        <p className="text-muted-foreground">{category.slug}</p>
      </div>

      <div>
        <h2 className="font-semibold">Status</h2>

        <p className="text-muted-foreground">
          {category.isActive ? "Active" : "Archived"}
        </p>
      </div>

      <div>
        <h2 className="font-semibold">Courses</h2>

        <p className="text-muted-foreground">{category._count.courses}</p>
      </div>
    </div>
  );
}
