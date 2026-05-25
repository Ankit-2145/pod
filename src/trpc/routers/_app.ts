import { createTRPCRouter } from "../init";
import { courseRouter } from "@/features/course/server/course.router";
import { categoryRouter } from "@/features/admin/categories/server/category.router";

export const appRouter = createTRPCRouter({
  course: courseRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
