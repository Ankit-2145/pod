import { UsersTable } from "@/features/admin/users-management/components/user-table";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function ListAllUsersPage() {
  await prefetch(trpc.admin.listUsers.queryOptions());

  return (
    <HydrateClient>
      <UsersTable />
    </HydrateClient>
  );
}
