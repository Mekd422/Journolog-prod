import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-text-primary">Not found</h1>
        <p className="mt-3 text-text-body">
          This page doesn&apos;t exist or is not publicly available.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go Home</Button>
        </Link>
      </div>
    </main>
  );
}
