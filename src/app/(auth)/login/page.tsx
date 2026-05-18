import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="h-[420px] w-full animate-pulse rounded-3xl bg-white/60" aria-hidden />
  );
}
