"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { INITIAL_FACILITY_PROFILE, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  hasPip?: boolean;
}

interface NavSection {
  sectionTitle?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    sectionTitle: "Core Operations",
    items: [
      { title: "Overview", href: "/dashboard", icon: "dashboard" },
      { title: "Voice Assistant", href: "/assistant", icon: "mic", badge: "AI" },
      { title: "Manufacturing Plant", href: "/onboarding", icon: "precision_manufacturing" },
      { title: "Carbon Intelligence", href: "/calc-engine", icon: "biotech" },
      { title: "Compliance Reports", href: "/reports", icon: "verified_user", hasPip: true },
    ],
  },
  {
    sectionTitle: "Optimization & Supply",
    items: [
      { title: "Decarbonization Planner", href: "/planner", icon: "trending_up" },
      { title: "Supply Chain Nudge", href: "/suppliers", icon: "share", badge: "NEW" },
      { title: "Government Schemes", href: "/schemes", icon: "account_balance" },
      { title: "Peer Benchmarks", href: "/benchmarks", icon: "leaderboard", badge: "NEW" },
      { title: "Group-Buying Pool", href: "/group-buying", icon: "groups" },
    ],
  },
  {
    sectionTitle: "Trust & Regulatory",
    items: [
      { title: "Digital Product Passport", href: "/passport", icon: "qr_code_2", badge: "DPP" },
      { title: "Regulation Radar & CCTS", href: "/compliance", icon: "radar" },
      { title: "Auditor Sign-Off", href: "/verification", icon: "verified" },
      { title: "Export Paperwork", href: "/export-paperwork", icon: "assignment" },
      { title: "Audit History", href: "/audit-history", icon: "history_edu" },
    ],
  },
];

export function SidebarNavigation({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfile(getStoredFacilityProfile());
      const handleProfileUpdate = () => {
        setProfile(getStoredFacilityProfile());
      };
      window.addEventListener("carbonready_profile_updated", handleProfileUpdate);
      return () => {
        window.removeEventListener("carbonready_profile_updated", handleProfileUpdate);
      };
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/20">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Brand Identity */}
        <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-lowest/60 border-b border-outline-variant/10 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="material-symbols-outlined text-lg">energy_savings_leaf</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors">
                CarbonReady
              </span>
              <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest text-[9px]">
                Copilot OS
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-space-xs px-space-xs py-0.5 rounded bg-surface-container-high">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">v2.4</span>
          </div>
        </div>

        {/* Enterprise Plant Context Tile */}
        <Link
          href="/onboarding"
          className="px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high transition-colors block border-b border-outline-variant/10 shrink-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs overflow-hidden">
              <span className="material-symbols-outlined text-primary text-base shrink-0">factory</span>
              <div className="truncate">
                <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{profile.companyName}</p>
                <p className="font-label-mono text-label-mono text-on-surface-variant text-[10px] truncate">{profile.facilityName} · {profile.facilityId}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base cursor-pointer hover:text-on-surface">unfold_more</span>
          </div>
        </Link>

        {/* Scrollable Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-md">
          {NAV_SECTIONS.map((sec, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {sec.sectionTitle && (
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/70 px-space-sm py-1 font-semibold">
                  {sec.sectionTitle}
                </span>
              )}
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`relative z-10 flex items-center gap-space-sm px-space-md py-space-xs rounded-lg transition-colors ${
                        isActive
                          ? "text-on-primary-container font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-base ${isActive ? "text-on-primary-container" : "text-primary/80"}`}>
                        {item.icon}
                      </span>
                      <span className="font-body-md text-body-md flex-1 text-[12px]">{item.title}</span>
                      {item.badge && (
                        <span className="font-label-mono text-label-mono text-[8px] px-1 rounded bg-surface-container-highest text-primary font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.hasPip && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    </Link>

                    {isActive && (
                      <motion.div
                        layoutId="activeNavHighlight"
                        className="absolute inset-0 bg-primary-container rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Customs Registry Footer */}
      <div className="p-space-md bg-surface-container-lowest/80 flex flex-col gap-space-xs border-t border-outline-variant/10 shrink-0">
        <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col gap-1 text-[10px] font-label-mono">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant uppercase">EU Customs XML</span>
            <span className="text-primary flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>v2.4
            </span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Audit Seal</span>
            <span className="text-secondary font-mono">0x7F2A...CB49</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
