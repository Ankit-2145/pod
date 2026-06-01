// users-table.tsx

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { DataTable } from "@/components/layouts/data-table";
import { userColumns } from "./user-columns";

export function UsersTable() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.admin.listUsers.queryOptions());

  return (
    <div className="p-6">
      <DataTable
        columns={userColumns}
        data={data.users.map((user) => ({
          ...user,
          role: user.role ?? "user",
        }))}
        searchColumn="name"
        searchPlaceholder="Filter users..."
      />
    </div>
  );
}
