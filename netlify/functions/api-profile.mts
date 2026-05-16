import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const clientId = url.searchParams.get("clientId");
    if (!clientId) return Response.json({ error: "clientId required" }, { status: 400 });

    const [profile] = await db.select().from(profiles).where(eq(profiles.id, clientId));
    return Response.json(profile ?? null);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { clientId, companyName = "", industry = "", hrEmail = "", city = "" } = body;
    if (!clientId) return Response.json({ error: "clientId required" }, { status: 400 });

    const [existing] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, clientId));

    if (existing) {
      const [updated] = await db
        .update(profiles)
        .set({ companyName, industry, hrEmail, city, updatedAt: new Date() })
        .where(eq(profiles.id, clientId))
        .returning();
      return Response.json(updated);
    } else {
      const [created] = await db
        .insert(profiles)
        .values({ id: clientId, companyName, industry, hrEmail, city })
        .returning();
      return Response.json(created, { status: 201 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/profile",
};
