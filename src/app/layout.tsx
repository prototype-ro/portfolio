import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, VT323 } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/Providers";
import { RobotBackdrop } from "@/components/RobotBackdrop";
import { TelemetryHUD } from "@/components/TelemetryHUD";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-intertight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Rodrigo [[sobrenome]] — Portfólio",
    template: "%s · Rodrigo [[sobrenome]]",
  },
  description:
    "Portfólio de Rodrigo [[sobrenome]], estudante de Engenharia de Software na PUC Minas. Apps e produtos digitais do design ao código.",
  keywords: [
    "portfólio",
    "desenvolvedor",
    "engenharia de software",
    "PUC Minas",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Rodrigo [[sobrenome]]" }],
  creator: "Rodrigo [[sobrenome]]",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    siteName: "Rodrigo [[sobrenome]] — Portfólio",
    title: "Rodrigo [[sobrenome]] — Portfólio",
    description:
      "Estudante de Engenharia de Software na PUC Minas. Apps e produtos digitais do design ao código.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Portfólio RD-01" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo [[sobrenome]] — Portfólio",
    description:
      "Estudante de Engenharia de Software na PUC Minas. Apps e produtos digitais do design ao código.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${interTight.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <body className="bg-bg-dark antialiased">
        <Providers>
          <SkipLink />
          <RobotBackdrop />
          <div className="relative z-10 flex min-h-dvh flex-col pb-12 md:m-3 md:pb-10">
            <Header />
            <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <TelemetryHUD />
        </Providers>
      </body>
    </html>
  );
}
