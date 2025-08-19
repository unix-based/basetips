"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Wallet, QrCode, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import LogoComponent from './components/LogoComponent';
import SecureDashboard from './components/SecureDashboard';
import { useMiniKit, useAuthenticate, parseSignInMessage } from '@coinbase/onchainkit/minikit';

// Official Base logo component for QR generation (used in landing visuals)
const BaseLogo = ({ className }: { className?: string }) => (
  <ImageWithFallback
    src="https://www.base.org/base-square.svg"
    alt="Base Logo"
    className={className}
  />
);

interface VerifiedUser {
  fid: number;
  username?: string;
  custodyAddress?: string;
}

export default function App() {
  const { context, setFrameReady, isFrameReady } = useMiniKit();
  const { signIn } = useAuthenticate();
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  const handleConnect = useCallback(async () => {
    try {
      const result = await signIn();
      if (result === false) return;
      // Parse signed message to get the verified address (SIWE-like)
      const parsed = parseSignInMessage(result.message);
      const fid = context?.user?.fid;
      if (typeof fid === 'number') {
        setVerifiedUser({ fid, custodyAddress: parsed.address });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Authentication failed', error);
    }
  }, [signIn, context?.user?.fid]);

  // Public landing (unauthenticated)
  if (!verifiedUser) {
    const analyticsFid = context?.user?.fid; // For analytics only; DO NOT use as primary auth

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogoComponent className="w-8 h-8 font-bold" />
            </div>
            <Button onClick={handleConnect} className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Generate QR Stickers for Crypto Tips
            </h1>
            <p className="mb-8 text-muted-foreground max-w-2xl mx-auto">
              Create custom QR codes for your tables, counters, and service areas. Let customers tip you directly with cryptocurrency through a simple scan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleConnect} className="flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
            {/* Optional non-sensitive analytics using context */}
            {analyticsFid ? (
              <p className="mt-4 text-xs text-muted-foreground">Analytics FID (non-auth): {analyticsFid}</p>
            ) : null}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Generate QR Codes</CardTitle>
                <CardDescription>
                  Create unique QR codes for each location in your business
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Receive Tips</CardTitle>
                <CardDescription>
                  Accept tips in various cryptocurrencies directly to your wallet
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Track Performance</CardTitle>
                <CardDescription>
                  Monitor tip amounts and engagement for each QR code
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated (cryptographically verified) state
  return <SecureDashboard verifiedFid={verifiedUser.fid} user={verifiedUser} />;
}