import z from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  instructorProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { UTApi } from "uploadthing/server";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export const courseRouter = createTRPCRouter({
  create: instructorProcedure
    .input(
      z.object({
        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const course = await ctx.prisma.course.create({
        data: {
          userId,
          authorId: userId,
          title: input.title,
        },
      });

      return course;
    }),

  getById: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "admin";
      const isSuperAdmin = ctx.user.role === "superAdmin";

      if (!isOwner && !isAdmin && !isSuperAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return course;
    }),
  getDashboardCourses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const role = ctx.user.role;

    // Admin sees everything
    if (role === "admin" || role === "superAdmin") {
      return ctx.prisma.course.findMany({
        include: {
          chapters: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Instructor sees only their own courses
    if (role === "instructor") {
      return ctx.prisma.course.findMany({
        where: {
          authorId: userId,
        },
        include: {
          chapters: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Student/User sees enrolled courses only
    return ctx.prisma.course.findMany({
      where: {
        purchases: {
          some: {
            userId,
          },
        },
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  updateTitle: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isInstructor = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "Admin";

      const isSuperAdmin = ctx.user.role === "superAdmin";

      if (!isInstructor && !isAdmin && !isSuperAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          title: input.title,
        },
      });

      return updatedCourse;
    }),
  updateShortDescription: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        shortDescription: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          shortDescription: input.shortDescription,
        },
      });
    }),

  updateDescription: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
        description: z.string().min(1, {
          message: "Description is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          description: input.description,
        },
      });

      return updatedCourse;
    }),
  updateImage: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
        imageUrl: z.url(),
        imageFileKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const utapi = new UTApi();

      if (course.imageFileKey) {
        await utapi.deleteFiles(course.imageFileKey);
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },
        data: {
          imageUrl: input.imageUrl,
          imageFileKey: input.imageFileKey,
        },
      });
    }),
  updateCategory: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          categoryId: input.categoryId,
        },
      });
    }),

  updatePrice: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        originalPrice: z.number().nullable(),

        price: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      if (
        input.price !== null &&
        input.originalPrice !== null &&
        input.price > input.originalPrice
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",

          message: "Discount price cannot be greater than original price",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          originalPrice: input.originalPrice,

          price: input.price,
        },
      });
    }),

  publish: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "admin";
      const isSuperAdmin = ctx.user.role === "superAdmin";

      if (!isOwner && !isAdmin && !isSuperAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          isPublished: true,
        },
      });

      return updatedCourse;
    }),

  unpublish: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          isPublished: false,
        },
      });

      return updatedCourse;
    }),

  delete: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      await ctx.prisma.course.delete({
        where: {
          id: input.courseId,
        },
      });

      return {
        success: true,
      };
    }),
  getPublished: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const courses = await ctx.prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
        },
        purchases: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses.map(({ purchases, ...course }) => ({
      ...course,

      canManage:
        user.role === "admin" ||
        user.role === "superAdmin" ||
        course.authorId === user.id,

      isPurchased: purchases.length > 0,
    }));
  }),

  createCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
          isPublished: true,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const purchase = await ctx.prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: input.courseId,
          },
        },
      });

      if (purchase) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already purchased",
        });
      }

      const order = await razorpay.orders.create({
        amount: Math.round(course.price! * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          courseId: course.id,
          userId: user.id,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        course: {
          id: course.id,
          title: course.title,
        },
        user: {
          name: user.name ?? "Student",
          email: user.email!,
        },
      };
    }),

  verifyPayment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
        .digest("hex");

      const isValid = generatedSignature === input.razorpay_signature;

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid payment signature",
        });
      }

      const existingPurchase = await ctx.prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: input.courseId,
          },
        },
      });

      if (existingPurchase) {
        return {
          success: true,
        };
      }

      await ctx.prisma.purchase.create({
        data: {
          userId,
          courseId: input.courseId,
          // razorpayOrderId: input.razorpay_order_id,
          // razorpayPaymentId: input.razorpay_payment_id,
        },
      });

      return {
        success: true,
      };
    }),
});
