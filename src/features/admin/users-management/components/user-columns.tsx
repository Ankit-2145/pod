import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import type { UserWithRole } from "better-auth/plugins/admin";
import { UserActions } from "../../components/user-actions";

const ROLE_LABELS = {
  user: "User",
  instructor: "Instructor",
  admin: "Admin",
  superAdmin: "Super Admin",
};

export const userColumns = (
  selfId: string,
  currentUserRole: string,
): ColumnDef<UserWithRole>[] => [
  {
    accessorKey: "name",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "role",

    header: "Role",

    cell: ({ row }) => (
      <Badge>
        {ROLE_LABELS[row.original.role as keyof typeof ROLE_LABELS]}
      </Badge>
    ),
  },
  {
    id: "status",

    header: "Status",

    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.banned && <Badge variant="destructive">Banned</Badge>}

        {row.original.emailVerified ? (
          <Badge variant="outline">Verified</Badge>
        ) : (
          <Badge variant="secondary">Unverified</Badge>
        )}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),

    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },

  {
    id: "actions",

    cell: ({ row }) => (
      <UserActions
        user={row.original}
        selfId={selfId}
        currentUserRole={currentUserRole}
      />
    ),
  },
];
