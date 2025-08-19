import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SiweMessage } from "siwe";

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession(req, res, sessionOptions);
  const { message, signature } = await req.json();
  try {
    const siweMessage = new SiweMessage(message);
    const { data } = await siweMessage.verify({ signature, nonce: session.nonce });
    session.address = data.address as `0x${string}`;
    session.chainId = Number(data.chainId);
    session.nonce = undefined;
    await session.save();
    return NextResponse.json({ ok: true, address: session.address, chainId: session.chainId }, { headers: res.headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid SIWE" }, { status: 400, headers: res.headers });
  }
}


