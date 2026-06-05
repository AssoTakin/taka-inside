import { NextRequest, NextResponse } from "next/server";
import { fetchStrapiList } from "@/lib/api";

export async function GET(_req: NextRequest) {
  const data = await fetchStrapiList("don-configs?sort[0]=ordre:asc", { revalidate: 300 });

  if (!data || data.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  const configs = data
    .filter((c: Record<string, unknown>) => c.actif !== false)
    .map((c: Record<string, unknown>) => ({
      montant: Number(c.montant || 0),
      frequence: String(c.frequence || "one-time"),
      ordre: Number(c.ordre || 0),
    }));

  return NextResponse.json(configs, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  });
}
