import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  userAc,
  adminAc,
} from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,

  course: ["create", "view", "update", "delete", "publish"],

  enrollment: ["purchase", "view"],

  student: ["list", "view"],

  organization: ["create", "view", "update", "delete", "manageMembers"],

  admin: ["create", "view", "update", "delete"],
});

/**
 * Student/User
 * Can browse and purchase courses.
 */
export const user = ac.newRole({
  ...userAc.statements,

  course: ["view"],

  enrollment: ["purchase", "view"],
});

/**
 * Instructor
 * Can create/manage their own courses
 * and see enrolled students.
 */
export const instructor = ac.newRole({
  ...userAc.statements,

  course: ["create", "view", "update", "delete", "publish"],

  enrollment: ["view"],

  student: ["list", "view"],
});

/**
 * Organization Admin
 * Can manage users within their organization
 * plus instructor permissions.
 */
export const admin = ac.newRole({
  ...adminAc.statements,

  course: ["create", "view", "update", "delete", "publish"],

  enrollment: ["view"],

  student: ["list", "view"],

  organization: ["view", "update", "manageMembers"],
});

/**
 * Super Admin
 * Platform-level role.
 * Can do everything an admin can do
 * plus create/update/delete admins and organizations.
 */
export const superAdmin = ac.newRole({
  ...adminAc.statements,

  user: ["impersonate-admins", ...adminAc.statements.user],

  course: ["create", "view", "update", "delete", "publish"],

  enrollment: ["purchase", "view"],

  student: ["list", "view"],

  organization: ["create", "view", "update", "delete", "manageMembers"],

  admin: ["create", "view", "update", "delete"],
});

export const roles = {
  user,
  instructor,
  admin,
  superAdmin,
};
