import type { Config, Context } from "@netlify/functions";
import { db } from "../../db/index.js";
import { profiles, tripPlans } from "../../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

async function ensureProfile(clientId: string) {
  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, clientId));
  if (!existing) {
    try {
      await db.insert(profiles).values({ id: clientId });
    } catch {
      // Concurrent insert — fine
    }
  }
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const pathId = context.params?.id;

  if (req.method === "GET") {
    const clientId = url.searchParams.get("clientId");
    if (!clientId) return Response.json({ error: "clientId required" }, { status: 400 });

    const plans = await db
      .select()
      .from(tripPlans)
      .where(eq(tripPlans.profileId, clientId))
      .orderBy(desc(tripPlans.createdAt));
    return Response.json(plans);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { clientId, ...planData } = body;
    if (!clientId) return Response.json({ error: "clientId required" }, { status: 400 });

    await ensureProfile(clientId);

    const id = String(planData.id || Date.now());
    const values = {
      id,
      profileId: clientId,
      dest: planData.dest || "",
      destId: planData.destId || "",
      destEmoji: planData.destEmoji || "✈️",
      route: planData.route || "",
      days: planData.days || 1,
      startDate: planData.startDate || "",
      teamSize: planData.teamSize || 10,
      sentTo: planData.sentTo || 0,
      dayPlans: planData.dayPlans || {},
      routeDetails: planData.routeDetails || {},
      company: planData.company || "",
      date: planData.date || "",
    };

    const [existing] = await db
      .select({ id: tripPlans.id })
      .from(tripPlans)
      .where(and(eq(tripPlans.id, id), eq(tripPlans.profileId, clientId)));

    let result;
    if (existing) {
      const { id: _id, profileId: _pid, ...updateFields } = values;
      [result] = await db
        .update(tripPlans)
        .set(updateFields)
        .where(eq(tripPlans.id, id))
        .returning();
    } else {
      [result] = await db.insert(tripPlans).values(values).returning();
    }

    return Response.json({
      ...result,
      dayPlans: result.dayPlans ?? {},
      routeDetails: result.routeDetails ?? {},
    }, { status: 201 });
  }

  if (req.method === "DELETE") {
    const clientId = url.searchParams.get("clientId");
    const planId = pathId ?? url.searchParams.get("id");
    if (!clientId || !planId) {
      return Response.json({ error: "clientId and plan id required" }, { status: 400 });
    }

    await db
      .delete(tripPlans)
      .where(and(eq(tripPlans.profileId, clientId), eq(tripPlans.id, planId)));
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/plans", "/api/plans/:id"],
};
