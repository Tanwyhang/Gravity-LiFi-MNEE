"use client";

import { Terminal, CreditCard, QrCode, Zap, ExternalLink, Globe, Percent, Coins, Wallet, ShieldCheck } from "lucide-react"
import { TokenETH, TokenUNI, TokenARB, TokenUSDC, TokenUSDT, TokenDAI } from "@web3icons/react"
import Image from "next/image"
import Link from "next/link"
import PixelBlast from '@/components/PixelBlast';
import { QrScanAnimation } from "@/components/QrScanAnimation"
import { LaptopClickAnimation } from "@/components/LaptopClickAnimation"
import { IntroAnimation } from "@/components/IntroAnimation"
import GradientText from '@/components/GradientText';
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentModalConfig } from "@/components/PaymentModal"
import { QRCode } from "@/components/ui/shadcn-io/qr-code"
import { useAccount } from 'wagmi'
import dynamic from "next/dynamic";

const PaymentModal = dynamic(
  () => import("@/components/PaymentModal").then((mod) => mod.PaymentModal),
  { ssr: false }
);

const WalletConnectButton = dynamic(
  () => import("@/components/WalletConnectButton").then((mod) => mod.WalletConnectButton),
  { ssr: false }
);

export default function Home() {
  const { isConnected } = useAccount()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 800])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 700])

  const demoPaymentUrl = "https://gravity-mnee.vercel.app/pay/vlftnqm?pc=%230101fe&bg=%23fbf1e6&tc=%23000000&bc=%230101fe&br=12&bs=solid&ts=ETH&ta=401.6060&mn=GRAVITY_PAY&ti=%23DEMO123&ct=PAY_WITH_CRYPTO&ra=0xdf0BaFEe53Fd2A5a7dF8bA31763d2E6963381e64&st=true&an=pulse&ua=999999&th=https%3A%2F%2Fmwtzwo37egeya3fd.public.blob.vercel-storage.com%2Fbg-IAWQjd3lCjlaZvgFOcnBExt0jhlzOj.jpeg";

  const modalConfigsWithThumbnail: PaymentModalConfig[] = [
    {
      primaryColor: "#f97316", // Orange
      backgroundColor: "#fff7ed", // Pale Orange
      textColor: "#000000",
      borderColor: "#c2410c",
      borderRadius: 16,
      buttonStyle: "glow",
      tokenSymbol: "ETH",
      tokenAmount: "0.05",
      merchantName: "CHARITY_FUND",
      transactionId: "#DONATE-001",
      customTitle: "DONATE_LOVE",
      recipientAddress: "0x123...abc",
      showTransactionId: true,
      animation: "pulse",
      customThumbnail: "/Memes/kaijukingz-nft-collectibles.gif"
    },
    {
      primaryColor: "#243370", // Walrus Theme
      backgroundColor: "#d6fffa",
      textColor: "#000000",
      borderColor: "#030303",
      borderRadius: 17,
      buttonStyle: "solid",
      tokenSymbol: "USDC",
      tokenAmount: "50.00",
      merchantName: "CONCERT_TIX",
      transactionId: "#TICKET-882",
      customTitle: "VIP_ACCESS",
      recipientAddress: "0x456...def",
      showTransactionId: true,
      animation: "pulse",
      customThumbnail: "/Memes/gifs-4-moons-contest-sequel-top-10-best-moon-meme-gifs-will-v0-hyfdvpwknshb1.gif"
    },
    {
      primaryColor: "#ec4899", // Pink
      backgroundColor: "#fdf2f8", // Pale Pink
      textColor: "#000000",
      borderColor: "#be185d",
      borderRadius: 12,
      buttonStyle: "glow",
      tokenSymbol: "MNEE",
      tokenAmount: "1000",
      merchantName: "GAME_STORE",
      transactionId: "#GAME-999",
      customTitle: "LEVEL_UP",
      recipientAddress: "0x789...ghi",
      showTransactionId: true,
      animation: "bounce",
      customThumbnail: "/Memes/kaiju-kingz-kaiju.gif"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      <IntroAnimation />
      


      <main className="relative" ref={containerRef}>
        {/* Hero Section */}
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#bababa"
              patternScale={3}
              patternDensity={0.7}
              pixelSizeJitter={0}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={4}
              edgeFade={0.25}
              transparent
            />
          </div>
          <section className="space-y-12 pt-12 flex flex-col items-center text-center relative z-10 w-full">
            <div className="space-y-8 w-full flex flex-col items-center">
              <div className="relative w-[30vw] h-[30vw] min-w-[300px] min-h-[300px]">
                <Image 
                  src="/logo.png" 
                  alt="Gravity Logo" 
                  fill
                  sizes="(max-width: 1000px) 300px, 30vw"
                  className="object-contain dark:invert"
                  priority
                />
              </div>
              <p className="text-md font-medium text-center max-w-2xl px-4 leading-relaxed bg-white/50 backdrop-blur-sm p-2 border border-black/5 rounded-2xl">
                Multi-DEX Web2-to-Web3 Bridge for Frictionless Payments in MNEE
              </p>
            </div>
            
            

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={isConnected ? { scale: 1.05 } : {}} whileTap={isConnected ? { scale: 0.95 } : {}}>
                {isConnected ? (
                  <Link href="/dashboard" className="bg-foreground text-background px-8 py-3 text-sm font-bold hover:bg-foreground/90 transition-colors inline-block text-center">
                    [ DASHBOARD ]
                  </Link>
                ) : (
                  <button disabled className="bg-foreground/50 text-background/50 px-8 py-3 text-sm font-bold cursor-not-allowed inline-block text-center">
                    [ DASHBOARD ]
                  </button>
                )}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/whitepaper"
                  className="border border-border px-8 py-3 text-sm font-bold transition-colors bg-white inline-block"
                >
                  [ WHITE_PAPER ]
                </Link>
              </motion.div>
            </div>

            {/* Crypto Partnerships Marquee */}
            <h4 className="text-sm font-mono text-center max-w-2xl px-4 leading-relaxed bg-white/30 backdrop-blur-md p-6 border border-black/5 rounded-2xl mb-8 mt-12 uppercase tracking-widest text-muted-foreground">[ SUPPORTED_ECOSYSTEMS::X402 ]</h4>
            <div className="w-full mb-12 relative overflow-hidden -mx-4">
              <div className="relative flex w-full overflow-hidden bg-muted/20 rounded-xl py-8">
                <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] items-center">
                  {[...Array(4)].map((_, setIndex) => (
                    <div key={setIndex} className="flex shrink-0 gap-16 items-center">
                      {[
                        { icon: <TokenETH className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUNI className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenARB className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUSDC className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUSDT className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenDAI className="w-24 h-24" variant="mono" /> }
                      ].map((partner, i) => (
                        <div key={`${setIndex}-${i}`} className="flex items-center justify-center p-4 rounded-lg transition-all duration-300">
                          {partner.icon}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Gradient edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
              </div>
            </div>
          </section>
        </div>

            {/* Payment Modal Mockups */}
            <div ref={containerRef} className="relative w-full py-12">
              {/* Background Image with Feather Fades */}
              <div className="absolute inset-0 z-0">
                <div className="relative h-full">
                  <Image
                    src="/Memes/bg_white.jpeg"
                    alt="Background"
                    fill
                    className="bottom-100 object-cover contrast-400 saturate-70"
                    style={{ objectPosition: 'center' }}
                  />
                  {/* White feather fade overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-70" />
                </div>
              </div>

              {/* Floating Shapes */}
              <motion.div style={{ y: y1 }} className="absolute -left-20 -top-20 z-10 w-[500px] h-[500px] pointer-events-none opacity-90 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapecylinder.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapecylinder.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y2 }} className="absolute -right-40 top-20 z-30 w-[600px] h-[600px] pointer-events-none opacity-90 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapestar.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapestar.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y3 }} className="absolute -left-40 bottom-150 z-30 w-[450px] h-[450px] pointer-events-none opacity-80 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapetube.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapetube.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y4 }} className="absolute right-0 -top-40 z-10 w-[400px] h-[400px] pointer-events-none opacity-80 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapespring.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapespring.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>

              <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase text-center relative z-20">[ X402_PAYMENT_KERNELS ]</h4>
              
              {/* Row 1: 3 Modals with Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto mb-12 z-20 mt-6 relative px-4">
                {modalConfigsWithThumbnail.map((config, i) => (
                  <div key={i} className="transform hover:scale-105 transition-transform duration-300 will-change-transform">
                    <PaymentModal
                      isOpen={true}
                      onClose={() => {}}
                      amountUSD={config.tokenAmount === "0.05" ? "124.50" : config.tokenAmount === "50.00" ? "50.00" : "100.00"}
                      config={config}
                      inline={true}
                      preview={true}
                    />
                  </div>
                ))}
              </div>

              {/* Demo Payment QR Code */}
              <div className="flex flex-col items-center justify-center w-full mt-20 z-20 relative">
                <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase text-center">[ SCAN_TO_PAY_DEMO ]</h4>
                
                <div className="relative group">
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <motion.div 
                    className="relative p-6 bg-white/80 backdrop-blur-xl rounded-xl border border-black/5 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {/* Tech Corners */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-blue-600/50 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-purple-600/50 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-pink-600/50 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-blue-600/50 rounded-br-lg" />

                    {/* Scanner Line */}
                    <motion.div
                      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20"
                      animate={{ top: ["5%", "95%", "5%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="bg-white p-4 rounded-lg overflow-hidden relative z-10 border border-black/5">
                      <div className="w-64 h-64">
                        <QRCode 
                          data={demoPaymentUrl}
                          foreground="#000000"
                          background="#ffffff"
                          robustness="L"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-black/5 backdrop-blur-sm shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-gray-600 font-mono tracking-wide">LIVE_NET::X402_STREAM_ACTIVE</p>
                </div>
              </div>
            </div>

            {/* Floating App Mockup */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-20 text-center">[ CREATOR's CONSOLE ]</h4>
            <div className="relative w-full max-w-5xl mx-auto mb-20 px-4 [perspective:2000px]">
              <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-xl p-2 shadow-2xl transition-all duration-1000 ease-out hover:[transform:rotateX(0deg)] [transform:rotateX(20deg)] group">
                <div className="rounded-lg border border-border bg-background/80 p-4 h-[400px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">GRAVITY_x402_TELEMETRY</div>
                  </div>

                  {/* Mockup Content */}
                  <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3 border-r border-border pr-4 space-y-3 hidden sm:block">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-full bg-muted/20 rounded" />
                      ))}
                    </div>
                    <div className="col-span-12 sm:col-span-9 space-y-6">
                      <div className="h-40 w-full bg-gradient-to-r from-muted/10 to-muted/5 rounded border border-border/50 relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/10 to-transparent" />
                         <div className="absolute bottom-4 left-4 text-2xl font-bold">$1,240,500.00</div>
                         <div className="absolute bottom-4 right-4 text-xs text-green-500">+12.5%</div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 w-full border border-border/50 rounded flex items-center px-4 justify-between bg-card/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted/20" />
                              <div className="w-24 h-2 bg-muted/20 rounded" />
                            </div>
                            <div className="w-16 h-2 bg-green-500/20 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Reflection/Glow */}
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/20 to-transparent blur-3xl -z-10 opacity-20" />
            </div>

            {/* Payment Flow Animations */}
            <h4 className="text-sm font-mono text-muted-foreground mb-24 tracking-widest uppercase mt-12 text-center">[ ROUTING_SIMULATION ]</h4>
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-24 z-20 px-4 items-center">
               <div className="flex flex-col items-center">
                 <QrScanAnimation />
               </div>
               <div className="flex flex-col items-center">
                 <LaptopClickAnimation />
               </div>
            </div>

        {/* Features Grid */}

        <section id="features" className="mb-20 space-y-8 relative z-10 bg-background">

          <div className="border-b border-border pb-2 container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold">SYSTEM_MODULES::X402</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
            {[
              {
                title: "UNIVERSAL_PAYMENT",
                desc: "Execute multi-asset clears across the x402 settlement fabric with AI assisted BFS routing protocol optimizing every hop in real time.",
                icon: CreditCard
              },
              {
                title: "QR_VERIFICATION",
                desc: "Generate zk anchored telemetry packets that compile into post-quantum QR attestations even in air-gapped venues.",
                icon: QrCode
              },
              {
                title: "ZERO_CONFIG",
                desc: "Self-provisioning edge nodes boot with deterministic WASM bundles—no backend, just autonomous x402 orchestration on Ethereum Sepolia.",
                icon: Zap
              }
            ].map((feature, i) => (
              <Card key={i} className="border border-border p-0 hover:shadow-lg transition-all duration-300 group hover:border-foreground/20 overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-2 font-mono">MODULE_0{i + 1}</div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Global Payment Benefits - New Design */}
        <section className="relative py-32 overflow-hidden bg-slate-950 text-white">
          
          {/* Background Elements - Solid Colors Only */}
          <div className="absolute inset-0 bg-slate-950">
            <div className="absolute inset-0 bg-[url('/Memes/bg_blue.jpeg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Top feather fade - Seamless transition from white */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent z-10" />

            {/* Bottom feather fade - Seamless transition to white */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            
            {/* Section Header */}
            <div className="text-center mb-24 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5D3B3]/10 border border-[#E5D3B3]/20 backdrop-blur-md"
              >
                <div className="w-2 h-2 bg-[#E5D3B3] rounded-full animate-pulse" />
                <span className="text-xs font-mono text-[#E5D3B3] font-bold tracking-wider">LIVE IN 180+ COUNTRIES</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-white font-sans"
              >
                <GradientText
                  colors={["#ffe3a1ff", "#ffffffff", "#fff1bdff", "#feffb3ff", "#ffedcaff"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="custom-class"
                >
                  The Future of Global Payments
                </GradientText>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                Accept stablecoins worldwide with instant settlement, lower fees, and zero regulatory complexity.
              </motion.p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
              {[
                {
                  title: "Global Reach",
                  subtitle: "180+ Countries",
                  desc: "Accept payments from customers worldwide without borders or restrictions.",
                  icon: Globe
                },
                {
                  title: "Instant Settlement",
                  subtitle: "No T+2 Delays",
                  desc: "Receive funds immediately instead of waiting days for traditional banking.",
                  icon: Zap
                },
                {
                  title: "Lower Fees",
                  subtitle: "Save 80% vs Cards",
                  desc: "Drastically reduce processing costs compared to traditional payment methods.",
                  icon: Percent
                },
                {
                  title: "Stable Value",
                  subtitle: "Always USD",
                  desc: "Never worry about crypto volatility with fully USD-pegged stablecoins.",
                  icon: Coins
                },
                {
                  title: "Clean Treasury",
                  subtitle: "One Ledger",
                  desc: "Simplify financial management with unified asset tracking.",
                  icon: Wallet
                },
                {
                  title: "Compliance Free",
                  subtitle: "GENIUS Act Protected",
                  desc: "Operate worry-free under regulatory protection—we handle the complexity.",
                  icon: ShieldCheck
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div className="relative h-full p-8 rounded-2xl border border-[#E5D3B3]/40 bg-zinc-900/50 backdrop-blur-xl shadow-[0_0_30px_rgba(229,211,179,0.25)] hover:bg-zinc-900/80 hover:border-[#E5D3B3] hover:shadow-[0_0_50px_rgba(229,211,179,0.5)] transition-all duration-300 overflow-hidden">
                    
                    <div className="relative z-10">
                      <div className="mb-6 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-[#E5D3B3] group-hover:scale-110 group-hover:bg-[#E5D3B3]/10 group-hover:border-[#E5D3B3]/20 transition-all duration-300">
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#E5D3B3] transition-colors">{benefit.title}</h3>
                      <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#E5D3B3]/80 mb-4 group-hover:border-[#E5D3B3]/30 transition-colors">
                        {benefit.subtitle}
                      </div>
                      <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>


          </div>
        </section>

        

        {/* Marquee Testimonials */}
        <section id="testimonials" className="space-y-8 overflow-hidden relative z-10 mb-20 bg-background">
          <div className="border-b border-border pb-2 container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold">COMMUNITY_FEEDBACK(LOGS)</h2>
          </div>
          
          <div className="relative flex w-full overflow-hidden bg-background/50 py-10">
            <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
              
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex shrink-0 gap-8">
                  {[
                    {
                      name: "Satoshi Chen",
                      username: "@satoshi_eth",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
                      review: "Our validator pods stay green because x402 flows auto-balance gas lanes—zero manual tuning required."
                    },
                    {
                      name: "Maria Rodriguez",
                      username: "@maria_defi",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                      review: "QR attestations compile instantly from the AI assisted BFS routing protocol even when the venue uplink drops."
                    },
                    {
                      name: "James Wilson",
                      username: "@jweb3_dev",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
                      review: "Bootstrapped a net-new merchant stack in minutes—zero-config WASM bundles handshake with our mesh out of the box."
                    },
                    {
                      name: "Aisha Patel",
                      username: "@aisha_crypto",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
                      review: "Multi-token intakes settle back to USDC automatically; the x402 bridge fuses every hop without slippage."
                    },
                    {
                      name: "Kai Nakamura",
                      username: "@kai_nft",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
                      review: "Receipts ship with zk proofs plus x402 telemetry hashes—disputes evaporated across our whole fleet."
                    }
                  ].map((testimonial, i) => (
                    <div key={`${setIndex}-${i}`} className="w-[300px] border border-border bg-card p-6 space-y-4 hover:border-foreground/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.username}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "{testimonial.review}"
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 mt-24 relative z-10 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2025 GRAVITY_PROTOCOL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">GITHUB</a>
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">TWITTER</a>
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">DISCORD</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
