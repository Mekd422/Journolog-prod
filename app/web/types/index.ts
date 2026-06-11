import type { RecordModel } from "pocketbase";

export type JourneyLogStatus = "draft" | "private" | "public";
export type EntryStatus = "draft" | "published";

export interface User extends RecordModel {
  name: string;
  email: string;
  avatar?: string;
}

export interface JourneyLog extends RecordModel {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  country_region?: string;
  cover?: string;
  slug: string;
  status: JourneyLogStatus;
  user: string;
}

export interface Entry extends RecordModel {
  title: string;
  entry_date: string;
  location?: string;
  show_on_map?: boolean;
  content?: Record<string, unknown>;
  status: EntryStatus;
  journey_log: string;
  user: string;
}

export interface Media extends RecordModel {
  file: string;
  user: string;
}
