import { requireAuth } from "@/lib/auth/auth-check";

const Dashboard = async () => {
  await requireAuth();

  return (
    <main>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Your Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and settings here
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
