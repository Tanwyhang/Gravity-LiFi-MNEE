"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { MousePointer2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

import { Safari } from "@/components/ui/shadcn-io/safari"

export function LaptopClickAnimation() {
  const [step, setStep] = useState<"link" | "loading" | "modal">("link")

  useEffect(() => {
    const cycle = async () => {
      setStep("link")
      await new Promise(r => setTimeout(r, 2500))
      setStep("loading")
      await new Promise(r => setTimeout(r, 1500))
      setStep("modal")
      await new Promise(r => setTimeout(r, 4000))
      cycle()
    }
    cycle()
  }, [])

  return (
    <div className="w-full mx-auto h-[300px] relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl blur-xl" />
      
      <div className="relative scale-90 sm:scale-100 transition-transform">
        <Safari 
          url="gravity.money/pay/8x92..."
          width={540}
          height={360}
          className="shadow-2xl"
        >
          <div className="w-full h-full bg-card/30 flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === "link" && (
                <motion.div
                  key="link"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="text-lg font-bold">Payment Request</div>
                  <div className="p-4 border border-border bg-background rounded-lg shadow-sm max-w-[200px] mx-auto group">
                    <div className="text-xs text-muted-foreground mb-1">Total Due</div>
                    <div className="text-xl font-bold mb-3">$124.50</div>
                    <div className="h-8 bg-foreground text-background rounded flex items-center justify-center text-xs font-bold gap-2">
                      PAY NOW <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Cursor Animation */}
                  <motion.div
                    initial={{ x: 100, y: 100, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 1,
                      scale: [1, 1, 0.9, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      times: [0, 0.8, 0.9, 1],
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 ml-8 mt-8 text-foreground z-50"
                  >
                    <MousePointer2 className="w-6 h-6 fill-current" />
                  </motion.div>
                </motion.div>
              )}

              {step === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <div className="text-xs font-mono text-muted-foreground">CONNECTING_WALLET...</div>
                </motion.div>
              )}

              {step === "modal" && (
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="w-[280px] bg-background border border-border rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm">Confirm Transaction</div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    
                    <div className="space-y-2 py-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-mono">0.05 ETH</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Gas Fee</span>
                        <span className="font-mono text-green-500">Low</span>
                      </div>
                    </div>

                    <div className="h-8 w-full bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold gap-2">
                      <CheckCircle2 className="w-3 h-3" /> CONFIRM
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Safari>
      </div>
    </div>
  )
}
