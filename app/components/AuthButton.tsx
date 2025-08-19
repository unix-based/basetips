"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

async function fetchNonce() {
  const res = await fetch("/api/auth/nonce");
  const data = await res.json();
  return data.nonce as string;
}

async function verify(message: string, signature: string) {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  return res.ok;
}

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export function AuthButton(props: { onSuccess?: (address: string) => void }) {
  const { connectAsync, connectors, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setSessionAddress(data.address);
    })();
  }, []);

  const handleConnectAndSign = async () => {
    try {
      setIsLoading(true);
      let activeAddress = address;
      if (!activeAddress) {
        const connector = connectors.find((c) => c.id === injected().id) ?? connectors[0];
        const { accounts } = await connectAsync({ connector });
        activeAddress = accounts[0] as `0x${string}`;
      }
      const chainId = 8453; // Base mainnet
      const nonce = await fetchNonce();
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: activeAddress!,
        statement: "Sign in with Ethereum to basetips",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      // Request signature via EIP-1193
      const messageToSign = siweMessage.prepareMessage();
      const signature = (await window.ethereum.request({
        method: "personal_sign",
        params: [messageToSign, activeAddress],
      })) as string;
      const ok = await verify(messageToSign, signature);
      const nextAddress = ok ? activeAddress : null;
      setSessionAddress(nextAddress ?? null);
      if (ok && nextAddress && props.onSuccess) props.onSuccess(nextAddress);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSessionAddress(null);
    disconnect();
  };

  if (sessionAddress) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{sessionAddress.slice(0, 6)}…{sessionAddress.slice(-4)}</span>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnectAndSign} disabled={isLoading || connectStatus === "pending"}>
      {isLoading ? "Signing…" : "Connect & Sign-In"}
    </Button>
  );
}

export default AuthButton;


