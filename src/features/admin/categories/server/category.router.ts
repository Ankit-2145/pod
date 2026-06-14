import z from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  adminProcedure,
  instructorProcedure,
  superAdminProcedure,
} from "@/trpc/init";

export const categoryRouter = createTRPCRouter({
  /**
   * - Create a new category
   * - Admins and super admins can create categories
   */

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, {
          message: "Category name is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.name.toLowerCase().trim().replace(/\s+/g, "-");

      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          OR: [
            {
              name: input.name,
            },
            {
              slug,
            },
          ],
        },
        select: {
          id: true,
        },
      });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Category already exists",
        });
      }

      return ctx.prisma.category.create({
        data: {
          name: input.name,
          slug,
        },
      });
    }),

  /**
   * - Get category by ID
   * - Admins and super admins can access this endpoint
   */
  getById: adminProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: {
          id: input.categoryId,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,

          _count: {
            select: {
              courses: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  /**
   * - Get many categories
   * - Instructors and above can access this endpoint
   */
  getMany: instructorProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
  }),

  /**
   * - Get active categories for course creation form
   * - Instructors and above can access this endpoint
   */

  getActive: instructorProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    });
  }),

  /**
   * - Update category name
   * - Admins and super admins can update category name
   */

  update: adminProcedure
    .input(
      z.object({
        categoryId: z.string(),

        name: z.string().min(1, {
          message: "Category name is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.name.toLowerCase().trim().replace(/\s+/g, "-");

      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          id: {
            not: input.categoryId,
          },

          OR: [
            {
              name: input.name,
            },
            {
              slug,
            },
          ],
        },

        select: {
          id: true,
        },
      });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Category already exists",
        });
      }

      return ctx.prisma.category.update({
        where: {
          id: input.categoryId,
        },

        data: {
          name: input.name,
          slug,
        },
      });
    }),

  /**
   * - Inactivate a category
   * - Admins and super admins can inactivate categories
   */

  inActive: adminProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.categoryId,
        },

        data: {
          isActive: false,
        },
      });
    }),

  /**
   * - Activate a category
   * - Admins and super admins can activate categories
   */

  Active: adminProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.categoryId,
        },
        data: {
          isActive: true,
        },
      });
    }),

  /**
   * - Delete a category
   * - Only allowed if the category is not assigned to any courses
   * - Only super admins can delete categories
   */

  delete: superAdminProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: {
          id: input.categoryId,
        },
        select: {
          id: true,
          _count: {
            select: {
              courses: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (category._count.courses > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete a category that is assigned to courses",
        });
      }

      await ctx.prisma.category.delete({
        where: {
          id: input.categoryId,
        },
      });
    }),
});
