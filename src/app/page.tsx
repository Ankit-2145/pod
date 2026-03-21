import { requireAuth } from "@/lib/auth-check";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default Page;
