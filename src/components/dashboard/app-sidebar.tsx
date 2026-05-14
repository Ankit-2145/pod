"use client";

import * as React from "react";
import { Building2Icon, Frame, Map, PieChart, Users2Icon } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";

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
      url: "#",
      icon: Building2Icon,
      items: [
        {
          title: "All Organizations",
          url: "/admin/all-org",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Manage Organizations",
      url: "/admin/organization",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

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
        <NavUser user={session?.user ?? { name: "", email: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
