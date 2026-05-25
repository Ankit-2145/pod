"use client";

import * as React from "react";
import { Building2Icon, FolderIcon, Users2Icon } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "List all Users",
      url: "#",
      icon: Users2Icon,
      isActive: true,
    },

    {
      title: "Organizations",
      icon: Building2Icon,
      items: [
        {
          title: "All Organizations",
          url: "/admin/organizations",
        },
        {
          title: "Members",
          url: "/admin/organizations/members",
        },
        {
          title: "Invitations",
          url: "/admin/organizations/invitations",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Categories",
      url: "/admin/categories",
      icon: FolderIcon,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
