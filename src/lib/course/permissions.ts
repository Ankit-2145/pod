import { redirect } from "next/navigation";

interface User {
  id: string;

  role?: string | null;
}

interface Course {
  authorId: string | null;
}

export function isAdmin(role?: string | null) {
  return role === "admin";
}

export function isSuperAdmin(role?: string | null) {
  return role === "superAdmin";
}

export function isInstructor(role?: string | null) {
  return role === "INSTRUCTOR";
}

export function canManageCourses(role?: string | null) {
  return isAdmin(role) || isInstructor(role) || isSuperAdmin(role);
}

export function canManageCourse(user: User, course: Course) {
  const isOwner = course.authorId === user.id;

  const isAdmin = user.role === "admin";

  const isSuperAdmin = user.role === "superAdmin";

  return isOwner || isAdmin || isSuperAdmin;
}

export function requireCourseAccess(user: User, course: Course) {
  const hasAccess = canManageCourse(user, course);

  if (!hasAccess) {
    redirect("/dashboard/courses");
  }
}
