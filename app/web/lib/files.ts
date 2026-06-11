import { pb } from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

export function getFileUrl(
  record: RecordModel,
  filename: string,
  options?: { thumb?: string }
): string {
  if (!filename) return "";
  return pb.files.getURL(record, filename, options);
}
