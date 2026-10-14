import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter_Tight, JetBrains_Mono, VT323 } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/Providers";
import { RobotBackdrop } from "@/components/RobotBackdrop";
import { TelemetryHUD } from "@/components/TelemetryHUD";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { RecorderControl } from "@/components/RecorderControl";
import type { Lang } from "@/data/i18n";
import { SITE_URL } from "@/lib/site";

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

const COPY: Record<Lang, { title: string; description: string }> = {
  pt: {
    title: "Rodrigo Lage da Costa — Portfólio",
    description:
      "Portfólio de Rodrigo Lage da Costa, estudante de Engenharia de Software na PUC Minas. Apps e produtos digitais do design ao código.",
  },
  en: {
    title: "Rodrigo Lage da Costa — Portfolio",
    description:
      "Portfolio of Rodrigo Lage da Costa, Software Engineering student at PUC Minas. Apps and digital products from design to code.",
  },
};

/** Reads the language cookie so SSR matches what the client will render. */
async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get("lang")?.value === "en" ? "en" : "pt";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { title, description } = COPY[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${title}` },
    description,
    applicationName: "RD-01 Portfólio",
    keywords: [
      "portfólio",
      "desenvolvedor",
      "engenharia de software",
      "PUC Minas",
      "Next.js",
      "React",
      "TypeScript",
    ],
    authors: [{ name: "Rodrigo Lage da Costa" }],
    creator: "Rodrigo Lage da Costa",
    alternates: {
      canonical: "/",
      languages: { "pt-BR": "/", en: "/" },
    },
    openGraph: {
      type: "website",
      siteName: "Rodrigo Lage da Costa — RD-01",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      alternateLocale: lang === "pt" ? "en_US" : "pt_BR",
      title,
      description,
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: "Portfólio RD-01" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#E4E3DF",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rodrigo Lage da Costa",
    jobTitle: "Software Engineering Student",
    url: SITE_URL,
    alumniOf: { "@type": "CollegeOrUniversity", name: "PUC Minas" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Belo Horizonte",
      addressRegion: "MG",
      addressCountry: "BR",
    },
  };

  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${interTight.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <body className="bg-bg-dark antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers initialLang={lang}>
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
          <RecorderControl />
        </Providers>
      </body>
    </html>
  );
}
