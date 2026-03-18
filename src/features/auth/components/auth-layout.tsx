export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
};
