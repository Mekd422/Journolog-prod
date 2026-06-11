import { JourneyOverviewPage } from "@/components/logs/JourneyOverviewPage";

export default async function JourneyLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="px-8 py-10 lg:px-12">
      <JourneyOverviewPage logId={id} />
    </main>
  );
}
