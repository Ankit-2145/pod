import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/auth-check";
import Link from "next/link";

const Page = async () => {
  await requireAuth();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* UI Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
          <p className="text-sm text-gray-600">
            This is the main dashboard page. You can navigate to different
            sections using the sidebar. Here you can manage your profile, view
            your settings, and access other features of the application.
          </p>
        </div>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          <Link href="/dashboard/profile">Go to Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
