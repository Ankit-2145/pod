import z from "zod";
import { instructorProcedure } from "../init";
import { TRPCError } from "@trpc/server";

/**
 * This procedure is used to fetch the details of a course for the course editor page.
 * It checks if the course exists and if the user has permission to manage it.
 * If the course is found and the user has permission, it adds the course details to the context for downstream procedures.
 */

export const courseOwnerProcedure = instructorProcedure
  .input(
    z.object({
      courseId: z.string(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    const course = await ctx.prisma.course.findUnique({
      where: {
        id: input.courseId,
      },
      select: {
        id: true,
        authorId: true,
        imageFileKey: true,
        isPublished: true,
      },
    });

    if (!course) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const canManage =
      course.authorId === ctx.user.id ||
      ctx.user.role === "admin" ||
      ctx.user.role === "superAdmin";

    if (!canManage) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next({
      ctx: {
        ...ctx,
        course,
      },
    });
  });

/**
 * This procedure is used when we need to fetch the course details, including the chapters.
 * We use it in the course editor, where we need to display the chapters and their details.
 * By fetching the course with its chapters in a single query, we can avoid N+1 queries when fetching chapter details separately.
 */

export const courseDetailsProcedure = instructorProcedure
  .input(
    z.object({
      courseId: z.string(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    const course = await ctx.prisma.course.findUnique({
      where: {
        id: input.courseId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const canManage =
      course.authorId === ctx.user.id ||
      ctx.user.role === "admin" ||
      ctx.user.role === "superAdmin";

    if (!canManage) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next({
      ctx: {
        ...ctx,
        course,
      },
    });
  });
