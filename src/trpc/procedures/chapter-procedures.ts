import z from "zod";
import { instructorProcedure } from "../init";
import { TRPCError } from "@trpc/server";

/**
 * Middleware to check if the user is the owner of the chapter or an admin.
 * It also fetches the chapter and attaches it to the context for later use.
 * This is used in all chapter-related procedures to ensure that only authorized users can access or modify chapter data.
 */

export const chapterOwnerProcedure = instructorProcedure
  .input(
    z.object({
      chapterId: z.string(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    const chapter = await ctx.prisma.chapter.findUnique({
      where: {
        id: input.chapterId,
      },

      select: {
        id: true,
        videoUrl: true,
        isPublished: true,

        course: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const canManage =
      chapter.course.authorId === ctx.user.id ||
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
        chapter,
      },
    });
  });

/**
 * This procedure is used to check if the user is the owner of the attachment or an admin.
 * It also fetches the attachment and its related chapter and course information.
 * The attachment information is then added to the context for use in the next middleware or resolver.
 */

export const attachmentOwnerProcedure = instructorProcedure
  .input(
    z.object({
      attachmentId: z.string(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    const attachment = await ctx.prisma.attachment.findUnique({
      where: {
        id: input.attachmentId,
      },

      select: {
        id: true,
        fileKey: true,

        chapter: {
          select: {
            course: {
              select: {
                authorId: true,
              },
            },
          },
        },
      },
    });

    if (!attachment || !attachment.chapter) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const canManage =
      attachment.chapter.course.authorId === ctx.user.id ||
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
        attachment,
      },
    });
  });

export const chapterDetailsProcedure = instructorProcedure
  .input(
    z.object({
      chapterId: z.string(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    const chapter = await ctx.prisma.chapter.findUnique({
      where: {
        id: input.chapterId,
      },

      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        course: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chapter not found",
      });
    }

    const canManage =
      chapter.course.authorId === ctx.user.id ||
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
        chapter,
      },
    });
  });
