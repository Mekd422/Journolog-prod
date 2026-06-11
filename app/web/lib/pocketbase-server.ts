import PocketBase from "pocketbase";

export function createServerPocketBase() {
  return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
}
