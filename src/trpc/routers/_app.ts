import { createTRPCRouter } from "../init";
import { courseRouter } from "@/features/course/server/course.router";
import { categoryRouter } from "@/features/admin/categories/server/category.router";
import { chapterRouter } from "@/features/course/server/chapter.router";

export const appRouter = createTRPCRouter({
  course: courseRouter,
  chapter: chapterRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
