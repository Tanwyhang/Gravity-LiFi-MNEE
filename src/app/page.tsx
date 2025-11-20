import { Terminal, CreditCard, QrCode, Zap } from "lucide-react"
import { TokenETH, TokenUNI, TokenARB, TokenUSDC, TokenUSDT, TokenDAI } from "@web3icons/react"
import Image from "next/image"
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background"
import { QrScanAnimation } from "@/components/QrScanAnimation"
import { LaptopClickAnimation } from "@/components/LaptopClickAnimation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Terminal className="h-5 w-5" />
            <span>GRAVITY-ERC20-PAYMENT</span>
          </div>
          <nav className="hidden md:flex gap-12 text-sm ml-auto mr-12">
            <a href="#about" className="hover:underline decoration-2 underline-offset-4">./about</a>
            <a href="#features" className="hover:underline decoration-2 underline-offset-4">./features</a>
            <a href="#testimonials" className="hover:underline decoration-2 underline-offset-4">./testimonials</a>
          </nav>
          <div className="text-xs text-muted-foreground hidden sm:block">
            v1.0.0-beta
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <AuroraBackground className="min-h-[calc(100vh-4rem)] h-auto bg-background dark:bg-background text-foreground">
          <section className="space-y-12 pt-12 flex flex-col items-center text-center relative z-10 w-full">
            <div className="space-y-8 w-full flex flex-col items-center">
              <div className="relative w-[30vw] h-[30vw] min-w-[300px] min-h-[300px]">
                <Image 
                  src="/logo.png" 
                  alt="Gravity Logo" 
                  fill
                  className="object-contain dark:invert"
                  priority
                />
              </div>
              <p className="text-muted-foreground text-sm font-mono justify-center max-w-2xl px-4">
                Pulling everything together
              </p>
            </div>
            
            

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-foreground text-background px-8 py-3 text-sm font-bold hover:bg-foreground/90 transition-colors">
                [ CREATE ]
              </button>
              <button className="border border-border px-8 py-3 text-sm font-bold hover:bg-muted/50 transition-colors">
                [ WHITEPAPER ]
              </button>
            </div>

            {/* Crypto Partnerships Marquee */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-12">[ SUPPORTED_ECOSYSTEMS ]</h4>
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

            {/* Payment Modal Mockups */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-12">[ PAYMENT_MODALS ]</h4>
            <div className="grid md:grid-cols-2 gap-24 w-full max-w-4xl mx-auto mb-12 z-20 mt-6 relative">
              {/* Modal 1: ETH Payment */}
              <div className="relative rounded-xl border border-border bg-card/90 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none rounded-xl" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                    </div>
                    <span className="font-bold text-sm">PAY_WITH_ETH</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">ID: #8X92...</div>
                </div>

                <div className="text-center mb-8 space-y-1">
                  <div className="text-4xl font-bold tracking-tighter">0.05 ETH</div>
                  <div className="text-sm text-muted-foreground">≈ $124.50 USD</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-3 rounded bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground">Network Cost</span>
                    <span className="font-mono text-xs">0.002 ETH</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 rounded bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span className="font-mono text-xs">~15 SEC</span>
                  </div>
                </div>

                <button className="w-full bg-foreground text-background py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  CONFIRM_PAYMENT
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </button>
              </div>

              {/* Modal 2: MNEE Payment */}
              <div className="relative rounded-xl border border-border bg-card/90 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group delay-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 pointer-events-none rounded-xl" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                    </div>
                    <span className="font-bold text-sm">PAY_WITH_MNEE</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">ID: #9Y21...</div>
                </div>

                <div className="text-center mb-8 space-y-1">
                  <div className="text-4xl font-bold tracking-tighter">124.50 MNEE</div>
                  <div className="text-sm text-muted-foreground">≈ $124.50 USD</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-3 rounded bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground">Network Cost</span>
                    <span className="font-mono text-xs">0.00 MNEE</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 rounded bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span className="font-mono text-xs">~2 SEC</span>
                  </div>
                </div>

                <button className="w-full bg-foreground text-background py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  CONFIRM_PAYMENT
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </button>
              </div>
            </div>

            {/* Floating App Mockup */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-20">[ DASHBOARD_VIEW ]</h4>
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
                    <div className="text-xs font-mono text-muted-foreground">GRAVITY_DASHBOARD</div>
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
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/20 to-transparent blur-3xl -z-10 opacity-30" />
            </div>

            {/* Payment Flow Animations */}
            <h4 className="text-sm font-mono text-muted-foreground mb-24 tracking-widest uppercase mt-12">[ PAYMENT_FLOWS ]</h4>
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-24 z-20 px-4 items-center">
               <div className="flex flex-col items-center">
                 <QrScanAnimation />
               </div>
               <div className="flex flex-col items-center">
                 <LaptopClickAnimation />
               </div>
            </div>
            
          </section>
        </AuroraBackground>

        {/* Features Grid */}
        <section id="features" className="mb-20 space-y-8 relative z-10 bg-background">
          <div className="border-b border-border pb-2 container mx-auto px-4">
            <h2 className="text-xl font-bold">SYSTEM_MODULES</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
            {[
              {
                title: "UNIVERSAL_PAYMENT",
                desc: "Accept USDC, USDT, DAI, or any ERC20. Automatic Uniswap conversion to your preferred settlement token.",
                icon: CreditCard
              },
              {
                title: "QR_VERIFICATION",
                desc: "Cryptographically signed receipts generated as QR codes. Instant offline verification for events.",
                icon: QrCode
              },
              {
                title: "ZERO_CONFIG",
                desc: "No backend required. Fully decentralized architecture running on Ethereum Sepolia.",
                icon: Zap
              }
            ].map((feature, i) => (
              <div key={i} className="border border-border p-12 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <feature.icon className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-2">MODULE_0{i + 1}</div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee Testimonials */}
        <section id="testimonials" className="space-y-8 overflow-hidden relative z-10 mb-20 bg-background">
          <div className="border-b border-border pb-2 container mx-auto px-4">
            <h2 className="text-xl font-bold">COMMUNITY_FEEDBACK</h2>
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
                      review: "Finally, a payment system that actually works for crypto events. No more gas headaches!"
                    },
                    {
                      name: "Maria Rodriguez",
                      username: "@maria_defi",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                      review: "The QR verification is incredible - scanned tickets instantly even with no internet connection."
                    },
                    {
                      name: "James Wilson",
                      username: "@jweb3_dev",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
                      review: "Zero config setup saved us weeks of development time. Just plug and play!"
                    },
                    {
                      name: "Aisha Patel",
                      username: "@aisha_crypto",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
                      review: "Accepting any ERC20 token while getting USDC back? Game changer for our conference."
                    },
                    {
                      name: "Kai Nakamura",
                      username: "@kai_nft",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
                      review: "The receipt system is verifiable and cryptographically secure. No more disputes!"
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
