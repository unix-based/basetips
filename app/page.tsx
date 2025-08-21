"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, QrCode, DollarSign, Users, ArrowRight, Plus, Trash2, Printer, ShoppingCart } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import LogoComponent from './components/LogoComponent';
import QRSticker from './components/QRSticker';
import QRCodeGenerator from './components/QRCodeGenerator';
import { printQRSticker } from './utils/print-sticker';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Mock data
const mockQRCodes = [
  { id: 1, name: "Table 1", totalTips: "0.25 ETH", status: "active" },
  { id: 2, name: "Table 2", totalTips: "0.18 ETH", status: "active" },
  { id: 3, name: "Counter", totalTips: "0.42 ETH", status: "active" },
];


// QR Code Sticker Preview Component - now using real QR codes
const QRStickerPreview = ({ locationName, address }: { locationName: string; address?: string }) => {
  // Use a demo address if no wallet is connected
  const demoAddress = "0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4";
  const qrAddress = address || demoAddress;
  
  return (
    <QRSticker 
      address={qrAddress}
      locationName={locationName || "Location Name"}
      size="medium"
    />
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [locationName, setLocationName] = useState('');
  const [customWalletAddress, setCustomWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<{
    id: number;
    name: string;
    address: string;
    totalTips: string;
    status: string;
    createdAt: string;
  }[]>([]);
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    quantity: 1,
    selectedQRId: null as number | null,
    selectedQRName: ''
  });
  
  // MiniKit hooks
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  
  // Wallet hooks
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  console.log('🔍 MiniKit state:', { isFrameReady, context });
  console.log('🔍 Wallet state:', { address, isConnected });
  console.log('🌍 Environment check:', {
    isClient: typeof window !== 'undefined',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    location: typeof window !== 'undefined' ? window.location.href : 'server'
  });

  // Initialize MiniKit frame
  useEffect(() => {
    console.log('🚀 Initializing MiniKit frame...');
    if (!isFrameReady) {
      setFrameReady();
      console.log('✅ Frame ready set');
    }
  }, [setFrameReady, isFrameReady]);

  const connectWallet = async () => {
    console.log('🔘 connectWallet function called');
    console.log('📊 Current state:', { 
      address, 
      isConnected, 
      isConnecting, 
      currentView,
      isFrameReady 
    });

    // If wallet is already connected, just go to dashboard
    if (isConnected && address) {
      console.log('✅ Wallet already connected, navigating to dashboard');
      setCurrentView('dashboard');
      return;
    }

    console.log('🔐 Starting wallet connection process...');
    setIsConnecting(true);
    
    try {
      console.log('📞 Attempting to connect wallet...');
      
      // Use the first available connector
      const connector = connectors[0];
      console.log('🔗 Using connector:', connector?.name);
      console.log('🔗 Available connectors:', connectors.map(c => c.name));
      
      const result = await connectAsync({ connector });
      console.log('📥 Connect result:', result);
      
      if (result.accounts && result.accounts.length > 0) {
        console.log('✅ Wallet connected successfully:', result.accounts[0]);
        setCurrentView('dashboard');
        console.log('🏠 Navigated to dashboard');
      } else {
        console.log('❌ Wallet connection failed: no accounts returned');
      }
    } catch (error) {
      console.error('💥 Wallet connection error:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('🏁 Wallet connection process finished');
      setIsConnecting(false);
    }
  };

  const handleOrderSubmit = () => {
    // Handle order submission
    alert(`Order placed!\n\nName: ${orderForm.name}\nPhone: ${orderForm.phone}\nSticker: ${orderForm.selectedQRName}\nQuantity: ${orderForm.quantity}\n\nYou will be contacted soon for payment and shipping details.`);
    
    // Reset form
    setOrderForm({
      name: '',
      phone: '',
      quantity: 1,
      selectedQRId: null,
      selectedQRName: ''
    });
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogoComponent className="w-8 h-8 font-bold" />
            </div>
            <Button 
              onClick={() => {
                console.log('🖱️ Header button clicked');
                console.log('🔧 Button disabled state:', isConnecting);
                console.log('🔧 Wallet connected:', isConnected);
                connectWallet();
              }} 
              disabled={isConnecting}
              className="flex items-center gap-2"
              style={{ pointerEvents: 'auto', zIndex: 1000 }}
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? 'Connecting...' : isConnected ? 'Dashboard' : 'Connect Wallet'}
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
              <Button 
                size="lg" 
                onClick={() => {
                  console.log('🖱️ Hero button clicked');
                  console.log('🔧 Button disabled state:', isConnecting);
                  console.log('🔧 Wallet connected:', isConnected);
                  connectWallet();
                }} 
                disabled={isConnecting}
                className="flex items-center gap-2"
                style={{ pointerEvents: 'auto', zIndex: 1000 }}
              >
                {isConnecting ? 'Connecting...' : isConnected ? 'Go to Dashboard' : 'Get Started'} 
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
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

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogoComponent className="w-8 h-8 font-bold" />
            </div>
            <div className="flex items-center gap-4">
              {isConnected && address && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Wallet Connected
                  </Badge>
                  <Avatar>
                    <AvatarFallback>{address.slice(0, 4)}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🚪 Disconnecting wallet...');
                      disconnect();
                      setCurrentView('landing');
                    }}
                  >
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1>Dashboard</h1>
              <p className="text-muted-foreground">Manage your QR codes and track tips</p>
            </div>
            <Button onClick={() => setCurrentView('create')} className="flex items-center gap-2">
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
                {/* Show generated QR codes first */}
                {generatedQRCodes.map((qr) => (
                  <Card key={qr.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                          <QRCodeGenerator 
                            address={qr.address || address || "0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4"}
                            size={56}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{qr.name}</h3>
                              <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                {qr.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {qr.address?.slice(0, 8)}...{qr.address?.slice(-6)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{qr.totalTips}</p>
                              <p className="text-sm text-muted-foreground">Total tips</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                await printQRSticker(
                                  qr.address || address || "0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4",
                                  qr.name
                                );
                              }}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setOrderForm(prev => ({
                                      ...prev,
                                      selectedQRId: qr.id,
                                      selectedQRName: qr.name
                                    }));
                                  }}
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Order Physical Stickers</DialogTitle>
                                  <DialogDescription>
                                    Order physical stickers for &ldquo;{qr.name}&rdquo;. Fill out your details below.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="order-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="order-name"
                                      value={orderForm.name}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                                      className="col-span-3"
                                      placeholder="Your full name"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="order-phone" className="text-right">
                                      Phone
                                    </Label>
                                    <Input
                                      id="order-phone"
                                      value={orderForm.phone}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                                      className="col-span-3"
                                      placeholder="+1 234 567 8900"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="order-quantity" className="text-right">
                                      Quantity
                                    </Label>
                                    <Input
                                      id="order-quantity"
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={orderForm.quantity}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogTrigger>
                                  <Button 
                                    onClick={handleOrderSubmit}
                                    disabled={!orderForm.name || !orderForm.phone || orderForm.quantity < 1}
                                  >
                                    Place Order
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setGeneratedQRCodes(prev => prev.filter(item => item.id !== qr.id));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Show mock QR codes */}
                {mockQRCodes.map((qr) => (
                  <Card key={qr.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                          <QRCodeGenerator 
                            address={address || "0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4"}
                            size={56}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{qr.name}</h3>
                              <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                {qr.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">Demo QR Code</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{qr.totalTips}</p>
                              <p className="text-sm text-muted-foreground">Total tips</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                await printQRSticker(
                                  address || "0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4",
                                  qr.name
                                );
                              }}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setOrderForm(prev => ({
                                      ...prev,
                                      selectedQRId: qr.id,
                                      selectedQRName: qr.name
                                    }));
                                  }}
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Order Physical Stickers</DialogTitle>
                                  <DialogDescription>
                                    Order physical stickers for &ldquo;{qr.name}&rdquo;. Fill out your details below.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="mock-order-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="mock-order-name"
                                      value={orderForm.name}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                                      className="col-span-3"
                                      placeholder="Your full name"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="mock-order-phone" className="text-right">
                                      Phone
                                    </Label>
                                    <Input
                                      id="mock-order-phone"
                                      value={orderForm.phone}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                                      className="col-span-3"
                                      placeholder="+1 234 567 8900"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="mock-order-quantity" className="text-right">
                                      Quantity
                                    </Label>
                                    <Input
                                      id="mock-order-quantity"
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={orderForm.quantity}
                                      onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogTrigger>
                                  <Button 
                                    onClick={handleOrderSubmit}
                                    disabled={!orderForm.name || !orderForm.phone || orderForm.quantity < 1}
                                  >
                                    Place Order
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogoComponent className="w-8 h-8 font-bold" />
            </div>
            <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1>Create QR Code</h1>
            <p className="text-muted-foreground">Generate a new QR code for tip collection</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Details</CardTitle>
                <CardDescription>Configure your QR code settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Table 1, Front Counter, Bar Area" 
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input 
                    id="wallet" 
                    placeholder="0x... or connect wallet" 
                    value={customWalletAddress || address || ""} 
                    onChange={(e) => setCustomWalletAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {address ? "Connected wallet address is shown. You can override it above." : "Enter a wallet address or connect your wallet."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" placeholder="Additional information for customers" />
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const targetAddress = customWalletAddress || address;
                      if (locationName && targetAddress) {
                        const newQR = {
                          id: Date.now(),
                          name: locationName,
                          address: targetAddress,
                          totalTips: "0.00 ETH",
                          status: "active",
                          createdAt: new Date().toISOString()
                        };
                        setGeneratedQRCodes(prev => [...prev, newQR]);
                        setLocationName('');
                        setCustomWalletAddress('');
                        setCurrentView('dashboard');
                      }
                    }}
                    disabled={!locationName || (!customWalletAddress && !address)}
                  >
                    Generate QR Code
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Sticker Preview</CardTitle>
                <CardDescription>This is how your QR code sticker will look</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-8">
                <QRStickerPreview 
                  locationName={locationName || "Location Name"} 
                  address={customWalletAddress || address}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}