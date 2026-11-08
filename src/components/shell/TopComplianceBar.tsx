"use client";

import { useState, useEffect } from "react";
import { resetToDemoBaseline } from "@/lib/data/initial-plant-data";

export function TopComplianceBar({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const [currentLang, setCurrentLang] = useState<"en" | "hi" | "mr">("en");
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  useEffect(() => {
    function checkBatch() {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("carbonready_active_batch");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.batchId) setActiveBatchId(parsed.batchId);
            setIsDemoMode(!!parsed.isDemoBatch);
          } catch {
            setIsDemoMode(true);
          }
        } else {
          setIsDemoMode(true);
        }
      }
    }

    checkBatch();
    window.addEventListener("carbonready_batch_updated", checkBatch);
    return () => {
      window.removeEventListener("carbonready_batch_updated", checkBatch);
    };
  }, []);

  const handleReset = () => {
    resetToDemoBaseline();
    setActiveBatchId("BATCH-2025-Q1-0842");
    setIsDemoMode(true);
    setResetNotice("Benchmark demo data restored!");
    setTimeout(() => setResetNotice(null), 3000);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/15 z-40 flex items-center justify-between px-space-md lg:px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left Compliance Flags & Demo Mode Controller */}
      <div className="flex items-center gap-space-sm lg:gap-space-md">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          aria-label="Toggle Navigation Drawer"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-base">verified</span>
          <span className="font-label-mono text-label-mono text-primary font-medium tracking-wide uppercase text-[11px]">
            EU CBAM Q2-2025: 92% Ready
          </span>
        </div>

        {/* Global Demo Status / Reset Controller */}
        {isDemoMode ? (
          <div className="hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-label-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider">DEMO DATA</span>
            <button
              onClick={handleReset}
              className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[9px] font-bold transition-all flex items-center gap-0.5"
              title="Reset application state to clean benchmark demo baseline"
            >
              <span className="material-symbols-outlined text-[11px]">restart_alt</span>
              <span>Reset Demo</span>
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider">LIVE BATCH: {activeBatchId || "ACTIVE"}</span>
            <button
              onClick={handleReset}
              className="ml-1 px-1.5 py-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary text-[9px] font-bold transition-all flex items-center gap-0.5"
              title="Switch back to clean demo baseline"
            >
              <span className="material-symbols-outlined text-[11px]">science</span>
              <span>Demo Mode</span>
            </button>
          </div>
        )}

        {resetNotice && (
          <span className="text-[10px] font-label-mono text-primary animate-fade-in px-2 py-0.5 bg-primary/10 rounded">
            {resetNotice}
          </span>
        )}
      </div>

      {/* Right Controls: Multilingual Toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-space-sm lg:gap-space-md">
        {/* Vernacular Language Switcher */}
        <div className="hidden md:flex items-center bg-surface-container-high rounded-full p-0.5 border border-outline-variant/20">
          <button
            onClick={() => setCurrentLang("en")}
            className={`px-space-sm py-0.5 rounded-full font-label-mono text-label-mono transition-all text-[11px] ${
              currentLang === "en"
                ? "bg-surface-container-highest text-on-surface font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLang("hi")}
            className={`px-space-sm py-0.5 rounded-full font-label-mono text-label-mono transition-all text-[11px] ${
              currentLang === "hi"
                ? "bg-surface-container-highest text-on-surface font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setCurrentLang("mr")}
            className={`px-space-sm py-0.5 rounded-full font-label-mono text-label-mono transition-all text-[11px] ${
              currentLang === "mr"
                ? "bg-surface-container-highest text-on-surface font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            मराठी
          </button>
        </div>

        {/* Notifications Icon with Indicator */}
        <button
          className="relative p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-space-sm pl-space-xs lg:pl-space-sm bg-surface-container-low/70 py-1 pr-space-sm lg:pr-space-md rounded-full border border-outline-variant/15">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-mono text-xs text-primary font-bold border border-primary/30">
            RS
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="font-body-sm text-[12px] font-semibold text-on-surface leading-tight">
              Rajesh Sharma
            </span>
            <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">
              MD · Ludhiana Works
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
