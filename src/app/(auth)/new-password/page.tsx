import { NewPasswordForm } from "@/features/auth/components/new-password-form";
import { requireUnAuth } from "@/lib/auth/auth-check";

const page = async () => {
  await requireUnAuth();

  return <NewPasswordForm />;
};

export default page;
