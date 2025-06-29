import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/modules/shared/components/header/header";
import { Footer } from "@/modules/shared/components/footer/footer";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Carbono Tickets",
    template: "%s | Carbono Tickets",
  },
  description:
    "Democratizamos la venta de tickets para eventos mainstream y underground. Descubre eventos únicos en tu ciudad.",
  keywords: [
    "tickets",
    "eventos",
    "underground",
    "mainstream",
    "música",
    "conciertos",
  ],
  authors: [{ name: "Carbono Tickets" }],
  creator: "Carbono Tickets",
  publisher: "Carbono Tickets",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "Carbono Tickets",
    description:
      "Democratizamos la venta de tickets para eventos mainstream y underground",
    siteName: "Carbono Tickets",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Carbono Tickets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbono Tickets",
    description:
      "Democratizamos la venta de tickets para eventos mainstream y underground",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-background font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
