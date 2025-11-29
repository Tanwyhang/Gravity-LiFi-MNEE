"use client";

import { useState } from "react";
import { Terminal, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link"

// Assuming these are local components that need to be imported
import { PaymentsTab } from "./PaymentsTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { SwapTab } from "./SwapTab";

import dynamic from "next/dynamic";

const WalletConnectButton = dynamic(
  () => import("@/components/WalletConnectButton").then((mod) => mod.WalletConnectButton),
  { ssr: false }
);

export default function Page() {
  const [activeTab, setActiveTab] = useState("payments");

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background flex flex-col">
      


      {/* Dashboard Content */}
      <main className="flex-1 space-y-8 p-8 pt-6 container mx-auto">
        {activeTab === 'analytics' && (
          <div className="flex items-center space-x-2">
            
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b border-border pb-4">
          <Button 
            variant={activeTab === "payments" ? "secondary" : "ghost"} 
            className="rounded-full px-6"
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </Button>
          <Button 
            variant={activeTab === "analytics" ? "secondary" : "ghost"} 
            className="rounded-full px-6"
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Button>
          <Button 
            variant={activeTab === "swap" ? "secondary" : "ghost"} 
            className="rounded-full px-6"
            onClick={() => setActiveTab("swap")}
          >
            Swap
          </Button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "payments" && <PaymentsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "swap" && <SwapTab />}
        </div>
      </main>
    </div>
  )
}
