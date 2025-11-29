"use client";

import { Check, Upload } from "lucide-react"
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background"
import Link from "next/link"

export default function CreatePage() {

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">


      <main className="relative">
        <AuroraBackground className="min-h-[calc(100vh-5rem)]">
          <section className="container mx-auto px-4 py-12 relative z-10">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter">CHOOSE YOUR TEMPLATE</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Select a payment modal template that fits your brand. Each template is fully customizable and ready to integrate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link
                  href="/create/custom"
                  className="group relative p-8 rounded-xl border-2 border-border hover:border-foreground/50 transition-all duration-300 block hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <Upload className="w-12 h-12 text-foreground/60" />
                    </div>

                    <div className="text-left space-y-3">
                      <h3 className="text-2xl font-bold">CUSTOM_THUMBNAIL</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Upload your brand logo or custom image. Perfect for established businesses with strong brand identity.
                      </p>

                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Custom branding</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Logo upload</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Full color control</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/create/simple"
                  className="group relative p-8 rounded-xl border-2 border-border hover:border-foreground/50 transition-all duration-300 block hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="w-full h-40 bg-muted/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <div className="w-24 h-24 rounded-full bg-foreground/20 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-foreground/40" />
                      </div>
                    </div>

                    <div className="text-left space-y-3">
                      <h3 className="text-2xl font-bold">SIMPLE_CLEAN</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Minimal design with colored indicators. Great for modern brands and startups.
                      </p>

                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Minimal design</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Color indicators</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4" />
                        <span>Fast setup</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="text-center space-y-6">
                <div className="text-sm text-muted-foreground">
                  Both templates include: Live preview • Export options • Payment processing • Responsive design
                </div>
              </div>
            </div>
          </section>
        </AuroraBackground>
      </main>
    </div>
  )
}