"use client"

import { TokenFactory } from "@/components/factory/TokenFactory"

export default function Home() {

  return (
    <div className="py-5 px-2 mt-5 pb-16 md:pb-5">
      <TokenFactory />
        {/* <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Coin Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary text-primary-foreground rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                  {symbol || "?"}
                </div>
                <p className="text-center text-xl font-bold mb-2">{coinName || "Your Coin"}</p>
                <p className="text-center">Symbol: {symbol || "???"}</p>
                <p className="text-center">Supply: {maxSupply || "0"}</p>
                <p className="text-center">Pre-Mint Amount: {preMintAmount || "0"}</p>
                <p className="text-center">Rewards Per Block: {rewardsPerBlock || "0"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Creations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      DogeCoin2 (DOGE2) - View on Etherscan
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      MoonRocket (MOON) - View on Etherscan
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      PepeCoin (PEPE) - View on Etherscan
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div> */}
    </div>
  )
}