"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let mermaidInitialized = false;

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (typeof window === "undefined" || !containerRef.current) return;

      try {
        // Dynamically import mermaid only on client side
        const mermaid = (await import("mermaid")).default;

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              primaryColor: "#ffffff",
              primaryTextColor: "#000000",
              primaryBorderColor: "#000000",
              lineColor: "#000000",
              secondaryColor: "#ffffff",
              tertiaryColor: "#ffffff",
              background: "#ffffff",
              mainBkg: "#ffffff",
              secondBkg: "#ffffff",
              textColor: "#000000",
              border1: "#000000",
              border2: "#000000",
              fontSize: "14px",
              nodeBorder: "#000000",
              clusterBkg: "#ffffff",
              clusterBorder: "#000000",
              edgeLabelBackground: "#ffffff",
            },
            flowchart: {
              htmlLabels: true,
              curve: "basis",
            },
          });
          mermaidInitialized = true;
        }

        // Clear container
        containerRef.current.innerHTML = "";

        // Create a unique ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, chart.trim());
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error, "\nChart:", chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color: red; padding: 20px; border: 1px solid red;">
            <strong>Error rendering diagram</strong><br/>
            Check browser console for details
          </div>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "my-8 p-6 rounded-xl border border-black bg-white overflow-x-auto min-h-[200px]",
        className
      )}
    />
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
