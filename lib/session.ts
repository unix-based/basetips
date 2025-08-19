import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  cookieName: "basetips_siwe",
  password: process.env.IRON_SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    address?: `0x${string}`;
    chainId?: number;
  }
}


