import { SVGProps } from "react";

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
}

export function Iphone15Pro({
  width = 433,
  height = 882,
  src,
  className,
  ...props
}: Iphone15ProProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 433 882"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M0 65C0 29.1015 29.1015 0 65 0H368C403.899 0 433 29.1015 433 65V817C433 852.899 403.899 882 368 882H65C29.1015 882 0 852.899 0 817V65Z"
        fill="#1A1A1A"
      />
      <path
        d="M3 65C3 30.7584 30.7584 3 65 3H368C402.242 3 430 30.7584 430 65V817C430 851.242 402.242 879 368 879H65C30.7584 879 3 851.242 3 817V65Z"
        stroke="#404040"
        strokeWidth="6"
      />
      <path
        d="M12 65C12 35.7289 35.7289 12 65 12H368C397.271 12 421 35.7289 421 65V817C421 846.271 397.271 870 368 870H65C35.7289 870 12 846.271 12 817V65Z"
        fill="black"
      />
      
      {/* Dynamic Island */}
      <rect x="136" y="22" width="161" height="45" rx="22.5" fill="black" />
      
      {/* Screen Content Area */}
      <foreignObject x="25" y="25" width="383" height="832" clipPath="url(#screen-mask)">
        <div className="w-full h-full overflow-hidden bg-background rounded-[45px]">
           {props.children}
        </div>
      </foreignObject>

      <defs>
        <clipPath id="screen-mask">
           <rect x="25" y="25" width="383" height="832" rx="45" />
        </clipPath>
      </defs>
    </svg>
  );
}
