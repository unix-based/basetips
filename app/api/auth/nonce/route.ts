import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { generateNonce } from "siwe";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession(req, res, sessionOptions);
  const nonce = generateNonce();
  session.nonce = nonce;
  await session.save();
  return NextResponse.json({ nonce }, { headers: res.headers });
}


