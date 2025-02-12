import Link from "next/link";
import {  Factory, Coins, Key } from "lucide-react";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around md:hidden">
      <Link href="/" className="flex flex-col items-center">
      <Factory size={24} className="text-yellow-500" />
      <span className="text-xs">Factory</span>
      </Link>
      <Link href="/tokens" className="flex flex-col items-center">
        <Coins size={24} className="text-yellow-500" />
        <span className="text-xs">Tokens</span>
      </Link>
      <Link href="/keys" className="flex flex-col items-center">
        <Key size={24} className="text-yellow-500" />

        <span className="text-xs">Keys</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
