import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { stateConfig } from "@/config/state";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["700"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: stateConfig.siteName,
  description: stateConfig.description,
};

const themeStyle = {
  "--color-hemp-green": stateConfig.theme.colors.primary,
  "--color-hemp-sage": stateConfig.theme.colors.sage,
  "--color-hemp-leaf": stateConfig.theme.colors.leaf,
  "--color-hemp-gold": stateConfig.theme.colors.gold,
  "--color-hemp-brown": stateConfig.theme.colors.brown,
  "--color-hemp-cream": stateConfig.theme.colors.cream,
  "--ihemp-color-primary-dark": stateConfig.theme.colors.primaryDark,
  "--ihemp-hero-title": stateConfig.theme.colors.heroText,
} as CSSProperties;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${fredoka.variable} bg-hemp-cream text-hemp-brown min-h-screen flex flex-col`} style={themeStyle}>
        <GoogleAnalytics />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
