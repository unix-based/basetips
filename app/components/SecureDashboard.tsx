"use client";

import React, { useMemo } from 'react';
import { Plus, QrCode, Eye, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import LogoComponent from './LogoComponent';

type VerifiedUser = {
  fid: number;
  username?: string;
  custodyAddress?: string;
};

interface SecureDashboardProps {
  verifiedFid: number;
  user: VerifiedUser;
}

const mockQRCodes = [
  { id: 1, name: "Table 1", totalTips: "0.25 ETH", status: "active" },
  { id: 2, name: "Table 2", totalTips: "0.18 ETH", status: "active" },
  { id: 3, name: "Counter", totalTips: "0.42 ETH", status: "active" },
];

export default function SecureDashboard(props: SecureDashboardProps) {
  const { verifiedFid, user } = props;

  const userInitials = useMemo(() => {
    if (user?.username && user.username.length > 0) return user.username[0]?.toUpperCase();
    return 'U';
  }, [user?.username]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LogoComponent className="w-8 h-8 font-bold" />
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Authenticated
            </Badge>
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted-foreground">Welcome! Verified FID: {verifiedFid}</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create QR Code
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">0.85 ETH</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">3</div>
                  <p className="text-xs text-muted-foreground">Across all locations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg. Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">0.002 ETH</div>
                  <p className="text-xs text-muted-foreground">≈ $4.80</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tips</CardTitle>
                <CardDescription>Latest tips received across all QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { location: "Table 1", amount: "0.005 ETH", time: "2 minutes ago" },
                    { location: "Counter", amount: "0.003 ETH", time: "15 minutes ago" },
                    { location: "Table 2", amount: "0.008 ETH", time: "1 hour ago" },
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{tip.location}</p>
                          <p className="text-sm text-muted-foreground">{tip.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tip.amount}</p>
                        <p className="text-sm text-muted-foreground">≈ $12.50</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6">
            <div className="grid gap-6">
              {mockQRCodes.map((qr) => (
                <Card key={qr.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{qr.name}</h3>
                          <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                            {qr.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{qr.totalTips}</p>
                        <p className="text-sm text-muted-foreground">Total tips</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

 