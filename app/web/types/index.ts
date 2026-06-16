import type { RecordModel } from "pocketbase";

export type JourneyLogStatus = "draft" | "private" | "public" | "archived";
export type EntryStatus = "draft" | "published";

export interface User extends RecordModel {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  public_profile_slug?: string;
  plan?: "free" | "premium";
}

export interface JourneyLog extends RecordModel {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  country?: string;
  region?: string;
  cover_image?: string;
  slug: string;
  status: JourneyLogStatus;
  user: string;
  is_featured?: boolean;
  tags?: string[];
  view_count?: number;
}

export interface MapboxLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Entry extends RecordModel {
  title: string;
  entry_date: string;
  end_date?: string;
  location_name?: string;
  show_on_map?: boolean;
  body_json?: Record<string, unknown>;
  body_html?: string;
  status: EntryStatus;
  journey_log: string;
  user: string;
  latitude?: number;
  longitude?: number;
  posted_via?: "web" | "email";
}

export interface Media extends RecordModel {
  file: string;
  user: string;
  journey_log: string;
  entry?: string;
  type: "image" | "video";
  caption?: string;
  alt_text?: string;
  taken_at?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  sort_order?: number;
}

export interface Tag extends RecordModel {
  name: string;
  slug: string;
  type: "style" | "region" | "activity" | "mood";
}

export interface SavedLog extends RecordModel {
  user: string;
  journey_log: string;
}

