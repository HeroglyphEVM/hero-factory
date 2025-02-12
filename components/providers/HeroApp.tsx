"use client";

import { ThemeProvider } from "next-themes"
import Header from "../nav/Header"
import { QueryClient } from "@tanstack/query-core"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider } from "@tanstack/react-query"
import { darkTheme, Theme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { wagmiConfig } from "@/services/web3/wagmiConfig"
import { Toaster } from "../ui/toaster";
import { structuralSharing } from "wagmi/query";

export const HeroApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  )
}

export const HeroAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        structuralSharing,
        refetchOnWindowFocus: false,
      },
    },
  });

  const customTheme = {
    ...darkTheme(
     { 
      borderRadius: 'none',
      fontStack: 'system' // Remove this line if present
      }
    ),
    colors: {
      ...darkTheme().colors,
      accentColor: '#FFD700',
      accentColorForeground: '#000',
      modalBackground: '#3C3834',
    },
    fonts: {
      body: 'JohtoMono, sans-serif',
    },
  } as Theme;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            <HeroApp>
              {children}
              <Toaster />
            </HeroApp>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}