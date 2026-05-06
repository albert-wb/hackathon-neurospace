import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Layout/Navbar";
import BottomNav from "@/components/Layout/BottomNav";

export const metadata: Metadata = {
  title: "NeuroSpace — Mapeamento sensorial urbano",
  description:
    "Plataforma colaborativa que mapeia o perfil sensorial de espaços urbanos para auxiliar pessoas neurodivergentes a navegarem a cidade com segurança e autonomia.",
  manifest: "/manifest.json",
  keywords: [
    "neurodivergente",
    "autismo",
    "TDAH",
    "sensorial",
    "mapa",
    "acessibilidade",
    "inclusão",
  ],
  openGraph: {
    title: "NeuroSpace",
    description:
      "Mapeie o perfil sensorial de espaços urbanos. Navegue a cidade com segurança.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#13151A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#13151A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
