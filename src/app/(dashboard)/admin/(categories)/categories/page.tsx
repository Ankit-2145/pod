import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CategoriesDataTable } from "@/features/admin/categories/components/categories-table";

export default async function CategoriesPage() {
  prefetch(trpc.category.getMany.queryOptions());

  return (
    <HydrateClient>
      <CategoriesDataTable />
    </HydrateClient>
  );
}
