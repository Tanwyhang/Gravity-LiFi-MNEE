"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PaymentModal } from "@/components/PaymentModal";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";
import { parseUrlThemeParams } from "@/lib/themes";

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Parse theme parameters from URL using the theme system
  const urlConfig = parseUrlThemeParams(searchParams);

  // Generate demo URL for Gravity theme
  const generateDemoUrl = () => {
    const demoTheme = {
      primaryColor: '#243370',
      backgroundColor: '#d6fffa',
      textColor: '#000000',
      borderColor: '#030303',
      borderRadius: 17,
      buttonStyle: 'solid' as const,
      tokenSymbol: 'ETH',
      tokenAmount: '0.05',
      merchantName: 'GRAVITY_PAY',
      transactionId: '#DEMO123',
      customTitle: 'PAY_WITH_CRYPTO',
      recipientAddress: '0x0ce3580766DcdDAf281DcCE968885A989E9B0e99',
      showTransactionId: true,
      animation: 'pulse' as const,
      usdAmount: '124.50'
    };

    const params = new URLSearchParams();
    Object.entries(demoTheme).forEach(([key, value]) => {
      if (value !== undefined && key !== 'usdAmount') {
        params.set(key, value.toString());
      }
    });

    return `/pay/demo?${params.toString()}`;
  };

  console.log('Demo URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/dvhtzhe?primaryColor=%23243370&backgroundColor=%23d6fffa&textColor=%23000000&borderColor=%23030303&borderRadius=17&buttonStyle=solid&tokenSymbol=ETH&tokenAmount=0.05&merchantName=GRAVITY_PAY&transactionId=%23DEMO123&customTitle=PAY_WITH_CRYPTO&recipientAddress=0x0ce3580766DcdDAf281DcCE968885A989E9B0e99&showTransactionId=true&animation=pulse&usdAmount=124.50&customThumbnail=`);

  return (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
        <PaymentModal
            isOpen={isOpen}
            onClose={() => {}}
            amountUSD={searchParams.get('usdAmount') || "124.50"}
            eventId={params.id as string}
            config={urlConfig}
        />
    </div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      <AuroraBackground className="min-h-screen h-auto bg-background dark:bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentContent />
        </Suspense>
      </AuroraBackground>
    </div>
  );
}
