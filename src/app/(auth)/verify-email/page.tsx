import { VerificationEmail } from "@/features/auth/components/verification-email";
import { requireUnAuth } from "@/lib/auth/auth-check";

const page = async () => {
  await requireUnAuth();

  return <VerificationEmail />;
};

export default page;
