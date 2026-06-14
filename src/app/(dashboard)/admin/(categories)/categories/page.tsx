import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CategoryTable } from "@/features/admin/categories/components/category-table";

export default async function CategoriesPage() {
  prefetch(trpc.category.getMany.queryOptions());

  return (
    <HydrateClient>
      <CategoryTable />
    </HydrateClient>
  );
}
