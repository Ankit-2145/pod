// user-columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

export const userColumns: ColumnDef<UserRow>[] = [
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

    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },

  {
    accessorKey: "actions",
  },
];
