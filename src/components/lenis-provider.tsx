'use client'

import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Adjust for desired scroll speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      orientation:"vertical",
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Adjust sensitivity
      syncTouch: false, // Set to true for touch devices if needed
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up Lenis instance on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}