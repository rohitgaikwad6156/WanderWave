import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { profiles, paymentRecords } from "../../db/schema.js";
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

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const clientId = url.searchParams.get("clientId");
    const destId = url.searchParams.get("destId");
    const startDate = url.searchParams.get("startDate");

    if (!clientId || !destId || !startDate) {
      return Response.json({ error: "clientId, destId, and startDate required" }, { status: 400 });
    }

    const records = await db
      .select()
      .from(paymentRecords)
      .where(
        and(
          eq(paymentRecords.profileId, clientId),
          eq(paymentRecords.destId, destId),
          eq(paymentRecords.startDate, startDate),
        ),
      )
      .orderBy(desc(paymentRecords.createdAt));

    return Response.json(records[0] ?? null);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { clientId, destId, startDate, ref, amount, paidAt } = body;

    if (!clientId || !destId || !startDate || !ref || !paidAt) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ensureProfile(clientId);

    const [record] = await db
      .insert(paymentRecords)
      .values({
        profileId: clientId,
        destId,
        startDate,
        ref,
        amount: amount || 0,
        paidAt,
        isPaid: true,
      })
      .returning();

    return Response.json(record, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/payments",
};
