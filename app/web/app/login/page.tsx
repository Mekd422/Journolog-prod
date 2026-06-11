import Link from "next/link";
import { Compass } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-2xl">journolog</span>
          </Link>
          <h1 className="mt-6 font-serif text-3xl text-text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-text-body">
            Sign in to continue writing your journeys.
          </p>
        </div>

        <div className="rounded-[8px] bg-white p-8 shadow-card">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
