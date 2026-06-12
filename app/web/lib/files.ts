import { pb } from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

export function getFileUrl(
  record: RecordModel,
  filename: string,
  options?: { thumb?: string }
): string {
  if (!filename || !record) return "";
  
  try {
    const url = pb.files.getURL(record, filename, options);
    return url || "";
  } catch (error) {
    console.error("Error generating file URL:", { filename, record: record.id, error });
    return "";
  }
}
