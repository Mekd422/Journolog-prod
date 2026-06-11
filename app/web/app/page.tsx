import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <span className="font-serif text-xl">journolog</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-text-body hover:text-text-primary">
            Log In
          </Link>
          <Link href="/signup">
            <Button>Start Your Log</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-serif text-5xl leading-tight text-text-primary">
            Your travel memories, beautifully kept and effortlessly shared.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-body">
            A calm space to write, reflect, and share your journeys — one entry
            at a time.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">Create a Free Journal</Button>
          </Link>
        </div>
        <div className="rounded-[8px] bg-primary/10 p-10 shadow-card">
          <p className="font-serif text-2xl text-primary">
            Begin your next chapter with a journal that feels as unhurried as
            the road itself.
          </p>
        </div>
      </section>
    </main>
  );
}
