import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { I18nProvider } from "@/i18n/I18nContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AskAdhikaarFAB from "@/components/ai/AskAdhikaarFAB";
import AIChatPanel from "@/components/ai/AIChatPanel";

import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "अधिकार Adhikaar - Civic Assistance Platform",
  description:
    "Know your rights. Discover your benefits. Democratizing statutory awareness and welfare access for every Indian citizen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        <I18nProvider>
          <ThemeProvider>
            <ChatProvider>
              <AppShell>
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </AppShell>
              <AskAdhikaarFAB />
              <AIChatPanel />
            </ChatProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
