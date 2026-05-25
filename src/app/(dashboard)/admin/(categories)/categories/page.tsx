import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CategoriesTable } from "@/features/admin/categories/components/categories-table";

export default async function CategoriesPage() {
  prefetch(trpc.category.getMany.queryOptions());

  return (
    <HydrateClient>
      <CategoriesTable />
    </HydrateClient>
  );
}
