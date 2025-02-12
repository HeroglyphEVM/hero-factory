import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroAppWithProviders } from "@/components/providers/HeroApp";
import BottomNav from "@/components/nav/BottomNav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Heroglyphs Factory",
  description: "Create your own token with Heroglyphs",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <HeroAppWithProviders>
            {children}
            <BottomNav />
          </HeroAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
