import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth/auth-check";

const page = async () => {
  await requireUnAuth();

  return <LoginForm />;
};

export default page;
