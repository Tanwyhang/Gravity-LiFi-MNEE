"use client";

import { WidgetConfig } from '@lifi/widget';
import dynamic from 'next/dynamic';

const LiFiWidget = dynamic(
  () => import('@lifi/widget').then((mod) => mod.LiFiWidget),
  { ssr: false }
);

const widgetConfig: WidgetConfig = {
  integrator: 'Gravity-ERC20-Payment',
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
  variant: 'compact',
  subvariant: 'default',
  appearance: 'light', // or 'dark' based on your app theme
};

export function SwapTab() {
  return (
    <div className="flex justify-center items-start min-h-[600px] py-8">
      <LiFiWidget integrator="Gravity-ERC20-Payment" config={widgetConfig} />
    </div>
  );
}
