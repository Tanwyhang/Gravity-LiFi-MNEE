"use client";

import { Terminal } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic";

const WalletConnectButton = dynamic(
  () => import("@/components/WalletConnectButton").then((mod) => mod.WalletConnectButton),
  { ssr: false }
);

export function Navbar() {
  return (
    <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Terminal className="h-5 w-5" />
          <Link href="/">
            <span>GRAVITY-x402-PAYMENT</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-12 text-sm ml-auto mr-12">
          <Link href="/dashboard" className="hover:underline decoration-2 underline-offset-4 font-bold text-primary">./dashboard</Link>
          <Link href="/whitepaper" className="hover:underline decoration-2 underline-offset-4">./whitepaper</Link>
          <Link href="/#about" className="hover:underline decoration-2 underline-offset-4">./about</Link>
          <Link href="/#features" className="hover:underline decoration-2 underline-offset-4">./features</Link>
          <Link href="/#testimonials" className="hover:underline decoration-2 underline-offset-4">./testimonials</Link>
        </nav>
        <div className="flex items-center gap-4">
          <WalletConnectButton />
          <div className="text-xs text-muted-foreground hidden sm:block">
            v1.0.0-beta
          </div>
        </div>
      </div>
    </header>
  )
}
