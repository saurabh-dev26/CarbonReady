"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AppShell } from "@/components/shell/AppShell";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* TOP IN-PAGE WORKSPACE NAVIGATION & REGULATORY TICKER */}
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-space-sm flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/15 shadow-md"
        >
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-label-mono text-label-mono text-primary font-semibold tracking-wider text-[11px]">
                CLIMATE OS v2.4
              </span>
            </div>
            <div className="h-4 w-px bg-outline-variant/30 hidden sm:block"></div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-mono text-label-mono text-[11px]">
              <span className="material-symbols-outlined text-primary text-sm">security</span>
              <span>MANDATE ALERT: EU CBAM DEFINITIVE PERIOD (JAN 2026) INGESTION PORTAL ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <div className="hidden lg:flex items-center gap-1 bg-surface-container rounded-lg p-0.5 border border-outline-variant/20">
              <Link
                className="px-space-sm py-1 font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors text-xs"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="px-space-sm py-1 font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors text-xs"
                href="/assistant"
              >
                Voice Copilot
              </Link>
              <Link
                className="px-space-sm py-1 font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors text-xs"
                href="/calc-engine"
              >
                CBAM Engine
              </Link>
              <Link
                className="px-space-sm py-1 font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors text-xs"
                href="/schemes"
              >
                Subsidies &amp; ROI
              </Link>
              <Link
                className="px-space-sm py-1 font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors text-xs"
                href="/audit-history"
              >
                Audit Ledger
              </Link>
            </div>
            <Link
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-label-mono transition-colors text-xs border border-primary/20"
              href="/dashboard"
            >
              Explore Live Demo
            </Link>
            <Link
              className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary font-label-ui text-label-ui font-semibold shadow-sm transition-all text-xs"
              href="/onboarding"
            >
              Get Started (MSME Tier)
            </Link>
          </div>
        </motion.section>

        {/* HERO SECTION */}
        <section className="relative w-full rounded-2xl bg-gradient-to-b from-surface-container-lowest via-surface-container-low to-surface-container p-space-lg lg:p-space-xl overflow-hidden border border-outline-variant/15 shadow-xl">
          <motion.div
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 bottom-0 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Column: Copy & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col gap-space-md"
            >
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high font-label-mono text-label-mono text-secondary-fixed text-[11px] border border-secondary/20">
                  <span className="material-symbols-outlined text-sm">verified_user</span> EU CBAM 2026 Ready
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high font-label-mono text-label-mono text-on-surface-variant text-[11px] border border-outline-variant/20">
                  <span className="material-symbols-outlined text-sm">balance</span> BRSR Core Aligned
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high font-label-mono text-label-mono text-tertiary text-[11px] border border-tertiary/20">
                  <span className="material-symbols-outlined text-sm">mic_external_on</span> Acoustic Industrial AI
                </span>
              </div>

              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold text-3xl lg:text-5xl leading-tight">
                AI Carbon Compliance. <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
                  Engineered for Indian MSME Exporters.
                </span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed text-sm lg:text-base">
                <strong className="text-on-surface font-semibold">AI-powered carbon intelligence and compliance assistance for Indian MSME exporters.</strong> Turn vernacular furnace logs into audited EU CBAM dossiers, protect export margins from punitive default tariffs (€142,500/1k MT), and secure green transition capital.
              </p>

              {/* CTA cluster */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-space-xs">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/onboarding"
                    className="px-space-lg py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-label-ui font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    <span>Launch Copilot &amp; Onboard</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/assistant"
                    className="px-space-md py-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-label-ui font-medium flex items-center justify-center gap-2 border border-outline-variant/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">mic</span>
                    <span>Try Voice Assistant Demo</span>
                  </Link>
                </motion.div>
              </div>

              {/* Metric micro-ribbon */}
              <div className="grid grid-cols-3 gap-space-md pt-space-md border-t border-outline-variant/15">
                <div className="flex flex-col">
                  <span className="font-metric-md text-metric-md text-primary font-bold">€142,500</span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">
                    Avg Penalty Avoided / 1k MT
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metric-md text-metric-md text-on-surface font-bold">&lt; 90 Sec</span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">
                    Daily Voice Shift Intake
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metric-md text-metric-md text-tertiary font-bold">XML v2.4</span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">
                    Direct DG TAXUD Standard
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Live Speech Ingestion Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col"
            >
              <div className="bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/20 shadow-xl flex flex-col gap-space-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                    <span className="font-label-mono text-label-mono text-on-surface font-semibold uppercase text-xs">
                      Real-Time Intake Terminal
                    </span>
                  </div>
                  <span className="font-label-mono text-label-mono px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-[10px]">
                    Ludhiana Meltshop #3
                  </span>
                </div>

                {/* Audio Waveform Graphic */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2 border border-outline-variant/10">
                  <div className="flex items-center justify-between text-on-surface-variant font-label-mono text-label-mono text-[10px]">
                    <span className="flex items-center gap-1.5 text-primary">
                      <span className="material-symbols-outlined text-sm">graphic_eq</span> Hindi Acoustic Stream
                    </span>
                    <span>Confidence: 98.4%</span>
                  </div>
                  {/* Waveform Bars */}
                  <div className="h-10 w-full flex items-end gap-1 px-1">
                    {[40, 65, 30, 85, 95, 60, 45, 75, 90, 50, 80, 70, 95, 85, 40, 60, 90, 75, 55, 35, 70, 85, 60, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/70 rounded-t transition-all"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Spoken Quote */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/10">
                  <span className="font-label-mono text-label-mono text-primary text-[10px] uppercase font-semibold">
                    Spoken Hindi Feed:
                  </span>
                  <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                    “आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है...”
                  </p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant italic border-t border-outline-variant/10 pt-1 mt-1">
                    “Ran 3 heats in EAF furnace. Charged 145 MT scrap, 12 MT sponge iron. Power sub-meter reads 84,200 kWh.”
                  </p>
                </div>

                {/* Extracted Entity Summary Chips */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded bg-surface-container flex flex-col">
                    <span className="font-label-mono text-[9px] text-on-surface-variant uppercase">Billets Produced</span>
                    <span className="font-metric-md text-sm text-on-surface font-semibold">142.0 MT Billets</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container flex flex-col">
                    <span className="font-label-mono text-[9px] text-on-surface-variant uppercase">Specific Intensity</span>
                    <span className="font-metric-md text-sm text-primary font-semibold">1.42 tCO2e/MT</span>
                  </div>
                </div>

                <Link
                  href="/assistant"
                  className="w-full mt-1 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-mono text-xs font-semibold text-center transition-colors shadow-sm"
                >
                  Test Full Voice Assistant →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4 CORE VALUE PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {[
            {
              icon: "mic",
              badge: "MULTILINGUAL",
              title: "Voice-First Intake",
              desc: "Shopfloor workers speak in Hindi, Marathi, or English. Acoustic AI extracts melt batches, feedstock, power, and coke consumption automatically.",
              link: "/assistant",
              linkText: "Open Voice Terminal →",
              color: "text-primary bg-primary/10",
              badgeColor: "text-primary",
            },
            {
              icon: "biotech",
              badge: "IPCC TIER 3",
              title: "Deterministic Carbon Engine",
              desc: "Zero AI hallucinations on calculations. Mathematical mass balances adhering to EN 19694-2 Method C and official EU CBAM Implementing Regulations.",
              link: "/calc-engine",
              linkText: "Inspect Math Models →",
              color: "text-secondary bg-secondary/10",
              badgeColor: "text-secondary",
            },
            {
              icon: "trending_up",
              badge: "WHAT-IF SIMULATOR",
              title: "Decarbonization Planner",
              desc: "Stress-test scrap blends, solar PPA mixes, and waste heat recovery boilers in real-time with deterministic marginal abatement cost curves.",
              link: "/planner",
              linkText: "Simulate Scenarios →",
              color: "text-tertiary bg-tertiary/10",
              badgeColor: "text-tertiary",
            },
            {
              icon: "account_balance",
              badge: "STATUTORY HONESTY",
              title: "Government Scheme Matcher",
              desc: "Honest matching for MSME ZED certification, RAMP, and SIDBI MSE-GIFT with official eligibility criteria and published historical timeline notices.",
              link: "/schemes",
              linkText: "Explore Schemes →",
              color: "text-primary bg-surface-container-highest",
              badgeColor: "text-on-surface-variant",
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between gap-space-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${pillar.color}`}>
                  <span className="material-symbols-outlined text-xl">{pillar.icon}</span>
                </span>
                <span className={`font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high ${pillar.badgeColor}`}>
                  {pillar.badge}
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-semibold text-on-surface">{pillar.title}</h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <Link href={pillar.link} className="font-label-mono text-xs text-primary flex items-center gap-1 hover:underline">
                {pillar.linkText}
              </Link>
            </motion.div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

