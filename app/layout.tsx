import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { business } from "@/content";
import { MotionPreferenceProvider } from "@/lib/motion";
import { ServiceModeProvider } from "@/lib/service-mode";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: `${business.name} — Mobile & Drop-off Car Detailing in the 626`,
    template: `%s · ${business.name}`,
  },
  description: `Premium mobile and drop-off car detailing across ${business.regionLong}. Book online or text ${business.phoneDisplay}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-base text-ink min-h-screen antialiased">
        <MotionPreferenceProvider>
          <ServiceModeProvider>
            <Header />
            <main id="main" className="pt-16">
              {children}
            </main>
            <Footer />
            <MobileActionBar />
          </ServiceModeProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
