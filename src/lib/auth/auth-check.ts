import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * - This function checks if the user is authenticated.
 * - If the user is not authenticated, they will be redirected to the login page.
 * - This can be used on protected pages that require authentication.
 */

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
};

/**
 * - This function checks if the user is not authenticated.
 * - If the user is authenticated, they will be redirected to the home page.
 * - This can be used on pages that should only be accessible to unauthenticated users, such as the login or registration pages.
 */

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return session;
};

export const checkPermission = async () => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      permissions: {
        user: ["list"],
      },
    },
    headers: await headers(),
  });
  return hasPermission;
};

/**
 * - This function ensures that the user is authenticated and has the necessary permissions to access admin features.
 * - If the user is not authenticated, they will be redirected to the login page.
 * - If they are authenticated but do not have the required permissions, they will be redirected to the home page.
 */
export const requireAdmin = async () => {
  await requireAuth();

  const hasAccess = await checkPermission();
  if (!hasAccess.success) {
    return redirect("/");
  }
};
