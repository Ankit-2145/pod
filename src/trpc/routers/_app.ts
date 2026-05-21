import { courseRouter } from "@/features/course/server/course.router";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  course: courseRouter,
});

export type AppRouter = typeof appRouter;
