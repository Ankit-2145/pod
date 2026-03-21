import { SignupForm } from "@/features/auth/components/signup-form";
import { requireUnAuth } from "@/lib/auth-check";

const page = async () => {
  await requireUnAuth();

  return <SignupForm />;
};

export default page;
