"use client"

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "../wallet/ConnectWallet";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../providers/ThemeProvider";
import { Switch } from "../ui/switch";
import { Moon, Sun } from "lucide-react";

const LINKS = [
  {
    name: "Factory",
    path: "/",
  },
  {
    name: "Tokens",
    path: "/tokens",
  },
  {
    name: "Keys",
    path: "/keys",
  },
]

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const rootPath = useMemo(() => pathname?.split("/")[1], [pathname]);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div>
      <header className="sticky top-0 z-20 flex h-12 w-full items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center space-x-6">
          <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6 shrink-0">
            <div className="flex relative w-8 h-8">
              <Image alt="Heroglyphs logo" className="cursor-pointer" fill src="/obelisk-logo.svg" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-tight">Heroglyphs</span>
              <span className="text-xs">Token Factory</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-3">
            {LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${rootPath === link.path.split("/")[1] ? "bg-muted text-primary-foreground hover:bg-primary/90" : "hover:text-foreground hover:bg-muted "}`}
                prefetch={false}
              >
                <Button variant="ghost">{link.name}</Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
            />
            <Moon className="h-4 w-4" />
          </div> */}
          <ConnectWallet />
        </div>
      </header>
    </div>
  )
}