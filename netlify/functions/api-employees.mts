import type { Config, Context } from "@netlify/functions";
import { db } from "../../db/index.js";
import { profiles, employees } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

async function ensureProfile(clientId: string) {
  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, clientId));
  if (!existing) {
    try {
      await db.insert(profiles).values({ id: clientId });
    } catch {
      // Profile was concurrently created — that's fine
    }
  }
}

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const clientId = url.searchParams.get("clientId");
    if (!clientId) return Response.json({ error: "clientId required" }, { status: 400 });

    const emps = await db
      .select()
      .from(employees)
      .where(eq(employees.profileId, clientId));
    return Response.json(emps);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { clientId, name, email } = body;
    if (!clientId || !name || !email) {
      return Response.json({ error: "clientId, name, and email required" }, { status: 400 });
    }

    await ensureProfile(clientId);

    const [existing] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(and(eq(employees.profileId, clientId), eq(employees.email, email)));

    if (existing) {
      return Response.json({ error: "Employee already exists" }, { status: 409 });
    }

    const [emp] = await db
      .insert(employees)
      .values({ profileId: clientId, name, email })
      .returning();
    return Response.json(emp, { status: 201 });
  }

  if (req.method === "DELETE") {
    const clientId = url.searchParams.get("clientId");
    const email = url.searchParams.get("email");
    if (!clientId || !email) {
      return Response.json({ error: "clientId and email required" }, { status: 400 });
    }

    await db
      .delete(employees)
      .where(and(eq(employees.profileId, clientId), eq(employees.email, email)));
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/employees",
};
