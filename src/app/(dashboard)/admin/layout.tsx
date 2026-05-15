import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { DashboardBreadcrumb } from "@/components/layouts/dashboard/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth/auth-check";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />

              <Separator orientation="vertical" className="mr-2 h-4" />

              <DashboardBreadcrumb />
            </div>
          </header>

          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
