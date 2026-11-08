"use client";

import React from "react";
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}

