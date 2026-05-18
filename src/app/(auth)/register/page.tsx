import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="h-[480px] w-full animate-pulse rounded-3xl bg-white/60" aria-hidden />
  );
}
