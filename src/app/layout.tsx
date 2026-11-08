import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";

export const metadata: Metadata = {
  title: "CarbonReady — AI Carbon Compliance Copilot for MSME Exporters",
  description:
    "Enterprise climate-tech platform empowering Indian MSME steel, casting, and engineering exporters with voice-first shopfloor intake, automated Scope 1 & 2 mathematical attribution, and cryptographically verified EU CBAM dossiers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-body-md text-on-surface min-h-screen">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

