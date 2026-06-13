import { redirect } from "next/navigation";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CategoryDetails } from "@/features/admin/categories/components/category-details";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryIdPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    prefetch(
      trpc.category.getBySlug.queryOptions({
        slug,
      }),
    );
  } catch {
    redirect("/dashboard/categories");
  }

  return (
    <HydrateClient>
      <section className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Category</h1>

          <p className="text-muted-foreground">
            Manage category details and status.
          </p>
        </div>

        <CategoryDetails categoryId={slug} />
      </section>
    </HydrateClient>
  );
}
