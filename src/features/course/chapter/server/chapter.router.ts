import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter } from "@/trpc/init";
import { UTApi } from "uploadthing/server";
import {
  attachmentOwnerProcedure,
  chapterDetailsProcedure,
  chapterOwnerProcedure,
} from "@/trpc/procedures/chapter-procedures";
import { courseOwnerProcedure } from "@/trpc/procedures/course-procedures";

export const chapterRouter = createTRPCRouter({
  create: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lastChapter = await ctx.prisma.chapter.findFirst({
        where: {
          courseId: ctx.course.id,
        },

        orderBy: {
          position: "desc",
        },

        select: {
          position: true,
        },
      });

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

      return ctx.prisma.chapter.create({
        data: {
          title: input.title,
          courseId: ctx.course.id,
          position: newPosition,
        },
      });
    }),

  reorder: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),

        list: z.array(
          z.object({
            chapterId: z.string(),
            position: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.list.map((item) =>
          ctx.prisma.chapter.update({
            where: {
              id: item.chapterId,
            },

            data: {
              position: item.position,
            },
          }),
        ),
      );
    }),
  getById: chapterDetailsProcedure.query(({ ctx }) => {
    return ctx.chapter;
  }),
  updateTitle: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },

        data: {
          title: input.title,
        },
      });
    }),
  updateDescription: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },

        data: {
          description: input.description,
        },
      });
    }),
  updateAccess: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
        isFree: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },

        data: {
          isFree: input.isFree,
        },
      });
    }),
  updateVideoUrl: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
        videoUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },

        data: {
          videoUrl: input.videoUrl,
        },
      });
    }),
  createAttachment: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
        url: z.url(),
        name: z.string().min(1),
        fileKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.attachment.create({
        data: {
          chapterId: ctx.chapter.id,
          url: input.url,
          name: input.name,
          fileKey: input.fileKey,
        },
      });
    }),

  deleteAttachment: attachmentOwnerProcedure
    .input(
      z.object({
        attachmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      const utapi = new UTApi();

      await utapi.deleteFiles(ctx.attachment.fileKey);

      await ctx.prisma.attachment.delete({
        where: {
          id: ctx.attachment.id,
        },
      });
    }),

  publish: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },
        data: {
          isPublished: true,
        },
      });
    }),

  unpublish: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.chapter.update({
        where: {
          id: ctx.chapter.id,
        },

        data: {
          isPublished: false,
        },
      });
    }),

  delete: chapterOwnerProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      if (ctx.chapter.isPublished) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unpublish the chapter before deleting it",
        });
      }

      await ctx.prisma.chapter.delete({
        where: {
          id: ctx.chapter.id,
        },
      });
    }),
});
