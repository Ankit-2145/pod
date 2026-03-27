import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { requireUnAuth } from "@/lib/auth/auth-check";

const page = async () => {
  await requireUnAuth();

  return <ResetPasswordForm />;
};

export default page;
