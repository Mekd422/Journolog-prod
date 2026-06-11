import Link from "next/link";
import { Compass } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-2xl">journolog</span>
          </Link>
          <h1 className="mt-6 font-serif text-3xl text-text-primary">
            Start your journal
          </h1>
          <p className="mt-2 text-sm text-text-body">
            Create a free account and begin capturing your travels.
          </p>
        </div>

        <div className="rounded-[8px] bg-white p-8 shadow-card">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
