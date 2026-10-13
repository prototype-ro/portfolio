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
  title: "Rodrigo [[sobrenome]] — Portfólio",
  description:
    "Portfólio de um estudante de Engenharia de Software na PUC Minas. Lab01S01 prototype.",
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
