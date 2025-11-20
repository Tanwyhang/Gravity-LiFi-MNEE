"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Scan, CheckCircle2, Smartphone, QrCode } from "lucide-react"

import { Iphone15Pro } from "@/components/ui/shadcn-io/iphone-15-pro"

export function QrScanAnimation() {
  const [step, setStep] = useState<"scan" | "pay">("scan")

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev === "scan" ? "pay" : "scan"))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto h-[300px] relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl blur-xl" />
      
      {/* Phone Frame */}
      <div className="relative scale-75 sm:scale-90 transition-transform">
        <Iphone15Pro 
          width={300} 
          height={420}
          className=""
        >
          <div className="w-full h-full bg-card/50 relative flex flex-col items-center justify-center p-6 pt-16">
            <AnimatePresence mode="wait">
              {step === "scan" ? (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.00, 0.32, 0.20, 1.00] }}
                  className="flex flex-col items-center gap-6 w-full"
                >
                  <div className="text-sm font-bold text-muted-foreground tracking-widest">SCAN_QR_CODE</div>
                  
                  <div className="relative w-48 h-48 bg-white p-8 rounded-xl overflow-hidden">
                    <QrCode className="w-full h-full text-black" />

                    {/* Scanning Line */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: [0.00, 0.32, 0.20, 1.00] }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Scan className="w-4 h-4 animate-pulse" />
                    <span>Detecting Gravity Protocol...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="pay"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.00, 0.32, 0.20, 1.00] }}
                  className="w-full bg-card border border-border rounded-xl p-4 shadow-lg space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      </div>
                      <span className="font-bold text-xs">PAYMENT_REQ</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>

                  <div className="text-center py-2">
                    <div className="text-2xl font-bold">0.05 ETH</div>
                    <div className="text-xs text-muted-foreground">≈ $124.50 USD</div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-8 w-full bg-foreground text-background rounded flex items-center justify-center text-xs font-bold">
                      CONFIRM
                    </div>
                    <div className="h-8 w-full border border-border rounded flex items-center justify-center text-xs">
                      CANCEL
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Iphone15Pro>
      </div>
    </div>
  )
}
