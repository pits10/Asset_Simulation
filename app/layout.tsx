import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, TopBar, AgeRangeSelector } from "@/components/layout";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ToastContainer } from "@/components/shared";
import { OnboardingModal } from "@/components/onboarding";

export const metadata: Metadata = {
  title: "FIRE? | 資産シミュレーション",
  description: "あなたは何歳でFIREできる？ 海外Fintech水準の資産シミュレーション・人生設計ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#F8FAFC" />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {/* Layout Structure */}
          <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 transition-all duration-300">
              {/* Top Bar */}
              <TopBar />

              {/* Page Content */}
              <main className="mt-16 p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
                {children}
              </main>
            </div>
          </div>

          {/* Global Modals */}
          <AgeRangeSelector />
          <OnboardingModal />

          {/* Toast Notifications */}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
