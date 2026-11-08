"use client";

import React, { useEffect, useState } from "react";
import { animate } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 0.8,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    // If reduced motion is requested or value is 0, set directly
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(displayValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  const formatted = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

