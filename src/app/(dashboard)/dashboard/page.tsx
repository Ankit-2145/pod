import { requireAuth } from "@/lib/auth/auth-check";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <section className=" p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Hi {session.user.name}&apos;s Dashboard
      </h1>
    </section>
  );
}
