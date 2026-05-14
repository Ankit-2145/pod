"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Building2 } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export default function AllOrg() {
  const { data: organizations } = authClient.useListOrganizations();

  async function onDeleteOrg(organizationId: string) {
    await authClient.organization.delete(
      {
        organizationId, // required
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to Delete Org");
        },
        onSuccess: () => {
          toast.success("Org Deleted");
        },
      },
    );
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations ({organizations?.length})
          </CardTitle>

          <CardDescription>
            Manage all organizations and their settings
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {organizations?.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>

                    <TableCell>{org.slug}</TableCell>

                    <TableCell>
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>

                          <DropdownMenuItem>Edit Organization</DropdownMenuItem>

                          <DropdownMenuItem>Manage Members</DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => onDeleteOrg(org.id)}
                          >
                            Delete Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {organizations?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
