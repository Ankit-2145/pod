"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: {
    courses: number;
  };
};

export function categoryColumns(
  onEdit: (category: Category) => void,
): ColumnDef<Category>[] {
  return [
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
      accessorKey: "slug",
      header: "Slug",
    },

    {
      accessorKey: "_count.courses",

      header: "Courses",

      cell: ({ row }) => row.original._count.courses,
    },

    {
      accessorKey: "isActive",

      header: "Status",

      cell: ({ row }) => (
        <Badge
          className="font-medium font-fontUrbanist text-xs"
          variant={row.original.isActive ? "default" : "destructive"}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },

    {
      id: "actions",

      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
