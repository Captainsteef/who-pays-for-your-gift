import { getStore } from "@netlify/blobs";

// GET -> { count }, POST -> records one click, then { count }
// One blob per click, so simultaneous clicks never overwrite each other.
// ponytail: count = listing all blobs; fine for thousands, switch to a DB counter for millions
export default async (req) => {
  const store = getStore({ name: "impact-clicks", consistency: "strong" });
  if (req.method === "POST") await store.set(crypto.randomUUID(), "1");
  let count = 0;
  for await (const page of store.list({ paginate: true })) count += page.blobs.length;
  return Response.json({ count });
};
