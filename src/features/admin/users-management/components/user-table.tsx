"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { authClient } from "@/lib/auth/auth-client";

import { DataTable } from "@/components/layouts/data-table";

import { userColumns } from "./user-columns";

export function UsersTable() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.admin.listUsers.queryOptions());

  const { data: session } = authClient.useSession();

  return (
    <div className="p-6">
      <DataTable
        columns={userColumns(session?.user.id ?? "")}
        data={data.users}
        searchColumn="name"
        searchPlaceholder="Filter users..."
      />
    </div>
  );
}
