import type { RecordModel } from "pocketbase";

export type JourneyLogStatus = "draft" | "private" | "public";
export type EntryStatus = "draft" | "published";

export interface User extends RecordModel {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  public_profile_slug?: string;
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
  is_featured?: boolean;
  tags?: string[];
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
  location?: string;
  show_on_map?: boolean;
  content?: Record<string, unknown>;
  status: EntryStatus;
  journey_log: string;
  user: string;
  latitude?: number;
  longitude?: number;
}

export interface Media extends RecordModel {
  file: string;
  user: string;
  caption?: string;
  location_name?: string;
  journey_log?: string;
}

export interface Tag extends RecordModel {
  name: string;
  type: "style" | "region" | "activity" | "mood";
  user?: string;
}
