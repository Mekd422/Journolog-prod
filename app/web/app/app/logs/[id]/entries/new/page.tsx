import Link from "next/link";
import { EntryEditorForm } from "@/components/logs/EntryEditorForm";
import { Button } from "@/components/ui/Button";

export default async function NewEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="px-8 py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-body">Entry Editor</p>
          <h1 className="font-serif text-3xl text-text-primary">
            Write a new entry
          </h1>
        </div>
        <Link href={`/app/logs/${id}`}>
          <Button variant="ghost">Back to Journey</Button>
        </Link>
      </div>

      <EntryEditorForm journeyLogId={id} />
    </main>
  );
}
