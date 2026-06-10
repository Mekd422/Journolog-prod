import { pb } from "@/lib/pocketbase";

export default async function TestPage() {
  const records = await pb.collection("journey_logs").getList();

  return (
    <pre>
      {JSON.stringify(records, null, 2)}
    </pre>
  );
}