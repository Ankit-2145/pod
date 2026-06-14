// analytics.router.ts

import { createTRPCRouter, adminProcedure } from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
  getAdminStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalInstructors,
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
    ] = await Promise.all([
      ctx.prisma.user.count(),

      ctx.prisma.user.count({
        where: {
          role: "instructor",
        },
      }),

      ctx.prisma.course.count(),

      ctx.prisma.course.count({
        where: {
          isPublished: true,
        },
      }),

      ctx.prisma.course.count({
        where: {
          isPublished: false,
        },
      }),

      ctx.prisma.purchase.count(),
    ]);

    return {
      totalUsers,
      totalInstructors,
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
    };
  }),
});
