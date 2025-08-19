"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

// Optional: Save wallet session to backend
async function saveWalletSession(address: string) {
  try {
    const res = await fetch("/api/auth/wallet-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to save wallet session:', error);
    return false;
  }
}

export function AuthButton(props: { onSuccess?: (address: string) => void }) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  console.log('🔍 AuthButton wallet state:', { address, isConnected });

  const handleConnect = async () => {
    console.log('🔘 AuthButton handleConnect called');
    console.log('📊 AuthButton state:', { isConnecting, isConnected, address });
    
    setIsConnecting(true);
    try {
      console.log('📞 AuthButton connecting wallet...');
      
      const connector = connectors[0];
      console.log('🔗 AuthButton using connector:', connector?.name);
      
      const result = await connectAsync({ connector });
      console.log('📥 AuthButton connect result:', result);
      
      if (result.accounts && result.accounts.length > 0) {
        console.log('✅ AuthButton wallet connected:', result.accounts[0]);
        // Save to your backend
        await saveWalletSession(result.accounts[0]);
        if (props.onSuccess) {
          console.log('🎯 AuthButton calling onSuccess callback');
          props.onSuccess(result.accounts[0]);
        }
      } else {
        console.log('❌ AuthButton wallet connection failed: no accounts');
      }
    } catch (error) {
      console.error('💥 AuthButton wallet connection error:', error);
      console.error('💥 AuthButton error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('🏁 AuthButton wallet connection finished');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    console.log('🚪 AuthButton disconnecting wallet...');
    disconnect();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">✅ {address.slice(0, 6)}...{address.slice(-4)}</span>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => {
        console.log('🖱️ AuthButton clicked');
        handleConnect();
      }}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}

export default AuthButton;


