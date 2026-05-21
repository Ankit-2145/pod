import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/auth-check";
import Link from "next/link";

export default async function CoursePage() {
  const session = await requireAuth();

  if (session.user.role !== "instructor" && session.user.role !== "admin") {
    return (
      <section className=" p-4">
        <h1 className="mb-4 text-2xl font-bold">
          You are not authorized to view this page
        </h1>
      </section>
    );
  }

  return (
    <section className=" p-4">
      <h1 className="mb-4 text-2xl font-bold">All courses come here</h1>
      <Button asChild>
        <Link href="/dashboard/courses/create">Create Course</Link>
      </Button>
    </section>
  );
}
