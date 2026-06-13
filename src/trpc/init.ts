import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    session,
    prisma,
  };
});
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const instructorProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const role = ctx.user.role;

    if (role !== "instructor" && role !== "admin" && role !== "superAdmin") {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  },
);

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role;

  if (role !== "admin" && role !== "superAdmin") {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }

  return next();
});

export const superAdminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const role = ctx.user.role;

    if (role !== "superAdmin") {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  },
);
