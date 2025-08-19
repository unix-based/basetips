import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession(req, res, sessionOptions);
  return NextResponse.json(
    { address: session.address ?? null, chainId: session.chainId ?? null },
    { headers: res.headers }
  );
}


