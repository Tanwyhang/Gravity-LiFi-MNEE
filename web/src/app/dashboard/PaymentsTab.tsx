"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Trash2, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCode } from "@/components/ui/shadcn-io/qr-code";
import { QRDownload } from "@/components/ui/qr-download";

interface PaymentLink {
  id: string;
  url: string;
  createdAt: string;
  creatorAddress?: string;
  config: {
    tokenSymbol: string;
    usdAmount: string;
    merchantName: string;
    customTitle: string;
  };
  totalEarnings: number;
}

export function PaymentsTab() {
  const { address } = useAccount();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [selectedQrLink, setSelectedQrLink] = useState<PaymentLink | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLinks = () => {
      try {
        const storedLinks = localStorage.getItem('createdPaymentLinks');
        if (storedLinks) {
          setLinks(JSON.parse(storedLinks));
        }
      } catch (error) {
        console.error("Failed to load payment links", error);
      }
    };

    loadLinks();
    
    // Listen for storage events to update real-time if changed in another tab
    window.addEventListener('storage', loadLinks);
    return () => window.removeEventListener('storage', loadLinks);
  }, []);

  const handleDelete = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('createdPaymentLinks', JSON.stringify(updatedLinks));
    toast.success("Payment link removed from history");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const filteredLinks = useMemo(() => {
    if (!address) return [];
    return links.filter(link => 
      link.creatorAddress && link.creatorAddress.toLowerCase() === address.toLowerCase()
    );
  }, [links, address]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Payment Links</h3>

      </div>



      {filteredLinks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-muted-foreground text-center">No payment links created yet.</p>
            <Link href="/create">
              <Button>Create New Link</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLinks.slice(0, 5).map((link) => (
            <Card key={link.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{link.config.customTitle || "Payment Link"}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {link.config.tokenSymbol}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-mono text-muted-foreground truncate max-w-[300px]">
                      {link.url}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium text-muted-foreground">Total Earnings</div>
                      <div className="text-lg font-bold text-primary">
                        {link.totalEarnings} MNEE
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedQrLink(link)}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.url)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Link href={link.url} target="_blank">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedQrLink} onOpenChange={(open) => !open && setSelectedQrLink(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div ref={qrCodeRef} className="p-4 bg-white rounded-xl border shadow-sm">
               {selectedQrLink && (
                 <QRCode
                   data={selectedQrLink.url}
                   size={200}
                   logo="/logo.png"
                   logoSize={40}
                 />
               )}
            </div>
            {selectedQrLink && (
                <QRDownload
                    qrCodeRef={qrCodeRef}
                    transactionHash={selectedQrLink.id}
                    amount={selectedQrLink.config.usdAmount}
                    tokenSymbol={selectedQrLink.config.tokenSymbol}
                />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
