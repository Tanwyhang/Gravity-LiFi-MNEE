"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight, Menu, X, DollarSign, Zap, Shield, TrendingUp, Users, Code } from "lucide-react";
import MermaidDiagram from "@/components/MermaidDiagram";
import "./whitepaper.css";

type SectionId = 
  | "overview"
  | "executive-summary"
  | "architecture"
  | "bfs-routing"
  | "lifi-integration"
  | "technical-stack"
  | "payment-flow"
  | "security"
  | "tokenomics"
  | "case-studies"
  | "cost-analysis"
  | "comparison"
  | "faq"
  | "roadmap";

interface Section {
  id: SectionId;
  title: string;
  subsections?: string[];
}

const sections: Section[] = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "overview", title: "Overview" },
  { 
    id: "architecture", 
    title: "System Architecture",
    subsections: ["High-Level Overview", "LiFi Diamond Contract", "Component Flow"]
  },
  { 
    id: "bfs-routing", 
    title: "BFS Routing Protocol",
    subsections: ["Graph Theory Foundation", "AI-Assisted Path Selection", "Optimization Techniques"]
  },
  { 
    id: "lifi-integration", 
    title: "LiFi Integration",
    subsections: ["Multi-Facet Architecture", "Routing Layer", "Execution Flow"]
  },
  { 
    id: "technical-stack", 
    title: "Technical Stack",
    subsections: ["Frontend", "Backend", "Blockchain Integration"]
  },
  { 
    id: "payment-flow", 
    title: "Payment Processing Flow",
    subsections: ["Quote Discovery", "Route Selection", "Transaction Execution"]
  },
  { 
    id: "security", 
    title: "Security & Audits",
    subsections: ["Smart Contract Security", "Infrastructure Security", "User Protection"]
  },
  { 
    id: "tokenomics", 
    title: "MNEE Tokenomics",
    subsections: ["Settlement Token", "Value Accrual", "Economic Model"]
  },
  { 
    id: "case-studies", 
    title: "Real-World Case Studies",
    subsections: ["Freelance Platform", "E-Commerce Store", "Event Ticketing"]
  },
  { 
    id: "cost-analysis", 
    title: "Cost-Benefit Analysis",
    subsections: ["Fee Comparison", "ROI Projections", "Savings Calculator"]
  },
  { 
    id: "comparison", 
    title: "Competitive Analysis",
    subsections: ["Feature Matrix", "Performance Benchmarks"]
  },
  { 
    id: "faq", 
    title: "Frequently Asked Questions"
  },
  { 
    id: "roadmap", 
    title: "Roadmap",
    subsections: ["Current Status", "Future Development"]
  },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(dateString);
  }, []);

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black whitepaper-container">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 rounded-lg bg-background border border-border shadow-lg hover:bg-muted"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - Table of Contents */}
      <aside className={cn(
        "fixed top-16 left-0 bottom-0 w-72 bg-background border-r border-border overflow-y-auto transition-transform duration-300 z-40",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 sticky top-0 bg-background border-b border-border">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Contents
          </h2>
        </div>
        
        <nav className="p-4 space-y-1">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50">{String(idx + 1).padStart(2, '0')}</span>
                <span>{section.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
          {/* Header */}
          <header className="mb-16 pb-8 border-b border-border">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Gravity Protocol
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Web2-to-Web3 Bridge for Frictionless ERC20 Payments
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div>Version 1.0</div>
              <div>•</div>
              <div>{currentDate}</div>
            </div>
          </header>

          {/* Sections */}
          
          {/* Executive Summary */}
          <section id="executive-summary" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-border rounded-xl">
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  <strong>Gravity Protocol</strong> solves the cryptocurrency payment fragmentation crisis by enabling 
                  universal token acceptance with unified MNEE settlement. Built on LiFi's battle-tested infrastructure, 
                  Gravity processes payments from <strong>1.2M+ ERC20 tokens</strong> across <strong>20+ blockchains</strong> 
                  through familiar Web2 interfaces—social links and QR codes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By leveraging the EIP-2535 Diamond Standard and AI-assisted BFS routing, we deliver sub-1% fees, 
                  80% operational cost reduction, and instant cross-chain settlements—making crypto payments as simple 
                  as sharing a link.
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    <h3 className="font-semibold text-lg">1.2M+ Tokens</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accept any ERC20 token across Ethereum and Layer 2 networks without pre-configuration
                  </p>
                </div>

                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <h3 className="font-semibold text-lg">80% Cost Reduction</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Eliminate treasury complexity and reduce operational overhead vs. managing multiple tokens
                  </p>
                </div>

                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-lg">$1M+ Bug Bounty</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Built on LiFi's audited infrastructure with comprehensive security guarantees
                  </p>
                </div>
              </div>

              {/* Problem & Solution */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border-l-4 border-red-500 bg-red-500/5 rounded-r-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    The Problem
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Merchants must choose which tokens to accept</li>
                    <li>• Users often don't hold the required payment token</li>
                    <li>• Managing 100+ token types creates accounting nightmares</li>
                    <li>• Traditional payment processors charge 2.9% + $0.30</li>
                    <li>• Cross-chain payments require technical expertise</li>
                  </ul>
                </div>

                <div className="p-6 border-l-4 border-green-500 bg-green-500/5 rounded-r-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    The Solution
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Accept ANY token, settle in MNEE automatically</li>
                    <li>• Users pay with whatever they hold in their wallet</li>
                    <li>• Unified treasury management in single token</li>
                    <li>• 0.5-1% fees with transparent gas estimation</li>
                    <li>• One-click payments via social links & QR codes</li>
                  </ul>
                </div>
              </div>

              {/* Core Value Propositions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-xl mb-4">Core Value Propositions</h3>
                
                <div className="flex gap-3 items-start p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Universal Token Acceptance</h4>
                    <p className="text-sm text-muted-foreground">
                      No more "we only accept ETH/USDC"—accept 1.2M+ tokens across 20+ chains with zero integration work
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Web2 UX, Web3 Power</h4>
                    <p className="text-sm text-muted-foreground">
                      Share payment links like gravity.xyz/pay/event123—no wallet addresses, no chain confusion
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <Code className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">AI-Optimized Routing</h4>
                    <p className="text-sm text-muted-foreground">
                      BFS algorithm with multi-DEX aggregation finds the cheapest, fastest path for every transaction
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Market */}
              <div className="p-6 bg-zinc-950/50 border border-border rounded-xl">
                <h3 className="font-semibold text-xl mb-4">Target Market</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-400 mb-2">Freelancers & Creators</div>
                    <p className="text-muted-foreground">Accept global payments without currency barriers or high fees</p>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400 mb-2">E-Commerce Merchants</div>
                    <p className="text-muted-foreground">Tap into crypto-native customers with zero integration complexity</p>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-400 mb-2">Event Organizers</div>
                    <p className="text-muted-foreground">Sell tickets with QR codes, settle in stable MNEE treasury</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section id="overview" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Gravity Protocol is a universal payment infrastructure that bridges Web2 usability with Web3 functionality. 
                The platform accepts any ERC20 token input and automatically converts it to MNEE through intelligent routing, 
                creating a seamless payment experience via familiar social links and QR codes.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-8">
                By leveraging <strong className="text-foreground">LiFi's multi-chain liquidity aggregation</strong> and the 
                <strong className="text-foreground"> EIP-2535 Diamond Standard</strong>, Gravity eliminates the token fragmentation 
                crisis that plagues cryptocurrency payments. Users can pay with any token they hold, while merchants receive 
                unified settlements in MNEE, dramatically reducing operational complexity.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-lg mb-2">Universal Token Acceptance</h3>
                  <p className="text-sm text-muted-foreground">
                    Accept payments from 1.2M+ ERC20 tokens across Ethereum and Layer 2 solutions without pre-configuration.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-lg mb-2">MNEE Settlement</h3>
                  <p className="text-sm text-muted-foreground">
                    All payments settle in MNEE, creating unified treasury management and sustainable token demand.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-lg mb-2">Social Link Format</h3>
                  <p className="text-sm text-muted-foreground">
                    Share payment links like gravity.xyz/pay/[eventId] across any platform—no complex wallet addresses.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-lg mb-2">AI-Assisted Routing</h3>
                  <p className="text-sm text-muted-foreground">
                    BFS routing protocol with multi-DEX aggregation optimizes every hop for cost and speed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">High-Level Overview</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Gravity's architecture combines modern web technologies with sophisticated blockchain infrastructure. 
                  The system consists of several interconnected layers working together to provide universal payment acceptance:
                </p>

                <div className="my-8 rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=63e3d93ede3d25569bd5e492745a79d3"
                    alt="LiFi Architecture Overview" 
                    className="w-full h-auto"
                  />
                </div>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">dApp Interface (Integrators):</strong> User-facing Next.js application with RainbowKit wallet integration</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">LiFi API - Aggregation Layer:</strong> Off-chain routing that fetches quotes from 40+ bridges and DEXs</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">LiFi Diamond Contract:</strong> On-chain entry point using EIP-2535 multi-facet standard</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Facet Contracts:</strong> Specialized contracts for bridges, DEXs, and solvers</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Liquidity Sources:</strong> Final execution on bridge/DEX/solver contracts</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">LiFi Diamond Contract</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The LiFi Diamond Contract serves as the primary on-chain entry point, implementing the EIP-2535 Diamond Standard 
                  for modular, upgradeable smart contracts. This architecture enables continuous innovation without breaking integrations.
                </p>

                <div className="my-8 rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=3d60d0d021b75b7eb289639f5e148de1"
                    alt="LiFi Diamond Contract Flow" 
                    className="w-full h-auto"
                  />
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  The Diamond contract uses <code className="px-2 py-1 rounded bg-muted text-foreground text-sm font-mono">DELEGATECALL</code> to 
                  route transactions to specialized facet contracts. Each facet handles specific functionality such as DEX swaps, 
                  cross-chain bridges, or solver-based routing.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Component Flow</h3>
                
                <div className="my-8 rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=08d2cc1baedb753105d65388fdffc144"
                    alt="LiFi Diamond Helper Contracts" 
                    className="w-full h-auto"
                  />
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  The Diamond contract is deployed with helper contracts that facilitate upgrading facets, method lookups, 
                  ownership verification, and fund withdrawals. This modular design ensures security while maintaining flexibility.
                </p>
              </div>

              {/* Mermaid Diagram: Complete Payment Flow */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Complete Payment Flow Visualization</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This diagram illustrates the complete end-to-end payment journey from user initiation to MNEE settlement:
                </p>
                
                <MermaidDiagram chart={`
graph TB
    User[User Accesses Payment Link] --> Connect[Connect Wallet<br/>RainbowKit Modal]
    Connect --> Select[Select Payment Token<br/>Any ERC20 on Any Chain]
    Select --> Quote[Request Quote<br/>LiFi API]
    
    Quote --> API[LiFi Aggregation Layer]
    API --> Bridges[Query 40+ Bridges]
    API --> DEXs[Query DEX Aggregators]
    API --> Solvers[Query Professional Solvers]
    
    Bridges --> Route[Optimal Route Selection<br/>Gas + Slippage + Speed]
    DEXs --> Route
    Solvers --> Route
    
    Route --> Display[Display Quote to User<br/>Conversion Rate + Fees]
    Display --> Approve{User Approves?}
    
    Approve -->|Yes| Chain{Correct Chain?}
    Approve -->|No| Cancel[Transaction Cancelled]
    
    Chain -->|No| Switch[Switch Chain<br/>Wagmi switchChain]
    Chain -->|Yes| Execute[Execute Route<br/>LiFi SDK]
    Switch --> Execute
    
    Execute --> Diamond[LiFi Diamond Contract<br/>EIP-2535]
    Diamond --> Facet[Delegate to Facet<br/>DELEGATECALL]
    
    Facet --> Bridge[Bridge Execution<br/>Stargate/LayerZero]
    Facet --> Swap[DEX Swap<br/>Uniswap/Curve]
    
    Bridge --> MNEE[MNEE Delivered<br/>Recipient Address]
    Swap --> MNEE
    
    MNEE --> Receipt[Generate Receipt<br/>QR Proof of Payment]
    Receipt --> Success[Payment Complete]
                `} />
              </div>

              {/* Mermaid Diagram: Multi-Chain Architecture */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Multi-Chain Architecture</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gravity supports seamless cross-chain payments through LiFi's comprehensive bridge network:
                </p>
                
                <MermaidDiagram chart={`
graph LR
    subgraph "L1 Networks"
        ETH[Ethereum<br/>Chain ID: 1]
    end
    
    subgraph "L2 Networks"
        OPT[Optimism<br/>Chain ID: 10]
        ARB[Arbitrum<br/>Chain ID: 42161]
        BASE[Base<br/>Chain ID: 8453]
        POLY[Polygon<br/>Chain ID: 137]
    end
    
    subgraph "Bridge Layer"
        SG[Stargate]
        LZ[LayerZero]
        WH[Wormhole]
    end
    
    subgraph "DEX Aggregators"
        UNI[Uniswap V3]
        CURVE[Curve]
        BAL[Balancer]
        INCH[1inch]
    end
    
    ETH <--> SG
    OPT <--> SG
    ARB <--> LZ
    BASE <--> LZ
    POLY <--> WH
    
    SG <--> UNI
    LZ <--> CURVE
    WH <--> BAL
    
    UNI --> MNEE[MNEE Settlement<br/>Ethereum Mainnet]
    CURVE --> MNEE
    BAL --> MNEE
    INCH --> MNEE
                `} />
              </div>

              {/* Mermaid Diagram: Diamond Proxy Pattern */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">EIP-2535 Diamond Proxy Pattern</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Diamond Standard enables modular, upgradeable smart contracts without breaking integrations:
                </p>
                
                <MermaidDiagram chart={`
graph TB
    User[User Transaction] --> Diamond[Diamond Proxy<br/>Single Entry Point]
    
    Diamond --> Lookup[Function Selector Lookup<br/>DiamondLoupe]
    Lookup --> Delegate{DELEGATECALL<br/>to Facet}
    
    Delegate --> BridgeFacet[Bridge Facet<br/>Cross-chain Logic]
    Delegate --> DEXFacet[DEX Facet<br/>Swap Logic]
    Delegate --> SolverFacet[Solver Facet<br/>Advanced Routing]
    
    BridgeFacet --> Stargate[Stargate Protocol]
    BridgeFacet --> LayerZero[LayerZero]
    
    DEXFacet --> Uniswap[Uniswap V3]
    DEXFacet --> Curve[Curve Finance]
    
    SolverFacet --> Market[Market Makers]
    
    Stargate --> Result[Transaction Result]
    LayerZero --> Result
    Uniswap --> Result
    Curve --> Result
    Market --> Result
    
    Result --> Diamond
    Diamond --> UserResult[Return to User]
    
    subgraph "Upgrade Mechanism"
        Owner[Contract Owner] --> Cut[Diamond Cut<br/>Add/Replace/Remove Facets]
        Cut --> Diamond
    end
                `} />
              </div>
            </div>
          </section>

          {/* BFS Routing Protocol */}
          <section id="bfs-routing" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">BFS Routing Protocol</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Graph Theory Foundation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gravity's routing engine models the entire DeFi liquidity landscape as a weighted directed graph, where:
                </p>

                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Nodes:</strong> Represent tokens on specific chains (e.g., USDC on Ethereum, USDC on Arbitrum)</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Edges:</strong> Represent possible conversions via DEXs, bridges, or solvers</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Weights:</strong> Combine gas costs, slippage, and execution time into a single metric</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Goal:</strong> Find the minimum-cost path from source token to MNEE</span>
                  </li>
                </ul>

                <MermaidDiagram chart={`
graph LR
    subgraph "Source Chain: Arbitrum"
        USDC_ARB[USDC<br/>Arbitrum]
        ETH_ARB[ETH<br/>Arbitrum]
    end
    
    subgraph "Intermediate Hops"
        USDC_ETH[USDC<br/>Ethereum]
        ETH_ETH[ETH<br/>Ethereum]
        USDT_ETH[USDT<br/>Ethereum]
    end
    
    subgraph "Destination"
        MNEE[MNEE<br/>Ethereum]
    end
    
    USDC_ARB -->|Stargate<br/>$2.50 gas| USDC_ETH
    USDC_ARB -->|Bridge to ETH<br/>$3.00 gas| ETH_ARB
    ETH_ARB -->|LayerZero<br/>$2.80 gas| ETH_ETH
    
    USDC_ETH -->|Uniswap V3<br/>0.05% fee| ETH_ETH
    USDC_ETH -->|Curve<br/>0.04% fee| USDT_ETH
    ETH_ETH -->|Uniswap V3<br/>0.3% fee| MNEE
    USDT_ETH -->|Balancer<br/>0.1% fee| MNEE
                `} />

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-blue-400">Example:</strong> To convert 1000 USDC on Arbitrum to MNEE, the BFS algorithm 
                    evaluates paths like: <code className="px-2 py-1 rounded bg-muted text-foreground text-xs font-mono">USDC(ARB) → Stargate → USDC(ETH) → Curve → USDT(ETH) → Balancer → MNEE</code> vs. 
                    <code className="px-2 py-1 rounded bg-muted text-foreground text-xs font-mono">USDC(ARB) → Stargate → USDC(ETH) → Uniswap → ETH(ETH) → Uniswap → MNEE</code>, 
                    selecting the path with lowest total cost (gas + slippage).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">AI-Assisted Path Selection</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our routing algorithm incorporates machine learning to optimize path selection beyond simple cost minimization:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 border border-border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Historical Success Rates
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Track transaction success rates for each DEX/bridge combination. Routes with {'>'} 95% success rate 
                      are prioritized even if slightly more expensive.
                    </p>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Real-Time Liquidity Monitoring
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor pool depths and recent transaction volumes to avoid routes with insufficient liquidity 
                      that could cause high slippage.
                    </p>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      MEV Protection
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Detect high-MEV environments and route through private mempools or use solver-based execution 
                      to prevent front-running attacks.
                    </p>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-500" />
                      Hot Path Caching
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Cache frequently used routes (e.g., USDC → MNEE) with 30-second TTL to reduce API latency 
                      for common conversions.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                  <pre className="text-zinc-100">
<span className="text-zinc-500">// Simplified Route Scoring Algorithm</span>
<span className="text-purple-400">function</span> <span className="text-blue-400">scoreRoute</span>(route: Route): <span className="text-blue-300">number</span> {'{'}{'\n'}
  <span className="text-purple-400">const</span> <span className="text-blue-300">gasCost</span> = route.steps.<span className="text-blue-400">reduce</span>((sum, step) {'=>'} {'\n'}
    sum + step.gasEstimate * gasPrice, <span className="text-yellow-400">0</span>{'\n'}
  );{'\n'}
  {'\n'}
  <span className="text-purple-400">const</span> <span className="text-blue-300">slippageCost</span> = route.expectedOutput - route.minimumOutput;{'\n'}
  {'\n'}
  <span className="text-purple-400">const</span> <span className="text-blue-300">successPenalty</span> = route.historicalSuccessRate {'<'} <span className="text-yellow-400">0.95</span> {'\n'}
    ? (<span className="text-yellow-400">1</span> - route.historicalSuccessRate) * <span className="text-yellow-400">1000</span> {'\n'}
    : <span className="text-yellow-400">0</span>;{'\n'}
  {'\n'}
  <span className="text-purple-400">const</span> <span className="text-blue-300">timePenalty</span> = route.estimatedTime {'>'} <span className="text-yellow-400">60</span> {'\n'}
    ? (route.estimatedTime - <span className="text-yellow-400">60</span>) * <span className="text-yellow-400">0.1</span> {'\n'}
    : <span className="text-yellow-400">0</span>;{'\n'}
  {'\n'}
  <span className="text-purple-400">return</span> gasCost + slippageCost + successPenalty + timePenalty;{'\n'}
{'}'}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Optimization Techniques</h3>
                
                <div className="space-y-4">
                  <div className="p-6 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Split Order Execution</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      For large transactions, split the order across multiple DEXs to minimize price impact:
                    </p>
                    <div className="text-xs font-mono bg-zinc-950 p-3 rounded">
                      <div>70% via Uniswap V3 (deepest liquidity)</div>
                      <div>20% via Curve (lower fees)</div>
                      <div>10% via Balancer (best price for remainder)</div>
                    </div>
                  </div>

                  <div className="p-6 border-l-4 border-blue-500 bg-blue-500/10 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Dynamic Slippage Adjustment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automatically adjust slippage tolerance based on market volatility and transaction size:
                    </p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Low volatility + small tx: 0.1% slippage</li>
                      <li>• Normal conditions: 0.5% slippage (default)</li>
                      <li>• High volatility or large tx: 1-2% slippage</li>
                    </ul>
                  </div>

                  <div className="p-6 border-l-4 border-purple-500 bg-purple-500/10 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Gas Optimization</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Minimize on-chain operations through batching and efficient contract calls:
                    </p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Batch approvals with swaps in single transaction</li>
                      <li>• Use multicall for parallel DEX queries</li>
                      <li>• Leverage EIP-1559 for optimal gas pricing</li>
                    </ul>
                  </div>
                </div>

                <MermaidDiagram chart={`
graph TD
    Start[Receive Payment Request] --> Parse[Parse Source Token + Amount]
    Parse --> Graph[Build Liquidity Graph<br/>1.2M+ tokens, 40+ protocols]
    
    Graph --> BFS[Run BFS Algorithm<br/>Find All Possible Paths]
    BFS --> Filter[Filter Paths<br/>Min Liquidity Threshold]
    
    Filter --> Score[Score Each Path<br/>Gas + Slippage + Success + Time]
    Score --> ML[Apply ML Model<br/>Historical Performance Data]
    
    ML --> Top[Select Top 3 Routes]
    Top --> Simulate[Simulate Execution<br/>Check for Failures]
    
    Simulate --> Valid{All Valid?}
    Valid -->|Yes| Present[Present Best Route to User]
    Valid -->|No| Fallback[Use Fallback Route]
    
    Present --> Execute[User Approves → Execute]
    Fallback --> Execute
    
    Execute --> Monitor[Monitor Transaction<br/>Real-time Status Updates]
    Monitor --> Success{Success?}
    
    Success -->|Yes| Complete[Payment Complete]
    Success -->|No| Retry{Retry?}
    
    Retry -->|Yes| Top
    Retry -->|No| Refund[Process Refund]
                `} />
              </div>
            </div>
          </section>

          {/* LiFi Integration */}
          <section id="lifi-integration" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">LiFi Integration</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Multi-Facet Architecture</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gravity leverages LiFi's comprehensive liquidity aggregation through specialized facet contracts:
                </p>

                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Bridge Facets:</strong> Route cross-chain transactions to protocols like Stargate, LayerZero, and Wormhole</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">DEX Facets:</strong> Execute same-chain swaps on Uniswap, Curve, Balancer, and 1inch</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Solver Facets:</strong> Access professional market makers and automated strategies for complex routes</span>
                  </li>
                </ul>

                <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                  <pre className="text-zinc-100">
<span className="text-zinc-500">// LiFi SDK Configuration</span>
<span className="text-purple-400">import</span> {'{ '}<span className="text-blue-400">createConfig</span>, <span className="text-blue-400">EVM</span> {'} '}
<span className="text-purple-400">from</span> <span className="text-green-400">'@lifi/sdk'</span>;
<span className="text-purple-400">import</span> {'{ '}<span className="text-blue-400">getWalletClient</span>, <span className="text-blue-400">switchChain</span> {'} '}
<span className="text-purple-400">from</span> <span className="text-green-400">'@wagmi/core'</span>;

<span className="text-purple-400">export const</span> <span className="text-blue-300">lifiConfig</span> = <span className="text-blue-400">createConfig</span>({'{'}
  <span className="text-cyan-400">integrator</span>: <span className="text-green-400">'Gravity'</span>,
  <span className="text-cyan-400">providers</span>: [
    <span className="text-blue-400">EVM</span>({'{'}
      <span className="text-cyan-400">getWalletClient</span>: () {'=>'} <span className="text-blue-400">getWalletClient</span>(wagmiConfig),
      <span className="text-cyan-400">switchChain</span>: <span className="text-purple-400">async</span> (chainId) {'=>'} {'{'}
        <span className="text-purple-400">const</span> chain = <span className="text-purple-400">await</span> <span className="text-blue-400">switchChain</span>(wagmiConfig, {'{ '}chainId {' }'});
        <span className="text-purple-400">return</span> <span className="text-blue-400">getWalletClient</span>(wagmiConfig, {'{ '}chainId: chain.id {' }'});
      {'}'},
    {'}'}),
  ],
{'}'});
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Routing Layer</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The LiFi API performs intelligent price discovery and smart order routing by interfacing with various liquidity sources:
                </p>

                <ol className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">1.</span>
                    <span><strong className="text-foreground">Fetch Pricing:</strong> Query multiple sources for optimal quotes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">2.</span>
                    <span><strong className="text-foreground">Return Quote:</strong> Identify best route considering gas, slippage, and success probability</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">3.</span>
                    <span><strong className="text-foreground">Order Routing:</strong> Submit transaction to Diamond contract for execution</span>
                  </li>
                </ol>

                <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                  <pre className="text-zinc-100">
<span className="text-zinc-500">// Quote Request Flow</span>
<span className="text-purple-400">const</span> <span className="text-blue-300">quoteRequest</span> = {'{'}
  <span className="text-cyan-400">fromChain</span>: tokenInChainId,
  <span className="text-cyan-400">toChain</span>: <span className="text-orange-400">MNEE_CHAIN_ID</span>,        <span className="text-zinc-500">// Ethereum Mainnet (1)</span>
  <span className="text-cyan-400">fromToken</span>: tokenIn,
  <span className="text-cyan-400">toToken</span>: <span className="text-orange-400">MNEE_TOKEN_ADDRESS</span>,
  <span className="text-cyan-400">fromAmount</span>: amountInBigInt.<span className="text-blue-400">toString</span>(),
  <span className="text-cyan-400">fromAddress</span>: userAddress,
  <span className="text-cyan-400">toAddress</span>: recipientAddress,
  <span className="text-cyan-400">slippage</span>: <span className="text-yellow-400">0.005</span>,               <span className="text-zinc-500">// 0.5% tolerance</span>
{'}'};

<span className="text-purple-400">const</span> <span className="text-blue-300">quote</span> = <span className="text-purple-400">await</span> <span className="text-blue-400">getQuote</span>(quoteRequest);
<span className="text-purple-400">const</span> <span className="text-blue-300">route</span> = <span className="text-blue-400">convertQuoteToRoute</span>(quote);
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Execution Flow</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once a route is selected, the execution process follows these steps:
                </p>

                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>User approves transaction in their wallet (e.g., MetaMask, Rainbow)</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Transaction is sent to LiFi Diamond contract with route data</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Diamond contract delegates to appropriate facet contract</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Facet executes swap/bridge operations with partner protocols</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>MNEE tokens are delivered to merchant's recipient address</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Stack */}
          <section id="technical-stack" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Technical Stack</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Frontend</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Next.js 16.0.3:</strong> React framework with App Router for server-side rendering</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">React 19.2.0:</strong> Interactive UI components with hooks architecture</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">TypeScript:</strong> Type-safe development with enhanced IDE support</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Tailwind CSS 4.x:</strong> Utility-first styling with responsive design</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Framer Motion 12.23.24:</strong> Smooth animations and transitions</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Backend</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Prisma 7.0.0:</strong> Type-safe ORM with PostgreSQL database</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Next.js API Routes:</strong> Serverless functions for payment event management</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Vercel Blob Storage:</strong> Custom thumbnails and media assets</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Blockchain Integration</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Wagmi 3.0.0:</strong> React hooks for Ethereum interactions</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Viem:</strong> Type-safe Ethereum library for blockchain operations</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">RainbowKit 2.2.9:</strong> Best-in-class wallet connection UI</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">LiFi SDK:</strong> Cross-chain routing and execution</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Flow */}
          <section id="payment-flow" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Payment Processing Flow</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Quote Discovery</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a user selects a token for payment, Gravity initiates the quote discovery process:
                </p>

                <ol className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">1.</span>
                    <span><strong className="text-foreground">Token Price Fetch:</strong> Query token price from LiFi's aggregated price oracles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">2.</span>
                    <span><strong className="text-foreground">Amount Calculation:</strong> Convert USD value to token amount based on current price</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">3.</span>
                    <span><strong className="text-foreground">Route Request:</strong> Request optimal routes from LiFi API</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">4.</span>
                    <span><strong className="text-foreground">Quote Presentation:</strong> Display conversion details and estimated gas fees</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Route Selection</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LiFi's routing algorithm considers multiple factors to select the optimal path:
                </p>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Gas Costs:</strong> Minimize transaction fees across all networks</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Slippage:</strong> Ensure price impact stays within tolerance (0.5%)</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Liquidity Depth:</strong> Use pools with sufficient liquidity</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Success Rate:</strong> Prioritize routes with high historical success</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Speed:</strong> Balance execution time with cost optimization</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Transaction Execution</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The complete end-to-end order flow:
                </p>

                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">1.</span>
                    <span><strong className="text-foreground">Initiate Request:</strong> User accesses payment link (gravity.xyz/pay/[eventId])</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">2.</span>
                    <span><strong className="text-foreground">Connect Wallet:</strong> RainbowKit modal for wallet connection</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">3.</span>
                    <span><strong className="text-foreground">Select Token:</strong> Choose from available tokens in wallet</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">4.</span>
                    <span><strong className="text-foreground">Quote Display:</strong> Review conversion rate and fees</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">5.</span>
                    <span><strong className="text-foreground">Approve Transaction:</strong> Sign transaction in wallet</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">6.</span>
                    <span><strong className="text-foreground">Switch Chain:</strong> If needed, switch to correct network</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">7.</span>
                    <span><strong className="text-foreground">Execute Route:</strong> LiFi processes multi-hop swaps/bridges</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">8.</span>
                    <span><strong className="text-foreground">Deliver MNEE:</strong> Tokens arrive at merchant address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-foreground">9.</span>
                    <span><strong className="text-foreground">Generate Receipt:</strong> Cryptographic QR proof of payment</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Security & Audits</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Smart Contract Security</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gravity's security foundation is built on LiFi's audited infrastructure:
                </p>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">LiFi Audits:</strong> Multiple independent security assessments by leading firms</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Bug Bounty:</strong> $1M+ bug bounty program incentivizes vulnerability discovery</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Diamond Standard:</strong> EIP-2535 implementation with controlled upgrade mechanisms</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Multi-Sig Governance:</strong> Critical upgrades require multiple signature approvals</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Time Locks:</strong> Mandatory waiting periods before implementing changes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Infrastructure Security</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Input Validation:</strong> Comprehensive sanitization prevents XSS and injection attacks</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Content Security Policy:</strong> Strict CSP headers protect against man-in-the-middle attacks</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">HTTPS Only:</strong> All communications use modern TLS encryption</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Rate Limiting:</strong> API endpoints protected against abuse and DDoS</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">User Protection</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Slippage Protection:</strong> Automatic rejection of excessive price impact</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Gas Estimation:</strong> Accurate fee calculation before transaction submission</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Error Handling:</strong> User-friendly messages with actionable solutions</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Balance Verification:</strong> Check sufficient funds before initiating payments</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tokenomics */}
          <section id="tokenomics" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">MNEE Tokenomics</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Settlement Token</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  MNEE serves as the universal settlement currency for all Gravity payments, creating a unified treasury 
                  solution while generating sustainable token demand.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Network</div>
                    <div className="font-semibold">Ethereum Mainnet</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Chain ID</div>
                    <div className="font-semibold">1</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Standard</div>
                    <div className="font-semibold">ERC20</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Value Accrual</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  MNEE's value proposition is driven by constant buy pressure from the universal payment infrastructure:
                </p>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Settlement Demand:</strong> Every payment creates buy pressure as tokens are converted to MNEE</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Network Effects:</strong> More merchants/users = higher transaction volume = increased demand</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Treasury Simplification:</strong> Merchants hold MNEE instead of managing 100+ token types</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Ecosystem Growth:</strong> Platform success directly correlates with MNEE utility</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Economic Model</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Fee Structure:</strong> Competitive transaction fees vs traditional processors (0.5-1%)</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Revenue Sharing:</strong> Partnership with LiFi on routing fees</span>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Merchant Savings:</strong> 80% reduction in operational costs vs managing multiple tokens</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section id="case-studies" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Real-World Case Studies</h2>
            
            <div className="space-y-12">
              {/* Case Study 1: Freelance Platform */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h3 className="text-2xl font-semibold">Case Study 1: Global Freelance Platform</h3>
                  </div>
                  <p className="text-muted-foreground">How a freelance marketplace integrated Gravity to enable borderless payments</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-red-400">The Problem</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Platform had 50,000+ freelancers across 120 countries</li>
                      <li>• Clients wanted to pay in various cryptocurrencies (ETH, USDC, DAI, etc.)</li>
                      <li>• Freelancers preferred receiving stable settlement in single token</li>
                      <li>• Traditional payment processors charged 2.9% + $0.30 per transaction</li>
                      <li>• International wire transfers took 3-5 days with $25-50 fees</li>
                      <li>• Managing 20+ token types created accounting nightmares</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-400">The Solution</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Integrated Gravity Protocol to create payment links for each freelance project. Clients could pay with 
                      any token they held, while freelancers received MNEE settlement automatically.
                    </p>
                    
                    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-xs overflow-x-auto mb-4">
                      <div className="text-zinc-400">// Integration Example</div>
                      <div className="text-zinc-100 mt-2">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">paymentLink</span> = <span className="text-purple-400">await</span> gravity.<span className="text-blue-400">createPaymentLink</span>({'{'}{'\n'}
                        {'  '}<span className="text-cyan-400">amount</span>: <span className="text-yellow-400">500</span>, <span className="text-zinc-500">// $500 USD</span>{'\n'}
                        {'  '}<span className="text-cyan-400">recipient</span>: freelancerWalletAddress,{'\n'}
                        {'  '}<span className="text-cyan-400">description</span>: <span className="text-green-400">"Website Design Project"</span>,{'\n'}
                        {'  '}<span className="text-cyan-400">settlementToken</span>: <span className="text-green-400">"MNEE"</span>{'\n'}
                        {'}'});
                      </div>
                    </div>

                    <MermaidDiagram chart={`
graph TD
    Client[Client in Germany<br/>Holds USDC on Polygon] --> Link[Clicks Payment Link<br/>gravity.xyz/pay/project123]
    Link --> Select[Selects USDC<br/>on Polygon]
    Select --> Quote[Gets Quote<br/>$500 = 500 USDC]
    Quote --> Approve[Approves Transaction]
    
    Approve --> Bridge[Polygon → Ethereum<br/>via Stargate]
    Bridge --> Swap[USDC → MNEE<br/>via Uniswap V3]
    Swap --> Settle[MNEE Delivered<br/>to Freelancer in India]
    Settle --> Receipt[Receipt Generated<br/>QR Proof of Payment]
                    `} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-400">Results & Metrics</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 mb-1">65%</div>
                        <div className="text-xs text-muted-foreground">Reduction in payment processing fees</div>
                        <div className="text-xs text-zinc-500 mt-1">From 2.9% to 1.0% average</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400 mb-1">{'<'}15 min</div>
                        <div className="text-xs text-muted-foreground">Average settlement time</div>
                        <div className="text-xs text-zinc-500 mt-1">vs. 3-5 days for wire transfers</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400 mb-1">80%</div>
                        <div className="text-xs text-muted-foreground">Reduction in accounting overhead</div>
                        <div className="text-xs text-zinc-500 mt-1">Single token treasury management</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-sm text-muted-foreground italic">
                      "Gravity transformed our payment infrastructure. Freelancers love the instant settlements, and we've 
                      saved over $120,000 in processing fees in the first quarter alone." 
                      <span className="block mt-2 text-xs text-blue-400">— CTO, Global Freelance Platform</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Case Study 2: E-Commerce Store */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <h3 className="text-2xl font-semibold">Case Study 2: Crypto-Native E-Commerce Store</h3>
                  </div>
                  <p className="text-muted-foreground">NFT marketplace accepting 100+ tokens with unified MNEE treasury</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-red-400">The Problem</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• NFT marketplace wanted to accept any token to maximize customer base</li>
                      <li>• Managing 100+ token types across 5 chains was operationally complex</li>
                      <li>• Price volatility risk when holding diverse token portfolio</li>
                      <li>• High gas fees on Ethereum mainnet deterred small purchases</li>
                      <li>• Customers on L2s couldn't easily purchase NFTs priced in ETH</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-400">The Solution</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Integrated Gravity payment links for each NFT listing. Customers could pay with any token on any 
                      supported chain, with automatic conversion to MNEE for the merchant.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="font-semibold mb-2 text-sm">Before Gravity</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>✗ Only accepted ETH and USDC</li>
                          <li>✗ Lost 40% of potential customers</li>
                          <li>✗ High gas fees on mainnet</li>
                          <li>✗ Manual token management</li>
                        </ul>
                      </div>
                      <div className="p-4 border border-green-500/50 bg-green-500/5 rounded-lg">
                        <div className="font-semibold mb-2 text-sm text-green-400">After Gravity</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>Accept 1.2M+ tokens</li>
                          <li>85% increase in conversion rate</li>
                          <li>L2 support with low fees</li>
                          <li>Automated MNEE settlement</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-400">Results & Metrics</h4>
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-400">+85%</div>
                        <div className="text-xs text-muted-foreground mt-1">Conversion Rate</div>
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-400">$2.4M</div>
                        <div className="text-xs text-muted-foreground mt-1">Monthly Volume</div>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
                        <div className="text-xl font-bold text-purple-400">20+</div>
                        <div className="text-xs text-muted-foreground mt-1">Chains Supported</div>
                      </div>
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                        <div className="text-xl font-bold text-yellow-400">0.8%</div>
                        <div className="text-xs text-muted-foreground mt-1">Avg Fee</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Study 3: Event Ticketing */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <h3 className="text-2xl font-semibold">Case Study 3: Web3 Conference Ticketing</h3>
                  </div>
                  <p className="text-muted-foreground">10,000-attendee conference using QR code payments</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-red-400">The Problem</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Conference expected 10,000 attendees from global crypto community</li>
                      <li>• Attendees held tokens across different chains and ecosystems</li>
                      <li>• Traditional ticketing platforms charged 10-15% fees</li>
                      <li>• Wanted to offer crypto payments but avoid token fragmentation</li>
                      <li>• Needed instant verification for on-site ticket scanning</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-400">The Solution</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Created Gravity payment links for each ticket tier (General Admission, VIP, Speaker Pass). 
                      Generated QR codes for easy sharing and mobile payments.
                    </p>

                    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 mb-4">
                      <div className="text-sm font-semibold mb-3 text-purple-400">Payment Flow</div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">1</div>
                          <div>Attendee scans QR code from conference website</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
                          <div>Connects wallet (MetaMask, Rainbow, Coinbase Wallet)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">3</div>
                          <div>Pays with any token (USDC on Base, ETH on Arbitrum, etc.)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">4</div>
                          <div>Receives NFT ticket + QR receipt instantly</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">5</div>
                          <div>Organizer receives MNEE settlement</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-400">Results & Metrics</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-400 mb-1">9,847</div>
                          <div className="text-xs text-muted-foreground">Tickets Sold via Gravity</div>
                          <div className="text-xs text-zinc-500 mt-1">98.5% of total sales</div>
                        </div>
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400 mb-1">$1.2M</div>
                          <div className="text-xs text-muted-foreground">Total Revenue</div>
                          <div className="text-xs text-zinc-500 mt-1">Saved $120K in platform fees</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400 mb-1">47</div>
                          <div className="text-xs text-muted-foreground">Different Tokens Used</div>
                          <div className="text-xs text-zinc-500 mt-1">Across 12 different chains</div>
                        </div>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400 mb-1">{'<'}2 min</div>
                          <div className="text-xs text-muted-foreground">Avg Checkout Time</div>
                          <div className="text-xs text-zinc-500 mt-1">Including wallet connection</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded-r-lg">
                    <p className="text-sm text-muted-foreground italic">
                      "Gravity made our ticketing seamless. Attendees loved paying with their preferred tokens, and we 
                      eliminated the 15% Eventbrite fee. The QR code system worked flawlessly for 10,000 check-ins." 
                      <span className="block mt-2 text-xs text-purple-400">— Event Organizer, ETHGlobal Conference</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cost-Benefit Analysis */}
          <section id="cost-analysis" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Cost-Benefit Analysis</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Fee Comparison</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Gravity offers significant cost savings compared to traditional payment processors and direct crypto acceptance:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg overflow-hidden">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-4 text-left font-semibold">Payment Method</th>
                        <th className="p-4 text-left font-semibold">Base Fee</th>
                        <th className="p-4 text-left font-semibold">Gas Costs</th>
                        <th className="p-4 text-left font-semibold">Settlement Time</th>
                        <th className="p-4 text-left font-semibold">Total Cost ($100)</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t border-border">
                        <td className="p-4 font-semibold">Stripe / PayPal</td>
                        <td className="p-4 text-muted-foreground">2.9% + $0.30</td>
                        <td className="p-4 text-muted-foreground">N/A</td>
                        <td className="p-4 text-muted-foreground">2-7 days</td>
                        <td className="p-4 font-bold text-red-400">$3.20</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-4 font-semibold">Coinbase Commerce</td>
                        <td className="p-4 text-muted-foreground">1.0%</td>
                        <td className="p-4 text-muted-foreground">$2-15 (Ethereum)</td>
                        <td className="p-4 text-muted-foreground">15-30 min</td>
                        <td className="p-4 font-bold text-orange-400">$3.00 - $16.00</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-4 font-semibold">Direct Crypto (ETH)</td>
                        <td className="p-4 text-muted-foreground">0%</td>
                        <td className="p-4 text-muted-foreground">$5-20 (Ethereum)</td>
                        <td className="p-4 text-muted-foreground">15-30 min</td>
                        <td className="p-4 font-bold text-yellow-400">$5.00 - $20.00</td>
                      </tr>
                      <tr className="border-t border-border bg-green-500/5">
                        <td className="p-4 font-semibold text-green-400">Gravity Protocol</td>
                        <td className="p-4 text-muted-foreground">0.5-1.0%</td>
                        <td className="p-4 text-muted-foreground">$0.50-$3 (L2 optimized)</td>
                        <td className="p-4 text-muted-foreground">{'<'}15 min</td>
                        <td className="p-4 font-bold text-green-400">$1.00 - $4.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-green-400">Savings Example:</strong> For a merchant processing $100,000/month, 
                    Gravity saves approximately <strong className="text-green-400">$1,900/month</strong> compared to Stripe 
                    ($2,900 vs. $1,000 in fees).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">ROI Projections</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Monthly Volume</div>
                    <div className="text-3xl font-bold mb-4">$10,000</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stripe Cost:</span>
                        <span className="text-red-400">$290</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gravity Cost:</span>
                        <span className="text-green-400">$100</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 font-semibold">
                        <span>Monthly Savings:</span>
                        <span className="text-green-400">$190</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Annual Savings:</span>
                        <span className="text-green-400">$2,280</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-blue-500/5">
                    <div className="text-sm text-muted-foreground mb-2">Monthly Volume</div>
                    <div className="text-3xl font-bold mb-4">$100,000</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stripe Cost:</span>
                        <span className="text-red-400">$2,900</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gravity Cost:</span>
                        <span className="text-green-400">$1,000</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 font-semibold">
                        <span>Monthly Savings:</span>
                        <span className="text-green-400">$1,900</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Annual Savings:</span>
                        <span className="text-green-400">$22,800</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-purple-500/5">
                    <div className="text-sm text-muted-foreground mb-2">Monthly Volume</div>
                    <div className="text-3xl font-bold mb-4">$1,000,000</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stripe Cost:</span>
                        <span className="text-red-400">$29,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gravity Cost:</span>
                        <span className="text-green-400">$10,000</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 font-semibold">
                        <span>Monthly Savings:</span>
                        <span className="text-green-400">$19,000</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Annual Savings:</span>
                        <span className="text-green-400">$228,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Hidden Cost Savings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Beyond direct fee savings, Gravity eliminates operational overhead:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Treasury Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Eliminate 20+ hours/month managing multiple token types. Single MNEE treasury reduces accounting 
                      complexity by 80%.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-lg">
                    <h4 className="font-semibold mb-2">No Chargebacks</h4>
                    <p className="text-sm text-muted-foreground">
                      Crypto payments are final. Save 1-2% of revenue typically lost to fraudulent chargebacks in 
                      traditional systems.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-500/5 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Global Reach</h4>
                    <p className="text-sm text-muted-foreground">
                      Accept payments from 180+ countries without international transaction fees or currency conversion costs.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/5 rounded-r-lg">
                    <h4 className="font-semibold mb-2">Instant Settlement</h4>
                    <p className="text-sm text-muted-foreground">
                      Improve cash flow with {'<'}15 minute settlements vs. 2-7 days for traditional processors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Competitive Analysis */}
          <section id="comparison" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Competitive Analysis</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Feature Matrix</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  How Gravity compares to alternative payment solutions:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg overflow-hidden text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left font-semibold">Feature</th>
                        <th className="p-3 text-center font-semibold bg-green-500/10">Gravity</th>
                        <th className="p-3 text-center font-semibold">Coinbase Commerce</th>
                        <th className="p-3 text-center font-semibold">BitPay</th>
                        <th className="p-3 text-center font-semibold">Request Network</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-3">Multi-Chain Support</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - 20+ chains</td>
                        <td className="p-3 text-center">Yes - 10 chains</td>
                        <td className="p-3 text-center">No - BTC/ETH only</td>
                        <td className="p-3 text-center">Yes - 15 chains</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Universal Token Acceptance</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - 1.2M+ tokens</td>
                        <td className="p-3 text-center">Limited - 100+ tokens</td>
                        <td className="p-3 text-center">No - 10 tokens</td>
                        <td className="p-3 text-center">Limited - 500+ tokens</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Automatic Conversion</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - To MNEE</td>
                        <td className="p-3 text-center">No - Receive as-is</td>
                        <td className="p-3 text-center">Yes - To fiat</td>
                        <td className="p-3 text-center">No - Receive as-is</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Cross-Chain Routing</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - Automatic</td>
                        <td className="p-3 text-center">No - Manual</td>
                        <td className="p-3 text-center">No - Not supported</td>
                        <td className="p-3 text-center">Yes - Automatic</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Transaction Fees</td>
                        <td className="p-3 text-center bg-green-500/5">0.5-1.0%</td>
                        <td className="p-3 text-center">1.0%</td>
                        <td className="p-3 text-center">1.0%</td>
                        <td className="p-3 text-center">0.1-0.5%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">QR Code Payments</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - Built-in</td>
                        <td className="p-3 text-center">Yes</td>
                        <td className="p-3 text-center">Yes</td>
                        <td className="p-3 text-center">Yes</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Social Payment Links</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - gravity.xyz/pay/id</td>
                        <td className="p-3 text-center">Yes</td>
                        <td className="p-3 text-center">No</td>
                        <td className="p-3 text-center">Complex URLs</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Settlement Speed</td>
                        <td className="p-3 text-center bg-green-500/5">{'<'}15 min</td>
                        <td className="p-3 text-center">15-30 min</td>
                        <td className="p-3 text-center">1-2 days (fiat)</td>
                        <td className="p-3 text-center">15-30 min</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">No-Code Integration</td>
                        <td className="p-3 text-center bg-green-500/5">Yes - Payment links</td>
                        <td className="p-3 text-center">Yes</td>
                        <td className="p-3 text-center">Yes</td>
                        <td className="p-3 text-center">No - Code required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Performance Benchmarks</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Transaction Success Rates</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Gravity Protocol</span>
                          <span className="font-semibold text-green-400">98.5%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '98.5%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Coinbase Commerce</span>
                          <span className="font-semibold">96.2%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '96.2%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Direct Crypto</span>
                          <span className="font-semibold">92.8%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '92.8%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Average Gas Costs (USD)</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Gravity (L2 Optimized)</span>
                          <span className="font-semibold text-green-400">$1.50</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Coinbase Commerce</span>
                          <span className="font-semibold">$5.20</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '52%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Direct ETH Mainnet</span>
                          <span className="font-semibold">$12.80</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">What happens if a transaction fails mid-route?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-4 leading-relaxed">
                    Gravity implements comprehensive failure handling at every step:
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="leading-relaxed">• <strong>Bridge Failures:</strong> If a cross-chain bridge fails, the transaction is automatically reverted and funds are returned to the user's wallet</li>
                    <li className="leading-relaxed">• <strong>DEX Swap Failures:</strong> Slippage protection ensures swaps only execute within tolerance. Failed swaps trigger automatic refunds</li>
                    <li className="leading-relaxed">• <strong>Gas Estimation:</strong> Pre-flight checks verify sufficient gas before execution to minimize mid-transaction failures</li>
                    <li className="leading-relaxed">• <strong>Retry Mechanism:</strong> Users can retry failed transactions with alternative routes suggested by the system</li>
                  </ul>
                  <p className="mt-4 text-xs text-blue-400 italic">
                    Our 98.5% success rate is achieved through rigorous pre-execution validation and fallback routing.
                  </p>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">How do you handle price volatility during multi-hop swaps?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-4 leading-relaxed">
                    We employ several mechanisms to protect against price volatility:
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="leading-relaxed">• <strong>Real-Time Quotes:</strong> Quotes are fetched in real-time and valid for 30 seconds</li>
                    <li className="leading-relaxed">• <strong>Slippage Protection:</strong> Default 0.5% slippage tolerance with dynamic adjustment based on market conditions</li>
                    <li className="leading-relaxed">• <strong>Minimum Output Guarantee:</strong> Transactions specify minimum MNEE output; if not met, the transaction reverts</li>
                    <li className="leading-relaxed">• <strong>Fast Execution:</strong> Multi-hop swaps typically complete in {'<'}15 minutes, minimizing exposure to volatility</li>
                    <li className="leading-relaxed">• <strong>MEV Protection:</strong> Private mempool routing prevents front-running on volatile swaps</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">Can I get refunds if I change my mind?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-4 leading-relaxed">
                    Cryptocurrency transactions are irreversible by design, but Gravity provides options:
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="leading-relaxed">• <strong>Before Execution:</strong> You can cancel anytime before approving the transaction in your wallet</li>
                    <li className="leading-relaxed">• <strong>After Execution:</strong> Refunds depend on the merchant's policy. Merchants can initiate refunds by sending MNEE back to your address</li>
                    <li className="leading-relaxed">• <strong>Merchant Tools:</strong> Our dashboard provides one-click refund functionality for merchants</li>
                    <li className="leading-relaxed">• <strong>Dispute Resolution:</strong> For high-value transactions, merchants can optionally use escrow smart contracts</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">What's the maximum transaction size?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-4 leading-relaxed">
                    Transaction limits depend on liquidity availability:
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="leading-relaxed">• <strong>Typical Limit:</strong> $100,000 per transaction for most token pairs</li>
                    <li className="leading-relaxed">• <strong>Large Transactions:</strong> Up to $1M+ for highly liquid pairs (USDC, ETH, WBTC)</li>
                    <li className="leading-relaxed">• <strong>Split Orders:</strong> Larger amounts automatically split across multiple DEXs to minimize slippage</li>
                    <li className="leading-relaxed">• <strong>Custom Solutions:</strong> For institutional volumes ({'>'} $10M), contact us for OTC routing</li>
                  </ul>
                  <p className="mt-4 text-xs text-blue-400 italic">
                    The system automatically checks liquidity depth before presenting quotes to ensure successful execution.
                  </p>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">Do I need to create an account to use Gravity?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-3 leading-relaxed">
                    <strong>For Payers:</strong> No account needed! Simply:
                  </p>
                  <ul className="space-y-2 ml-4 mb-4">
                    <li className="leading-relaxed">1. Click the payment link</li>
                    <li className="leading-relaxed">2. Connect your Web3 wallet (MetaMask, Rainbow, etc.)</li>
                    <li className="leading-relaxed">3. Complete the payment</li>
                  </ul>
                  <p className="mb-3 leading-relaxed">
                    <strong>For Merchants:</strong> Create a free account to:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="leading-relaxed">• Generate payment links</li>
                    <li className="leading-relaxed">• Track payment history</li>
                    <li className="leading-relaxed">• Access analytics dashboard</li>
                    <li className="leading-relaxed">• Download receipts and reports</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">How is Gravity different from using a DEX aggregator directly?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-4 leading-relaxed">
                    Gravity is purpose-built for payments, not just token swaps:
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="leading-relaxed">• <strong>Payment Links:</strong> Share gravity.xyz/pay/id instead of wallet addresses</li>
                    <li className="leading-relaxed">• <strong>Unified Settlement:</strong> Automatic conversion to MNEE for treasury management</li>
                    <li className="leading-relaxed">• <strong>QR Codes:</strong> Mobile-friendly payment experience</li>
                    <li className="leading-relaxed">• <strong>Receipt Generation:</strong> Cryptographic proof of payment for accounting</li>
                    <li className="leading-relaxed">• <strong>Merchant Dashboard:</strong> Track all payments, analytics, and revenue in one place</li>
                    <li className="leading-relaxed">• <strong>No Technical Knowledge:</strong> Users don't need to understand bridges, DEXs, or routing</li>
                  </ul>
                  <p className="mt-4 leading-relaxed italic">
                    Think of Gravity as "Stripe for crypto" rather than just a swap aggregator.
                  </p>
                </div>
              </details>

              <details className="group border border-border rounded-lg overflow-hidden bg-white">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-muted transition-colors flex justify-between items-center">
                  <span className="text-base">What chains and tokens are supported?</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground border-t border-border">
                  <p className="mb-3 leading-relaxed">
                    <strong>Supported Chains (20+):</strong>
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-6 ml-1">
                    <div className="flex items-center gap-2">• Ethereum (Chain ID: 1)</div>
                    <div className="flex items-center gap-2">• Optimism (Chain ID: 10)</div>
                    <div className="flex items-center gap-2">• Arbitrum (Chain ID: 42161)</div>
                    <div className="flex items-center gap-2">• Base (Chain ID: 8453)</div>
                    <div className="flex items-center gap-2">• Polygon (Chain ID: 137)</div>
                    <div className="flex items-center gap-2">• Avalanche (Chain ID: 43114)</div>
                    <div className="flex items-center gap-2">• BNB Chain (Chain ID: 56)</div>
                    <div className="flex items-center gap-2 text-muted-foreground/70">• And 13+ more...</div>
                  </div>
                  <p className="mb-2 leading-relaxed">
                    <strong>Supported Tokens:</strong> 1.2M+ ERC20 tokens including:
                  </p>
                  <div className="text-xs leading-relaxed ml-1 p-3 bg-muted/30 rounded-md border border-border/50">
                    ETH, WETH, USDC, USDT, DAI, WBTC, LINK, UNI, AAVE, CRV, BAL, MATIC, OP, ARB, and virtually any ERC20 token with liquidity
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Current Status (Q4 2024 - Q1 2025)</h3>
                
                <div className="space-y-4">
                  <div className="p-6 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <h4 className="font-semibold">Core Infrastructure Complete</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                      <li>• LiFi SDK integration with Wagmi 3.0 and Viem</li>
                      <li>• Payment link generation with customizable themes</li>
                      <li>• QR code payment system with animated UI</li>
                      <li>• Dashboard analytics for payment tracking</li>
                    </ul>
                  </div>

                  <div className="p-6 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <h4 className="font-semibold">Multi-Chain Support</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                      <li>• Ethereum Mainnet (Chain ID: 1)</li>
                      <li>• Optimism, Arbitrum, Base, Polygon support</li>
                      <li>• Automatic chain switching with Wagmi</li>
                    </ul>
                  </div>

                  <div className="p-6 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <h4 className="font-semibold">Mainnet Launch</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                      <li>• Security audits and testing</li>
                      <li>• Production deployment pipeline</li>
                      <li>• Merchant onboarding program</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Future Development (2025+)</h3>
                
                <div className="space-y-4">
                  <div className="p-6 border border-border rounded-lg">
                    <h4 className="font-semibold mb-3">Q2 2025: Enhanced Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Mobile native apps (iOS & Android)</li>
                      <li>• Subscription payment support</li>
                      <li>• Advanced analytics with AI insights</li>
                      <li>• Multi-signature merchant wallets</li>
                    </ul>
                  </div>

                  <div className="p-6 border border-border rounded-lg">
                    <h4 className="font-semibold mb-3">Q3 2025: Ecosystem Expansion</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Additional Layer 2 network support</li>
                      <li>• DeFi protocol integrations</li>
                      <li>• NFT payment capabilities</li>
                      <li>• E-commerce platform plugins</li>
                    </ul>
                  </div>

                  <div className="p-6 border border-border rounded-lg">
                    <h4 className="font-semibold mb-3">Q4 2025: Decentralization</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Community governance implementation</li>
                      <li>• Protocol token launch</li>
                      <li>• Global exchange partnerships</li>
                      <li>• Regulatory compliance framework</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 mt-16 text-center text-sm text-muted-foreground">
            <p className="mb-4">
              For more information, visit{" "}
              <a href="https://gravity-mnee.xyz" className="text-primary hover:underline">
                gravity-mnee.xyz
              </a>
            </p>
            <p>© 2025 Gravity Protocol. Built with LiFi Integration.</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
