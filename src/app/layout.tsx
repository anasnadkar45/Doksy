import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";

const ibm = IBM_Plex_Sans_Devanagari({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doksy | Turn Your README into Beautiful Documentation",
  description:
    "Doksy helps you transform GitHub README files into clean, professional documentation websites in just a few clicks. Simple, fast, and customizable.",
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  openGraph: {
    title: "Doksy | Turn Your README into Beautiful Documentation",
    description:
      "Convert your GitHub README into a stunning multi-page documentation site. Fast, minimal, and developer-friendly.",
    url: "https://doksy.site",
    siteName: "Doksy",
    images: [
      {
        url: "https://doksy.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Doksy Documentation Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doksy | Turn Your README into Beautiful Documentation",
    description:
      "Doksy converts your GitHub README into a clean, professional documentation site in seconds.",
    images: ["https://doksy.site/og-image.png"],
    site: "@NadkarAnas45",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-W5MPEX0581"></Script>
        <Script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());

          gtag('config', 'G-W5MPEX0581');
          `}
        </Script>
      </head>
      <body
        className={`${ibm.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
