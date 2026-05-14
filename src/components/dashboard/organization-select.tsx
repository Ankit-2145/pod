"use client";

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onSuccess: () => {
          toast.success("Organization changed.");
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to switch organization");
        },
      },
    );
  }

  return (
    <div className="space-y-2">
      {organizations.map((org) => {
        const isActive = activeOrganization?.id === org.id;

        return (
          <button
            key={org.id}
            type="button"
            onClick={() => setActiveOrganization(org.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
              isActive ? "border-primary bg-primary/10" : "hover:bg-muted",
            )}
          >
            <div>
              <p className="font-medium">{org.name}</p>

              {org.slug && (
                <p className="text-muted-foreground text-sm">{org.slug}</p>
              )}
            </div>

            {isActive && (
              <span className="text-primary text-sm font-medium">Active</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
