"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { authClient } from "@/lib/auth/auth-client";

import { DataTable } from "@/components/layouts/data-table";

import { userColumns } from "./user-columns";
import { DashboardHeading } from "@/components/shared/dashboard-heading";
import { Users2Icon } from "lucide-react";

export function UsersTable() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.admin.listUsers.queryOptions());

  const { data: session } = authClient.useSession();

  return (
    <section className="space-y-6 p-6">
      <DashboardHeading
        title="All Users"
        description="Manage users for the platform."
        icon={Users2Icon}
      />
      <DataTable
        columns={userColumns(session?.user.id ?? "", session?.user.role ?? "")}
        data={data.users}
        searchColumn="name"
        searchPlaceholder="Filter users..."
      />
    </section>
  );
}
