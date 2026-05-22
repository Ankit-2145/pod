"use client";

import * as React from "react";
import { BookOpenIcon, Settings2Icon } from "lucide-react";
// import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { NavProjects } from "./nav-projects";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./org-switcher";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Courses",
      icon: BookOpenIcon,
      isActive: true,
      items: [
        {
          title: "All Courses",
          url: "/dashboard/courses",
        },
        {
          title: "Create Course",
          url: "/dashboard/courses/create",
        },
        {
          title: "Categories",
          url: "/dashboard/courses/categories",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "General",
          url: "#",
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
      name: "Home",
      url: "/dashboard",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
