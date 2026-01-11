import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, TopBar, AgeRangeSelector } from "@/components/layout";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ToastContainer } from "@/components/shared";

export const metadata: Metadata = {
  title: "Asset Simulator | Financial Planning",
  description: "Modern fintech-style personal finance simulation dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#F8FAFC" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* Layout Structure */}
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
              {/* Top Bar */}
              <TopBar />

              {/* Page Content */}
              <main className="mt-16 p-6 bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-4rem)] transition-theme">
                {children}
              </main>
            </div>
          </div>

          {/* Global Modals */}
          <AgeRangeSelector />

          {/* Toast Notifications */}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
