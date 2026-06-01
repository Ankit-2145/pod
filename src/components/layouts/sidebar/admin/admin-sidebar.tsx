"use client";

import * as React from "react";
import {
  Building2Icon,
  Columns3CogIcon,
  FolderIcon,
  UserRoundCogIcon,
  Users2Icon,
} from "lucide-react";

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

const data = {
  courses: [
    {
      name: "Admin Dashboard",
      url: "/admin",
      icon: Columns3CogIcon,
    },
    {
      name: "Categories",
      url: "/admin/categories",
      icon: FolderIcon,
    },
  ],
  navMain: [
    {
      title: "User Management",
      icon: UserRoundCogIcon,
      items: [
        {
          title: "All Users",
          url: "/admin/list-all-users",
          icon: Users2Icon,
        },
      ],
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
        <NavProjects projects={data.courses} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
