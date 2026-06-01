import { createTRPCRouter } from "../init";
import { courseRouter } from "@/features/course/server/course.router";
import { categoryRouter } from "@/features/admin/categories/server/category.router";
import { chapterRouter } from "@/features/course/chapter/server/chapter.router";
import { adminRouter } from "@/features/admin/users-management/server/admin.router";

export const appRouter = createTRPCRouter({
  course: courseRouter,
  chapter: chapterRouter,
  category: categoryRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
